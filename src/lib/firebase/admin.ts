// src/lib/firebase/admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      console.error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set");
      return null;
    }

    const serviceAccount = JSON.parse(serviceAccountKey);

    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization failed:", error.message);
    console.error("Check your FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
    return null;
  }
}

const app = getAdminApp();

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;