/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input, Textarea } from "@heroui/input";

import { useAuth } from "@/context/AuthContext";
import api from "@/api/api";
import { User } from "@/types/User";

type Task = {
  name: string;
  description: string;
  deadlineDate: string;
  deadlineTime: string;
  users: string[];
};

const TaskForm: React.FC<{ onTaskAdded: () => void }> = ({ onTaskAdded }) => {
  const { user } = useAuth();
  const [task, setTask] = useState<Task>({
    name: "",
    description: "",
    deadlineDate: "",
    deadlineTime: "",
    users: [],
  });

  const [users, setUsers] = useState([]);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleUserSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setIsCheckboxChecked(isChecked);

    if (isChecked) {
      const selectedUsers = users.map((user: User) => user._id);

      setTask((prevTask) => ({ ...prevTask, users: selectedUsers }));
    } else {
      setTask((prevTask) => ({ ...prevTask, users: [] }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedDeadline = new Date(
      `${task.deadlineDate}T${task.deadlineTime}`
    );
    const currentDate = new Date();

    if (selectedDeadline <= currentDate) {
      toast.error("Deadline must be in the future.");

      return;
    }

    if (task.users.length === 0) {
      toast.error("Please select at least one user.");

      return;
    }

    api
      .post("/tasks", task)
      .then(() => {
        toast.success("Task created successfully!");
        setTask({
          name: "",
          description: "",
          deadlineDate: "",
          deadlineTime: "",
          users: [],
        });
        setIsCheckboxChecked(false);
        onTaskAdded();
      })
      .catch(() => {
        toast.error("Failed to create task. Please try again.");
      });
  };

  const isAdmin = user?.role === "admin";

  return (
    <>
      <form
        className="space-y-6 max-w-4xl w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <Input
          fullWidth
          required
          label="Task Name"
          name="name"
          placeholder="Task Name"
          type="text"
          value={task.name}
          variant="faded"
          onChange={handleInputChange}
        />
        <Textarea
          fullWidth
          required
          label="Description"
          name="description"
          placeholder="Describe the task"
          value={task.description}
          variant="faded"
          onChange={handleInputChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            fullWidth
            required
            label="Deadline Date"
            name="deadlineDate"
            type="date"
            value={task.deadlineDate}
            variant="faded"
            onChange={handleInputChange}
          />
          <Input
            fullWidth
            required
            label="Deadline Time"
            name="deadlineTime"
            type="time"
            value={task.deadlineTime}
            variant="faded"
            onChange={handleInputChange}
          />
        </div>

        <Checkbox
          color="primary"
          isSelected={isCheckboxChecked}
          onChange={handleUserSelection}
        >
          Assign to All Users
        </Checkbox>

        <div className="relative group">
          <Button
            fullWidth
            className={
              !isAdmin ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
            }
            color={isAdmin ? "primary" : "default"}
            disabled={!isAdmin}
            type="submit"
            variant={isAdmin ? "solid" : "light"}
          >
            Create Task
          </Button>
          {!isAdmin && (
            <span className="absolute left-1/2 top-0 mb-2 w-max bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform -translate-x-1/2 -translate-y-full">
              You are not an admin
            </span>
          )}
        </div>
      </form>
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

export default TaskForm;
