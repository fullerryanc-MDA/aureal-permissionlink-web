/**
 * Permission Request Utilities
 */

import { db, collections } from './firebaseAdmin';
import type { PermissionRequest, LandownerResponse, PermissionRequestStatus } from './types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Get permission request by ID
 */
export async function getPermissionRequest(requestId: string): Promise<PermissionRequest | null> {
  try {
    const doc = await db.collection(collections.permissionRequests).doc(requestId).get();

    if (!doc.exists) {
      console.log(`[Permissions] Request not found: ${requestId}`);
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as PermissionRequest;
  } catch (error) {
    console.error('[Permissions] Error fetching request:', error);
    throw new Error('Failed to fetch permission request');
  }
}

/**
 * Update permission request with landowner response
 */
export async function updatePermissionRequest(
  requestId: string,
  response: LandownerResponse
): Promise<PermissionRequest> {
  try {
    const requestRef = db.collection(collections.permissionRequests).doc(requestId);

    // Check if request exists
    const doc = await requestRef.get();
    if (!doc.exists) {
      throw new Error('Permission request not found');
    }

    const currentData = doc.data() as PermissionRequest;

    // Check if already responded
    if (currentData.status !== 'pending') {
      throw new Error(`Request already ${currentData.status}`);
    }

    // Update document
    const updates = {
      status: response.status as PermissionRequestStatus,
      landownerName: response.landownerName,
      landownerEmail: response.landownerEmail || null,
      landownerPhone: response.landownerPhone || null,
      landownerNotes: response.notes || null,
      respondedAt: Date.now(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await requestRef.update(updates);

    console.log(`[Permissions] Request ${requestId} ${response.status} by ${response.landownerName}`);

    // Fetch and return updated document
    const updatedDoc = await requestRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as PermissionRequest;
  } catch (error) {
    console.error('[Permissions] Error updating request:', error);
    throw error;
  }
}

/**
 * Create a new permission request
 * (Called from React Native app, included here for completeness)
 */
export async function createPermissionRequest(
  data: Omit<PermissionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<PermissionRequest> {
  try {
    const requestRef = db.collection(collections.permissionRequests).doc();

    const permissionRequest: Omit<PermissionRequest, 'id'> = {
      ...data,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await requestRef.set(permissionRequest);

    console.log(`[Permissions] Created request: ${requestRef.id}`);

    return {
      id: requestRef.id,
      ...permissionRequest,
    };
  } catch (error) {
    console.error('[Permissions] Error creating request:', error);
    throw new Error('Failed to create permission request');
  }
}

/**
 * Check if request is expired
 */
export function isRequestExpired(request: PermissionRequest): boolean {
  const now = Date.now();
  // Request expires if it's been pending for more than 30 days
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  return request.status === 'pending' && request.createdAt < thirtyDaysAgo;
}

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Calculate duration in days
 */
export function calculateDuration(startDate: number, endDate: number): number {
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
}

/**
 * Generate a secure request ID
 * (Alternative to using Firestore auto-generated IDs)
 */
export function generateRequestId(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('hex');
}
