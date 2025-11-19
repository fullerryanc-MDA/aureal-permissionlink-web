# PermissionLink Deployment Checklist

Use this checklist to track your progress deploying the web backend.

## ✅ Phase 1: Local Setup (15 minutes)

- [ ] Navigate to project directory: `cd /c/Users/fulle/aureal-permissionlink-web`
- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`: `cp .env.example .env`
- [ ] Get Firebase credentials from Firebase Console
- [ ] Update `.env` with Firebase credentials
- [ ] Test local server: `npm run dev`
- [ ] Visit `http://localhost:3000` - should see Aureal landing page
- [ ] Test API: Create test request in Firestore, visit URL

## ✅ Phase 2: GitHub Setup (10 minutes)

- [ ] Create new GitHub repository: `aureal-permissionlink-web`
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial commit: PermissionLink web backend"`
- [ ] Add remote: `git remote add origin https://github.com/YOUR_USERNAME/aureal-permissionlink-web.git`
- [ ] Push: `git push -u origin main`
- [ ] Verify code is on GitHub

## ✅ Phase 3: Vercel Deployment (20 minutes)

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign in with GitHub
- [ ] Click "Add New Project"
- [ ] Select `aureal-permissionlink-web` repository
- [ ] Verify Next.js auto-detected
- [ ] Add environment variables:
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_CLIENT_EMAIL`
  - [ ] `FIREBASE_PRIVATE_KEY` (with quotes!)
  - [ ] `NEXT_PUBLIC_APP_URL` = `https://aureallabs.com`
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Note temporary URL: `https://aureal-permissionlink-web-xxxxx.vercel.app`
- [ ] Test temporary URL - should work!

## ✅ Phase 4: Custom Domain (20 minutes)

- [ ] In Vercel project, go to Settings > Domains
- [ ] Add domain: `aureallabs.com`
- [ ] Copy DNS configuration from Vercel
- [ ] Update DNS settings (GitHub Pages or domain provider):
  - [ ] Type: `CNAME`
  - [ ] Name: `app`
  - [ ] Value: `cname.vercel-dns.com`
- [ ] Wait for DNS propagation (5-20 minutes)
- [ ] Vercel auto-verifies domain
- [ ] SSL certificate issued
- [ ] Test: Visit `https://aureallabs.com`
- [ ] Should see landing page with HTTPS lock icon

## ✅ Phase 5: Firestore Setup (15 minutes)

- [ ] Go to Firebase Console
- [ ] Select your Aureal project
- [ ] Go to Firestore Database
- [ ] Verify database exists (or create one)
- [ ] Update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /permissionRequests/{requestId} {
      // Allow anyone to read (needed for web)
      allow read: if true;

      // Allow authenticated users to create
      allow create: if request.auth != null;

      // Server-side updates only (via Admin SDK)
      allow update: if false;
    }
  }
}
```

- [ ] Save and publish rules
- [ ] Test: Create test document in Firestore
- [ ] Visit: `https://aureallabs.com/permission-request?token=test-doc-id`
- [ ] Should display test request

## ✅ Phase 6: React Native Integration (2 hours)

See [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md) for detailed code.

- [ ] Create new file: `hooks/usePermissionRequestListener.ts`
- [ ] Update `app/(tabs)/ActiveHuntScreen.tsx`:
  - [ ] Import Firestore functions
  - [ ] Replace QR payload generation with Firestore write
  - [ ] Update URL to use Firestore document ID
  - [ ] Add real-time listener
- [ ] Update `app.json`:
  - [ ] Add `aureallabs.com` to `associatedDomains` (iOS)
  - [ ] Add `aureallabs.com` to `intentFilters` (Android)
- [ ] Update `services/DeepLinkHandler.ts`:
  - [ ] Add `aureallabs.com` to hostname check
- [ ] Rebuild React Native app
- [ ] Test on device

## ✅ Phase 7: End-to-End Testing (30 minutes)

### Test 1: Create Request in App
- [ ] Open Aureal app
- [ ] Start hunt
- [ ] Tap FAB > PermissionLink
- [ ] Tap "Request New Permission"
- [ ] Draw property boundary
- [ ] Fill in details
- [ ] Generate QR code
- [ ] Verify QR contains correct URL format
- [ ] Check Firestore - should see new document

### Test 2: Landowner Web Experience
- [ ] Scan QR code with different device
- [ ] Should open `https://aureallabs.com/permission-request?token=...`
- [ ] Page loads with all request details
- [ ] Map placeholder displays coordinates
- [ ] Fill out landowner form
- [ ] Click "Approve Request"
- [ ] Should see success message

### Test 3: Real-Time Update in App
- [ ] Check Firestore - status should be "approved"
- [ ] App should show notification
- [ ] App should display landowner's response
- [ ] Verify landowner name, email, notes displayed

### Test 4: Denial Flow
- [ ] Create new request
- [ ] Open web page
- [ ] Click "Deny Request"
- [ ] Confirm denial
- [ ] Verify app receives denial notification
- [ ] Check Firestore - status should be "denied"

## ✅ Phase 8: Production Verification (15 minutes)

- [ ] Web backend deployed: `https://aureallabs.com`
- [ ] HTTPS working (green lock icon)
- [ ] DNS fully propagated
- [ ] Firebase connection working
- [ ] API routes responding correctly
- [ ] Firestore updates saving correctly
- [ ] React Native app creates requests
- [ ] QR codes work end-to-end
- [ ] Real-time listeners functioning
- [ ] Notifications appearing
- [ ] No console errors
- [ ] Mobile responsive design working

## ✅ Optional Enhancements (Future)

- [ ] Add MapLibre interactive map
- [ ] Implement push notifications via FCM
- [ ] Add email notifications (SendGrid)
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics or Mixpanel)
- [ ] Create admin dashboard
- [ ] Add rate limiting
- [ ] Implement request expiration (cron job)
- [ ] Add multi-language support
- [ ] Create landowner dashboard (manage multiple requests)

## 📊 Deployment Metrics

| Metric | Value |
|--------|-------|
| Total Time | ~4 hours |
| Files Created | 20 |
| API Endpoints | 2 (GET, POST) |
| Components | 3 |
| Documentation Pages | 4 |
| Cost | $0/month (Vercel free tier + Firebase free tier) |

## 🎉 Launch Checklist

Before announcing to users:

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Error handling tested
- [ ] Performance acceptable (< 2s page load)
- [ ] Mobile experience smooth
- [ ] Firestore costs reviewed
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Support process defined

## 📞 Troubleshooting Resources

If stuck, check:

1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Common issues section
2. [README.md](./README.md) - Configuration details
3. [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md) - Integration code
4. Vercel Logs: Project > Deployments > Runtime Logs
5. Firebase Logs: Firebase Console > Firestore > Monitor

---

**Track your progress by checking off items as you complete them!**

**Estimated total time:** 4-6 hours (depending on DNS propagation time)

**You've got this!** 🚀
