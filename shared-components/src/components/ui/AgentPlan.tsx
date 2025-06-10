"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
} from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

// Type definitions
interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tools?: string[];
  agent?: string;
  context?: string;
  planId?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

// Initial task data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research Project Requirements",
    description:
      "Gather all necessary information about project scope and requirements",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Interview stakeholders",
        description:
          "Conduct interviews with key stakeholders to understand needs",
        status: "completed",
        priority: "high",
        tools: ["communication-agent", "meeting-scheduler"],
      },
      {
        id: "1.2",
        title: "Review existing documentation",
        description:
          "Go through all available documentation and extract requirements",
        status: "in-progress",
        priority: "medium",
        tools: ["file-system", "browser"],
      },
      {
        id: "1.3",
        title: "Compile findings report",
        description:
          "Create a comprehensive report of all gathered information",
        status: "need-help",
        priority: "medium",
        tools: ["file-system", "markdown-processor"],
      },
    ],
  },
  {
    id: "2",
    title: "Design System Architecture",
    description: "Create the overall system architecture based on requirements",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "2.1",
        title: "Define main components",
        description: "Identify and define all main system components",
        status: "pending",
        priority: "high",
        tools: ["diagram-tool"],
      },
      {
        id: "2.2",
        title: "Choose technology stack",
        description: "Select appropriate technologies for each component",
        status: "pending",
        priority: "medium",
        tools: ["research-agent"],
      },
    ],
  },
];

// Drag handle for tasks
function DragHandle() {
  return (
    <span
      style={{ cursor: "grab", marginRight: 8, color: "#888" }}
      aria-label="Drag to reorder"
      tabIndex={0}
      role="button"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="5" cy="6" r="1.5" fill="currentColor"/><circle cx="5" cy="10" r="1.5" fill="currentColor"/><circle cx="5" cy="14" r="1.5" fill="currentColor"/><circle cx="10" cy="6" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="14" r="1.5" fill="currentColor"/></svg>
    </span>
  );
}

// Sortable Task Item
function SortableTask({ task, index, children }: { task: Task; index: number; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : undefined,
    background: isDragging ? "#f3f4f6" : undefined,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="relative group border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 rounded-xl shadow-sm mb-2"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span {...listeners} tabIndex={0} aria-label="Drag handle" className="cursor-grab">
          <DragHandle />
        </span>
        {children}
      </div>
    </motion.li>
  );
}

export default function AgentPlan({ tasks: propTasks }: { tasks?: Task[] } = {}) {
  // Controlled vs uncontrolled logic
  const isControlled = !!propTasks;
  const [internalTasks, setInternalTasks] = useState<Task[]>(isControlled ? [] : initialTasks);
  const tasks: Task[] = isControlled ? propTasks! : internalTasks;

  // DnD-kit setup
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: any) {
    if (isControlled) return; // Only allow reordering in uncontrolled mode
    const { active, over } = event;
    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      setInternalTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <motion.div layout>
        <LayoutGroup>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {tasks.map((task, idx) => (
                  <SortableTask key={task.id} task={task} index={idx}>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{task.title}</span>
                        <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-bold">
                          {task.priority}
                        </span>
                        <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold">
                          {task.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{task.description}</div>
                      {/* Subtasks and controls would go here */}
                    </div>
                  </SortableTask>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
