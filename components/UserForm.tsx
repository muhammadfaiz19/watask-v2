/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import { Button } from "@heroui/button";
import { useState } from "react";
import { Input } from "@heroui/input";

import { User } from "@/types/User";


interface UserFormProps {
  onSubmit: (user: Omit<User, "_id">) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phoneNumber, email, username, password, role });
    setName("");
    setPhoneNumber("");
    setEmail("");
    setUsername("");
    setPassword("");
  };

  return (
    <form
      className="space-y-6 max-w-4xl w-full mx-auto z-50"
      onSubmit={handleSubmit}
    >
      <Input
        isClearable
        required
        className="w-full"
        label="Name"
        placeholder="Enter Name"
        value={name}
        variant="faded"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        isClearable
        required
        className="w-full"
        label="Phone Number"
        placeholder="Enter Phone Number"
        value={phoneNumber}
        variant="faded"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Input
        isClearable
        required
        className="w-full"
        label="Email"
        placeholder="Enter Email"
        type="email"
        value={email}
        variant="faded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        isClearable
        required
        className="w-full"
        label="Username"
        placeholder="Enter Username"
        value={username}
        variant="faded"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        isClearable
        required
        className="w-full"
        label="Password"
        placeholder="Enter Password"
        type="password"
        value={password}
        variant="faded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        className="w-full p-4 bg-default-100 border border-gray-600 rounded-md"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <Button className="w-full" color="primary" type="submit">
        Add User
      </Button>
    </form>
  );
};

export default UserForm;
