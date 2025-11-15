# Claude Desktop Standing Orders

**Last Updated:** 2025-11-15
**Purpose:** Permanent operational procedures for Claude Desktop when serving as GymApp project lead

---

## 🗂️ Task List Management & Archiving Procedure

### Archive Triggers

Execute archiving procedure when **ANY** of the following conditions are met:

1. **Size Limit:** `tasklist.md` exceeds 2000 lines
2. **Task Count:** Total tasks exceed 50 (excluding archived)
3. **Phase Completion:** Two complete phases have finished since last archive
4. **Token Pressure:** Context window approaching limits during task operations

### Archiving Procedure

#### Step 1: Identify Tasks to Archive

```
Completed tasks to archive = Total Completed Tasks - 10

Keep with full content:
- Latest 10 completed tasks
- All tasks in current phase (regardless of status)
- All tasks in next planned phase
```

#### Step 2: Archive Format

For each task being archived, reduce to single-line format:

```markdown
**TASK-XXX:** Task Name, Brief description (max 80 chars), STATUS
```

**Example:**
```markdown
**TASK-026:** Create Firebase Service Layer, Abstract Firebase operations from components, COMPLETE
```

#### Step 3: File Operations

1. **Read current `tasklist.md`** - Extract tasks to be archived
2. **Update `tasklist-archive.md`** - Append archived tasks to appropriate phase section
3. **Update `tasklist.md`** - Remove archived task full content, keep only task numbers for reference

#### Step 4: Archive File Structure

`tasklist-archive.md` should maintain:

```markdown
# GymApp Task Archive

**Last Archive Date:** [Current Date]
**Archived Tasks:** TASK-XXX through TASK-YYY

---

## Phase N: Phase Name (STATUS)

**TASK-XXX:** Name, Description, STATUS
**TASK-YYY:** Name, Description, STATUS
[... more tasks ...]

---

## Archive Notes
- Summary of archived phase
- Total tasks archived
- Reference to git commits for implementation details
```

#### Step 5: Update Task List Header

Update `tasklist.md` header with:
- New last updated date
- Updated archive reference
- Current task count
- File size if approaching limits

#### Step 6: Verification

After archiving:
- [ ] Verify `tasklist-archive.md` properly updated
- [ ] Verify `tasklist.md` size reduced appropriately
- [ ] Verify latest 10 completed tasks retained with full content
- [ ] Verify current and next phase tasks retained with full content
- [ ] Verify archive references updated in headers
- [ ] Build and verify project still functions
- [ ] Commit changes with descriptive message

### Commit Message Format

```
chore: archive tasks TASK-XXX to TASK-YYY

- Archived [N] completed tasks to tasklist-archive.md
- Retained latest 10 completed tasks with full content
- Current tasklist.md size: [SIZE] lines
- Phase [X] tasks: [N] remaining
```

---

## 📝 Adding New Phase Tasks

### When to Add New Phase

Add new phase tasks when:
1. Current phase is 80%+ complete
2. Next phase architecture is well-defined
3. Dependencies are clear
4. Agent assignments can be determined

### New Phase Task Template

```markdown
## 🎯 PHASE X: PHASE NAME (STATUS)

**Status:** Planned / In Progress / Complete
**Total Tasks:** [N] ([X] Claude + [Y] Jules + [Z] Gemini)
**Purpose:** [One-line phase purpose]

---

### TASK-XXX: Task Name
**Agent:** [Claude Desktop / Jules / Gemini]
**Alternative Agents:** [List acceptable alternatives]
**Status:** PLANNED / READY_FOR_EXECUTION / IN_PROGRESS / COMPLETE
**Dependencies:** [Task numbers or "None"]
**Estimated Duration:** [Time estimate]
**Priority:** CRITICAL / HIGH / MEDIUM / LOW

**Description:**
[Clear description of what needs to be done]

**Components/Files Affected:**
- file1.tsx
- file2.ts
- etc.

**Key Requirements:**
- Requirement 1
- Requirement 2

**Verification Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

**Result:**
_[Populated after completion or "Pending execution"]_

---
```

