import { Dayjs } from "dayjs";

// Common fields between TaskCollection and Task
type TaskCommon = {
  deleted: null | { at: number };
  title: string;
  description: string;
};

export type TaskId = string;

// TaskCollection is the type of the Task object in the Firestore collection
export interface TaskCollection extends TaskCommon {
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
}

// Task is the type of the Task object in the app state
export interface Task extends TaskCommon {
  id: TaskId;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  completedAt: Dayjs | null;
}
