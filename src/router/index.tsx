import type { LayoutProps } from "@layouts";
import { lazy } from "react";
import { type RouteObject, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import LazyRoute from "./LazyRoute";

const Login = lazy(() => import("@/pages/Auth/Login"));
const Signup = lazy(() => import("@/pages/Auth/Signup"));

export type RouteName = keyof typeof routes;
export type Route = RouteObject & {
  notProtected?: boolean;
  admin?: boolean;
  component: React.ComponentType;
  layout?: React.FC<LayoutProps>;
};

export const routes = {
  home: { path: "/", component: Home },
  login: { path: "/login", component: Login, notProtected: true },
  signup: { path: "/signup", component: Signup, notProtected: true },
} as const;

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  Object.keys(routes).map((id) => {
    const { path, component, notProtected, layout } = (routes as Record<string, Route>)[id];
    return {
      id,
      path,
      element: <LazyRoute component={component} notProtected={notProtected} layout={layout} />,
    };
  }),
);
