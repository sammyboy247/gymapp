# Jules Remote Session Workflow Protocol

**Version:** 1.0
**Created:** 2025-11-15
**Purpose:** Explicit, step-by-step protocol for working with Jules remote sessions to prevent conflicts and data loss

---

## 🚨 CRITICAL UNDERSTANDING

Jules works in a **remote cloud VM** that pulls from and pushes to your Git remote repository. Jules does **NOT** have access to your local working directory.

**This means:**
- Jules pulls code from GitHub/GitLab (remote)
- Jules makes changes in cloud VM
- Jules creates a diff against remote
- You pull Jules's diff to local

**Therefore:**
- Local changes **MUST** be pushed to remote before Jules starts
- Jules changes **MUST** be pulled to local before continuing work
- Overlapping work creates merge conflicts

---

## 📋 The Complete Jules Workflow

### Phase 1: PRE-JULES CHECKLIST (MANDATORY)

**Before running `jules remote new` or `jules new`, ALWAYS:**

#### Step 1: Verify Clean Local State
```bash
git status
```

**Expected:**
- Either "working tree clean"
- OR only expected uncommitted changes

**If unexpected changes:**
- Review with `git diff`
- Decide: commit, stash, or discard

#### Step 2: Commit Local Changes
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: [describe work completed]

- Bullet points of changes
- Make commit atomic and descriptive

Committing before Jules session [SESSION_TOPIC]"

# Verify commit succeeded
git log -1
```

**Why:** Jules needs a clean, committed baseline to work from.

#### Step 3: Push to Remote (CRITICAL)
```bash
# Push to remote repository
git push origin main

# Verify push succeeded
git status
```

**Expected output:**
```
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

**Why:** Jules pulls from remote, not local. If you don't push, Jules works on old code.

#### Step 4: Verify Remote is Current
```bash
# Check remote status
git fetch
git status
```

**Expected:** "Your branch is up to date with 'origin/main'"

**If behind remote:**
```bash
git pull origin main
# Resolve any conflicts
# Verify build still passes
```

---

### Phase 2: INITIATING JULES SESSION

**Only after Phase 1 is complete:**

```bash
# For new session from current repo
jules remote new --repo . --session "Clear description of task

CONTEXT:
- Relevant context
- Dependencies
- Files to modify

REQUIREMENTS:
- Specific requirements
- Constraints
- Success criteria"

# OR for new session from remote repo
jules remote new --repo owner/repo --session "Task description"
```

**Immediately after:**
1. **Record the session ID** returned
2. **Update task tracking** with session ID
3. **Note the start time**
4. **Set timer** for 5+ minutes before first status check

**Example tracking:**
```markdown
### TASK-042: Implement Feature X
**Agent:** Jules
**Status:** INITIATED
**Session ID:** 9548686965274856921
**Started:** 2025-11-15 14:30
**Next Check:** 2025-11-15 14:35 (5 min wait)
**Description:** [Jules task description]
```

---

### Phase 3: MONITORING JULES SESSION

**Wait minimum 5 minutes before first check:**

```bash
# Check session status
jules remote pull --session 9548686965274856921

# OR check all sessions
jules remote list --session
```

**Possible states:**
- **"No diff found"** - Still in progress, wait another 5 minutes
- **Diff returned** - Session complete, ready to integrate
- **Error message** - Session failed, investigate

**While Jules is working:**
- ❌ **DO NOT** make changes to overlapping files locally
- ❌ **DO NOT** start another Jules session on same files
- ❌ **DO NOT** commit/push to areas Jules is working on
- ✅ **DO** work on completely independent files if needed
- ✅ **DO** wait patiently (sessions take 10-90 minutes)
- ✅ **DO** check status every 5-10 minutes

---

### Phase 4: INTEGRATING JULES WORK (CRITICAL)

**When Jules session shows complete (diff available):**

#### Step 1: Save Jules Diff
```bash
# Save diff to file for reference
jules remote pull --session 9548686965274856921 > jules_task_042.diff

# Review the diff
cat jules_task_042.diff
# OR
code jules_task_042.diff
```

**Why:** Having diff file allows recovery if integration fails.

#### Step 2: Verify Local State is Clean
```bash
git status
```

**Expected:** "working tree clean"

**If NOT clean:**
- You have local changes Jules doesn't know about
- **STOP** - Do NOT proceed
- Commit or stash local changes first
- Re-evaluate if there are conflicts

#### Step 3: Apply Jules Changes (METHOD A - Recommended for Review)

**Manual extraction (when you want to review/fix issues):**

```bash
# Read the diff to understand changes
cat jules_task_042.diff

# For each file in diff, manually extract:
# 1. Read file from diff
# 2. Create/edit file locally
# 3. Fix any TypeScript/import errors
# 4. Ensure service layer patterns followed
```

