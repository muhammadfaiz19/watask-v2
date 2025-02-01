"use client";
import { useEffect, useState } from "react";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { protectRoute } = useAuth();
  
  useEffect(() => {
    const initializePage = async () => {
      try {
        await protectRoute();
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [protectRoute]);

  const handleTaskAdded = () => {
    setRefresh(!refresh); 
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 px-8 md:px-10">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList refresh={refresh} />
    </section>
  );
}