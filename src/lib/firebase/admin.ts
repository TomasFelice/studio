import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY!
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error', error.message || String(error));
  }
}

if (getApps().length > 0) {
    try {
        authInstance = getAuth();
        dbInstance = getFirestore();
    } catch(e) {
        console.error('Firebase Admin SDK service error', e);
    }
}

export const auth = authInstance;
export const db = dbInstance;
