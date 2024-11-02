// app/home/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/Button";
import DeleteModal from "../../components/DeleteModal";
import ThemeToggle from "../../components/ThemeToggle";
import { LogOut, Plus } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
}

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null as number | null,
    userName: "",
  });

  useEffect(() => {
    // Check if user is logged in by looking for userData in localStorage
    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.push("/login");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteModal({ isOpen: true, userId: id, userName: name });
  };

  const confirmDelete = async () => {
    if (deleteModal.userId) {
      try {
        const response = await fetch(`/api/users/${deleteModal.userId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          setUsers(users.filter((user) => user.id !== deleteModal.userId));
          setDeleteModal({ isOpen: false, userId: null, userName: "" });
        } else {
          setError("Failed to delete user");
        }
      } catch (error) {
        setError("Failed to delete user");
      }
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const handleLogout = async () => {
    try {
      // Remove cookie
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Clear localStorage
      localStorage.removeItem("userData");
      router.push("/login");
    } catch (error) {
      setError("Failed to logout");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">{error}</div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex gap-4 items-center">
            <Button
              variant="primary"
              onClick={() => router.push("/signup")}
              className="flex gap-2 items-center"
            >
              Add User
            </Button>
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="flex gap-2 items-center"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{formatDate(user.dob)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(user.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(user.id, user.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No users found. Click &quot;Add User&quot; to create one.
            </p>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, userId: null, userName: "" })
        }
        onConfirm={confirmDelete}
        userName={deleteModal.userName}
      />

      <ThemeToggle />
    </div>
  );
}
