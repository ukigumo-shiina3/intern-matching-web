import {
  getAuth,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  UserCredential as FirebaseUserCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
  const signIn = async (email: string, password: string): Promise<User> => {
    const user = await loginFirebaseUser(email, password);
    if (!user) {
      throw new Error("無効な認証情報です");
    }
    return setUser(user);
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    const credential = await createFirebaseUser(email, password);
    return setUser(credential.user);
  };

  return {
    signIn,
    signUp,
  };
};
