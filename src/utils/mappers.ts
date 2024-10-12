import { Task, TaskCollection, TaskId } from "@types";
import dayjs from "dayjs";

export function mapTaskToCollection(task: Task): TaskCollection {
  return {
    title: task.title,
    createdAt: task.createdAt.unix(),
    updatedAt: task.updatedAt.unix(),
    completedAt: task.completedAt ? task.completedAt.unix() : null,
  };
}

export function mapCollectionToTask(id: TaskId, collection: TaskCollection): Task {
  return {
    id,
    title: collection.title,
    createdAt: dayjs.unix(collection.createdAt),
    updatedAt: dayjs.unix(collection.updatedAt),
    completedAt: collection.completedAt ? dayjs.unix(collection.completedAt) : null,
  };
}
