# Troubleshooting Guide - GymApp PoC

**Last Updated:** 2025-11-15

---

## Common Issues

### 1. Build & Development Issues

#### Issue: "Cannot find module '@/components/...'"

**Cause:** TypeScript path alias not recognized

**Solution:**
```bash
# Check tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Restart dev server
npm run dev
```

---

#### Issue: "Build fails with TypeScript errors"

**Cause:** Type errors in code

**Solution:**
```bash
# Check for errors
npx tsc --noEmit

# Fix errors shown in output
# Common fixes:
# - Add missing type imports
# - Fix incorrect prop types
# - Add | null to optional types
```

---

#### Issue: "Vite: Cannot find module 'react'"

**Cause:** Dependencies not installed

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or if using pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

### 2. Firebase Configuration Issues

#### Issue: "Firebase: Error (auth/configuration-not-found)"

**Cause:** Environment variables not loaded or incorrect

**Solution:**
1. Check `.env` file exists in project root
2. Verify all `VITE_FIREBASE_*` variables are set
3. Restart dev server (Vite loads .env on start)
4. Check variables start with `VITE_` prefix

```bash
# Test environment variables
npm run dev
# In browser console:
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
// Should NOT be undefined
```

---

#### Issue: "Firebase: Error (auth/api-key-not-valid)"

**Cause:** Incorrect Firebase API key

**Solution:**
1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Copy correct `apiKey` value
4. Update `VITE_FIREBASE_API_KEY` in `.env`
5. Restart dev server

---

#### Issue: "Firestore: Missing or insufficient permissions"

**Cause:** Security rules not deployed or incorrect

