import { db } from "../server/db";
import { sessions, users, studentProfiles } from "../shared/schema";

async function main() {
  console.log("Creating database tables...");
  
  try {
    // Create sessions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "sid" varchar PRIMARY KEY,
        "sess" text NOT NULL,
        "expire" timestamp NOT NULL
      )
    `);
    console.log("Sessions table created or already exists");
    
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY,
        "email" text NOT NULL UNIQUE,
        "password" text,
        "name" text NOT NULL,
        "profile_image_url" text,
        "role" text NOT NULL DEFAULT 'student',
        "google_id" text UNIQUE,
        "created_at" timestamp DEFAULT now()
      )
    `);
    console.log("Users table created or already exists");
    
    // Create student_profiles table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "student_profiles" (
        "id" serial PRIMARY KEY,
        "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "phone" text NOT NULL,
        "college" text NOT NULL,
        "year_of_study" text NOT NULL,
        "location" text NOT NULL
      )
    `);
    console.log("Student profiles table created or already exists");
    
    console.log("Database setup complete");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    process.exit(0);
  }
}

main();