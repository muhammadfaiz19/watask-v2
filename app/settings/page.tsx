/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";

import api from "@/api/api";
import UserForm from "@/components/UserForm";
import UserList from "@/components/UserList";
import { User } from "@/types/User";
import { withAdminProtection } from "@/components/ProtectedRoute";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const addUser = async (user: Omit<User, "_id">) => {
    try {
      const res = await api.post("/users", user);

      setUsers((prev) => [...prev, res.data.user]);
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };
  
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-8 md:px-10">
      <h1 className="text-3xl font-bold mb-4">User Manager</h1>
      <UserForm onSubmit={addUser} />
      <UserList users={users} onDelete={deleteUser} />
    </section>
  );
};

export default withAdminProtection(UsersPage);