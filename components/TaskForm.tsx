/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
"use client";

import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input, Textarea } from "@heroui/input";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

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

  // Fetch users when component mounts
  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  // Handle checkbox for assigning all users
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

  // Handle individual user selection
  // const handleIndividualUserSelect = (userId: string) => {
  //   setTask((prevTask) => {
  //     const newUsers = prevTask.users.includes(userId)
  //       ? prevTask.users.filter(id => id !== userId)
  //       : [...prevTask.users, userId];

  //     return { ...prevTask, users: newUsers };
  //   });
  // };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate deadline
    const selectedDeadline = new Date(`${task.deadlineDate}T${task.deadlineTime}`);
    const currentDate = new Date();

    if (selectedDeadline <= currentDate) {
      toast.error("Deadline must be in the future.");

      return;
    }

    // Validate user selection
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
        onTaskAdded(); // Call data refresh function
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
          color="primary"
          isSelected={isCheckboxChecked}
          onChange={handleUserSelection}
        >
          Assign to All Users
        </Checkbox>

        {/* {!isCheckboxChecked && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
            {users.map(user => (
              <Checkbox
                key={user._id}
                color="primary"
                isSelected={task.users.includes(user._id)}
                onChange={() => handleIndividualUserSelect(user._id)}
              >
                {user.name}
              </Checkbox>
            ))}
          </div>
        )} */}

        <Button fullWidth color="primary" type="submit">
          Create Task
        </Button>
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