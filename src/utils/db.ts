import { logger } from "./logger";

const storageKey = "Yodo";
let localDb: Record<string, unknown> = {};

if (typeof window !== "undefined") {
  const localData = window.localStorage.getItem(storageKey);

  if (localData) {
    localDb = JSON.parse(localData);
  }
}

/**
 * LocalStorage
 * Insert: DB(key, value)
 * Select: DB(key)
 * Delete: DB(key, null)
 */
export function DB<T>(key: string, value?: unknown): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (key === "RESET_DB") {
    logger("resetDB", storageKey);
    localDb = {};
    window.localStorage.removeItem(storageKey);
    return null;
  }

  if (value === null) {
    delete localDb[key];
    window.localStorage.setItem(storageKey, JSON.stringify(localDb));
    return null;
  }

  if (value === undefined) {
    return (localDb[key] as T) || null;
  }

  localDb[key] = value;

  window.localStorage.setItem(storageKey, JSON.stringify(localDb));

  return null;
}
