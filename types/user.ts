export interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin"
  phone?: string
  college?: string
  year?: string
  location?: string
}
