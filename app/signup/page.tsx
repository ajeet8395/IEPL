"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ThemeToggle from "../../components/ThemeToggle";
import { apiRequest } from "@/utils/api";

interface ValidationErrors {
  phone?: string;
  password?: string;
  dob?: string;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState("");

  const validatePhone = (phone: string): string | undefined => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits";
    }
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
  };

  const validateDob = (dob: string): string | undefined => {
    const selectedDate = new Date(dob);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return "Date of birth cannot be in the future";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear specific error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    // Validate on change for immediate feedback
    if (field === "phone") {
      const error = validatePhone(value);
      setErrors((prev) => ({ ...prev, phone: error }));
    }
    if (field === "password") {
      const error = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: error }));
    }
    if (field === "dob") {
      const error = validateDob(value);
      setErrors((prev) => ({ ...prev, dob: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // Validate all fields
    const validationErrors: ValidationErrors = {
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      dob: validateDob(formData.dob),
    };

    if (formData.password !== formData.confirmPassword) {
      validationErrors.password = "Passwords do not match";
    }

    // Filter out undefined errors and check if there are any errors
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== undefined
    );
    setErrors(validationErrors);

    if (hasErrors) {
      return;
    }

    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          password: formData.password,
        }),
      });

      if (response.success) {
        router.push("/login");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        {submitError && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <div>
            <Input
              label="Phone Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          <div>
            <Input
              label="Date of Birth"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
              value={formData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-500">{errors.dob}</p>
            )}
          </div>
          <div>
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <Input
            label="Confirm Password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
          />
          <Button type="submit">Sign Up</Button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}
