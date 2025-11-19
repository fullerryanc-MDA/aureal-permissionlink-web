# Mobile App Integration Guide

This guide shows how to integrate the PermissionLink web backend with your React Native Aureal app.

## 🔗 Integration Flow

```
1. Detectorist creates request in app → Saves to Firestore
2. App generates shareable link → https://aureallabs.com/permission-request?token=<requestId>
3. Landowner opens link → Sees web page
4. Landowner responds → Updates Firestore
5. App receives real-time update → Shows notification
```

## 📦 Required Changes to React Native App

### 1. Update QR Code Generation

In `app/(tabs)/ActiveHuntScreen.tsx`, update the permission request creation:

```typescript
// REPLACE THIS SECTION (around line 2159-2174)

// OLD CODE:
const requestPayload = {
  type: 'permission_request',
  propertyName: details.propertyName,
  activityType: details.activityType,
  startDate: details.startDate,
  endDate: details.endDate,
  message: details.message,
  bounds: details.bounds,
  requesterName: user?.displayName || user?.email?.split('@')[0] || 'Aureal User',
  requestedAt: Date.now(),
};

const encodedData = encodeURIComponent(JSON.stringify(requestPayload));
const webUrl = `https://aureal.app/permission-request?data=${encodedData}`;

// NEW CODE:
// Import Firebase functions
import { db } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Inside the onSubmit handler:
const handlePermissionRequestSubmit = async (details) => {
  try {
    console.log('[ActiveHunt] Creating permission request...');

    // Get current user
    const userId = useSessionStore.getState().user?.uid;
    const userName = useSessionStore.getState().user?.displayName ||
                     useSessionStore.getState().user?.email?.split('@')[0] ||
                     'Aureal User';

    // Create document in Firestore
    const requestRef = await addDoc(collection(db, 'permissionRequests'), {
      type: 'permission_request',
      propertyName: details.propertyName,
      activityType: details.activityType,
      startDate: details.startDate,
      endDate: details.endDate,
      message: details.message,
      bounds: details.bounds,
      requesterUserId: userId,
      requesterName: userName,
      status: 'pending',
      requestedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log('[ActiveHunt] Permission request created:', requestRef.id);

    // Generate web URL (using request ID as token)
    const webUrl = `https://aureallabs.com/permission-request?token=${requestRef.id}`;

    // Store for QR code display
    setQrCodeData(webUrl);
    setQrPropertyName(details.propertyName);
    setQrActivityType(getActivityDisplayName(details.activityType));
    setPermissionRequestDetailsVisible(false);
    setQrCodeModalVisible(true);

    // Set up real-time listener for responses (see below)
    listenForPermissionResponse(requestRef.id);

  } catch (error) {
    console.error('[ActiveHunt] Error creating permission request:', error);
    Alert.alert('Error', 'Failed to create permission request. Please try again.');
  }
};
```

### 2. Add Real-Time Response Listener

Create a new file `hooks/usePermissionRequestListener.ts`:

```typescript
/**
 * Hook to listen for permission request responses
 */

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

interface PermissionRequestStatus {
  status: 'pending' | 'approved' | 'denied';
  landownerName?: string;
  landownerNotes?: string;
  respondedAt?: number;
}

export function usePermissionRequestListener(requestId: string | null) {
  const [status, setStatus] = useState<PermissionRequestStatus | null>(null);

  useEffect(() => {
    if (!requestId) return;

    console.log(`[PermissionListener] Listening to request: ${requestId}`);

    const unsubscribe = onSnapshot(
      doc(db, 'permissionRequests', requestId),
      (doc) => {
        if (!doc.exists()) {
          console.log('[PermissionListener] Request not found');
          return;
        }

        const data = doc.data();
        const newStatus: PermissionRequestStatus = {
          status: data.status,
          landownerName: data.landownerName,
          landownerNotes: data.landownerNotes,
          respondedAt: data.respondedAt,
        };

        // Check if status changed
        if (status?.status !== newStatus.status) {
          if (newStatus.status === 'approved') {
            console.log('[PermissionListener] Request approved!');

            // Show notification
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Permission Approved! 🎉',
                body: `${newStatus.landownerName} has approved your request`,
                data: { requestId },
              },
              trigger: null, // Show immediately
            });

            // Show alert
            Alert.alert(
              'Permission Approved! 🎉',
              `${newStatus.landownerName} has approved your request${
                newStatus.landownerNotes ? `\n\nNotes: ${newStatus.landownerNotes}` : ''
              }`,
              [{ text: 'Great!', style: 'default' }]
            );
          } else if (newStatus.status === 'denied') {
            console.log('[PermissionListener] Request denied');

            Alert.alert(
              'Permission Denied',
              `${newStatus.landownerName} has denied your request${
                newStatus.landownerNotes ? `\n\nReason: ${newStatus.landownerNotes}` : ''
              }`,
              [{ text: 'OK', style: 'default' }]
            );
          }
        }

        setStatus(newStatus);
      },
      (error) => {
        console.error('[PermissionListener] Error:', error);
      }
    );

    return () => {
      console.log('[PermissionListener] Unsubscribing');
      unsubscribe();
    };
  }, [requestId]);

  return status;
}
```

### 3. Use the Listener in ActiveHuntScreen

Add to `app/(tabs)/ActiveHuntScreen.tsx`:

```typescript
import { usePermissionRequestListener } from '@/hooks/usePermissionRequestListener';

