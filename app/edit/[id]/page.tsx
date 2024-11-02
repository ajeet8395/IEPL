// app/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import ThemeToggle from "../../../components/ThemeToggle";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
}

export default function EditUser() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    if (params?.id) {
      fetchUser();
    }
  }, [params?.id]);

  const fetchUser = async () => {
    if (!params?.id) return;

    try {
      const response = await fetch(`/api/users/${params.id}`);
      const data = await response.json();

      if (data.success) {
        const user = data.user;
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          dob: user.dob.split("T")[0], // Format date for input field
        });
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/home");
      } else {
        setError("Failed to update user");
      }
    } catch (error) {
      setError("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Edit User</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            label="Phone Number"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <Input
            label="Date of Birth"
            type="date"
            required
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <div className="flex gap-4">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <ThemeToggle />
    </div>
  );
}
