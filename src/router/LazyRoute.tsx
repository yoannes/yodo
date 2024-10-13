import { YodoLoading } from "@components";
import { EmptyLayout } from "@layouts";
import type { Route } from "@router";
import { Suspense } from "react";
import Middlewares from "./Middlewares";

const LazyRoute = ({ component: Component, admin, notProtected, layout }: Route) => {
  const Layout = layout;

  return (
    <Suspense
      fallback={
        <EmptyLayout>
          <YodoLoading full />
        </EmptyLayout>
      }
    >
      {Layout ? (
        <Layout>
          <Middlewares admin={admin} notProtected={notProtected} component={Component} />
        </Layout>
      ) : (
        <Middlewares admin={admin} notProtected={notProtected} component={Component} />
      )}
    </Suspense>
  );
};

export default LazyRoute;
