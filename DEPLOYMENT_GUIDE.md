# PermissionLink Web Backend - Deployment Guide

This guide will get your PermissionLink web backend live in production in about 1-2 hours.

## 🎯 Overview

You're deploying a Next.js web application that:
- Handles permission request links from QR codes
- Displays request details to landowners
- Saves landowner responses to Firebase
- Sends real-time updates to the React Native app

**Production URL:** `https://aureallabs.com`

## ⏱️ Time Estimate

- **Setup**: 15 minutes
- **Deploy to Vercel**: 10 minutes
- **Configure Domain**: 20 minutes
- **Test & Verify**: 15 minutes
- **Total**: ~1 hour

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account (free tier is fine)
- [x] Firebase project (existing)
- [x] Domain `aureallabs.com` (you already have this)

## 🚀 Step-by-Step Deployment

### Step 1: Get Firebase Credentials (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Aureal project
3. Click **⚙️ Settings** > **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Keep this file handy - you'll need it in Step 4

### Step 2: Push Code to GitHub (5 minutes)

```bash
# Navigate to the web backend directory
cd /c/Users/fulle/aureal-permissionlink-web

# Initialize git repository
git init
git add .
git commit -m "Initial commit: PermissionLink web backend"

# Create a new repository on GitHub
# Go to https://github.com/new
# Name it: aureal-permissionlink-web
# DO NOT initialize with README (we already have code)

# Add remote and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aureal-permissionlink-web.git
git push -u origin main
```

### Step 3: Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New Project**
4. Select your GitHub repository: `aureal-permissionlink-web`
5. Vercel auto-detects Next.js settings ✅
6. **DO NOT deploy yet** - Click **Continue** but don't click **Deploy**
7. Go to **Environment Variables** section (below)

### Step 4: Add Environment Variables (5 minutes)

In the Vercel deployment screen, add these environment variables:

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `FIREBASE_PROJECT_ID` | `your-project-id` | From Firebase JSON: `project_id` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxxxx@...` | From Firebase JSON: `client_email` |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | From Firebase JSON: `private_key` |
| `NEXT_PUBLIC_APP_URL` | `https://aureallabs.com` | Just type this |

**Important:**
- For `FIREBASE_PRIVATE_KEY`: Copy the ENTIRE value including the quotes
- Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"`

Now click **Deploy**! ✅

### Step 5: Wait for Deployment (2 minutes)

Vercel will:
1. Install dependencies
2. Build your Next.js app
3. Deploy to a temporary URL

You'll see: `https://aureal-permissionlink-web-xxxxx.vercel.app` ✅

### Step 6: Configure Custom Domain (20 minutes)

1. In Vercel project, go to **Settings** > **Domains**
2. Add domain: `aureallabs.com`
3. Vercel will give you DNS configuration:

**Option A: CNAME Record** (Recommended)

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**Option B: A Record**

```
Type: A
Name: app
Value: 76.76.21.21 (or Vercel's current IP)
```

4. Update DNS settings (GitHub Pages or your domain provider)
5. Wait for DNS propagation (5-20 minutes)
6. Vercel will auto-verify and issue SSL certificate

### Step 7: Update React Native App (10 minutes)

In your `metal-detector-app` project, update the permission request URL:

```typescript
// In app/(tabs)/ActiveHuntScreen.tsx (around line 2174)

// OLD:
const webUrl = `https://aureal.app/permission-request?data=${encodedData}`;

// NEW:
const webUrl = `https://aureallabs.com/permission-request?token=${requestRef.id}`;
```

**Also update the creation logic** - See [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md) for complete code.

### Step 8: Update Deep Links (5 minutes)

In `metal-detector-app/app.json`:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:aureallabs.com"
      ]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "aureallabs.com",
              "pathPrefix": "/permission-request"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Step 9: Test the Full Flow (15 minutes)

1. **Test web backend directly:**
   - Visit: `https://aureallabs.com`
   - Should see Aureal landing page ✅