**Solution:**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Verify rules in Firebase Console
# Go to Firestore Database → Rules
# Check "Last published" date is recent
```

**Common Rule Issues:**
- User not authenticated → Check login works
- Wrong role → Check user document has `role` field
- Trying to write wrong data → Check rule validation

---

### 3. Authentication Issues

#### Issue: "Cannot login - 'auth/invalid-credential'"

**Cause:** Wrong email or password

**Solution:**
1. Check test credentials:
   - member1@gymapp.com / Member123!
   - admin@gymapp.com / Admin123!
2. Verify user exists in Firebase Console → Authentication
3. If seed data not loaded, run:
   ```bash
   npm run seed:demo
   ```

---

#### Issue: "User redirected to login immediately after signing in"

**Cause:** Auth state not persisting or role not set

**Solution:**
1. Check browser console for errors
2. Verify user document exists in Firestore `users` collection
3. Verify user document has `role` field (member/coach/admin)
4. Check `useAuthInit.ts` hook is being called

---

#### Issue: "Cannot access /admin route (redirects to /schedule)"

**Cause:** User does not have admin or coach role

**Solution:**
1. Check user's role in Firestore:
   - Firebase Console → Firestore → users collection
   - Find user document by UID
   - Verify `role` field is "admin" or "coach"
2. If wrong role, update in Firestore
3. Logout and login again

---

### 4. Booking Issues

#### Issue: "Booking fails with 'Session is full'"

**Cause:** Session capacity reached or race condition

**Solution:**
- Expected behavior if session has 0 spots remaining
- Check session capacity in Firestore `schedules` collection
- If incorrect, manually update `spotsRemaining` field

---

#### Issue: "Booking succeeds but doesn't appear in schedule"

**Cause:** Real-time listener not updating or Firestore rules issue

**Solution:**
1. Check browser console for errors
2. Verify booking exists in Firestore `bookings` collection
3. Check booking has `status: 'active'` and matches user's UID
4. Try refreshing page
5. Check Firestore rules allow reading own bookings

---

#### Issue: "Cannot cancel booking"

**Cause:** Booking not found or permission denied

**Solution:**
1. Check booking exists in Firestore
2. Verify `userId` matches logged-in user
3. Check Firestore rules allow deletion
4. Verify transaction doesn't fail (check console)

---

### 5. Social Features Issues

#### Issue: "Friend search finds no results"

**Cause:** Searching by email/name instead of Friend ID

**Solution:**
- Friend search ONLY works with exact Friend ID (e.g., MEM00001)
- Email and name search are intentionally disabled (privacy)
- Get Friend ID from user's Profile page

---

#### Issue: "Friend activity badge doesn't show friends"

**Cause:** Privacy settings or no friends booked

**Solution:**
1. Check both users have `shareActivity: true`:
   - Navigate to Profile → Privacy Settings
   - Toggle "Share Activity" ON
2. Verify users are actually friends (check `friends` array)
3. Verify both users booked the same session
4. Check browser console for errors

---

#### Issue: "Friend request fails to send"

**Cause:** Already friends or request already exists

**Solution:**
- Cannot send request if already friends
- Cannot send duplicate request
- Check Firestore `friendRequests` collection for existing request

---

### 6. Admin/Coach Issues

#### Issue: "Cannot create session"

**Cause:** Missing required fields or validation error

**Solution:**
1. Check all required fields are filled:
   - Session Type, Date, Start Time, End Time, Coach, Capacity
2. Verify start time is before end time
3. Check capacity is > 0
4. Check browser console for validation errors

---

#### Issue: "Roster modal shows no bookings"

**Cause:** No users have booked or query error

**Solution:**
1. Verify users have booked the session (check schedule view)
2. Check Firestore `bookings` collection for sessionId
3. Verify bookings have `status: 'active'`
4. Check console for query errors

---

#### Issue: "Cannot export roster CSV"

**Cause:** Browser blocking download or no bookings

**Solution:**
1. Check browser allows downloads
2. Verify session has bookings
3. Check console for JavaScript errors
4. Try different browser

---

### 7. Performance Issues

#### Issue: "App loads slowly"

**Cause:** Large bundle or slow network

**Solution:**
1. Check bundle size:
   ```bash
   npm run build
   # Initial bundle should be ~61 KB gzipped
   ```
2. Verify code splitting is working (separate chunks for routes)
3. Check Network tab in DevTools for slow requests
4. Verify Firebase region is close to users

---

#### Issue: "Schedule page slow to load"

**Cause:** Too many sessions or inefficient queries

**Solution:**
1. Check number of sessions in date range (default 7 days)
2. Reduce date range if needed
3. Add indexes in Firebase Console if queries are slow
4. Check Firestore usage in Firebase Console

---

### 8. Seed Data Issues

#### Issue: "npm run seed:demo fails"

**Cause:** Missing serviceAccountKey.json or Firebase Admin SDK not installed

**Solution:**
```bash
# Install dependencies
npm install

# Get service account key:
# 1. Firebase Console → Project Settings → Service Accounts
# 2. Click "Generate new private key"
# 3. Save as serviceAccountKey.json in project root

# Run seed script
npm run seed:demo
```

---

#### Issue: "Seed script creates users but not sessions"

**Cause:** Script error partway through

**Solution:**
```bash
# Clear data and reseed
npm run seed:demo:clear

# Check console output for specific errors
# Common issues:
# - Invalid Timestamp format
# - Missing required fields
# - Firestore rules blocking writes
```

---

### 9. Deployment Issues

#### Issue: "Firebase deploy fails - permission denied"

**Cause:** Not logged in or wrong project

**Solution:**
```bash
# Login to Firebase CLI
firebase login

# Check current project
firebase projects:list

# Switch to correct project
firebase use <project-id>

