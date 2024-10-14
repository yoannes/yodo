import { Collections } from "@consts";
import { lang } from "@hooks";
import { UserCollection } from "@types";
import { AuthUser, firebaseAdd, firebaseGet, logger } from "@utils";

export async function createUserIfNotExists(authUser: AuthUser) {
  const exists = await firebaseGet<UserCollection>({
    collectionName: Collections.Users,
    where: { fieldPath: "email", opStr: "==", value: authUser.email },
  });

  if (exists.status === "OK") {
    return exists.results![0];
  }

  if (exists.status === "NO_RESULTS") {
    const name = authUser.displayName?.split(" ") || [];
    const firstName = name.length > 0 ? name[0] : "";
    const lastName = name.length > 1 ? name.slice(1).join(" ") : "";
    const payload = {
      email: authUser.email,
      firstName,
      lastName,
      avatar: authUser.photoURL || "",
      userType: "User",
      lang,
    };
    const res = await firebaseAdd<UserCollection>(Collections.Users, payload);

    if (res.status === "OK") {
      dispatchSlack({
        email: authUser.email || "",
        name: authUser.displayName || "",
        avatar: authUser.photoURL || "",
        lang,
      });
      return res.result;
    }
  }

  return null;
}

function dispatchSlack(payload: Record<string, string>) {
  const data = {
    text: [
      "*Sign up*",
      `Name: *${payload.name}*`,
      `Email: *${payload.email}*`,
      `Language: *${payload.lang}*`,
      `Avatar: ${payload.avatar}`,
    ].join("\n"),
  };

  fetch(import.meta.env.VITE_SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((result) => logger("Success:", result))
    .catch((error) => logger("Error:", error));
}
