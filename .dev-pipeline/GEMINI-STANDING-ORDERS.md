# Gemini CLI - Standing Orders & Constraints

**Document Version:** 1.1
**Last Updated:** 2025-11-06
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

**Correct Commands:**
```powershell
# List all active sessions
jules remote list

# Wait before checking again
Start-Sleep -Seconds 300
jules remote list

# Alternatively, list with task details
jules remote list --task
```

**Why:** Prevents API overload and respects rate limits.

---

### CONSTRAINT-004: Instant Commands Must Include Wait

**RULE:** Commands that execute and complete almost instantly (like `echo`, `Write-Output`, simple variable assignments) will crash the Gemini CLI application. They MUST be accompanied by a short wait command.

**Prohibited Pattern:**
```powershell
echo "Task completed"  # ❌ Will crash Gemini CLI
Write-Output "Done"    # ❌ Will crash Gemini CLI
$result = "value"      # ❌ Will crash Gemini CLI
```

**Correct Pattern:**
```powershell
echo "Task completed"; Start-Sleep -Seconds 2  # ✅ Safe
Write-Output "Done"; Start-Sleep -Seconds 1    # ✅ Safe
$result = "value"; Start-Sleep -Seconds 1      # ✅ Safe
```

**Why:** The Gemini CLI expects commands to have measurable execution time. Instant commands complete before the CLI can properly register them, causing application crashes.

**Best Practice:** Add a 1-2 second sleep after any command that would execute in under 100ms.

---

### CONSTRAINT-005: Update Task Files Immediately

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
- [ ] Does this command execute instantly (echo, Write-Output, etc.)? ⏱️ Add 1-2 second sleep
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
- v1.1 (2025-11-06): 
  - Corrected Jules commands (jules remote list instead of jules remote status)
  - Added CONSTRAINT-004 for instant commands requiring wait times
  - Updated Quick Reference Card
- v1.0 (2025-11-05): Initial version with dev server constraint
