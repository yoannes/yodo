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
import { Unsubscribe } from "firebase/auth";
import localforage from "localforage";
import type React from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import { createUserIfNotExists, loadLocalData, setLocalData, syncLocalData } from "./helpers";

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
let listenSub: Unsubscribe;

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

  // We listen to doc changes from firestore, to avoid unnecessary reads we only
  // listen to changes that are newer than the newest task in the local storage
  const setDefaultListeners = useCallback(
    async (userId: string) => {
      listenSub?.();

      // if no userId, just cancel the listener
      if (!userId) return;

      let newest = dayjs().unix();
      const data = await loadLocalData(userId);
      if (data?.list) {
        const _newest = Object.values(data.list).sort(
          (a, b) => b.updatedAt.unix() - a.updatedAt.unix(),
        )[0];
        if (_newest) {
          newest = _newest.updatedAt.unix();
        }

        await syncLocalData(setTasks, userId, data);
      }

      listenSub = firebaseListenToDocChanges({
        collectionName: `${Collections.Users}/${userId}/${Collections.Tasks}`,
        orderBy: "updatedAt",
        orderByDirection: "desc",
        where: { fieldPath: "updatedAt", opStr: ">", value: newest },
        limit: 1,
        callback(changes) {
          logger("changes", changes);

          if (changes.type !== "removed") {
            const id = changes.doc.id;
            const data = changes.doc.data() as TaskCollection;

            setTasks((prev) => {
              const newState = {
                ...prev,
                list: { ...prev.list, [id]: mapCollectionToTask(id, data) },
              };

              setLocalData(userId, newState);

              return newState;
            });
          }
        },
      });
    },
    [setTasks],
  );

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
      }
    } else {
      setAuth({ user: null, authUser: null, ready: true });
      localforage.clear();
    }
  };

  useEffect(() => {
    setDefaultListeners(auth.user?.id || "");
  }, [setDefaultListeners, auth.user?.id]);

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
