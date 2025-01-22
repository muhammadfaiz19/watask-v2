"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

const Login = () => {
  return (
    <section className="flex flex-col mx-auto gap-4 px-8 md:px-10 py-8 md:py-0">
      <div className="w-full max-w-3xl">
        <div className="flex justify-center mb-6">
        <Image 
            alt="Login Illustration" 
            // className="filter invert hue-rotate-180" 
            height={500} 
            src="/6240693.svg" 
            width={500}
          />
        </div>
        <h3 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h3>
        <Input
          fullWidth
          required
          className="mb-4"
          label="Email"
          placeholder="Email"
          type="email"
        />
        <Input
          fullWidth
          required
          className="mb-6"
          label="Password"
          placeholder="Password"
          type="password"
        />
        <Button fullWidth color="primary" type="submit">
          Sign In
        </Button>
      </div>
    </section>
  );
};

export default Login;
