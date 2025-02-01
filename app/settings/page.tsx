"use client";

import { useState, useEffect } from "react";

import api from "@/api/api";
import UserForm from "@/components/UserForm";
import UserList from "@/components/UserList";
import { User, UserFormData } from "@/types/User";
import { withAdminProtection } from "@/components/ProtectedRoute";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/users");

      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (userData: UserFormData) => {
    try {
      const res = await api.post("/users", userData);

      setUsers((prev) => [...prev, res.data.user]);
    } catch (err: any) {
      throw err;
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      // Update the users state with the new data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      // Optionally refetch all users to ensure data consistency
      await fetchUsers();
    } catch (err: any) {
      console.error("Failed to update user state", err);
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err: any) {
      console.error("Failed to delete user", err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-8 md:px-10">
      <h1 className="text-3xl font-bold mb-4">User Manager</h1>
      <UserForm onSubmit={addUser} />
      <UserList users={users} onDelete={deleteUser} onUpdate={updateUser} />
    </section>
  );
};

export default withAdminProtection(UsersPage);
