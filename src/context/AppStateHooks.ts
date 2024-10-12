import { useContext } from "react";
import { AppDispatchContext, AppStateContext } from "./AppStateContext";

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);
