"use client";
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

import { useAuth } from "@/context/AuthContext";
import api from "@/api/api";

interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
}

export default function ProfileCard() {
  const { user, setUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    username: user?.username || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await api.put("/users/profile", formData);

      setUser(response.data);
      toast.success("Profile updated successfully");
      onClose();
    } catch (err: any) {
      toast.error("Failed to update profile");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Profile Settings</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Name</p>
          <p className="font-semibold">{user.name}</p>
        </div>
        <div>
          <p className="text-gray-600">Username</p>
          <p className="font-semibold">{user.username}</p>
        </div>
        <div>
          <p className="text-gray-600">Email</p>
          <p className="font-semibold">{user.email}</p>
        </div>
        <div>
          <p className="text-gray-600">Phone Number</p>
          <p className="font-semibold">{user.phoneNumber}</p>
        </div>
      </div>

      <Button 
        fullWidth 
        color="primary" 
        variant="solid" 
        onPress={onOpen}
      >
        Edit Profile
      </Button>

      <Modal 
        backdrop="blur" 
        isOpen={isOpen} 
        placement="center"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <Input
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="default" 
              variant="light" 
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleProfileUpdate}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ToastContainer 
        autoClose={3000} 
        position="top-right" 
        theme="light" 
      />
    </div>
  );
}