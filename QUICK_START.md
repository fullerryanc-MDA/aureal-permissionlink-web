# PermissionLink Web Backend - Quick Start Guide

Get your web backend live in 1-2 hours!

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free)
- ✅ Firebase project with Firestore
- ✅ Domain: aureallabs.com

## 🚀 5-Step Deployment

### Step 1: Get Firebase Credentials (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Aureal project
3. **Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download JSON file
6. Note these values:
   - `project_id`
   - `client_email`
   - `private_key`

### Step 2: Deploy to Vercel (10 min)

```bash
# Push to GitHub
cd /c/Users/fulle/aureal-permissionlink-web
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/aureal-permissionlink-web.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. **Add New Project**
3. Import `aureal-permissionlink-web`
4. Add environment variables:
   - `FIREBASE_PROJECT_ID` = (from Firebase JSON)
   - `FIREBASE_CLIENT_EMAIL` = (from Firebase JSON)
   - `FIREBASE_PRIVATE_KEY` = (from Firebase JSON, with quotes!)
   - `NEXT_PUBLIC_APP_URL` = `https://aureallabs.com`
5. Click **Deploy**

### Step 3: Configure Domain (20 min)

1. In Vercel: **Settings** > **Domains**
2. Add: `aureallabs.com`
3. Update DNS (at your domain provider):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
4. Wait for DNS propagation (5-20 min)
5. Vercel auto-issues SSL certificate

### Step 4: Update Firestore Rules (5 min)

In Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /permissionRequests/{requestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if false;
    }
  }
}
```

### Step 5: Test (10 min)

1. Visit: `https://aureallabs.com`
2. Should see Aureal landing page ✅
3. Create test request in Firestore
4. Visit: `https://aureallabs.com/permission-request?token=test-id`
5. Should display request ✅

## ✅ Done!

Your web backend is live at `https://aureallabs.com`

## 📱 Next: Integrate with React Native

See [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md)

Key changes:
1. Save permission requests to Firestore
2. Generate URL with document ID
3. Add real-time listener

Estimated time: 2-3 hours

## 📚 Full Docs

- [README.md](./README.md) - Complete reference
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed deployment
- [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md) - App integration
- [CHECKLIST.md](./CHECKLIST.md) - Progress tracker

## 🆘 Help

**Web backend not loading?**
- Check Vercel deployment logs
- Verify environment variables
- Check Firebase credentials

**Domain not working?**
- Wait for DNS propagation
- Check DNS with `nslookup aureallabs.com`
- Clear browser cache

**Permission request not found?**
- Check Firestore rules
- Verify document ID in URL
- Check Firebase Admin credentials

---

**You've got this!** 🚀
