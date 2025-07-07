import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );

    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error: any) {
    console.error("CRITICAL: Firebase Admin SDK initialization failed. Check your FIREBASE_SERVICE_ACCOUNT_KEY environment variable.", error.message);
    return null;
  }
}

const app = getAdminApp();

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
