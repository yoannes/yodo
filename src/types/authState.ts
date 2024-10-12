import { User as AuthUser } from "firebase/auth";
import { User } from "./collections";

export type AuthState = {
  authUser: null | AuthUser;
  user: null | User;
  ready: boolean;
};