### Agent Selection Guidelines

**Claude Desktop (Preferred for):**
- Architecture decisions and refactoring
- Code review and systematic audits
- Documentation creation
- Complex logic that requires deep reasoning
- Multi-file coordination without execution
- Security and accessibility reviews

**Jules (Preferred for):**
- Complex multi-file implementations
- New feature development
- UI component creation
- Service layer implementation
- Integration of multiple systems
- Tasks requiring 30+ minutes of focused coding

**Gemini CLI (Preferred for):**
- Git operations and commits
- Build verification
- Task coordination and monitoring
- Quick file edits and updates
- Status report updates
- Integration of Jules outputs
- Sequential simple tasks

**Alternative Agent Clause:**
Include in each task:
```markdown
**Alternative Agents:** [Agent1: "if reason", Agent2: "if reason"]
```

Example:
```markdown
**Alternative Agents:** 
- Claude Desktop: "if Jules unavailable or task complexity lower than estimated"
- Gemini: "if task can be broken into smaller sequential steps"
```

---

## 🔄 Context Window Management

### When Approaching Token Limits

**Signs of token pressure:**
- Responses include truncated code
- Tool calls fail with size errors
- "Context too large" warnings
- Difficulty loading full task list

**Immediate Actions:**

1. **Archive completed tasks** following archiving procedure
2. **Split large tasks** into smaller subtasks
3. **Move detailed specifications** to separate files and reference by path
4. **Compress verbose descriptions** to essential information only
5. **Link to git commits** for implementation details instead of repeating

### Preventative Measures

**Task Description Length:**
- Keep descriptions under 500 words
- Use bullet points instead of paragraphs where possible
- Link to external docs for detailed specifications

**Phase Planning:**
- Max 15-20 tasks per phase
- Break larger phases into sub-phases if needed
- Archive immediately after phase completion

**File References:**
- Instead of: "Create component with [500 lines of specification]"
- Use: "Create component per specification in `docs/component-spec.md`"

---

## 🎯 Task Status Definitions

**PLANNED** - Task defined but not ready for execution (dependencies incomplete)
**READY_FOR_JULES** - Ready for Jules execution (all dependencies met, spec complete)
**READY_FOR_EXECUTION** - Ready for any assigned agent
**IN_PROGRESS** - Currently being worked on
**REQUIRES_RE_RUN** - Previous execution incomplete, needs fresh attempt
**PENDING** - Waiting on external factor (Jules completion, manual testing, etc.)
**COMPLETE** - Successfully completed and verified

---

## 🔍 Task Monitoring Procedures

### For Jules Tasks

1. **Before Execution:**
   - Verify all dependencies complete
   - Confirm Firebase credentials available if needed
   - Note previous Jules session ID if re-running
   - Document what partial work exists

2. **During Execution:**
   - Monitor via Jules CLI: `jules remote list`
   - Watch for completion notifications
   - Track session ID for integration

3. **After Completion:**
   - Pull session: `jules remote pull --session [ID]`
   - Review changes before applying
   - Verify with `npm run build`
   - Integrate and commit via Gemini if successful
   - Update task status in tasklist.md

### For Gemini Tasks

1. **Task Assignment:**
   - Provide clear checklist format
   - Include specific commands to run
   - Define success criteria

2. **Monitoring:**
   - Review Gemini output for completeness
   - Verify git commits occurred
   - Check build status

### For Claude Desktop Tasks

1. **Self-Monitoring:**
   - Update task status as you progress
   - Document decisions made
   - Note any deviations from plan
   - Update STATUS-REPORT.md if significant

---

## 📊 Progress Tracking

### Update Frequency

**Daily (if active development):**
- Task status updates in tasklist.md
- Current blockers documented

**After Each Phase:**
- Update STATUS-REPORT.md
- Archive completed tasks if needed
- Add next phase tasks
- Update project health status

