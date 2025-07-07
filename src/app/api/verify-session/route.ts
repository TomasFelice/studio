import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Inicializar Firebase Admin
if (!getApps().length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY!
  );
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { session } = req.body;

  if (!session) {
    return res.status(401).json({ message: 'No session provided' });
  }

  try {
    await getAuth().verifySessionCookie(session, true);
    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid session' });
  }
}