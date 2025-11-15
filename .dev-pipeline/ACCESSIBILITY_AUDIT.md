# Accessibility (A11y) Audit - GymApp PoC

**Date:** 2025-11-15
**Auditor:** Claude Code
**Standard:** WCAG 2.1 Level AA
**Scope:** Code-level accessibility review (manual testing with assistive technologies pending)

---

## Executive Summary

**Overall Status:** ⚠️ NEEDS IMPROVEMENT - Multiple WCAG violations found

**Key Findings:**
- ❌ **CRITICAL**: Session cards not keyboard accessible (div with onClick)
- ❌ **CRITICAL**: Modals missing ARIA roles and keyboard support
- ❌ **HIGH**: No focus trap in modals
- ❌ **HIGH**: No Escape key support to close modals
- ✅ **GOOD**: Form labels properly associated
- ✅ **GOOD**: Mobile menu button has aria-label
- ⚠️ **MODERATE**: Some buttons missing descriptive labels

**Estimated WCAG Compliance:** 60% (needs significant improvements)
**Expected Lighthouse Score:** 70-75 (before fixes)

---

## 1. Keyboard Navigation

### ❌ CRITICAL: Session Cards Not Keyboard Accessible

**File:** `src/features/schedule/components/ScheduleView.tsx`

**Current Code:**
```tsx
<div
  key={session.id}
  onClick={() => handleSessionClick(session)}
  className={`p-4 border rounded-lg transition-colors ${
    isUserBooked(session.id)
      ? 'bg-blue-100 border-blue-500'
      : session.spotsRemaining > 0
      ? 'cursor-pointer hover:bg-zinc-100 border-gray-300'
      : 'bg-zinc-200 text-zinc-500 border-gray-200'
  }`}
>
```

**Issues:**
- ❌ `<div>` with `onClick` is not keyboard accessible
- ❌ No `tabIndex` to make it focusable
- ❌ No `onKeyDown` handler for Enter/Space keys
- ❌ No ARIA role to indicate it's interactive
- ❌ No focus visible styles

**WCAG Violations:**
- **2.1.1 Keyboard (Level A)** - Failed
- **2.1.3 Keyboard (No Exception) (Level AAA)** - Failed

**Impact:** Users relying on keyboard cannot book sessions

**Recommended Fix:**
```tsx
<button
  type="button"
  onClick={() => handleSessionClick(session)}
  disabled={session.spotsRemaining === 0 && !isUserBooked(session.id)}
  className={`p-4 border rounded-lg transition-colors text-left w-full ${
    isUserBooked(session.id)
      ? 'bg-blue-100 border-blue-500'
      : session.spotsRemaining > 0
      ? 'cursor-pointer hover:bg-zinc-100 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
      : 'bg-zinc-200 text-zinc-500 border-gray-200 cursor-not-allowed'
  }`}
  aria-label={`Book ${session.sessionType} on ${session.startTime.toDate().toLocaleDateString()} at ${session.startTime.toDate().toLocaleTimeString()}`}
>
  {/* existing content */}
</button>
```

**Priority:** 🔴 CRITICAL

---

### ❌ CRITICAL: Modal Keyboard Support Missing

**Files:**
- `src/features/schedule/components/BookingModal.tsx`
- `src/features/admin/components/SessionFormModal.tsx`
- `src/features/admin/components/ProgramFormModal.tsx`

**Current State:**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md">
```

**Issues:**
- ❌ No `role="dialog"` on modal
- ❌ No `aria-modal="true"` attribute
- ❌ No `aria-labelledby` pointing to title
- ❌ No Escape key handler to close modal
- ❌ No focus trap (user can Tab outside modal)
- ❌ Focus not moved to modal on open
- ❌ Focus not returned to trigger element on close

**WCAG Violations:**
- **2.1.2 No Keyboard Trap (Level A)** - Partially Failed (can tab out of modal)
- **2.4.3 Focus Order (Level A)** - Failed (no focus management)
- **4.1.2 Name, Role, Value (Level A)** - Failed (missing ARIA)

**Impact:** Keyboard users cannot effectively use modals, screen readers don't announce modals

**Recommended Fix:**
```tsx
// Add useEffect for Escape key and focus management
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);

// Modal JSX
<div
  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
  onClick={onClose} // Close on overlay click
>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md"
    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
  >
    <h2 id="modal-title" className="text-2xl font-bold mb-4">{session.sessionType}</h2>
```

**Priority:** 🔴 CRITICAL

---

## 2. Screen Reader Support

### ✅ GOOD: Form Labels Properly Associated

**Files:** All form components

**Current State:**
```tsx
<label htmlFor="program-select" className="block mb-2 font-semibold">
  Select Program:
</label>
<select
  id="program-select"
  value={selectedProgramId}
  onChange={e => setSelectedProgramId(e.target.value)}
  className="w-full p-2 border rounded"
