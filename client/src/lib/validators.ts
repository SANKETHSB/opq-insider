import { z } from "zod";

export const loginValidator = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerValidator = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  college: z.string().min(2, "College name is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
  location: z.string().min(2, "Location is required"),
});
