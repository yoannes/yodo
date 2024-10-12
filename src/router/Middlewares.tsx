import { useAuth, useNavigator } from "@hooks";
import type { Route } from "@router";
import { logger } from "@utils";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

// Use this component as middleware when needed
const Middlewares = ({ component: Component, notProtected }: Route) => {
  const auth = useAuth();
  const nav = useNavigator();

  useEffect(() => {
    if (!notProtected && !auth.state.authUser) {
      nav.push({ name: "login" });
    }
  }, [auth.state.authUser]);

  if (notProtected === true) {
    return <Component />;
  }

  if (!auth.state.authUser) {
    logger("User is not authenticated, redirecting to login page");
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

Middlewares.displayName = "Middlewares";

export default Middlewares;
