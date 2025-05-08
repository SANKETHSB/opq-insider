"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function StudentAuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image
              src="/images/opq-logo.png"
              alt="OPQ Insider Logo"
              width={200}
              height={75}
              priority
              className="mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm userType="student" />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/auth/admin" className="text-blue-600 hover:underline">
            Switch to Admin Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
