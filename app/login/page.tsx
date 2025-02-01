"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FaUser, FaLock } from "react-icons/fa";

import api from "@/api/api";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext

interface LoginCredentials {
  login: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const tempErrors: { login?: string; password?: string } = {};

    if (!credentials.login.trim())
      tempErrors.login = "Email or Username is required";
    if (!credentials.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const cleanCredentials = {
          login: credentials.login.trim(),
          password: credentials.password, // Tidak perlu trim di sini
        };

        const response = await api.post("/login", cleanCredentials);
        const { token, user } = response.data;

        login(token, user);
        toast.success("Login successful");
        router.push(user.role === "admin" ? "/settings" : "/");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl p-8">
        <div className="flex justify-center mb-6">
          <Image
            alt="Login Illustration"
            height={500}
            src="/6240693.svg"
            width={500}
          />
        </div>
        <h3 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            fullWidth
            color={errors.login ? "danger" : "default"}
            errorMessage={errors.login}
            name="login"
            placeholder="Email or Username"
            startContent={<FaUser />}
            value={credentials.login}
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
            value={credentials.password}
            variant="faded"
            onChange={handleChange}
          />
          <Button fullWidth color="primary" isLoading={isLoading} type="submit">
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link className="text-primary hover:underline" href="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
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
    </section>
  );
};

export default Login;