// Inside the component:
const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
const requestStatus = usePermissionRequestListener(activeRequestId);

// After creating a request:
const handlePermissionRequestSubmit = async (details) => {
  // ... (code from step 1)

  // After successful creation:
  setActiveRequestId(requestRef.id);
};

// Optional: Clear listener when QR modal is closed
const handleQRModalClose = () => {
  setQrCodeModalVisible(false);
  setActiveRequestId(null); // Stop listening
};
```

## 🔔 Push Notifications Setup

For push notifications when landowner responds, you'll need to add Firebase Cloud Messaging (FCM) to the web backend.

### In Next.js backend (`/api/permission-requests/[requestId]/route.ts`):

```typescript
// After updating request status
if (body.status === 'approved' || body.status === 'denied') {
  // Send push notification to requester
  await sendPushNotification(updatedRequest.requesterUserId, {
    title: body.status === 'approved' ? 'Permission Approved! 🎉' : 'Permission Denied',
    body: `${body.landownerName} has ${body.status} your request`,
    data: { requestId },
  });
}
```

## 🧪 Testing

### 1. Test Locally

```bash
# Terminal 1: Run Next.js dev server
cd aureal-permissionlink-web
npm run dev

# Terminal 2: Run React Native dev server
cd metal-detector-app
npm start
```

### 2. Create Test Request

1. In React Native app: Create a permission request
2. Copy the generated URL (should be http://localhost:3000/permission-request?token=...)
3. Open in browser
4. Fill out landowner form and approve/deny
5. Check React Native app for real-time update

### 3. Test with Production URL

After deploying to Vercel:

1. Update URL in ActiveHuntScreen: `https://aureallabs.com/permission-request?token=...`
2. Create request in app
3. Scan QR code or share link
4. Test approval/denial flow

## ✅ Deployment Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Firebase Admin credentials added to Vercel
- [ ] Next.js app deployed to Vercel
- [ ] Custom domain `aureallabs.com` configured
- [ ] React Native app updated with new URL
- [ ] Deep links configured in `app.json`
- [ ] Push notifications configured (optional)
- [ ] Test full flow end-to-end

## 🐛 Troubleshooting

### "Permission request not found"
- Check Firestore rules allow read access
- Verify request ID is correct
- Check Firebase Admin credentials in Vercel

### QR code doesn't open web page
- Verify URL format: `https://aureallabs.com/permission-request?token=<id>`
- Check DNS configuration for custom domain
- Test URL directly in browser first

### Real-time updates not working
- Check Firestore rules allow read access to requester
- Verify listener is set up correctly
- Check Firebase connection in React Native app

## 📞 Support

For issues or questions, check the main [README.md](./README.md) or review the code comments.
