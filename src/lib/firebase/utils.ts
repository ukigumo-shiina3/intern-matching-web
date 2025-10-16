import {
  getAuth,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  UserCredential as FirebaseUserCredential,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateEmail,
} from "firebase/auth";
import cookies from "js-cookie";
import { GetServerSidePropsContext } from "next";
import { NextRouter } from "next/router";
import nookies from "nookies";
import firebase from "./initFirebase";

export type User = {
  uid: string;
  email: string;
  token: string;
};

export const setUser = async (fbUser: FirebaseUser): Promise<User> => {
  const { uid, email } = fbUser;
  const token = await fbUser.getIdToken();
  const user = {
    uid,
    token,
    email: email as string,
  } as User;
  cookies.set("auth", JSON.stringify(user), {
    expires: 3650, // expires 10 years(= 365days * 10)
  });
  return user;
};

export const currentUser = (
  ctx?: GetServerSidePropsContext
): User | undefined => {
  const cookie = nookies.get(ctx);
  if (!cookie) {
    throw new Error("unauthorized. Please auth first");
  }
  if (cookie["auth"]) {
    try {
      return JSON.parse(cookie["auth"]);
    } catch {
      return undefined;
    }
  }
};

export const authorize = async (
  router: NextRouter,
  path = "/auth/signin"
): Promise<User> => {
  const user = currentUser();
  if (!user) {
    await router.push(path);
    return Promise.reject("unauthorized");
  }
  return user;
};

export const createFirebaseUser = async (
  email: string,
  password: string
): Promise<FirebaseUserCredential> => {
  const auth = getAuth(firebase);
  const user = createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const loginFirebaseUser = async (
  email: string,
  password: string
): Promise<FirebaseUser | null> => {
  const auth = getAuth(firebase);
  const user = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setUser(userCredential.user!);
      return userCredential.user;
    })
    .catch(() => {
      return null;
    });
  return user;
};

export const logout = async (): Promise<void> => {
  cookies.remove("auth");
  const auth = getAuth(firebase);
  await auth.signOut();
};

export const sendPassResetEmail = (email: string) => {
  const auth = getAuth(firebase);
  return sendPasswordResetEmail(auth, email);
};

export const verifyResetPassword = (oobCode: string) => {
  const auth = getAuth(firebase);
  return verifyPasswordResetCode(auth, oobCode);
};

export const confirmPassReset = (oobCode: string, password: string) => {
  const auth = getAuth(firebase);
  return confirmPasswordReset(auth, oobCode, password);
};

export const updateFirebaseEmail = async (
  currentEmail: string,
  newEmail: string,
  password: string
) => {
  const auth = getAuth(firebase);
  return new Promise<void>((resolve, reject) => {
    signInWithEmailAndPassword(auth, currentEmail, password)
      .then((credential) => {
        updateEmail(credential.user, newEmail)
          .then(() => resolve())
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        return reject(error);
      });
  });
};
