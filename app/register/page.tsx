"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

import api from "@/api/api";

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
  username?: string;
  password?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for phone number (only digits)
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "");

      setFormData((prev) => ({ ...prev, [name]: numericValue }));

      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Validate Indonesian phone number format starting with 62 or 0
    const phoneRegex = /^(62|0)\d{9,13}$/;

    return phoneRegex.test(phoneNumber);
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) tempErrors.name = "Name is required";

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      tempErrors.phoneNumber =
        "Invalid Indonesian phone number. Must start with 62 or 0 and be 10-13 digits long.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    // Username validation
    if (!formData.username.trim()) tempErrors.username = "Username is required";

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await api.post("/register", formData);
        toast.success("Registration successful");
        router.push("/login");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl p-8">
          <div className="flex justify-center mb-6">
            <Image
              alt="Register Illustration"
              height={500}
              src="/6240693.svg"
              width={500}
            />
          </div>
          <h3 className="text-2xl font-bold text-center mb-6">
            Create Your Account
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              fullWidth
              color={errors.name ? "danger" : "default"}
              errorMessage={errors.name}
              name="name"
              placeholder="Full Name"
              startContent={<FaUser />}
              value={formData.name}
              variant="faded"
              onChange={handleChange}
            />
            <Input
              fullWidth
              color={errors.phoneNumber ? "danger" : "default"}
              // description="Use Indonesian format: start with 62 or 0"
              errorMessage={errors.phoneNumber}
              name="phoneNumber"
              placeholder="Phone Number (e.g., 62857...)"
              startContent={<FaPhone />}
              value={formData.phoneNumber}
              variant="faded"
              onChange={handleChange}
            />
            <Input
              fullWidth
              color={errors.email ? "danger" : "default"}
              errorMessage={errors.email}
              name="email"
              placeholder="Email"
              startContent={<FaEnvelope />}
              type="email"
              value={formData.email}
              variant="faded"
              onChange={handleChange}
            />
            <Input
              fullWidth
              color={errors.username ? "danger" : "default"}
              errorMessage={errors.username}
              name="username"
              placeholder="Username"
              startContent={<FaUser />}
              value={formData.username}
              variant="faded"
              onChange={handleChange}
            />
            <Input
              fullWidth
              color={errors.password ? "danger" : "default"}
              errorMessage={errors.password}
              name="password"
              placeholder="Password"
              startContent={<FaLock />}
              type="password"
              value={formData.password}
              variant="faded"
              onChange={handleChange}
            />
            <Button fullWidth color="primary" type="submit">
              Register
            </Button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link className="text-primary hover:underline" href="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
      <ToastContainer
        draggable
        pauseOnFocusLoss
        pauseOnHover
        autoClose={5000}
        closeOnClick={false}
        hideProgressBar={false}
        newestOnTop={false}
        position="top-right"
        rtl={false}
        theme="dark"
        transition={Bounce}
      />
    </>
  );
};

export default Register;
