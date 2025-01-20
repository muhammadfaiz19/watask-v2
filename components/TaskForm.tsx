/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
"use client";

import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input, Textarea } from "@heroui/input";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { toast } from "react-hot-toast";

import api from "@/api/api";


type User = {
  _id: string;
  name: string;
};

type Task = {
  name: string;
  description: string;
  deadlineDate: string;
  deadlineTime: string;
  users: string[];
};

const TaskForm: React.FC<{ onTaskAdded: () => void }> = ({ onTaskAdded }) => {
  const [task, setTask] = useState<Task>({
    name: "",
    description: "",
    deadlineDate: "",
    deadlineTime: "",
    users: [],
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  // Fetch users ketika komponen di-mount
  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  // Handle perubahan input
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  // Handle checkbox untuk assign semua user
  const handleUserSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setIsCheckboxChecked(isChecked);

    if (isChecked) {
      const selectedUsers = users.map((user) => user._id);

      setTask((prevTask) => ({ ...prevTask, users: selectedUsers }));
    } else {
      setTask((prevTask) => ({ ...prevTask, users: [] }));
    }
  };

  // Handle submit form
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isCheckboxChecked) {
      toast.error("Please select the checkbox to assign users.");

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
        onTaskAdded(); // Panggil fungsi refresh data
      })
      .catch(() => {
        toast.error("Failed to create task. Please try again.");
      });
  };

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
          required
          color="primary"
          isSelected={isCheckboxChecked}
          onChange={handleUserSelection}
        >
          Assign to All Users
        </Checkbox>
        <Button fullWidth color="primary" type="submit">
          Create Task
        </Button>
      </form>
    </>
  );
};

export default TaskForm;
