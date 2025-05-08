"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-8 text-center"
      >
        <Image src="/images/opq-logo.png" alt="OPQ Insider Logo" width={400} height={150} priority className="mb-4" />

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Welcome to OPQInsider</h1>

        <p className="text-xl text-gray-600 max-w-2xl">
          Your gateway to career opportunities and professional development
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/auth/student">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Student Login
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/auth/admin">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Admin Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
