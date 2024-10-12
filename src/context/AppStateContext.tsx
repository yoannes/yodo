import { Collections } from "@consts";
import type { AppState, AuthState, TaskCollection } from "@types";
import { TaskState } from "@types";
import {
  AuthUser,
  firebaseAuthStateChanged,
  firebaseListenToDocChanges,
  logger,
  mapCollectionToTask,
} from "@utils";
import dayjs from "dayjs";
import type React from "react";
import { createContext, useEffect, useState } from "react";
import { createUserIfNotExists } from "./helpers";

const initialState: AppState = {
  auth: {
    user: null,
    authUser: null,
    ready: false,
  },
  tasks: {
    list: {},
  },
};

let started = false;

export const AppStateContext = createContext<AppState>(initialState);
export const AppDispatchContext = createContext<{
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  setTasks: React.Dispatch<React.SetStateAction<TaskState>>;
}>({
  setAuth: () => {},
  setTasks: () => {},
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(initialState.auth);
  const [tasks, setTasks] = useState<TaskState>(initialState.tasks);

  const setDefaultListeners = (userId: string) => {
    firebaseListenToDocChanges({
      collectionName: `${Collections.Users}/${userId}/${Collections.Tasks}`,
      callback(changes) {
        logger("changes", changes);

        if (changes.type === "removed") {
          setTasks((prev) => {
            const { [changes.doc.id]: _, ...rest } = prev.list;
            return { ...prev, list: rest };
          });
        } else {
          const id = changes.doc.id;
          const data = changes.doc.data() as TaskCollection;

          setTasks((prev) => {
            return {
              ...prev,
              list: { ...prev.list, [id]: mapCollectionToTask(id, data) },
            };
          });
        }
      },
    });
  };

  // This function is called when the user logs in or logs out
  const authChanged = async (authUser: AuthUser | null) => {
    logger("authChanged", authUser);

    if (authUser && authUser.email) {
      const user = await createUserIfNotExists(authUser);
      if (user) {
        setAuth({
          user: {
            ...user.data,
            id: user.id,
            createdAt: dayjs(user.data.createdAt),
            fullname: `${user.data.lastName || ""} ${user.data.firstName || ""}`,
          },
          authUser,
          ready: true,
        });
        setDefaultListeners(user.id);
      }
    } else {
      setAuth({ user: null, authUser: null, ready: true });
    }
  };

  useEffect(() => {
    if (started) return;
    started = true;

    firebaseAuthStateChanged((user) => authChanged(user));
  }, [authChanged]);

  return (
    <AppStateContext.Provider value={{ auth, tasks }}>
      <AppDispatchContext.Provider value={{ setAuth, setTasks }}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export { AppProvider };
