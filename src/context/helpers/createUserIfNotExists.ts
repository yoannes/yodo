import { Collections } from "@consts";
import { lang } from "@hooks";
import { UserCollection } from "@types";
import { AuthUser, firebaseAdd, firebaseGet } from "@utils";

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

    const res = await firebaseAdd<UserCollection>(Collections.Users, {
      email: authUser.email,
      firstName,
      lastName,
      avatar: authUser.photoURL || "",
      userType: "User",
      lang,
    });

    if (res.status === "OK") {
      return res.result;
    }
  }

  return null;
}
