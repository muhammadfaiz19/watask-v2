"use client";

import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { useState, FormEvent } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

import { UserFormData } from "@/types/User";

interface UserFormProps {
  onSubmit: (user: UserFormData) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserFormData>({
    name: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await onSubmit(user);
      toast.success("User added successfully!");
      setUser({
        name: "",
        phoneNumber: "",
        email: "",
        username: "",
        password: "",
        role: "user",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        className="space-y-6 max-w-4xl w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <Input
          fullWidth
          required
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          label="Password"
          minLength={6}
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
          disabled={isSubmitting}
          label="Role"
          name="role"
          placeholder="Select role"
          value={user.role}
          variant="faded"
          onChange={handleChange}
        >
          <SelectItem key="user" value="user">
            User
          </SelectItem>
          <SelectItem key="admin" value="admin">
            Admin
          </SelectItem>
        </Select>
        <Button fullWidth color="primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Adding User..." : "Add User"}
        </Button>
      </form>
      <ToastContainer
        autoClose={5000}
        position="top-right"
        theme="dark"
        transition={Bounce}
      />
    </>
  );
};

export default UserForm;
