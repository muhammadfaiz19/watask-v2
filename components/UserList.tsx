"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
import { Select, SelectItem } from "@heroui/select";

import { User } from "@/types/User";
import api from "@/api/api";

interface UserListProps {
  refresh: boolean;
}

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
];

const UserList: React.FC<UserListProps> = ({ refresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onOpenChange: onUpdateOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();

  useEffect(() => {
    api.get("/users")
      .then((response) => setUsers(response.data))
      .catch((err) => {
        console.error("Failed to fetch users", err);
        toast.error("Failed to load users. Please try again.");
      });
  }, [refresh]);

  const deleteUser = (id: string) => {
    api.delete(`/users/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toast.success("User deleted successfully!");
        onDeleteOpenChange();
      })
      .catch((err) => {
        console.error("Failed to delete user", err);
        toast.error("Failed to delete user. Please try again.");
      });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setUpdatedUser((prevUser) =>
      prevUser ? { ...prevUser, [name]: value } : null
    );
  };

  const handleRoleChange = (value: string) => {
    setUpdatedUser((prevUser) =>
      prevUser ? { ...prevUser, role: value } : null
    );
  };

  const handleUpdateUser = () => {
    if (updatedUser && updatedUser._id) {
      api.put(`/users/${updatedUser._id}`, updatedUser)
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === updatedUser._id ? updatedUser : user
            )
          );
          toast.success("User updated successfully!");
          onUpdateOpenChange();
        })
        .catch((err) => {
          console.error("Failed to update user", err);
          toast.error("Failed to update user. Please try again.");
        });
    }
  };

  return (
    <div className="max-w-4xl w-full mt-5">
      <h2 className="text-xl text-center font-semibold mb-4">User List</h2>
      <Table 
        className="bg-default-100/70" 
      >
        <TableHeader>
          <TableColumn className="font-bold text-center">Name</TableColumn>
          <TableColumn className="font-bold text-center">Phone Number</TableColumn>
          <TableColumn className="font-bold text-center">Email</TableColumn>
          <TableColumn className="font-bold text-center">Username</TableColumn>
          <TableColumn className="font-bold text-center">Role</TableColumn>
          <TableColumn className="font-bold text-center">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="text-center">{user.name}</TableCell>
              <TableCell className="text-center">{user.phoneNumber}</TableCell>
              <TableCell className="text-center">{user.email}</TableCell>
              <TableCell className="text-center">{user.username}</TableCell>
              <TableCell className="text-center">{user.role}</TableCell>
              <TableCell className="text-center space-x-2">
                <Button 
                  color="primary" 
                  onPress={() => {
                    setUpdatedUser({ ...user });
                    onUpdateOpen();
                  }}
                >
                  Update
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => {
                    setUpdatedUser(user);
                    onDeleteOpen();
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Modal */}
      <Modal isOpen={isUpdateOpen} onOpenChange={onUpdateOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Update User</ModalHeader>
              <ModalBody>
                {updatedUser && (
                  <div className="space-y-4">
                    <Input
                      fullWidth
                      label="Name"
                      name="name"
                      value={updatedUser.name}
                      onChange={handleInputChange}
                    />
                    <Input
                      fullWidth
                      label="Email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                    />
                    <Input
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={updatedUser.phoneNumber}
                      onChange={handleInputChange}
                    />
                    <Input
                      fullWidth
                      label="Username"
                      name="username"
                      value={updatedUser.username}
                      onChange={handleInputChange}
                    />
                    <Select
                      fullWidth
                      label="Role"
                      selectedKeys={[updatedUser.role]}
                      onSelectionChange={(keys) => {
                        const selectedRole = Array.from(keys)[0] as string;

                        handleRoleChange(selectedRole);
                      }}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleUpdateUser}>
                  Update User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this user?
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => {
                    deleteUser(updatedUser?._id || '');
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserList;