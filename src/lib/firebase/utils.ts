import {
  getAuth,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  UserCredential as FirebaseUserCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
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

  const isProduction = process.env.NODE_ENV === "production";

  cookies.set("auth", JSON.stringify(user), {
    expires: 3650, // expires 10 years(= 365days * 10)
    secure: isProduction,
    sameSite: "lax",
  });
  return user;
};

export const createFirebaseUser = async (
  email: string,
  password: string
): Promise<FirebaseUserCredential> => {
  const auth = getAuth(firebase);
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return credential;
};

export const loginFirebaseUser = async (
  email: string,
  password: string
): Promise<FirebaseUser | null> => {
  const auth = getAuth(firebase);
  const user = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      console.error("ログインエラー", error);
      return null;
    });
  return user;
};

export const useAuth = () => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const authCookie = cookies.get("auth");
    if (authCookie) {
      try {
        const userData = JSON.parse(authCookie) as User;
        setUserState(userData);
      } catch (error) {
        console.error("Cookie解析エラー:", error);
        cookies.remove("auth");
      }
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    const fbUser = await loginFirebaseUser(email, password);
    if (!fbUser) {
      throw new Error("無効な認証情報です");
    }
    const userData = await setUser(fbUser);
    setUserState(userData);
    return userData;
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    const credential = await createFirebaseUser(email, password);
    const userData = await setUser(credential.user);
    setUserState(userData);
    return userData;
  };

  const logout = async (): Promise<void> => {
    cookies.remove("auth");
    setUserState(null);
    const auth = getAuth(firebase);
    await signOut(auth);
  };

  return {
    user,
    signIn,
    signUp,
    logout,
  };
};
