import { AuthState } from "./authState";
import { TaskState } from "./taskState";

export type AppState = {
  auth: AuthState;
  tasks: TaskState;
};
