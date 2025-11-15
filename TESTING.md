# Testing Guide - GymApp PoC

**Last Updated:** 2025-11-15
**Status:** Manual Testing Only (E2E framework pending)

---

## Test Accounts

### Admins (2)
```
Email:    admin@gymapp.com
Password: Admin123!
Role:     admin
Friend ID: ADM00001

Email:    admin2@gymapp.com
Password: Admin123!
Role:     admin
Friend ID: ADM00002
```

### Coaches (3)
```
Email:    coach1@gymapp.com (Coach Sarah)
Password: Coach123!
Friend ID: CCH00001

Email:    coach2@gymapp.com (Coach Mike)
Password: Coach123!
Friend ID: CCH00002

Email:    coach3@gymapp.com (Coach Emily)
Password: Coach123!
Friend ID: CCH00003
```

### Members (25)
```
Email:    member1@gymapp.com to member25@gymapp.com
Password: Member123!
Names:    Realistic names (Emma Smith, Liam Johnson, etc.)
Friend IDs: MEM00001 to MEM00025
```

**Generate Test Data:**
```bash
npm run seed:demo
```

See `.dev-pipeline/SEED_DATA_GUIDE.md` for complete details.

---

## Manual Testing Checklist

### 1. Authentication Flow

**Test Case:** User Registration & Login
- [ ] Navigate to login page
- [ ] Enter email: member1@gymapp.com
- [ ] Enter password: Member123!
- [ ] Click "Sign In"
- [ ] **Expected:** Redirect to homepage
- [ ] **Verify:** Display name shows "Emma Smith"

**Test Case:** Logout
- [ ] Click logout button
- [ ] **Expected:** Redirect to login page
- [ ] **Verify:** Cannot access protected routes

---

### 2. Schedule & Booking

**Test Case:** View Schedule
- [ ] Login as member1@gymapp.com
- [ ] Navigate to Schedule page
- [ ] **Expected:** See list of 70 sessions (2 weeks)
- [ ] **Verify:** Sessions show time, coach, capacity

**Test Case:** Filter Sessions
- [ ] Click "Session Type" dropdown
- [ ] Select "Morning Strength"
- [ ] **Expected:** Only Morning Strength sessions shown
- [ ] Reset filter to "All"

**Test Case:** Book Available Session
- [ ] Find session with spots remaining
- [ ] Click on session card
- [ ] **Expected:** BookingModal opens
- [ ] Select program from dropdown
- [ ] Click "Book Session"
- [ ] **Expected:** Toast notification "Session booked successfully!"
- [ ] **Verify:** Session card shows "✓ Booked" badge
- [ ] **Verify:** Spots remaining decremented

**Test Case:** View Full Session
- [ ] Find today's 6 PM session (FULL - 0 spots)
- [ ] Click on session card
- [ ] **Expected:** "Book Session" button is disabled
- [ ] **Verify:** Shows "0 / 15 available"

**Test Case:** Cancel Booking
- [ ] Click on booked session
- [ ] **Expected:** Shows "Cancel Booking" button
- [ ] Click "Cancel Booking"
- [ ] **Expected:** Toast notification "Booking cancelled successfully"
- [ ] **Verify:** "✓ Booked" badge removed
- [ ] **Verify:** Spots remaining incremented

---

### 3. Social Features

**Test Case:** Friend Search by Friend ID
- [ ] Login as member1@gymapp.com
- [ ] Navigate to Profile → Social tab
- [ ] Enter Friend ID: MEM00006
- [ ] Click "Search"
- [ ] **Expected:** Shows "Charlotte Brown" (or similar)
- [ ] **Verify:** Only shows displayName and friendId (no email)

**Test Case:** Send Friend Request
- [ ] Continue from friend search
- [ ] Click "Send Request"
- [ ] **Expected:** Toast notification "Friend request sent"
- [ ] **Verify:** Request appears in "Sent Requests"

**Test Case:** Accept Friend Request
- [ ] Logout
- [ ] Login as member6@gymapp.com
- [ ] Navigate to Profile → Social tab
- [ ] **Expected:** See pending request from Emma Smith
- [ ] Click "Accept"
- [ ] **Expected:** Toast notification "Friend request accepted"
- [ ] **Verify:** Friend appears in "Friends List"

**Test Case:** Activity Sharing Privacy
- [ ] As member6@gymapp.com
- [ ] Navigate to Profile → Privacy Settings
- [ ] Toggle "Share Activity" ON
- [ ] Logout and login as member1@gymapp.com
- [ ] Book same session as member6
- [ ] Navigate to Schedule
- [ ] **Expected:** Friend activity badge shows "1 friend attending"
- [ ] Click badge
- [ ] **Verify:** Shows member6 name

---

### 4. Admin Schedule Management

**Test Case:** Create New Session
- [ ] Login as admin@gymapp.com
- [ ] Navigate to Admin page
- [ ] Click "Create Session"
- [ ] Fill form:
  - Session Type: "Test Session"
  - Date: Tomorrow
  - Start Time: 10:00 AM
  - End Time: 11:00 AM
  - Coach: Coach Sarah
  - Capacity: 15
  - Location: Main Gym
- [ ] Click "Save"
- [ ] **Expected:** Toast notification "Session created successfully"
- [ ] **Verify:** Session appears in schedule list

**Test Case:** View Session Roster
- [ ] Find today's 6 AM session (has 5 bookings)
- [ ] Click roster icon (Users icon)
- [ ] **Expected:** RosterModal opens
- [ ] **Verify:** Shows 5 booked members
- [ ] **Verify:** Member names and booking times visible

