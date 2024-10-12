import { Collections } from "@consts";
import { TaskCollection } from "@types";
import { firebaseAdd } from "@utils";
import { useMemo } from "react";
import { useAppDispatch, useAppState } from "../../context/AppStateHooks";

export function useTasks() {
  const { tasks, auth } = useAppState();
  const { setTasks } = useAppDispatch();

  const add = async (title: string) => {
    if (!auth.user || !title) return;

    const t = {
      title,
      completedAt: null,
    };

    const collection = `${Collections.Users}/${auth.user.id}/${Collections.Tasks}`;
    const res = await firebaseAdd<TaskCollection>(collection, t);

    return res.status === "OK";
  };

  return useMemo(
    () => ({
      state: tasks,
      add,
    }),
    [tasks],
  );
}
