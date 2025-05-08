import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-8">Welcome to your OPQInsider admin dashboard!</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
