import { logger } from "@utils";
import { useMemo } from "react";
import { useMatches, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { type Route, type RouteName, routes } from "../../router";

type QueryKey = "t" | "menu";
type Query = Partial<Record<QueryKey, string | string[]>>;

export type RouteLocation = {
  name?: RouteName;
  params?: Record<string, string>;
  query?: Query;
  isAdminRoute?: boolean;
};

export function useNavigator() {
  const navigate = useNavigate();
  const params = useParams();
  const matches = useMatches();
  const [searchParams] = useSearchParams();

  const currentRoute = useMemo<RouteLocation>(() => {
    const match = matches[0];
    if (!match) return {};

    const route = routes[match.id as RouteName];
    if (!route) return {};

    return {
      name: match.id,
      params: params as Record<string, string>,
      isAdminRoute: match.id.includes("admin"),
      query: Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => {
          if (acc[key]) {
            const _value = Array.isArray(acc[key]) ? [...acc[key], value] : [acc[key], value];
            acc[key] = _value as string | string[];
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string | string[]>,
      ),
    } as RouteLocation;
  }, [matches, params, searchParams]);

  const back = () => {
    navigate(-1);
  };

  const setParams = (to: RouteLocation, route: Route, routeName: string) => {
    let newParams = to.params || {};

    // Replace dynamic segments
    let path = (route.path || "") as string;

    // if newParams is empty and routeName is same as currentRoute, use currentRoute params
    if (Object.keys(newParams).length === 0 && routeName === currentRoute.name) {
      newParams = currentRoute.params || {};
    }

    for (const key of Object.keys(newParams)) {
      path = path.replace(`:${key}`, newParams[key]);
    }

    return path;
  };

  const push = (to: RouteLocation) => {
    const routeName = to.name || currentRoute.name || "";

    const route = routes[routeName as RouteName];
    if (!route) {
      // eslint-disable-next-line no-console
      console.warn(`No route found with name: ${routeName}`);
      return;
    }

    const query: Query = to.query || ({} as Query);
    const path = setParams(to, route, routeName);
    const searchParams = new URLSearchParams();

    for (const key of Object.keys(query)) {
      const value = query[key as QueryKey];
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined) searchParams.append(key, v);
        }
      } else if (value !== undefined) {
        searchParams.append(key, value);
      }
    }

    const queryString = searchParams.toString();

    logger("push", queryString ? `${path}?${queryString}` : path);
    navigate(queryString ? `${path}?${queryString}` : path);
  };

  return { push, back, params, currentRoute };
}
