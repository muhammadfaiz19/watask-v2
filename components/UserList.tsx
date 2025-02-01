"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
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
  TableCell,
} from "@heroui/table";
import { Select, SelectItem } from "@heroui/select";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { User } from "@/types/User";
import api from "@/api/api";

interface UserListProps {
  users: User[];
  onDelete: (id: string) => Promise<void>;
}

const ROLE_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

const UserList: React.FC<UserListProps> = ({ users, onDelete }) => {
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onOpenChange: onUpdateOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterRole === "" || user.role === filterRole)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleUpdateUser = async () => {
    if (updatedUser && updatedUser._id) {
      try {
        await api.put(`/users/${updatedUser._id}`, updatedUser);
        toast.success("User updated successfully!");
        onUpdateOpenChange();
      } catch (err) {
        console.error("Failed to update user", err);
        toast.error("Failed to update user. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-4xl w-full mt-5">
      <h2 className="text-xl text-center font-semibold mb-4">User List</h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <Input
          className="w-full md:w-3/4"
          label="Search"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          className="w-full md:w-1/4"
          label="Filter by Role"
          selectedKeys={[filterRole]}
          onSelectionChange={(keys) => setFilterRole(Array.from(keys)[0] as string)}
        >
          {ROLE_OPTIONS.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table className="bg-default-100/70 min-w-full">
          <TableHeader>
            <TableColumn className="font-bold text-center">Name</TableColumn>
            <TableColumn className="font-bold text-center">Phone Number</TableColumn>
            <TableColumn className="font-bold text-center">Email</TableColumn>
            <TableColumn className="font-bold text-center">Username</TableColumn>
            <TableColumn className="font-bold text-center">Role</TableColumn>
            <TableColumn className="font-bold text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">{user.phoneNumber}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">{user.username}</TableCell>
                <TableCell className="text-center">{user.role}</TableCell>
                <TableCell className="text-center space-x-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="faded">:</Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key="update"
                        onPress={() => {
                          setUpdatedUser({ ...user });
                          onUpdateOpen();
                        }}
                      >
                        Update
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        onPress={() => {
                          setUpdatedUser(user);
                          onDeleteOpen();
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Update Modal */}
      <Modal
        backdrop="blur"
        className="mx-4"
        isOpen={isUpdateOpen}
        placement="center"
        onOpenChange={onUpdateOpenChange}
      >
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
      <Modal
        backdrop="blur"
        className="mx-4"
        isOpen={isDeleteOpen}
        placement="center"
        onOpenChange={onDeleteOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>Are you sure you want to delete this user?</ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onDelete(updatedUser?._id || "");
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
