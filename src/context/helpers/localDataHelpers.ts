import { Collections } from "@consts";
import { TaskCollection, TaskId, TaskState } from "@types";
import { firebaseGet, logger, mapCollectionToTask, mapTaskToCollection } from "@utils";
import dayjs from "dayjs";
import localforage from "localforage";

/**
 * Local data helpers
 *
 * This helpers will help us to manage the local storage data
 * We will use localforage to store the data in the indexedDB
 * And Check on firebase for older tasks and update the locally
 * Assuming that most users won't delete their data frequently, this function will save us a lot of reads
 */

function localDataKey(userId: string) {
  return `tasks-${userId}`;
}

export async function loadLocalData(userId: string) {
  try {
    const res = await localforage.getItem<{ list: Record<TaskId, TaskCollection> }>(
      localDataKey(userId),
    );
    if (res) {
      // Deserialize TaskCollection to Task
      const deserializedData: TaskState = {
        list: Object.fromEntries(
          Object.entries(res.list).map(([taskId, taskCollection]) => [
            taskId,
            mapCollectionToTask(taskId, taskCollection),
          ]),
        ),
      };

      return deserializedData;
    }
  } catch (error) {
    logger("Failed to load local data", error);
  }

  return { list: {} };
}

export async function setLocalData(userId: string, data: TaskState) {
  try {
    const serializedData: Record<TaskId, TaskCollection> = Object.fromEntries(
      Object.entries(data.list).map(([taskId, task]) => [taskId, mapTaskToCollection(task)]),
    );

    await localforage.setItem(localDataKey(userId), { list: serializedData });
  } catch (error) {
    logger("Failed to set local data", error);
  }
}

export async function syncLocalData(
  setTasks: (data: TaskState) => void,
  userId: string,
  data: TaskState,
) {
  // fom data, get the oldest task by createdAt
  const oldestTask = Object.values(data.list).sort(
    (a, b) => a.createdAt.unix() - b.createdAt.unix(),
  )[0];
  const oldest = oldestTask ? oldestTask.createdAt.unix() : dayjs().unix();

  const res = await firebaseGet<TaskCollection>({
    collectionName: `${Collections.Users}/${userId}/${Collections.Tasks}`,
    where: { fieldPath: "createdAt", opStr: "<", value: oldest },
  });

  logger("syncLocalData", res);

  if (res.status === "OK") {
    for (const serializedTask of res.results || []) {
      const task = mapCollectionToTask(serializedTask.id, serializedTask.data);
      data.list[task.id] = task;
    }

    await setLocalData(userId, data);
  }

  setTasks(data);
}
