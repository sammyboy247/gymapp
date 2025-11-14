# Gemini CLI - Standing Orders & Constraints

**Document Version:** 1.2
**Last Updated:** 2025-11-14
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
Test-Path "file.txt"   # ❌ Will crash Gemini CLI
```

**Correct Pattern:**
```powershell
echo "Task completed"; Start-Sleep -Seconds 2  # ✅ Safe
Write-Output "Done"; Start-Sleep -Seconds 1    # ✅ Safe
$result = "value"; Start-Sleep -Seconds 1      # ✅ Safe
Test-Path "file.txt"; Start-Sleep -Seconds 1   # ✅ Safe
```

**Why:** The Gemini CLI expects commands to have measurable execution time. Instant commands complete before the CLI can properly register them, causing application crashes.

**Best Practice:** Add a 1-2 second sleep after any command that would execute in under 100ms.

---

### CONSTRAINT-005: Update Task Files Immediately

**RULE:** After adopting any action, immediately update the task file with:
- New status (Initiated)
- Timestamp

**RULE:** After completing any action, immediately update the task file with:
- New status (Completed)
- Session IDs (for Jules tasks)
- Timestamp
- Result summary

**Why:** Ensures recovery is possible if Gemini crashes.

---

### CONSTRAINT-006: Add Sleep to `git status`

**RULE:** The `git status` command can cause instability. Always append a short sleep command to it.

**Prohibited Pattern:**
```powershell
git status # ❌ May crash Gemini CLI
```

**Correct Pattern:**
```powershell
git status; Start-Sleep -Seconds 1 # ✅ Safe
```

**Why:** The `git status` command can sometimes execute too quickly, leading to the same instability as other instant commands.

---

### CONSTRAINT-007: Always Check for Existing Jules Sessions Before Starting New Work

**RULE:** Before initiating ANY new Jules session, Gemini MUST check for existing completed sessions that may already contain the work.

**MANDATORY PRE-FLIGHT CHECKLIST:**
```powershell
# 1. List all Jules sessions for this repo
jules remote list --session

# 2. Identify recently completed sessions (last 24-48 hours)
# Look for "Completed" status

# 3. For each completed session, check what it contains
jules remote pull --session [SESSION_ID] 2>&1 | head -20

# 4. Check what files were created/modified
jules remote pull --session [SESSION_ID] 2>&1 | Select-String "^diff --git"

# 5. ONLY start new Jules session if work is truly new
```

**Why This Constraint Exists:**

On 2025-11-14, a costly mistake was made:
- TASK-036, TASK-037, and TASK-038 were completed by Jules 8-19 hours prior
- Completed work was sitting in Jules sessions waiting to be pulled
- A NEW Jules session was initiated for TASK-036 **without checking** existing sessions
- Result: Duplicate work, wasted 60-90 minutes of cloud VM time, potential merge conflicts

**Red Flags That Work May Already Exist:**
- ✅ Required dependencies are already installed
- ✅ Some related files exist but are functional (not just placeholders)
- ✅ Build is passing but features seem incomplete
- ✅ Multiple related Jules sessions show "Completed" status recently
- ✅ Tasklist shows recent Jules session IDs in notes

**Decision Tree:**

```
About to start Jules work for TASK-XXX?
│
├─ Run: jules remote list --session
│
├─ See completed session from last 48 hours?
│  ├─ YES → Check what it contains
│  │        └─ Contains your work? → PULL IT, don't start new session
│  │        └─ Different work? → OK to start new session
│  │
│  └─ NO → Check local files
│           └─ Placeholder files only? → OK to start new session
│           └─ Functional files exist? → Investigation needed, may already be done
```

**Correct Recovery if Duplicate Started:**
1. Check if Jules session can be cancelled (while in "Planning" state)
2. Pull all completed sessions that contain the work
3. Document the mistake in GEMINI-CONTINUE-INSTRUCTIONS.md
4. Update tasklist.md with actual status

**Exception:**
If intentionally re-running a task due to bugs or missing requirements, document WHY in the Jules session description:
```bash
jules remote new --repo . --session "RETRY TASK-036: Previous session 123456 missing BookingModal component. Re-implementing with complete spec..."
```

---

## 📋 Quick Reference Card

**BEFORE running ANY command, check:**
- [ ] Does this command exit when complete? ✅ OK to run
- [ ] Does this command wait indefinitely? ❌ DOCUMENT FOR MANUAL TESTING
- [ ] Does this command execute instantly (echo, Write-Output, etc.)? ⏱️ Add 1-2 second sleep
- [ ] Am I checking Jules too frequently? ⏱️ Wait 5 minutes
- [ ] Have I updated the task file? 📝 Update immediately after action

**BEFORE starting NEW Jules session, check:**
- [ ] Have I listed existing Jules sessions? 🔍 `jules remote list --session`
- [ ] Are there completed sessions from last 48 hours? ⏰ Check timestamps
- [ ] Have I checked what those sessions contain? 📄 `jules remote pull --session [ID]`
- [ ] Is the work I'm about to start already done? ⚠️ Pull instead of recreate

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
- v1.2 (2025-11-14):
  - Added CONSTRAINT-007: Check for existing Jules sessions before starting new work
  - Documented real-world incident where duplicate Jules session was initiated
  - Added pre-flight checklist for Jules session creation
  - Expanded Quick Reference Card with Jules session verification steps
  - Impact: Prevents wasted cloud VM time and duplicate work
- v1.1 (2025-11-06):
  - Corrected Jules commands (jules remote list instead of jules remote status)
  - Added CONSTRAINT-004 for instant commands requiring wait times
  - Updated Quick Reference Card
- v1.0 (2025-11-05): Initial version with dev server constraint
