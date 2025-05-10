import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { loginSchema, registerSchema, UserRole } from "@shared/schema";
import { hash, compare } from "bcrypt";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication (passport, sessions, etc.)
  await setupAuth(app);

  // User authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: result.error.format()
        });
      }

      const { email, password } = result.data;
      const user = await storage.getUserByEmail(email);

      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session through Passport
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        return res.json({ 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl
          }
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: result.error.format()
        });
      }

      const { 
        name, 
        email, 
        password, 
        phone, 
        college, 
        yearOfStudy, 
        location 
      } = result.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Create user with student role
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        role: UserRole.STUDENT
      });

      // Create student profile
      await storage.createStudentProfile({
        userId: user.id,
        phone,
        college,
        yearOfStudy,
        location
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        return res.status(201).json({ 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json({ user: req.user });
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Protected routes
  app.get("/api/protected", isAuthenticated, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
  });

  // Admin protected routes
  app.get("/api/admin/dashboard", isAuthenticated, isAdmin, (req, res) => {
    res.json({ message: "Admin dashboard data" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
