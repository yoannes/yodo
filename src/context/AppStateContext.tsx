import type { AppState } from "@types";
import { AuthUser, firebaseAuthStateChanged, logger } from "@utils";
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
};

let started = false;

export const AppStateContext = createContext<AppState>(initialState);
export const AppDispatchContext = createContext<(changes: Partial<AppState>) => void>(() => {});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(initialState);

  // This function is used to update the state
  const dispatch = (changes: Partial<AppState>) => {
    setState((prev) => {
      return { ...prev, ...changes };
    });
  };

  // This function is called when the user logs in or logs out
  const authChanged = async (authUser: AuthUser | null) => {
    logger("authChanged", authUser);

    if (authUser && authUser.email) {
      const user = await createUserIfNotExists(authUser);
      if (user) {
        dispatch({
          auth: {
            user: {
              ...user.data,
              id: user.id,
              createdAt: dayjs(user.data.createdAt),
              fullname: `${user.data.lastName || ""} ${user.data.firstName || ""}`,
            },
            authUser,
            ready: true,
          },
        });
      }
    } else {
      dispatch({
        auth: { user: null, authUser: null, ready: true },
      });
    }
  };

  useEffect(() => {
    if (started) return;
    started = true;

    firebaseAuthStateChanged((user) => authChanged(user));
  }, [authChanged]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export { AppProvider };
