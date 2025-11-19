# Aureal PermissionLink Web Backend

Production-ready Next.js web application for handling metal detecting permission requests.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
aureal-permissionlink-web/
├── app/                           # Next.js 14 App Router
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   ├── permission-request/
│   │   └── page.tsx               # Permission request landing page
│   └── api/
│       └── permission-requests/
│           └── [requestId]/
│               └── route.ts       # API endpoints (GET, POST)
├── components/
│   ├── PermissionRequestView.tsx  # Request details display
│   ├── LandownerForm.tsx          # Landowner response form
│   └── PropertyMap.tsx            # Property boundaries map (placeholder)
├── lib/
│   ├── firebaseAdmin.ts           # Firebase Admin SDK setup
│   ├── permissions.ts             # Permission request utilities
│   └── types.ts                   # TypeScript type definitions
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Admin SDK (from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# App URL (for production)
NEXT_PUBLIC_APP_URL=https://aureallabs.com
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the values from the downloaded JSON file to your `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and newlines)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/aureal-permissionlink-web.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Add environment variables:**
   - In Vercel project settings > Environment Variables
   - Add all variables from `.env`
   - Deploy!

4. **Configure custom domain:**
   - In Vercel project settings > Domains
   - Add `aureallabs.com`
   - Follow DNS configuration instructions

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Mobile App Integration

### 1. Create Permission Request (React Native)

```typescript
import { db } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

async function createPermissionRequest(data: {
  propertyName: string;
  activityType: string;
  startDate: number;
  endDate: number;
  message: string;
  bounds: { latitude: number; longitude: number }[];
}) {
  const user = auth.currentUser;

  const requestRef = await addDoc(collection(db, 'permissionRequests'), {
    type: 'permission_request',
    propertyName: data.propertyName,
    activityType: data.activityType,
    startDate: data.startDate,
    endDate: data.endDate,
    message: data.message,
    bounds: data.bounds,
    requesterUserId: user.uid,
    requesterName: user.displayName || user.email?.split('@')[0] || 'Aureal User',
    status: 'pending',
    requestedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Generate shareable link
  const webUrl = `https://aureallabs.com/permission-request?token=${requestRef.id}`;

  return { requestId: requestRef.id, webUrl };
}
```

### 2. Generate QR Code

```typescript
import QRCode from 'react-native-qrcode-svg';

<QRCode
  value={webUrl}
  size={280}
  backgroundColor="white"
  color="#0F172A"
/>
```

### 3. Listen for Responses

```typescript
import { doc, onSnapshot } from 'firebase/firestore';

// Set up real-time listener
const unsubscribe = onSnapshot(
  doc(db, 'permissionRequests', requestId),
  (doc) => {
    const data = doc.data();

    if (data?.status === 'approved') {
      // Show notification
      Alert.alert(
        'Permission Approved! 🎉',
        `${data.landownerName} has approved your request for ${data.propertyName}`,
      );
    } else if (data?.status === 'denied') {
      Alert.alert(
        'Permission Denied',
        `${data.landownerName} has denied your request.`,
      );
    }
  }
);

// Clean up listener when component unmounts
return () => unsubscribe();
```

## 🗄️ Firestore Schema

### Collection: `permissionRequests`

```typescript
{
  // Document ID is the request token/ID
  id: string;

  // Request details
  type: 'permission_request';
  propertyName: string;
  activityType: 'metal_detecting' | 'rockhounding' | ...;
  startDate: number; // timestamp
  endDate: number; // timestamp
  message?: string;
  bounds: Array<{ latitude: number; longitude: number }>;

  // Requester info
  requesterUserId: string;
  requesterName: string;

  // Status
  status: 'pending' | 'approved' | 'denied' | 'expired';

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
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## 🔒 Security

- All API routes use Firebase Admin SDK (server-side only)
- Private keys never exposed to client
- CORS enabled for mobile app requests
- Request validation on all endpoints
- Status checks prevent duplicate responses

## 📝 TODO: Post-MVP Enhancements

- [ ] Add MapLibre integration for interactive maps
- [ ] Implement push notifications (FCM)
- [ ] Add email notifications (SendGrid)
- [ ] Rate limiting on API routes
- [ ] Analytics tracking
- [ ] Admin dashboard for monitoring
- [ ] Request expiration cron job
- [ ] Multi-language support

## 📄 License

© 2024 Aureal. All rights reserved.
