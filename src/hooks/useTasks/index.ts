import { Collections } from "@consts";
import { setLocalData } from "@context/helpers";
import { TaskCollection } from "@types";
import {
  firebaseAdd,
  firebaseDelete,
  firebaseGetCount,
  firebaseUndelete,
  firebaseUpdate,
} from "@utils";
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

  const edit = async (id: string, payload: Partial<TaskCollection>) => {
    if (!auth.user) return;

    try {
      const collection = `${Collections.Users}/${auth.user.id}/${Collections.Tasks}`;
      await firebaseUpdate<TaskCollection>(collection, id, payload);
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

      setTasks((prev) => {
        const { [id]: _, ...rest } = prev.list;
        const newState = { ...prev, list: rest };
        if (auth.user) setLocalData(auth.user.id, newState);
        return newState;
      });

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

  const getCount = async () => {
    if (!auth.user) return;

    const open = await firebaseGetCount({
      collectionName: `${Collections.Users}/${auth.user.id}/${Collections.Tasks}`,
      where: {
        fieldPath: "completedAt",
        opStr: "==",
        value: null,
      },
    });
    const completed = await firebaseGetCount({
      collectionName: `${Collections.Users}/${auth.user.id}/${Collections.Tasks}`,
      where: {
        fieldPath: "completedAt",
        opStr: "!=",
        value: null,
      },
    });

    return { open: open.result || 0, completed: completed.result || 0 };
  };

  return useMemo(
    () => ({
      state: tasks,
      add,
      edit,
      del,
      unDel,
      getCount,
    }),
    [tasks],
  );
}
