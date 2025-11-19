/**
 * Type Definitions for Permission Requests
 * Matches types from React Native app (types/permissions.ts)
 */

export type ActivityType =
  | 'metal_detecting'
  | 'rockhounding'
  | 'fossil_hunting'
  | 'arrowhead_hunting'
  | 'shed_hunting'
  | 'hiking'
  | 'photography'
  | 'wildlife_observation';

export type PermissionRequestStatus = 'pending' | 'approved' | 'denied' | 'expired';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface PermissionRequest {
  // Document ID (auto-generated or custom token)
  id: string;

  // Request details
  type: 'permission_request';
  propertyName: string;
  activityType: ActivityType;
  startDate: number; // timestamp
  endDate: number; // timestamp
  message?: string;
  bounds: Coordinate[];

  // Requester info
  requesterUserId: string;
  requesterName: string;

  // Status
  status: PermissionRequestStatus;

  // Landowner response
  landownerName?: string;
  landownerEmail?: string;
  landownerPhone?: string;
  landownerNotes?: string;
  respondedAt?: number;

  // Timestamps
  requestedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface LandownerResponse {
  status: 'approved' | 'denied';
  landownerName: string;
  landownerEmail?: string;
  landownerPhone?: string;
  notes?: string;
}

// Activity display names
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  metal_detecting: 'Metal Detecting',
  rockhounding: 'Rockhounding',
  fossil_hunting: 'Fossil Hunting',
  arrowhead_hunting: 'Arrowhead Hunting',
  shed_hunting: 'Shed Hunting',
  hiking: 'Hiking',
  photography: 'Photography',
  wildlife_observation: 'Wildlife Observation',
};

// Activity icons (MaterialCommunityIcons names)
export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  metal_detecting: 'magnet',
  rockhounding: 'diamond-stone',
  fossil_hunting: 'bone',
  arrowhead_hunting: 'bow-arrow',
  shed_hunting: 'shoe-print',
  hiking: 'hiking',
  photography: 'camera',
  wildlife_observation: 'binoculars',
};