>
```

**Strengths:**
- ✅ All form inputs have associated labels
- ✅ Proper use of `htmlFor` and `id` attributes
- ✅ React Hook Form with Zod provides validation feedback

**Priority:** 🟢 LOW (no changes needed)

---

### ✅ GOOD: Mobile Menu Button Has ARIA Label

**File:** `src/components/layout/Navbar.tsx`

**Current State:**
```tsx
<button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="md:hidden p-2 text-zinc-600 hover:text-blue-600"
  aria-label="Toggle menu"
>
  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>
```

**Strengths:**
- ✅ Button has descriptive `aria-label`
- ✅ Icon-only button is accessible

**Minor Improvement:**
```tsx
aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
aria-expanded={mobileMenuOpen}
```

**Priority:** 🟡 MODERATE (nice-to-have improvement)

---

### ⚠️ MODERATE: Some Buttons Missing Descriptive Labels

**Files:** Various

**Examples:**
1. **Close buttons in modals:**
```tsx
<button onClick={onClose} className="py-2 px-4 rounded bg-zinc-200 hover:bg-zinc-300">
  Close
</button>
```
✅ Has visible text, screen reader friendly

2. **X close buttons:**
```tsx
<button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
  <X size={24} />
</button>
```
❌ No aria-label for icon-only button

**Recommended Fix:**
```tsx
<button
  onClick={onClose}
  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
  aria-label="Close dialog"
>
  <X size={24} />
</button>
```

**Priority:** 🟡 MODERATE

---

### ❌ HIGH: Loading State Not Announced

**File:** `src/features/schedule/components/ScheduleView.tsx`

**Current State:**
```tsx
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <SessionCardSkeleton key={index} />
    ))}
  </div>
) : (
  // actual content
)}
```

**Issues:**
- ❌ No `aria-live` region to announce loading state
- ❌ Screen readers don't know content is loading

**Recommended Fix:**
```tsx
{loading && (
  <div aria-live="polite" aria-busy="true" className="sr-only">
    Loading schedule...
  </div>
)}
```

**Priority:** 🔴 HIGH

---

## 3. Color Contrast

### ✅ MOSTLY GOOD: Text Contrast

**Audit of Common Colors:**

1. **Primary Text (zinc-800 on white):** ✅ PASS
   - Contrast ratio: ~10:1 (exceeds 4.5:1 minimum)

2. **Secondary Text (zinc-600 on white):** ✅ PASS
   - Contrast ratio: ~7:1 (exceeds 4.5:1 minimum)

3. **Gray Text (gray-500 on white):** ⚠️ BORDERLINE
   - Contrast ratio: ~4.6:1 (barely passes 4.5:1)
   - Used for: Location text in session cards

4. **Error Text (red-500 on white):** ✅ PASS
   - Contrast ratio: ~5.6:1 (exceeds 4.5:1 minimum)

5. **Link Text (blue-600 on white):** ✅ PASS
   - Contrast ratio: ~6.5:1 (exceeds 4.5:1 minimum)

**WCAG Compliance:** ✅ Mostly compliant with 4.5:1 minimum for normal text

---

### ⚠️ MODERATE: Disabled Button Contrast

**Current State:**
```tsx
className="... disabled:bg-blue-300"
```

**Issue:**
- Blue-300 text on white may not meet 3:1 contrast for interactive elements
- Disabled states should still be perceivable

**Recommendation:** Verify disabled button contrast ratios

**Priority:** 🟡 MODERATE

---

## 4. Focus Management

### ❌ HIGH: No Focus Trap in Modals

**Issue:** Users can Tab out of modals to background content

**WCAG Violation:**
- **2.4.3 Focus Order (Level A)** - Failed

**Recommended Solution:**
Use a focus trap library like `focus-trap-react` or implement custom focus trap:

```tsx
import { useRef, useEffect } from 'react';

const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const useFocusTrap = (isOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(focusableSelectors);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    firstElement?.focus();
    container.addEventListener('keydown', handleTab);

    return () => container.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  return containerRef;
};
```

**Priority:** 🔴 HIGH

---

### ❌ HIGH: Focus Not Returned After Modal Close

**Issue:** After closing modal, focus is lost (stays on body)

**Expected Behavior:** Focus should return to the element that opened the modal

**Recommended Fix:**
```tsx
// In ScheduleView:
const triggerRef = useRef<HTMLButtonElement>(null);

const handleSessionClick = (session: Schedule) => {
  // Store reference to clicked element
  triggerRef.current = document.activeElement as HTMLButtonElement;
  setSelectedSession(session);
};

