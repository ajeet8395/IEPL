"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ThemeToggle from "../../components/ThemeToggle";
import { apiRequest } from "@/utils/api";

interface LoginResponse {
  success: boolean;
  token: string;
  userData: {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string;
  };
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // Type assertion to treat response as LoginResponse
      const loginResponse = response as LoginResponse;

      if (loginResponse.success) {
        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(loginResponse.userData));
        router.push("/home");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button type="submit">Login</Button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}