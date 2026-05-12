"use client";

import { useState } from "react";

export function useTaskModal() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const openTaskModal = (taskId: string) => setSelectedTaskId(taskId);
  const closeTaskModal = () => setSelectedTaskId(null);
  return { selectedTaskId, openTaskModal, closeTaskModal };
}
