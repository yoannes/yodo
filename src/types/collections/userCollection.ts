import { Dayjs } from "dayjs";

// Common fields between UserCollection and User
type UserCommon = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  userType: 1 | 2;
  lang: "pt_BR" | "en" | "ja";
};

// UserCollection is the type of the user object in the Firestore collection
export interface UserCollection extends UserCommon {
  createdAt: number;
}

// User is the type of the user object in the app state
export interface User extends UserCommon {
  id: string;
  createdAt: Dayjs;
  fullname: string;
}
