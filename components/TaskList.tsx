"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { useState, useEffect } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth(); // Mendapatkan informasi user yang sedang login
  const isAdmin = user?.role === "admin"; // Menentukan apakah user adalah admin

  const [tasks, setTasks] = useState<Task[]>([]);
  const [updatedTask, setUpdatedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string>("");

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUpdatedTask((prevTask) =>
      prevTask ? { ...prevTask, [name]: value } : null
    );
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
          onUpdateOpenChange();
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
              {/* Update Button */}
              <div
                className={
                  !isAdmin
                    ? "relative group cursor-not-allowed"
                    : "relative group"
                }
              >
                <Button
                  className={
                    !isAdmin
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }
                  color={isAdmin ? "primary" : "default"}
                  disabled={!isAdmin}
                  variant={isAdmin ? "solid" : "light"}
                  onPress={() => {
                    if (isAdmin) {
                      setUpdatedTask({ ...task });
                      onUpdateOpen();
                    }
                  }}
                >
                  Update
                </Button>
                {!isAdmin && (
                  <span className="absolute left-1/2 top-0 mb-2 w-max bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform -translate-x-1/2 -translate-y-full">
                    You are not an admin
                  </span>
                )}
              </div>

              {/* Delete Button */}
              <div
                className={
                  !isAdmin
                    ? "relative group cursor-not-allowed"
                    : "relative group"
                }
              >
                <Button
                  className={
                    !isAdmin
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : ""
                  }
                  color={isAdmin ? "danger" : "default"}
                  disabled={!isAdmin}
                  variant={isAdmin ? "solid" : "light"}
                  onPress={() => {
                    if (isAdmin) {
                      setTaskToDelete(task._id);
                      onDeleteOpen();
                    }
                  }}
                >
                  Delete
                </Button>
                {!isAdmin && (
                  <span className="absolute left-1/2 top-0 mb-2 w-max bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform -translate-x-1/2 -translate-y-full">
                    You are not an admin
                  </span>
                )}
              </div>
            </div>
          </AccordionItem>
        ))}
      </Accordion>

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
              <ModalHeader>Update Task</ModalHeader>
              <ModalBody>
                {updatedTask && (
                  <div className="space-y-4">
                    <Input
                      fullWidth
                      label="Task Name"
                      name="name"
                      value={updatedTask.name}
                      onChange={handleInputChange}
                    />
                    <Textarea
                      fullWidth
                      label="Description"
                      name="description"
                      value={updatedTask.description}
                      onChange={handleInputChange}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        fullWidth
                        label="Deadline Date"
                        name="deadlineDate"
                        type="date"
                        value={updatedTask.deadlineDate}
                        onChange={handleInputChange}
                      />
                      <Input
                        fullWidth
                        label="Deadline Time"
                        name="deadlineTime"
                        type="time"
                        value={updatedTask.deadlineTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleUpdateTask}>
                  Update Task
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
              <ModalBody>Are you sure you want to delete this task?</ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    deleteTask(taskToDelete);
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
  );
};

export default TaskList;