2. **Create a test permission request:**

   ```bash
   # In Firestore console, manually create a test document
   Collection: permissionRequests
   Document ID: test-request-123
   Fields:
     type: "permission_request"
     propertyName: "Test Farm"
     activityType: "metal_detecting"
     startDate: 1735689600000
     endDate: 1738368000000
     message: "This is a test request"
     bounds: [
       { latitude: 37.7749, longitude: -122.4194 },
       { latitude: 37.7750, longitude: -122.4194 },
       { latitude: 37.7750, longitude: -122.4195 }
     ]
     requesterUserId: "test-user-id"
     requesterName: "Test User"
     status: "pending"
     requestedAt: 1735689600000
     createdAt: 1735689600000
     updatedAt: 1735689600000
   ```

3. **Test the URL:**
   - Visit: `https://aureallabs.com/permission-request?token=test-request-123`
   - Should display request details ✅
   - Fill out landowner form
   - Click "Approve Request"
   - Check Firestore - should see status updated to "approved" ✅

4. **Test from React Native app:**
   - Create a real permission request
   - Generate QR code
   - Scan on a different device
   - Should open web page ✅
   - Approve/deny
   - Check app for real-time update ✅

## ✅ Verification Checklist

- [ ] Web backend deployed to Vercel
- [ ] Custom domain `aureallabs.com` working
- [ ] HTTPS certificate issued
- [ ] Firebase connection working
- [ ] Can view test request
- [ ] Can submit landowner response
- [ ] Firestore updates correctly
- [ ] React Native app creates requests
- [ ] QR codes generate correctly
- [ ] Real-time updates working
- [ ] Deep links configured

## 🐛 Common Issues

### Issue: "Firebase Admin not initialized"

**Solution:** Check environment variables in Vercel:
1. Go to Vercel project > Settings > Environment Variables
2. Verify all 3 Firebase variables are set
3. Redeploy: Deployments > ⋮ > Redeploy

### Issue: "Permission request not found"

**Solution:** Check Firestore security rules:

```javascript
// In Firebase Console > Firestore > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /permissionRequests/{requestId} {
      // Allow anyone to read permission requests (needed for web)
      allow read: if true;

      // Allow owner to create
      allow create: if request.auth != null;

      // Only allow server (Admin SDK) to update
      allow update: if false; // Updates via API only
    }
  }
}
```

### Issue: DNS not propagating

**Solution:**
- Wait 5-20 minutes (sometimes up to 48 hours)
- Check DNS with: `nslookup aureallabs.com`
- Clear browser cache
- Try incognito mode

### Issue: Real-time updates not working

**Solution:**
- Verify Firestore listener is set up (see [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md))
- Check Firebase connection in React Native app
- Verify user has internet connection

## 📊 Monitoring

### Check Deployment Status

```bash
# Install Vercel CLI
npm i -g vercel

# Check deployment
vercel ls
```

### View Logs

In Vercel Dashboard:
- Go to your project
- Click **Deployments**
- Click on latest deployment
- Click **Runtime Logs**

### Monitor Firestore

In Firebase Console:
- Go to **Firestore**
- Monitor `permissionRequests` collection
- Check document updates

## 🎉 You're Live!

Once verified, you now have:

✅ **Production web backend** at `https://aureallabs.com`
✅ **Permission request flow** working end-to-end
✅ **Real-time updates** from Firestore
✅ **Mobile app integration** complete

## 📚 Next Steps

- [ ] Add push notifications ([TODO](#))
- [ ] Implement MapLibre interactive map
- [ ] Add email notifications
- [ ] Set up analytics
- [ ] Create admin dashboard

## 💬 Support

- **Web Backend Issues:** Check [README.md](./README.md)
- **Mobile Integration:** Check [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md)
- **Vercel Help:** https://vercel.com/docs
- **Firebase Help:** https://firebase.google.com/docs

---

**Questions?** Review the documentation or check the code comments.
