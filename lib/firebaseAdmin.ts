/**
 * Firebase Admin SDK Configuration
 * Server-side only - never expose to client
 */

import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK (singleton pattern)
if (!getApps().length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount),
  });

  console.log('[Firebase Admin] Initialized successfully');
}

// Export Firestore instance
export const db = getFirestore();

// Collection references
export const collections = {
  permissionRequests: 'permissionRequests',
  permissions: 'permissions',
  users: 'users',
  properties: 'properties',
} as const;
