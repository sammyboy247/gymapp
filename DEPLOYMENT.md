# Deployment Guide - GymApp PoC

**Last Updated:** 2025-11-15
**Version:** 1.0.0

---

## Prerequisites

- Node.js 18.x or 20.x (LTS)
- npm or pnpm
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project created
- Git (for version control)

---

## 1. Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "gymapp-prod")
4. Enable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Required Services

**Authentication:**
1. Navigate to Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Click "Save"

**Firestore Database:**
1. Navigate to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location (closest to users)
5. Click "Enable"

---

## 2. Environment Configuration

### Step 1: Get Firebase Config

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" → Web apps
3. If no app exists, click "Add app" (</> icon)
4. Register app with nickname (e.g., "GymApp Web")
5. Copy the `firebaseConfig` object

### Step 2: Create `.env` File

**Local Development:**
Create `.env` in project root:

\`\`\`env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="gymapp-xxxxx.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="gymapp-xxxxx"
VITE_FIREBASE_STORAGE_BUCKET="gymapp-xxxxx.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
\`\`\`

**⚠️ IMPORTANT:** Never commit `.env` to Git (already in `.gitignore`)

---

## 3. Firestore Security Rules

### Deploy Security Rules

\`\`\`bash
# Login to Firebase CLI
firebase login

# Initialize Firebase (if not already)
firebase init firestore

# Select your project
# Choose default files (firestore.rules, firestore.indexes.json)

# Deploy rules
firebase deploy --only firestore:rules

# Verify deployment
firebase firestore:rules:list
\`\`\`

**Verify Rules Deployed:**
1. Firebase Console → Firestore Database → Rules
2. Check last published date
3. Rules should match `firestore.rules` file in repo

---

## 4. Seed Demo Data (Optional)

### Generate Service Account Key

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `serviceAccountKey.json` in project root
4. ⚠️ **DO NOT** commit this file

### Run Seed Script

\`\`\`bash
# Install dependencies (if not already)
npm install

# Seed demo data (30 users, 70 sessions, 8 programs)
npm run seed:demo

# Or clear and reseed
npm run seed:demo:clear
\`\`\`

**Test Credentials:**
- Admin: admin@gymapp.com / Admin123!
- Coach: coach1@gymapp.com / Coach123!
- Member: member1@gymapp.com / Member123!

See `.dev-pipeline/SEED_DATA_GUIDE.md` for complete list.

---

## 5. Production Build

### Build for Production

\`\`\`bash
# Install dependencies
npm install

# Run production build
npm run build

# Build output in dist/ directory
\`\`\`

**Verify Build:**
- Bundle size: Initial ~61 KB gzipped ✅
- No TypeScript errors
- No build warnings (except chunk size info)

---

## 6. Deployment Options

### Option A: Firebase Hosting (Recommended)

**Setup:**
\`\`\`bash
# Initialize Firebase Hosting
firebase init hosting

# Choose:
# - Use existing project
# - Public directory: dist
# - Single-page app: Yes
# - Overwrite index.html: No
\`\`\`

**Deploy:**
\`\`\`bash
# Build first
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Get hosting URL
firebase hosting:sites:list
\`\`\`

**Access:** https://gymapp-xxxxx.web.app

---

### Option B: Vercel

**Setup:**
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
\`\`\`

**Environment Variables:**
Add all `VITE_*` variables in Vercel dashboard:
1. Project Settings → Environment Variables
2. Add each variable from `.env`
3. Redeploy after adding

---

### Option C: Netlify

**Setup:**
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

---

## 7. Post-Deployment Checklist

### Verify Deployment

- [ ] App loads without errors
- [ ] Login works with test credentials
- [ ] Schedule page loads sessions
- [ ] Booking flow works
- [ ] Admin page accessible (admins only)
- [ ] Friend search works
- [ ] Firestore writes succeed

### Security Checks

- [ ] Firestore rules deployed
- [ ] Environment variables configured
- [ ] No secrets in client code
- [ ] HTTPS enforced
- [ ] Auth state persists across refresh

### Performance Checks

- [ ] Lighthouse score > 90
- [ ] Initial load < 3 seconds
- [ ] Route transitions smooth
- [ ] No console errors

---

## 8. Production Environment Variables

### For Hosting Platforms

**Required Variables:**
\`\`\`
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
\`\`\`

**Setting in Different Platforms:**

**Vercel:**
```bash
vercel env add VITE_FIREBASE_API_KEY production
```

**Netlify:**
Site settings → Environment variables → Add variable

**Firebase Hosting:**
No environment variables needed (uses `.env` at build time)

---

## 9. Troubleshooting Deployment

### Build Fails

**Issue:** TypeScript errors
**Solution:** Run `npm run build` locally, fix all errors

**Issue:** Missing dependencies
**Solution:** Delete `node_modules`, run `npm install`

### Firestore Permission Denied

**Issue:** "Missing or insufficient permissions"
**Solution:**
1. Verify Firestore rules deployed
2. Check user is authenticated
3. Verify user role in Firestore

### Environment Variables Not Working

**Issue:** Firebase config returns undefined
**Solution:**
1. Verify variables start with `VITE_`
2. Rebuild after adding variables
3. Check platform-specific env var syntax

---

## 10. Rollback Procedure

### If Production Issue Occurs

**Firebase Hosting:**
\`\`\`bash
# List deployments
firebase hosting:releases:list

# Rollback to previous
firebase hosting:rollback
\`\`\`

**Vercel:**
1. Go to Vercel dashboard
2. Deployments → Select previous deployment
3. Click "Promote to Production"

**Netlify:**
1. Go to Netlify dashboard
2. Deploys → Select previous deployment
3. Click "Publish deploy"

---

## 11. Monitoring

### Firebase Console

**Monitor:**
- Authentication → Users (track signups)
- Firestore → Usage (read/write metrics)
- Hosting → Usage (bandwidth, requests)

### Application Monitoring

**Recommended:**
- Google Analytics (already configured)
- Sentry (error tracking)
- LogRocket (session replay)

---

## 12. Scaling Considerations

### Firestore

**Current:** Free tier (up to 50K reads/day, 20K writes/day)

**If Scaling Needed:**
- Upgrade to Blaze plan (pay-as-you-go)
- Add indexes for complex queries
- Implement caching with React Query

### Hosting

**Firebase Hosting:**
- Free: 10 GB bandwidth/month
- Blaze: Unlimited (pay per GB)

**CDN:** Firebase Hosting includes global CDN

---

## 13. Backup Strategy

### Firestore Backup

**Manual Export:**
\`\`\`bash
# Export all collections
gcloud firestore export gs://[BUCKET_NAME]/[EXPORT_FOLDER]

# Restore
gcloud firestore import gs://[BUCKET_NAME]/[EXPORT_FOLDER]
\`\`\`

**Automated Backups:**
- Set up Cloud Scheduler + Cloud Functions
- Export to Cloud Storage daily

### Authentication Backup

**Users:**
- Export via Firebase Admin SDK
- Store encrypted in secure location

---

## 14. CI/CD Pipeline (Optional)

### GitHub Actions Example

\`\`\`yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: gymapp-xxxxx
\`\`\`

---

## 15. Maintenance

### Regular Tasks

**Weekly:**
- [ ] Check Firebase usage metrics
- [ ] Review Firestore security rules logs
- [ ] Check for npm security vulnerabilities

**Monthly:**
- [ ] Update dependencies (`npm update`)
- [ ] Review performance metrics
- [ ] Check for Firebase service updates

**Quarterly:**
- [ ] Security audit
- [ ] Performance audit
- [ ] Backup Firestore data

---

**Deployment Status:** Ready for production
**Support:** Check TROUBLESHOOTING.md for common issues