**After Each Jules Session:**
- Update task status
- Document integration results
- Note any issues for future reference

### Status Report Integration

After major milestones, update `STATUS-REPORT.md`:
- Current phase progress percentage
- Completed task count
- Known issues
- Next steps
- Project health (GREEN/YELLOW/RED)

---

## 🚨 Emergency Procedures

### If Task List Becomes Unmanageable

1. **Immediate Archive:** Archive all completed tasks, keep only latest 5
2. **Phase Consolidation:** Move all future phase tasks to separate planning doc
3. **Focus on Current:** Keep only current phase tasks in main list
4. **Link Strategy:** Replace detailed descriptions with links to external docs

### If Context Window Exceeded Mid-Task

1. **Save Current State:** Commit any work in progress
2. **Archive Immediately:** Follow emergency archive procedure
3. **Continue in New Context:** Reference archived tasks by number only
4. **Update Standing Orders:** Document what triggered the issue

### If Git History Needed for Archived Tasks

```bash
# Find commit for specific task
git log --all --grep="TASK-XXX" --oneline

# View full commit
git show [commit-hash]

# View files changed in commit
git show [commit-hash] --name-only
```

---

## 🔐 Security & Safety

### Never Archive

- Security audit results with specific vulnerabilities
- API keys or credentials
- User data or PII
- Active bugs in CRITICAL status

### Always Verify Before Archiving

- [ ] All code committed to git
- [ ] Build passes
- [ ] No active blockers
- [ ] Status report updated
- [ ] Dependencies documented for future tasks

---

## 📚 File Organization Standards

### Dev Pipeline Directory Structure

```
.dev-pipeline/
├── tasklist.md                           # Current tasks
├── tasklist-archive.md                   # Historical tasks
├── STATUS-REPORT.md                      # Current project status
├── ACTION-QUEUE.md                       # Immediate action items
├── CLAUDE-DESKTOP-STANDING-ORDERS.md     # This file
├── GEMINI-STANDING-ORDERS.md             # Gemini procedures
├── JULES-WORKFLOW-PROTOCOL.md            # Jules procedures
├── MULTI-AGENT-WORKFLOW-SPECIFICATION.md # Agent selection matrix
└── [phase-specific-docs]/                # Detailed specs
```

### When to Create New Documents

**Create new doc when:**
- Specification exceeds 1000 words
- Multiple tasks reference same detailed requirements
- Architecture decisions need detailed explanation
- Workflow becomes too complex for task description

**Link format in tasks:**
```markdown
**Detailed Specification:** See `docs/[spec-name].md`
**Architecture Decision:** See `docs/architecture/[decision-name].md`
```

---

## ✅ Pre-Archive Checklist

Before executing archiving procedure:

- [ ] Current phase is marked COMPLETE or at least 80% done
- [ ] All archived tasks have STATUS of COMPLETE
- [ ] Latest 10 completed tasks identified correctly
- [ ] Git working directory is clean (no uncommitted changes)
- [ ] Build passes: `npm run build`
- [ ] STATUS-REPORT.md is up to date
- [ ] Next phase tasks are defined (if adding new phase)
- [ ] Archive file has proper headers and structure

---

## 📖 References

**Related Documents:**
- `tasklist.md` - Current task list
- `tasklist-archive.md` - Historical tasks
- `STATUS-REPORT.md` - Project status
- `MULTI-AGENT-WORKFLOW-SPECIFICATION.md` - Agent selection guide

**Git Commands:**
```bash
# View recent commits
git log --oneline -20

# View task-specific commits
git log --grep="TASK-" --oneline

# View files in commit
git show [commit-hash] --name-only
```

---

## 🔄 Version History

**v1.0** - 2025-11-15 - Initial creation
- Established archiving procedures
- Defined task management standards
- Created emergency procedures
- Set up context window management guidelines

---

**END OF STANDING ORDERS**
