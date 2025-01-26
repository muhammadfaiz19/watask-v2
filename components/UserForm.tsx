/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
"use client";

import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { useState, FormEvent } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

interface UserFormProps {
  onSubmit: (user: { name: string; phoneNumber: string; email: string; username: string; password: string; role: string }) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(user);
    toast.success("User added successfully!");
    setUser({ name: "", phoneNumber: "", email: "", username: "", password: "", role: "user" });
  };

  return (
    <>
      <form className="space-y-6 max-w-4xl w-full mx-auto" onSubmit={handleSubmit}>
        <Input
          fullWidth
          required
          label="Name"
          name="name"
          placeholder="Enter full name"
          value={user.name}
          variant="faded"
          onChange={handleChange}
        />
        <Input
          fullWidth
          required
          label="Phone Number"
          name="phoneNumber"
          placeholder="Enter phone number"
          value={user.phoneNumber}
          variant="faded"
          onChange={handleChange}
        />
        <Input
          fullWidth
          required
          label="Email"
          name="email"
          placeholder="Enter email"
          type="email"
          value={user.email}
          variant="faded"
          onChange={handleChange}
        />
        <Input
          fullWidth
          required
          label="Username"
          name="username"
          placeholder="Choose a username"
          value={user.username}
          variant="faded"
          onChange={handleChange}
        />
        <Input
          fullWidth
          required
          label="Password"
          name="password"
          placeholder="Enter password"
          type="password"
          value={user.password}
          variant="faded"
          onChange={handleChange}
        />
        <Select
          fullWidth
          required
          label="Role"
          name="role"
          placeholder="Select role"
          value={user.role}
          variant="faded"
          onChange={handleChange}
        >
          <SelectItem  value="user">User</SelectItem >
          <SelectItem  value="admin">Admin</SelectItem >
        </Select>
        <Button fullWidth color="primary" type="submit">
          Add User
        </Button>
      </form>
      <ToastContainer autoClose={5000} position="top-right" theme="dark" transition={Bounce} />
    </>
  );
};

export default UserForm;