"use client";
import { useEffect, useState } from "react";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const { protectRoute } = useAuth();

  useEffect(() => {
    protectRoute();
  }, []);
  const handleTaskAdded = () => {
    setRefresh(!refresh); 
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-8 md:px-10">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList refresh={refresh} />
    </section>
  );
}