/**
 * Firebase Admin SDK Configuration
 * Server-side only - never expose to client
 */

import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Parse private key - handle different formats from environment variables
function parsePrivateKey(key: string): string {
  // Remove any quotes that might be added
  let parsed = key.trim();

  // Remove leading/trailing quotes if present
  if (parsed.startsWith('"') && parsed.endsWith('"')) {
    parsed = parsed.slice(1, -1);
  }
  if (parsed.startsWith("'") && parsed.endsWith("'")) {
    parsed = parsed.slice(1, -1);
  }

  // Replace escaped newlines with actual newlines
  parsed = parsed.replace(/\\n/g, '\n');

  return parsed;
}

// Initialize Firebase Admin SDK (singleton pattern)
if (!getApps().length) {
  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY || '');

  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: privateKey,
  };

  try {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('[Firebase Admin] Initialized successfully');
  } catch (error) {
    console.error('[Firebase Admin] Initialization failed:', error);
    console.error('[Firebase Admin] Private key length:', privateKey.length);
    console.error('[Firebase Admin] Private key starts with:', privateKey.substring(0, 50));
    throw error;
  }
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
