import dayjs from "dayjs";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  Unsubscribe,
  User,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  DocumentChange,
  DocumentData,
  FieldPath,
  QueryConstraint,
  WhereFilterOp,
  addDoc,
  collection,
  collectionGroup,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  endAt,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { logger } from "./logger";

type FirebaseOptionsWhere = {
  fieldPath: string | FieldPath;
  opStr: WhereFilterOp;
  value: unknown;
};

export type FirebaseOptions = {
  collectionName?: string;
  collectionGroupName?: string;
  where?: FirebaseOptionsWhere;
  compoundWhere?: FirebaseOptionsWhere[];
  limit?: number;
  startAt?: number;
  endAt?: number;
  orderBy?: string;
  orderByDirection?: "asc" | "desc";
  fetchDeleted?: boolean;
  // eslint-disable-next-line no-unused-vars
  callback?: (changes: FirebaseDocChange) => void;
};

export type AuthUser = User;
export type FirebaseUnsubscribe = Unsubscribe;
type FirebaseDocChange = DocumentChange<DocumentData>;

type FirebaseResponse<T> = {
  status: string;
  // has to be any because this type is used on the frontend and backend
  result?: { id: string; data: T };
  results?: { id: string; data: T }[];
};

const firebaseConfig = import.meta.env.VITE_FIREBASE || "{}";

// Initialize Firebase
const app = initializeApp(JSON.parse(firebaseConfig));
const auth = getAuth(app);
const db = getFirestore(app);
const fn = getFunctions(app);

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8090);
  connectFunctionsEmulator(fn, "localhost", 5001);
}

/**
 * Auth
 */

export async function firebaseLogin(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return { status: "OK", result: user };
  } catch (error: any) {
    return { status: error.code };
  }
}

export async function firebaseLogout() {
  try {
    await auth.signOut();
  } catch (error: any) {
    return { status: error.code };
  }
}

export async function firebaseSignup(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { status: "OK", result: user };
  } catch (error: any) {
    return { status: error.code };
  }
}

export async function firebaseSigninGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    return { status: error.code };
  }
}

export async function firebaseAuthStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Firestore
 */

function buildArgs(options: FirebaseOptions): QueryConstraint[] {
  const args: QueryConstraint[] = [];

  if (options.where && options.where.fieldPath) {
    args.push(where(options.where.fieldPath, options.where.opStr, options.where.value));
  }

  if (options.compoundWhere && options.compoundWhere.length) {
    options.compoundWhere.forEach((w) => {
      args.push(where(w.fieldPath, w.opStr, w.value));
    });
  }

  if (options.orderBy) args.push(orderBy(options.orderBy, options.orderByDirection || "asc"));
  if (options.startAt) args.push(startAt(options.startAt));
  if (options.endAt) args.push(endAt(options.endAt));
  if (options.limit) args.push(limit(options.limit));
  if (!options.fetchDeleted) args.push(where("deleted", "==", null));

  return args;
}

export function firebaseListenToDocChanges(options: FirebaseOptions): FirebaseUnsubscribe {
  if (!options.collectionName && !options.collectionGroupName) {
    throw new Error("collection is required");
  }
  if (!options.callback) {
    throw new Error("callback is required");
  }

  const args = buildArgs(options);
  const c = options.collectionName
    ? collection(db, options.collectionName || "")
    : collectionGroup(db, options.collectionGroupName || "");
  const q = query(c, ...args);

  return onSnapshot(
    q,
    (snapshot) => {
      if (options.callback) {
        for (const change of snapshot.docChanges()) {
          options.callback(change);
        }
      }
    },
    (error) => {
      logger("listenToDocChanges", error.code, error.message, options);
    },
  );
}

export async function firebaseGet<T>(options: FirebaseOptions): Promise<FirebaseResponse<T>> {
  try {
    if (!options.collectionName && !options.collectionGroupName) {
      throw new Error("collection is required");
    }

    const args = buildArgs(options);
    const c = options.collectionName
      ? collection(db, options.collectionName || "")
      : collectionGroup(db, options.collectionGroupName || "");
    const q = query(c, ...args);

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.docs.length) {
      return { status: "NO_RESULTS" };
    }

    const results = querySnapshot.docs.map((doc) => {
      return { id: doc.id, data: doc.data() as T };
    });

    return { status: "OK", results };
  } catch (error) {
    logger("firebaseGet", error);
    return { status: "ERROR" };
  }
}

export async function firebaseGetById<T>(
  collectionName: string,
  id: string,
): Promise<FirebaseResponse<T>> {
  try {
    if (!id) {
      return { status: "NOT_FOUND" };
    }

    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return {
        status: "OK",
        result: {
          id: snapshot.id,
          data: snapshot.data() as T,
        },
      };
    }
    return { status: "NOT_FOUND" };
  } catch (error) {
    logger("firebaseGetById", collectionName, error);
    return { status: "ERROR" };
  }
}

export async function firebaseGetCount<T>(options: FirebaseOptions) {
  try {
    if (!options.collectionName && !options.collectionGroupName) {
      throw new Error("collection is required");
    }

    const args = buildArgs(options);
    const c = options.collectionName
      ? collection(db, options.collectionName || "")
      : collectionGroup(db, options.collectionGroupName || "");
    const q = query(c, ...args);

    const snapshot = await getCountFromServer(q);

    return { status: "OK", result: snapshot.data().count as T };
  } catch (error) {
    logger("firebaseGetCount", error);
    return { status: "ERROR" };
  }
}

export async function firebaseAdd<T>(
  collectionName: string,
  payload: any,
  id?: string,
): Promise<FirebaseResponse<T>> {
  try {
    // Add deleted column as null
    if (payload.deleted === undefined) {
      payload.deleted = null;
    }

    payload.createdAt = dayjs().unix();
    payload.updatedAt = dayjs().unix();

    let ref;

    if (id) {
      ref = doc(db, collectionName, id);
      await setDoc(ref, payload);
    } else {
      ref = await addDoc(collection(db, collectionName), payload);
    }

    return {
      status: "OK",
      result: { id: ref.id, data: payload as T },
    };
  } catch (error: any) {
    logger("firebaseAdd", error.code, error.message);
    return { status: error.code };
  }
}

export function firebaseUpdate<T>(collationName: string, id: string, data: Partial<T>) {
  //@ts-ignore
  data.updatedAt = dayjs().unix();

  logger("firebaseUpdate", data);

  return updateDoc(doc(db, collationName, id), data);
}

export function firebaseDelete(collationName: string, id: string) {
  return updateDoc(doc(db, collationName, id), {
    updatedAt: dayjs().unix(),
    deleted: {
      at: dayjs().unix(),
    },
  });
}

export function firebaseUndelete(collationName: string, id: string) {
  return updateDoc(doc(db, collationName, id), {
    updatedAt: dayjs().unix(),
    deleted: null,
  });
}

export function firebaseHardDelete(collationName: string, id: string) {
  return deleteDoc(doc(db, collationName, id));
}
