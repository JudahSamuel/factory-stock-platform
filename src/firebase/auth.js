import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  auth,
  db
} from "./config";

export const loginUser = async (
  email,
  password
) => {

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const userDoc =
    await getDoc(
      doc(db, "users", email)
    );

  const role =
    userDoc.data().role;

  return role;
};