**Test Case:** Export Roster to CSV
- [ ] In RosterModal
- [ ] Click "Export CSV"
- [ ] **Expected:** CSV file downloads
- [ ] **Verify:** Contains member names, emails, booking times

**Test Case:** Delete Session
- [ ] Find test session created earlier
- [ ] Click delete icon (Trash icon)
- [ ] **Expected:** Confirmation dialog
- [ ] Click "OK"
- [ ] **Expected:** Toast notification "Session deleted successfully"
- [ ] **Verify:** Session removed from list

---

### 5. Program Management

**Test Case:** Create Program
- [ ] Login as coach1@gymapp.com
- [ ] Navigate to Admin → Programs section
- [ ] Click "Create Program"
- [ ] Fill form:
  - Name: "Test Program"
  - Description: "Test workout program"
  - Type: Strength
  - Duration: 8 weeks
  - Exercises: "Squats, Bench, Deadlift"
  - Active: Yes
- [ ] Click "Create"
- [ ] **Expected:** Toast notification "Program created successfully"
- [ ] **Verify:** Program appears in list

**Test Case:** Edit Program
- [ ] Find test program
- [ ] Click "Edit"
- [ ] Change duration to 10 weeks
- [ ] Click "Update"
- [ ] **Expected:** Toast notification "Program updated successfully"
- [ ] **Verify:** Duration shows 10 weeks

---

### 6. Security Testing

**Test Case:** Unauthorized Admin Access
- [ ] Login as member1@gymapp.com
- [ ] Manually navigate to `/admin` in URL
- [ ] **Expected:** Redirect to /schedule
- [ ] **Verify:** Cannot access admin features

**Test Case:** Booking Privacy
- [ ] Login as member1@gymapp.com
- [ ] Book a session
- [ ] Logout and login as member2@gymapp.com
- [ ] Navigate to Schedule
- [ ] Click same session
- [ ] **Expected:** Does NOT show member1's booking
- [ ] **Verify:** Only sees own bookings

**Test Case:** Friend Search Privacy
- [ ] As member2@gymapp.com
- [ ] Try searching by email: member1@gymapp.com
- [ ] **Expected:** No results found
- [ ] Try searching by name: Emma Smith
- [ ] **Expected:** No results found
- [ ] Search by Friend ID: MEM00001
- [ ] **Expected:** Shows Emma Smith (Friend ID search only works)

---

## Performance Testing

### Lighthouse Audit

**Run Lighthouse:**
1. Open app in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Select "Performance, Accessibility, Best Practices, SEO"
5. Click "Analyze page load"

**Expected Scores:**
- Performance: > 90 ✅
- Accessibility: > 85
- Best Practices: > 90
- SEO: > 85

### Bundle Size Verification

**Check Build Output:**
```bash
npm run build
```

**Expected:**
```
dist/assets/index.js: 192 KB (61 KB gzipped) ✅
dist/assets/AdminPage.js: 149 KB (39 KB gzipped)
dist/assets/firebase-vendor.js: 480 KB (112 KB gzipped)
```

**Initial load:** ~61 KB gzipped (under 200 KB target)

---

## Browser Compatibility Testing

### Supported Browsers
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Test in Each Browser
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

### Mobile Testing
- [ ] iOS Safari (iPhone)
- [ ] Chrome Android
- [ ] Responsive breakpoints (320px, 768px, 1024px)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Focus visible on all elements

### Screen Reader Testing
- [ ] Modals announced as "dialog"
- [ ] Form labels read correctly
- [ ] Button purposes clear
- [ ] Loading states announced
- [ ] Error messages announced

**Tools:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac/iOS)

See `.dev-pipeline/ACCESSIBILITY_AUDIT.md` for complete report.

---

## Known Test Data

### Pre-Seeded Scenarios

**Today's Sessions:**
- 6 AM Morning Strength: 5/12 booked
- 6 PM Evening session: FULL (15/15 booked)

**Friendships:**
- Member1 ↔ Member6 (existing)
- Member2 ↔ Member7 (existing)

**Pending Requests:**
- Member11 → Member16
- Member12 → Member17

---

## Regression Testing

### After Code Changes

**Quick Smoke Test:**
1. [ ] Login works
2. [ ] Schedule loads
3. [ ] Booking works
4. [ ] Admin page accessible (admins)
5. [ ] No console errors

**Full Regression:**
- Run all test cases above
- Check Lighthouse scores
- Verify bundle size unchanged

---

## Bug Reporting

### When You Find a Bug

**Report Format:**
```
**Title:** [Short description]

**Steps to Reproduce:**
1. Login as member1@gymapp.com
2. Navigate to Schedule
3. Click on session at 6 PM
4. ...

**Expected:**
[What should happen]

**Actual:**
[What actually happens]

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Account: member1@gymapp.com

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Copy any errors from browser console]
```

---

## Future: Automated E2E Tests

### Planned Framework: Playwright

**Test Structure:**
```typescript
// tests/e2e/booking.spec.ts
import { test, expect } from '@playwright/test';

test('member can book session', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name=email]', 'member1@gymapp.com');
  await page.fill('[name=password]', 'Member123!');
  await page.click('button[type=submit]');

  // Navigate to schedule
  await page.click('text=Schedule');

  // Book session
  await page.click('text=Morning Strength').first();
  await page.selectOption('[name=program]', 'Beginner Strength');
  await page.click('text=Book Session');

  // Verify
  await expect(page.locator('text=✓ Booked')).toBeVisible();
});
```

**Setup (Future):**
```bash
npm install -D @playwright/test
npx playwright install
npm run test:e2e
```

---

**Testing Status:** Manual testing complete, automated E2E pending
**Next Steps:** Implement Playwright E2E suite (TASK-057)
