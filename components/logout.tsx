"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@heroui/button";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dan data user dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Tampilkan pesan berhasil
    toast.success("Logout successful");

    // Redirect ke halaman login
    router.push("/login");
  };

  return (
    <Button>
      <button onClick={handleLogout}>Logout</button>
    </Button>
  );
};

export default LogoutButton;
