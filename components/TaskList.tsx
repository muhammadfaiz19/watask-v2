/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Accordion, AccordionItem } from "@heroui/accordion";

import api from "@/api/api";
interface TaskListProps {
  refresh: boolean;
}

interface Task {
  _id: string;
  name: string;
  description: string;
  deadlineDate: string;
  deadlineTime: string;
}

const TaskList: React.FC<TaskListProps> = ({ refresh }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [updatedTask, setUpdatedTask] = useState<Task | null>(null);

  useEffect(() => {
    api
      .get("/tasks")
      .then((response) => setTasks(response.data))
      .catch((err) => {
        console.error("Failed to fetch tasks", err);
        toast.error("Failed to load tasks. Please try again.");
      });
  }, [refresh]);

  const deleteTask = (id: string) => {
    api
      .delete(`/tasks/${id}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        toast.success("Task deleted successfully!");
      })
      .catch((err) => {
        console.error("Failed to delete task", err);
        toast.error("Failed to delete task. Please try again.");
      });
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task._id);
    setUpdatedTask({ ...task });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUpdatedTask((prevTask) => (prevTask ? { ...prevTask, [name]: value } : null));
  };

  const handleUpdateTask = () => {
    if (updatedTask && updatedTask._id) {
      api
        .put(`/tasks/${updatedTask._id}`, updatedTask)
        .then(() => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === updatedTask._id ? updatedTask : task
            )
          );
          toast.success("Task updated successfully!");
          setEditingTaskId(null);
        })
        .catch((err) => {
          console.error("Failed to update task", err);
          toast.error("Failed to update task. Please try again.");
        });
    }
  };

  return (
    <div className="max-w-4xl w-full mt-5">
      <h2 className="text-xl text-center font-semibold mb-4">Task List</h2>
      <Accordion className="bg-default-100/70" variant="bordered">
        {tasks.map((task) => (
          <AccordionItem key={task._id} title={task.name}>
            <div>
              <p>Deskripsi Tugas: {task.description}</p>
              <p>
                Deadline:{" "}
                {format(new Date(task.deadlineDate), "eeee, dd MMMM yyyy", {
                  locale: localeId,
                })}
              </p>
              <p>Pukul: {task.deadlineTime} WIB</p>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button color="primary" onPress={() => handleEditClick(task)}>
                Edit
              </Button>
              <Button
                color="danger"
                type="button"
                onPress={() => deleteTask(task._id)}
              >
                Delete
              </Button>
            </div>

            {editingTaskId === task._id && updatedTask && (
              <div className="mt-6 p-6 rounded-md shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Edit Task</h3>

                <div className="space-y-4">
                  <Input
                    fullWidth
                    aria-label="Task Name"
                    label="Task Name"
                    name="name"
                    value={updatedTask.name}
                    onChange={handleInputChange}
                  />
                  <Textarea
                    fullWidth
                    aria-label="Description"
                    label="Description"
                    name="description"
                    value={updatedTask.description}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      fullWidth
                      aria-label="Deadline Date"
                      label="Deadline Date"
                      name="deadlineDate"
                      type="date"
                      value={updatedTask.deadlineDate}
                      onChange={handleInputChange}
                    />
                    <Input
                      fullWidth
                      aria-label="Deadline Time"
                      label="Deadline Time"
                      name="deadlineTime"
                      type="time"
                      value={updatedTask.deadlineTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <Button color="primary" type="button" onPress={handleUpdateTask}>
                    Update Task
                  </Button>
                  <Button
                    color="default"
                    type="button"
                    onPress={() => setEditingTaskId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TaskList;
