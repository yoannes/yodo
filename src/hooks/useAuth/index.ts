import { logger } from "@utils";
import {
  firebaseLogin,
  firebaseLogout,
  firebaseSigninGoogle,
  firebaseSignup,
} from "@utils/firebase";
import { useMemo } from "react";
import { useAppState } from "../../context/AppStateHooks";

export function useAuth() {
  const { auth } = useAppState();

  const signup = async (email: string, password: string) => {
    const res = await firebaseSignup(email, password);
    logger("firebaseSignup", res);
    return res.status;
  };

  const login = async (email: string, password: string) => {
    const res = await firebaseLogin(email, password);
    logger("login", res);
    return res.status;
  };

  const signout = async () => {
    logger("signout");
    return firebaseLogout();
  };

  return useMemo(
    () => ({
      state: auth,
      me: auth.user,
      login,
      signup,
      loginGoogle: firebaseSigninGoogle,
      signout,
    }),
    [auth, auth.ready],
  );
}