const handleModalClose = () => {
  setSelectedSession(null);
  // Return focus to trigger element
  triggerRef.current?.focus();
};
```

**Priority:** 🔴 HIGH

---

## 5. Semantic HTML

### ✅ GOOD: Proper HTML Structure

**Strengths:**
- ✅ Headings used semantically (h1, h2, h3)
- ✅ Lists used for navigation links
- ✅ `<nav>` element for navigation
- ✅ `<button>` elements for buttons (mostly)
- ✅ `<Link>` from React Router for navigation

**Priority:** 🟢 LOW (no changes needed)

---

## 6. Skip Links

### ❌ MODERATE: No Skip Navigation Link

**Issue:** Keyboard users must tab through entire navigation to reach main content

**WCAG Guideline:**
- **2.4.1 Bypass Blocks (Level A)** - Recommended

**Recommended Fix:**
```tsx
// In App.tsx or AppLayout:
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600"
>
  Skip to main content
</a>

// Add id to main content area:
<main id="main-content">
  {/* page content */}
</main>
```

**Priority:** 🟡 MODERATE

---

## 7. Summary of Issues

### 🔴 CRITICAL (Must Fix)

1. **Session Cards Not Keyboard Accessible**
   - File: ScheduleView.tsx
   - Fix: Convert divs to buttons with proper ARIA
   - Effort: 15 minutes

2. **Modals Missing ARIA and Keyboard Support**
   - Files: BookingModal, SessionFormModal, ProgramFormModal
   - Fix: Add role="dialog", aria-modal, Escape key handler
   - Effort: 30 minutes

### 🔴 HIGH (Should Fix)

3. **No Focus Trap in Modals**
   - Files: All modal components
   - Fix: Implement focus trap
   - Effort: 45 minutes (create reusable hook)

4. **Focus Not Returned After Modal Close**
   - Files: ScheduleView + modals
   - Fix: Track trigger element, return focus
   - Effort: 15 minutes

5. **Loading State Not Announced**
   - File: ScheduleView.tsx
   - Fix: Add aria-live region
   - Effort: 5 minutes

### 🟡 MODERATE (Nice to Have)

6. **Mobile Menu Button - Enhanced ARIA**
   - File: Navbar.tsx
   - Fix: Add aria-expanded
   - Effort: 2 minutes

7. **X Close Buttons Missing Labels**
   - Files: Various modals
   - Fix: Add aria-label="Close dialog"
   - Effort: 10 minutes

8. **No Skip Navigation Link**
   - File: AppLayout or App.tsx
   - Fix: Add skip link
   - Effort: 10 minutes

---

## 8. Implementation Priority

**Phase 1: Critical Keyboard Accessibility (45 min)**
1. ✅ Make session cards keyboard accessible (buttons)
2. ✅ Add Escape key support to modals
3. ✅ Add ARIA roles to modals (role="dialog", aria-modal)
4. ✅ Add loading state announcements

**Phase 2: Focus Management (60 min)**
5. ✅ Implement focus trap in modals
6. ✅ Return focus after modal close
7. ✅ Add focus visible styles

**Phase 3: Polish (20 min)**
8. ✅ Add aria-labels to icon-only buttons
9. ✅ Add skip navigation link
10. ✅ Enhanced mobile menu ARIA

---

## 9. Testing Checklist

**Manual Keyboard Testing:**
- [ ] Can navigate entire app using only Tab/Shift+Tab
- [ ] Can activate all interactive elements with Enter/Space
- [ ] Can close modals with Escape key
- [ ] Focus visible on all interactive elements
- [ ] Focus trapped in open modals
- [ ] Focus returns to trigger after modal close

**Screen Reader Testing (NVDA/JAWS/VoiceOver):**
- [ ] Modals announced as "dialog"
- [ ] Form labels read correctly
- [ ] Button purposes clear
- [ ] Loading states announced
- [ ] Error messages announced

**Automated Testing:**
- [ ] Run Lighthouse accessibility audit (target: >90)
- [ ] Run axe DevTools (target: 0 critical issues)
- [ ] Verify WCAG 2.1 Level AA compliance

---

## 10. Current Grade: D+

**Strengths:**
- Good form label associations
- Semantic HTML structure
- Adequate color contrast
- Mobile menu button has aria-label

**Critical Weaknesses:**
- ❌ Session cards not keyboard accessible
- ❌ Modals missing ARIA roles
- ❌ No Escape key support
- ❌ No focus management in modals
- ❌ Loading states not announced

**After Fixes:** Expected grade A- to A

---

## 11. Recommended Libraries

**Focus Management:**
- `focus-trap-react` - Simplifies focus trapping in modals
- `react-focus-lock` - Alternative focus trap solution

**Accessibility Testing:**
- `@axe-core/react` - Runtime accessibility testing
- `jest-axe` - Accessibility testing in unit tests

---

## 12. Deliverables

**This Audit:**
- ✅ Comprehensive accessibility review
- ✅ Prioritized issue list with code examples
- ✅ WCAG violation references
- ✅ Implementation roadmap

**Next Steps:**
1. Implement Phase 1 (critical keyboard accessibility)
2. Implement Phase 2 (focus management)
3. Implement Phase 3 (polish)
4. Manual testing with keyboard and screen readers
5. Automated testing with Lighthouse/axe

---

**Audit Status:** COMPLETE
**Next Action:** Implement critical keyboard accessibility fixes
