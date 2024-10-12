import { Collections } from "@consts";
import { TaskCollection } from "@types";
import { firebaseAdd, firebaseDelete, firebaseUndelete, firebaseUpdate } from "@utils";
import { useMemo } from "react";
import { useAppState } from "../../context/AppStateHooks";

export function useTasks() {
  const { tasks, auth } = useAppState();

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

  const edit = async (id: string, title: string) => {
    if (!auth.user || !title) return;

    try {
      const collection = `${Collections.Users}/${auth.user.id}/${Collections.Tasks}`;
      await firebaseUpdate<TaskCollection>(collection, id, { title });
      return true;
    } catch (error) {
      return false;
    }
  };

  const del = async (id: string) => {
    if (!auth.user) return;

    try {
      const collection = `${Collections.Users}/${auth.user.id}/${Collections.Tasks}`;
      await firebaseDelete(collection, id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const unDel = async (id: string) => {
    if (!auth.user) return;

    try {
      const collection = `${Collections.Users}/${auth.user.id}/${Collections.Tasks}`;
      await firebaseUndelete(collection, id);
      return true;
    } catch (error) {
      return false;
    }
  };

  return useMemo(
    () => ({
      state: tasks,
      add,
      edit,
      del,
      unDel,
    }),
    [tasks],
  );
}
