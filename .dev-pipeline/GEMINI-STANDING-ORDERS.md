# Gemini CLI - Standing Orders & Constraints

**Document Version:** 1.0
**Last Updated:** 2025-11-05
**Purpose:** Critical rules that Gemini MUST follow at all times

---

## 🚨 CRITICAL CONSTRAINTS

### CONSTRAINT-001: Never Run Long-Running Dev Servers

**RULE:** Gemini MUST NEVER execute commands that start development servers or other long-running processes that wait for output indefinitely.

**Prohibited Commands:**
- `npm run dev`
- `npm start`
- `pnpm dev`
- `yarn dev`
- `vite`
- `vite dev`
- Any command that starts a web server and waits

**Why:** These commands block and wait indefinitely for manual intervention (Ctrl+C). Gemini will stall completely, requiring manual intervention to kill the process.

**Alternative Approach:**
If verification of a dev server is needed:
1. Document the command for manual testing by the human developer
2. Update task status noting "REQUIRES MANUAL VERIFICATION"
3. Provide instructions for the human to run and test
4. Continue with remaining tasks

**Example - WRONG:**
```powershell
npm run dev  # ❌ DON'T DO THIS - Will hang forever
```

**Example - CORRECT:**
```markdown
Task requires manual verification:
- Human should run: npm run dev
- Human should verify: App loads at http://localhost:5173
- Human should check: No console errors
- Human should stop: Press Ctrl+C
```

---

### CONSTRAINT-002: Build Commands Are OK

**RULE:** Build commands that complete and exit are SAFE to run.

**Allowed Commands:**
- `npm run build`
- `npm run test` (if tests exit)
- `npm install`
- `pnpm build`
- `yarn build`

**Why:** These commands complete their work and exit, returning control to Gemini.

---

### CONSTRAINT-003: Wait Between Jules Status Checks

**RULE:** When monitoring Jules sessions, ALWAYS wait at least 300 seconds (5 minutes) between status checks.

**Correct Approach:**
```powershell
jules remote status --session [ID]
Start-Sleep -Seconds 300
jules remote status --session [ID]
```

**Why:** Prevents API overload and respects rate limits.

---

### CONSTRAINT-004: Update Task Files Immediately

**RULE:** After completing any action, immediately update the task file with:
- New status
- Session IDs (for Jules tasks)
- Timestamp
- Result summary

**Why:** Ensures recovery is possible if Gemini crashes.

---

## 📋 Quick Reference Card

**BEFORE running ANY command, check:**
- [ ] Does this command exit when complete? ✅ OK to run
- [ ] Does this command wait indefinitely? ❌ DOCUMENT FOR MANUAL TESTING
- [ ] Am I checking Jules too frequently? ⏱️ Wait 5 minutes
- [ ] Have I updated the task file? 📝 Update immediately after action

---

## 🆘 If You Find Yourself Stuck

If a command is running and you realize it won't exit:

1. **Don't wait** - Acknowledge the mistake
2. **Document** - Note in task file that manual intervention is needed
3. **Continue** - Move to next task that can be automated
4. **Report** - Update STATUS-REPORT.md with the issue

---

## 📝 Document Evolution

This document should be updated whenever new constraints are discovered through experience.

**Version History:**
- v1.0 (2025-11-05): Initial version with dev server constraint
