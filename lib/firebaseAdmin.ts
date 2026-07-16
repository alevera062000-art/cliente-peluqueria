import { cert, getApps, getApp, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

function getAdminApp() {
  if (getApps().length) return getApp();
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error(
      "Falta la variable de entorno FIREBASE_SERVICE_ACCOUNT (JSON de la cuenta de servicio de Firebase).",
    );
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  return initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

export function getAdminDb() {
  return getDatabase(getAdminApp());
}