**Why:**
- Allows fixing Jules errors before committing
- Ensures code quality
- Catches type mismatches
- More control over integration

**This is what Claude Code did in this session - worked well!**

#### Step 3: Apply Jules Changes (METHOD B - Auto Apply)

**Automatic application (when you trust Jules output):**

```bash
# This attempts to apply diff automatically
jules remote pull --session 9548686965274856921 --apply
```

**⚠️ WARNING:**
- This modifies files directly
- May create merge conflicts
- May break TypeScript compilation
- Harder to review what changed

**Only use --apply if:**
- Jules session is for isolated new files
- You trust Jules output completely
- You're ready to fix any issues immediately

#### Step 4: Verify Integration

```bash
# Check what changed
git status
git diff

# Verify TypeScript compilation
npm run build
```

**If build fails:**
- Review errors carefully
- Fix TypeScript issues
- Check imports and types
- Verify service layer usage
- Run build again until passes

**Do NOT proceed until build passes!**

#### Step 5: Test Key Functionality (if applicable)

```bash
# Start dev server (ONLY if you can monitor it)
npm run dev

# Test the feature manually
# Verify no runtime errors in console
# Check that existing features still work

# Stop dev server (Ctrl+C)
```

---

### Phase 5: COMMITTING JULES WORK

**Only after build passes and testing is complete:**

```bash
# Stage changes
git add -A

# Commit with descriptive message
git commit -m "feat: Integrate TASK-042 [Feature Name] from Jules

COMPONENTS CREATED/MODIFIED:
- Component1.tsx: Description
- Service.ts: Description

FEATURES:
- Feature 1
- Feature 2

VERIFICATION:
- Build passed: X modules (✓)
- TypeScript strict mode (✓)

Session: Jules 9548686965274856921

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Verify commit
git log -1
git status
```

**Commit message format:**
- Start with conventional commit type
- List what changed
- Note session ID for traceability
- Include verification checklist

---

### Phase 6: PREPARING FOR NEXT TASK

**Before starting another Jules session or local work:**

```bash
# Push integrated work to remote
git push origin main

# Verify push succeeded
git status
```

**Expected:** "Your branch is up to date with 'origin/main'"

**Why:**
- Next Jules session needs latest code
- Other team members need your changes
- Remote is source of truth

**Now safe to:**
- Start another Jules session
- Continue local development
- Switch to other tasks

---

## 🔄 Multiple Concurrent Jules Sessions

**Can you run multiple Jules sessions at once?**

**✅ YES, if:**
- Sessions work on completely different files
- No overlapping functionality
- No shared dependencies

**❌ NO, if:**
- Sessions modify same files
- Sessions touch same features
- Unclear boundaries between work

**Best practice:**
- Run one Jules session at a time
- Integrate fully before starting next
- Reduces merge conflict risk

**If you MUST run parallel sessions:**

```bash
# Track sessions carefully
# TASK-042: Session 9548686965274856921 (Schedule feature)
# TASK-043: Session 11928338607257800173 (Admin panel)

# Integrate OLDEST session first
# Then integrate newer sessions
# Fix conflicts carefully
```

---

## ⚠️ Common Failure Scenarios & Recovery

### Scenario 1: Forgot to Push Before Jules

**Problem:** You started Jules session without pushing local changes.

**Symptoms:**
- Jules diff doesn't include your recent work
- Jules made changes based on old code
- Conflicts when integrating

**Recovery:**
```bash
# 1. Save Jules diff
jules remote pull --session [ID] > jules_session_backup.diff

# 2. DON'T apply it yet
# 3. Commit and push your local changes
git add .
git commit -m "feat: local work before Jules integration"
git push origin main

# 4. Review Jules diff
cat jules_session_backup.diff

# 5. Manually merge Jules changes with your changes
# 6. Fix conflicts carefully
# 7. Test thoroughly
```

### Scenario 2: Local Changes While Jules Running

**Problem:** You made local changes while Jules was working on overlapping files.

**Symptoms:**
- Git shows conflicts when integrating Jules
- Build fails after integration
- Functionality broken

**Recovery:**
```bash
# 1. Identify the conflict
git status

# 2. Decide priority:
#    - Keep local changes? Discard Jules work
#    - Keep Jules changes? Discard local work
#    - Merge both? Manual merge required

# 3. If merging both:
#    - Create backup: git stash
#    - Integrate Jules: jules remote pull --session [ID] --apply
#    - Apply local: git stash pop
#    - Resolve conflicts
#    - Test thoroughly

# 4. If keeping only one:
#    - Keep local: Don't integrate Jules (waste of session)
#    - Keep Jules: git restore . (lose local work)
```

**Prevention:** Don't work on overlapping areas during Jules session!

### Scenario 3: Jules Session Failed

**Problem:** Jules session shows error or never completes.