# Deploy again
firebase deploy --only firestore:rules
```

---

#### Issue: "App deployed but shows blank page"

**Cause:** Build errors or incorrect environment variables

**Solution:**
1. Check browser console for errors
2. Verify environment variables set in hosting platform
3. Rebuild with correct variables:
   ```bash
   npm run build
   ```
4. Check dist/index.html was created
5. Verify hosting platform serves SPA correctly

---

#### Issue: "Environment variables undefined in production"

**Cause:** Variables not prefixed with VITE_ or not set in hosting platform

**Solution:**
1. Check all variables start with `VITE_`
2. For Vercel/Netlify, add variables in dashboard
3. Rebuild after adding variables
4. Check variables are available:
   ```javascript
   console.log(import.meta.env.VITE_FIREBASE_API_KEY)
   ```

---

## Debug Tools

### Browser DevTools

**Check Authentication State:**
```javascript
// In browser console
import { auth } from './src/services/firebase/config';
console.log(auth.currentUser);
```

**Check Zustand State:**
```javascript
// In browser console (if React DevTools installed)
$r.store.getState()
```

**Check Firebase Connection:**
```javascript
// In browser console
import { db } from './src/services/firebase/config';
console.log(db);
```

---

### Firebase Console

**Check Firestore Data:**
1. Firebase Console → Firestore Database
2. Browse collections: users, schedules, bookings, programs
3. Verify document structure matches types

**Check Authentication:**
1. Firebase Console → Authentication
2. Verify users exist with correct emails
3. Check custom claims (not visible in console, use Admin SDK)

**Check Usage:**
1. Firebase Console → Firestore → Usage
2. Check read/write counts
3. Verify within quota

---

### Firestore Rules Testing

**Test in Playground:**
1. Firebase Console → Firestore → Rules
2. Click "Rules Playground"
3. Select auth user
4. Try operations (read, write, delete)
5. See if allowed/denied

---

## Getting Help

### Before Asking for Help

1. [ ] Check this troubleshooting guide
2. [ ] Check browser console for errors
3. [ ] Check Firebase Console for data/rules
4. [ ] Try clearing browser cache
5. [ ] Try in incognito/private window
6. [ ] Try different browser

### Information to Provide

When reporting an issue, include:

```
**Environment:**
- OS: Windows 11 / macOS / Linux
- Browser: Chrome 120
- Node version: 20.x
- App version/commit: abc123

**Issue:**
[Description of problem]

**Steps to Reproduce:**
1. Login as member1@gymapp.com
2. Navigate to Schedule
3. Click session at 6 PM
4. ...

**Expected:**
[What should happen]

**Actual:**
[What actually happens]

**Console Errors:**
[Paste errors from browser console]

**Screenshots:**
[Attach if helpful]

**Already Tried:**
- Cleared cache
- Tried different browser
- Checked Firestore rules deployed
- ...
```

---

## Common Error Messages

### "Firebase: No Firebase App '[DEFAULT]' has been created"

**Fix:** Check firebase config initialization in `src/services/firebase/config.ts`

---

### "Firebase: Error (auth/network-request-failed)"

**Fix:** Check internet connection, Firebase status page

---

### "TypeError: Cannot read property 'uid' of null"

**Fix:** User not authenticated - add null checks or loading states

---

### "Firestore: PERMISSION_DENIED"

**Fix:** Deploy Firestore rules, check user authentication, verify role

---

### "React Hook useEffect has a missing dependency"

**Fix:** Add dependency to array or use useCallback for functions

---

## Performance Debugging

### Lighthouse Issues

**Low Performance Score:**
- Check bundle size (should be ~61 KB initial)
- Verify code splitting working
- Check no blocking resources

**Low Accessibility Score:**
- Check keyboard navigation works
- Verify ARIA labels present
- Test with screen reader

---

## Still Stuck?

1. Check `.dev-pipeline/` folder for detailed documentation:
   - SECURITY_AUDIT.md
   - PERFORMANCE_AUDIT.md
   - ACCESSIBILITY_AUDIT.md
   - SEED_DATA_GUIDE.md

2. Check source code comments for implementation details

3. Review Firebase documentation:
   - https://firebase.google.com/docs

4. Search GitHub issues (if public repo)

---

**Last Updated:** 2025-11-15
**Status:** Comprehensive troubleshooting guide complete
