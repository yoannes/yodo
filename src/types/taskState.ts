import { Task, TaskId } from "./collections";

export type TaskState = {
  list: Record<TaskId, Task>;
};
