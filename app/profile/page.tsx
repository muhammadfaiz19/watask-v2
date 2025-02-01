"use client";

import React, { useState, useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { useAuth } from "@/context/AuthContext";
import api from "@/api/api";

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileSettings() {
  const { user, setUser } = useAuth();
  const profileModal = useDisclosure();
  const passwordModal = useDisclosure();
  const [loading, setLoading] = useState(false);

  const [profileFormData, setProfileFormData] = useState<UserProfile>({
    name: "",
    email: "",
    phoneNumber: "",
    username: "",
  });

  const [passwordFormData, setPasswordFormData] = useState<PasswordUpdateData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.put("/users/profile", profileFormData);

      setUser(response.data);
      toast.success("Profile updated successfully");
      profileModal.onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordFormData.currentPassword.trim()) {
      toast.error("Current password is required");

      return;
    }
    if (passwordFormData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");

      return;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("New passwords do not match");

      return;
    }

    setLoading(true);
    try {
      await api.put("/users/password", {
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      });
      toast.success("Password updated successfully");
      passwordModal.onClose();
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-8 md:px-10">
      <div className="mx-auto max-w-4xl w-full">
        <h1 className="mb-8 text-2xl font-bold text-center sm:text-3xl lg:text-4xl">
          Profile Settings
        </h1>

        {/* Profile Information Display */}
        <div className="mb-8 rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold sm:text-2xl">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {[
              { label: "Name", value: user.name || "Not Provided" },
              { label: "Username", value: user.username || "Not Provided" },
              { label: "Email", value: user.email || "Not Provided" },
              { label: "Phone Number", value: user.phoneNumber || "Not Provided" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-background p-3 sm:p-4 rounded-md">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-base font-medium sm:text-lg break-words">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
          <Button
            fullWidth
            className="h-10 text-base sm:h-12 sm:text-md"
            color="primary"
            variant="solid"
            onPress={profileModal.onOpen}
          >
            Edit Profile
          </Button>
          <Button
            fullWidth
            className="h-10 text-base sm:h-12 sm:text-md"
            color="primary"
            variant="bordered"
            onPress={passwordModal.onOpen}
          >
            Change Password
          </Button>
        </div>

        {/* Profile Edit Modal */}
        <Modal
          backdrop="blur"
          className="mx-4"
          isOpen={profileModal.isOpen}
          placement="center"
          onClose={profileModal.onClose}
        >
          <ModalContent>
            <ModalHeader className="text-lg sm:text-xl">Edit Profile</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {["name", "email", "phoneNumber", "username"].map((field) => (
                  <Input
                    key={field}
                    fullWidth
                    className="text-sm sm:text-base"
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={profileFormData[field as keyof UserProfile]}
                    onChange={handleProfileInputChange}
                  />
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="text-sm sm:text-base"
                color="default"
                variant="light"
                onPress={profileModal.onClose}
              >
                Cancel
              </Button>
              <Button
                className="text-sm sm:text-base"
                color="primary"
                isLoading={loading}
                onPress={handleProfileUpdate}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Password Change Modal */}
        <Modal
          backdrop="blur"
          className="mx-4"
          isOpen={passwordModal.isOpen}
          placement="center"
          onClose={passwordModal.onClose}
        >
          <ModalContent>
            <ModalHeader className="text-lg sm:text-xl">
              Change Password
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  fullWidth
                  className="text-sm sm:text-base"
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordFormData.currentPassword}
                  onChange={handlePasswordInputChange}
                />
                <Input
                  fullWidth
                  className="text-sm sm:text-base"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordInputChange}
                />
                <Input
                  fullWidth
                  className="text-sm sm:text-base"
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordFormData.confirmPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={passwordModal.onClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                onPress={handlePasswordUpdate}
              >
                Update Password
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
      </div>
    </div>
  );
}