**Recovery:**
```bash
# 1. Check session status
jules remote pull --session [ID]

# 2. If error message shown:
#    - Read error carefully
#    - Identify what went wrong
#    - Fix prerequisites (missing files, incorrect context)

# 3. Start new session with fixes:
jules remote new --repo . --session "RETRY: [original task]

PREVIOUS ATTEMPT: Session [OLD_ID] failed because [reason]

CORRECTED CONTEXT:
[Fixed information]
..."

# 4. Update task tracking with new session ID
```

### Scenario 4: Applied Jules But Build Fails

**Problem:** Integrated Jules work but TypeScript errors prevent build.

**Recovery:**
```bash
# 1. Read error messages
npm run build 2>&1 | tee build_errors.log

# 2. Identify issues:
#    - Missing type imports
#    - Incorrect service layer usage
#    - Wrong import paths

# 3. Fix systematically:
#    - Fix one error at a time
#    - Run build after each fix
#    - Don't guess - read the errors

# 4. Common fixes:
#    - Add: import type { Type } from '@/types'
#    - Change: import Type → import type { Type }
#    - Fix: import '../../file' → import '@/path/file'
#    - Add: getDoc import from 'firebase/firestore'

# 5. When build passes:
#    - Commit the fixes
#    - Note what was fixed in commit message
```

### Scenario 5: Lost Track of Session ID

**Problem:** Jules session completed but you lost the session ID.

**Recovery:**
```bash
# List all recent sessions
jules remote list --session

# Sessions show:
# - Session ID
# - Status (complete/in progress)
# - Description (first line of task)

# Identify by description or timestamp
# Pull the diff to verify it's the right one
jules remote pull --session [SUSPECTED_ID]

# Review diff to confirm
# If correct, proceed with integration
```

---

## 📊 Jules Session Checklist

### Before Starting Jules:
- [ ] `git status` - verify local state
- [ ] `git add . && git commit` - commit local work
- [ ] `git push origin main` - push to remote
- [ ] `git status` - verify "up to date with origin/main"
- [ ] Record what Jules will work on
- [ ] Set timer for 5+ minute wait

### While Jules Running:
- [ ] Avoid overlapping files locally
- [ ] Check status every 5-10 minutes
- [ ] Note when session completes
- [ ] Don't start overlapping Jules sessions

### When Integrating Jules:
- [ ] Save diff to file: `jules remote pull --session [ID] > jules_task_X.diff`
- [ ] `git status` - verify local clean
- [ ] Review diff before applying
- [ ] Apply changes (manual or --apply)
- [ ] `npm run build` - verify build passes
- [ ] Test functionality
- [ ] `git add -A` - stage changes
- [ ] `git commit` - descriptive message with session ID
- [ ] `git push origin main` - push integrated work
- [ ] Update task tracking

---

## 🎯 Success Criteria

A Jules session is successfully integrated when:

✅ Build passes (`npm run build`)
✅ No TypeScript errors
✅ No runtime console errors
✅ Existing features still work
✅ New features work as expected
✅ Code follows project patterns
✅ Changes committed with session ID
✅ Changes pushed to remote
✅ Ready for next Jules session or local work

---

## 📝 Integration with Other Protocols

**This protocol integrates with:**

- **CLAUDE-CODE-STANDING-ORDERS.md** - When Claude Code integrates Jules work
- **GEMINI-STANDING-ORDERS.md** - When Gemini coordinates Jules sessions
- **MULTI-AGENT-WORKFLOW-SPECIFICATION.md** - Overall workflow context
- **ACTION-QUEUE.md** - Task tracking and status updates

**Key rule:** No matter which agent is working, **ALWAYS follow this Jules protocol**.

---

## 🔧 Quick Reference Commands

```bash
# PRE-JULES
git status && git add . && git commit -m "msg" && git push origin main

# START JULES
jules remote new --repo . --session "task description"

# CHECK STATUS (wait 5+ min first)
jules remote pull --session [ID]

# SAVE DIFF
jules remote pull --session [ID] > jules_task_X.diff

# APPLY (after local clean)
jules remote pull --session [ID] --apply

# VERIFY
npm run build

# COMMIT
git add -A && git commit -m "feat: integrate Jules [ID]" && git push origin main
```

---

## 🎓 Training Points

**When training new agents on Jules:**

1. **Emphasize:** Jules works on remote, not local
2. **Drill:** Must push before Jules, must integrate before continuing
3. **Practice:** Run through full workflow on dummy task
4. **Verify:** Agent can recite the pre-Jules checklist
5. **Test:** Give scenarios and ask for recovery procedure

**Common mistakes to prevent:**
- Starting Jules without pushing
- Working locally while Jules running
- Applying Jules without reviewing
- Committing Jules work without build verification
- Forgetting to push after integration

---

**This is the definitive Jules workflow protocol. All agents must follow these steps exactly to prevent conflicts, data loss, and wasted Jules sessions.**

---

**Last Updated:** 2025-11-15
