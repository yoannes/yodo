import { Task, TaskCollection, TaskId } from "@types";
import dayjs from "dayjs";

export function mapTaskToCollection(task: Task): TaskCollection {
  return {
    title: task.title,
    description: task.description,
    createdAt: task.createdAt.unix(),
    updatedAt: task.updatedAt.unix(),
    completedAt: task.completedAt ? task.completedAt.unix() : null,
    deleted: task.deleted,
  };
}

export function mapCollectionToTask(id: TaskId, collection: TaskCollection): Task {
  return {
    id,
    title: collection.title,
    description: collection.description,
    createdAt: dayjs.unix(collection.createdAt),
    updatedAt: dayjs.unix(collection.updatedAt),
    completedAt: collection.completedAt ? dayjs.unix(collection.completedAt) : null,
    deleted: collection.deleted,
  };
}
