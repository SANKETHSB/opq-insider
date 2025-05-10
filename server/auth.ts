import type { Express, RequestHandler } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { compare } from "bcrypt";
import { storage } from "./storage";
import { UserRole } from "@shared/schema";
import connectPg from "connect-pg-simple";

export async function setupAuth(app: Express) {
  // Initialize session storage
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const PgStore = connectPg(session);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "opqinsider-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: sessionTtl, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      },
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true
      })
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Local strategy for email/password login
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid credentials" });
          }
          
          const isPasswordValid = await compare(password, user.password);
          
          if (!isPasswordValid) {
            return done(null, false, { message: "Invalid credentials" });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Google OAuth strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists by Google ID
            let user = await storage.getUserByGoogleId(profile.id);
            
            if (!user) {
              // Check if user exists by email
              const email = profile.emails?.[0]?.value;
              if (email) {
                user = await storage.getUserByEmail(email);
              }
              
              if (user) {
                // Link Google account to existing user
                user = await storage.updateUser(user.id, { googleId: profile.id });
              } else {
                // Create new user
                user = await storage.createUser({
                  name: profile.displayName,
                  email: email || `user-${profile.id}@placeholder.com`,
                  googleId: profile.id,
                  profileImageUrl: profile.photos?.[0]?.value,
                  role: UserRole.STUDENT
                });
              }
            }
            
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );

    // Google OAuth routes
    app.get(
      "/api/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/api/auth/google/callback",
      passport.authenticate("google", { 
        failureRedirect: "/auth",
        successRedirect: "/dashboard"
      })
    );
  }
}

// Middleware for checking if user is authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware for checking if user is an admin
export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.user && req.user.role === UserRole.ADMIN) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};
