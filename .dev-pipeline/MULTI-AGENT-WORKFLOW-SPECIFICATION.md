# Multi-Agent Development Workflow Specification

**Version:** 1.0  
**Last Updated:** 2025-11-05  
**Purpose:** Complete specification for implementing the Claude-Gemini-Jules collaborative development workflow

---

## 🎯 Executive Summary

This document defines a proven multi-agent development workflow where:
- **Claude** acts as the chief architect and orchestrator
- **Gemini CLI** serves as the rapid information gatherer and agent coordinator  
- **Jules** handles complex, asynchronous implementation tasks

The workflow centers around a `.dev-pipeline/` directory that serves as a shared communication hub, enabling seamless handoffs between agents and maintaining clear project state.

---

## 📐 Core Architectural Principles

### 1. Agent Hierarchy & Responsibilities

```
┌─────────────────────────────────────────────┐
│   CLAUDE (Chief Architect & Orchestrator)   │
│   - High-level planning & strategy          │
│   - Feature design & specifications         │
│   - Quality review & decision-making        │
└──────────────┬──────────────────────────────┘
               │ Strategic Direction
               ▼
┌─────────────────────────────────────────────┐
│   GEMINI CLI (Information Coordinator)      │
│   - Quick information retrieval             │
│   - Agent instruction & coordination        │
│   - Status monitoring & verification        │
│   - Git operations & checkpoints            │
└──────────────┬──────────────────────────────┘
               │ Task Instructions
               ▼
┌─────────────────────────────────────────────┐
│   JULES (Asynchronous Implementation)       │
│   - Complex multi-file implementations      │
│   - Broad context code generation           │
│   - Architecture-wide refactoring           │
│   - Asynchronous remote execution           │
└─────────────────────────────────────────────┘
```

### 2. Communication Channel: The `.dev-pipeline/` Directory

The `.dev-pipeline/` folder is the central nervous system of the workflow:

**Purpose:**
- Serves as a persistent communication hub between agents
- Maintains project state across sessions
- Tracks task progress and agent handoffs
- Stores strategic documents and action queues

**Critical Property:**
- **Excluded from version control** via `.gitignore`
- Prevents pollution of git history with agent coordination artifacts
- Allows free-form agent communication without commit overhead

**Key Files:**
```
.dev-pipeline/
├── ACTION-QUEUE.md              # Immediate next actions
├── GEMINI-CONTINUE-INSTRUCTIONS.md  # Recovery instructions for Gemini
├── STATUS-REPORT.md             # Current project state
├── STRATEGIC-QUESTIONS.md       # Open decisions needing input
├── [feature]-tasks.md           # Task breakdowns for features
└── checkup.md                   # Health check reference
```

---

## 🔄 The Workflow Cycle

### Phase 1: Strategic Planning (Human + Claude)

**Participants:** Human Developer, Claude  
**Duration:** Variable (hours to days)  
**Outputs:** Feature specifications, task breakdowns

**Process:**
1. Human presents project goal or feature request to Claude
2. Claude engages in collaborative brainstorming and architectural design
3. Together, they break down the work into discrete, atomic tasks
4. Claude generates a task specification file (e.g., `feature-X-tasks.md`)
5. Task file is saved to `.dev-pipeline/` directory

**Task File Structure:**
```markdown
# Feature X - Task Breakdown

## Task List

### TASK-001: [Brief Description]
**Agent:** [Gemini|Jules]
**Status:** PENDING
**Description:** Detailed task description

**Instructions:**
- Step 1
- Step 2
- Verification steps

**Result:**
_Pending execution_

### TASK-002: ...
```

**Key Principles:**
- Tasks should be atomic (single responsibility)
- Dependencies should be explicit and ordered
- Each task should have clear verification criteria
- Include Git checkpoint tasks at logical milestones

---

### Phase 2: Task Assignment (Human → Gemini)

**Participants:** Human Developer, Gemini CLI  
**Duration:** Seconds to minutes  
**Outputs:** Task initiation, agent coordination

**Process:**
1. Human instructs Gemini CLI to execute tasks from the pipeline
2. Gemini reads the task file from `.dev-pipeline/`
3. Gemini determines appropriate agent (self vs Jules) based on task type
4. For Gemini tasks: Execute immediately and update status
5. For Jules tasks: Formulate and dispatch instructions to Jules

**Decision Matrix - Gemini vs Jules:**

| Task Characteristics | Assign To |
|---------------------|-----------|
| Single file creation/modification | Gemini |
| Quick information gathering | Gemini |
| Git operations (commit, push, status) | Gemini |
| File verification (exists, contains) | Gemini |
| Multi-file scaffolding | Jules |
| Complex implementation (>5 files) | Jules |
| Architecture-wide changes | Jules |
| Requires broad codebase context | Jules |

**Example Gemini Command:**
```bash
gemini "Execute TASK-001 from .dev-pipeline/feature-X-tasks.md"
```

---

### Phase 3: Asynchronous Execution (Jules)

**Participants:** Gemini CLI, Jules  
**Duration:** Minutes to hours (asynchronous)  
**Outputs:** Completed implementations, session IDs

**Jules Task Lifecycle:**

```
1. INITIATION
   ├─ Gemini: `jules new "[task description]"`
   ├─ Jules: Returns session ID (e.g., 2889372153784130901)
   └─ Gemini: Updates task status to INITIATED, logs session ID

2. MONITORING (THE CHALLENGE)
   ├─ Gemini: `jules remote list --session`
   ├─ Check session status: "in progress" | "complete" | "failed"
   └─ ⚠️ CRITICAL: Wait between checks (300 seconds minimum)

3. COMPLETION
   ├─ Jules: Completes work, marks session as "complete"
   ├─ Gemini: Detects completion via status check
   └─ Gemini: Ready to pull results

4. INTEGRATION
   ├─ Gemini: `jules remote pull --session [ID] --apply`
   ├─ Code changes applied to local repository
   ├─ Gemini: Verify changes with `git diff`
   └─ Gemini: Update task status to EXECUTED
```

**Key Jules Commands:**

```bash
# Create new session
jules new "task description here"

# List all sessions
jules remote list --session

# Check specific session status
jules remote status --session [SESSION_ID]

# View session logs
jules remote logs --session [SESSION_ID]

# Pull completed work (without applying)
jules remote pull --session [SESSION_ID]

# Pull and apply to local repo
jules remote pull --session [SESSION_ID] --apply
```

---

### Phase 4: The Async Challenge & Solution

**THE PROBLEM:**
- Jules works asynchronously (takes minutes to hours)
- Gemini has no native "wait and check later" capability
- Gemini would repeatedly check Jules status, overwhelming the API
- No graceful handling when Gemini crashes mid-monitoring

**SOLUTION COMPONENTS:**

#### 4.1 Explicit Wait Commands
```powershell
# After initiating Jules task
Start-Sleep -Seconds 300  # Wait 5 minutes before first check

# Between status checks
Start-Sleep -Seconds 300  # Wait 5 minutes between checks
```

#### 4.2 Status Tracking in Task Files
```markdown
### TASK-008: Set Up API Gateway
**Agent:** Jules
**Status:** INITIATED
**Jules Session:** 2889372153784130901
**Initiated:** 2025-11-03 14:30
**Last Checked:** 2025-11-03 14:40

**Result:**
_Awaiting completion. Next check at 14:50._
```

#### 4.3 Recovery Instructions File
When Gemini crashes or loses context, it can resume by reading `GEMINI-CONTINUE-INSTRUCTIONS.md`:

```markdown
# Instructions for Gemini CLI - Continue Processing

## Current Status
- **Last Task:** TASK-008 (API Gateway) - Jules session 2889372153784130901 INITIATED
- **Next Task:** Check completion, then proceed to TASK-009

## Immediate Actions Required

### Step 1: Check Jules Session Status
```bash
jules remote status --session 2889372153784130901
```

**If complete:**
- Update TASK-008 status to EXECUTED
- Proceed to TASK-009

**If still running:**
- Wait 5 minutes: Start-Sleep -Seconds 300
- Check again
```

**This file provides:**
- Current state snapshot
- Next actions to take
- Session IDs to check
- Recovery procedures

---

### Phase 5: Integration & Verification (Gemini)

**Participants:** Gemini CLI  
**Duration:** Minutes  
**Outputs:** Verified implementations, updated task files

**Process:**

1. **Pull Jules Work**
   ```bash
   jules remote pull --session [ID] --apply
   ```

2. **Verify Changes**
   ```bash
   git status
   git diff
   ```

3. **Review for Issues**
   - Check for unexpected file changes
   - Verify no files were deleted incorrectly
   - Ensure new files are present and correct
   - Check for merge conflicts

4. **Update Task File**
   ```markdown
   ### TASK-008: Set Up API Gateway
   **Status:** ✅ EXECUTED
   **Result:** Completed at 2025-11-03 15:45. Jules session 2889372153784130901 pulled successfully. API Gateway structure verified in services/api-gateway/.
   ```

5. **Optional: Run Verification Commands**
   ```bash
   # Check files exist
   ls services/api-gateway/
   
   # Try building
   pnpm build
   
   # Run tests
   pnpm test
   ```

---

### Phase 6: Git Checkpoints (Gemini)

**Participants:** Gemini CLI  
**Duration:** Seconds  
**Outputs:** Committed progress, clean git history

**Checkpoint Strategy:**
- Commit at logical milestones (every 3-5 tasks)
- Use conventional commit format
- Push after each checkpoint
- Verify push success before proceeding

**Checkpoint Task Example:**
```markdown
### TASK-009: 💾 COMMIT CHECKPOINT - Foundation Complete
**Agent:** Gemini
**Status:** PENDING
**Description:** CRITICAL - Commit all foundation work

**Instructions:**
```bash
git status                    # Review changes
git add .                     # Stage all
git commit -m "feat: complete foundation infrastructure

- Scaffold all 10 core modules
- Install root dependencies
- Configure shared TypeScript settings
- Implement API Gateway

This commit establishes the monorepo foundation."

git push origin master        # Push to remote
git status                    # Verify clean
```
```

**Commit Message Format:**
```
<type>: <short description>

- Bullet point of what changed
- Another change
- Another change

<Additional context or reasoning>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## 🛠️ Tool Specifications

### Gemini CLI Capabilities

**Best For:**
- Executing shell commands
- Reading/writing files (especially markdown)
- Git operations
- Quick information retrieval
- Status checking and verification
- Coordinating other agents

**Commands:**
```bash
# Basic usage
gemini "prompt here"

# With file references
gemini -p "Read .dev-pipeline/tasks.md and execute TASK-001"

# Piping output to Jules
gemini -p "find hardest issue" | jules new
```

**Limitations:**
- Cannot execute asynchronous waiting natively
- Loses context if crashed or interrupted
- Must explicitly wait between operations

---

### Jules Capabilities

**Best For:**
- Multi-file scaffolding
- Complex implementations requiring broad context
- Architecture-wide refactoring
- Asynchronous work that takes time

**Key Features:**
- Remote execution (doesn't block Gemini)
- Full repository context
- Can handle large codebases
- Returns session ID for tracking

**Session Management:**
```bash
# Create session
jules new "implement authentication service"
# Returns: Session created: 4933882015444625191

# List all sessions
jules remote list --session
# Shows all sessions with status

# Check specific session
jules remote status --session 4933882015444625191
# Returns: complete | in progress | failed

# Pull without applying (preview)
jules remote pull --session 4933882015444625191

# Pull and apply to local
jules remote pull --session 4933882015444625191 --apply
```

**Best Practices:**
- Always log session IDs immediately
- Include session ID in task file
- Wait at least 5 minutes before first status check
- Don't check status more than once per 5 minutes

---

### Claude Capabilities

**Best For:**
- High-level architectural planning
- Feature design and specification
- Breaking down complex problems
- Reviewing implementations
- Making strategic decisions

**Working Mode:**
- Conversational interface
- Can see full conversation history
- Excels at reasoning and planning
- Can generate detailed specifications

**Limitations:**
- Cannot directly execute commands
- Needs Gemini or Jules to implement plans
- Works best in planning phase

---

## 📋 Standard Operating Procedures

### SOP 1: Starting a New Feature

1. **Discuss with Claude**
   - Describe the feature goal
   - Collaborate on approach
   - Define success criteria

2. **Generate Task Breakdown**
   - Claude creates task file
   - Save to `.dev-pipeline/feature-name-tasks.md`
   - Include verification steps

3. **Review with Human**
   - Human approves task breakdown
   - Adjustments made if needed

4. **Begin Execution**
   - Instruct Gemini to start tasks
   - Monitor progress via task file updates

---

### SOP 2: Handling Jules Tasks

1. **Initiation**
   ```bash
   gemini "Execute TASK-X from .dev-pipeline/tasks.md"
   ```
   - Gemini dispatches to Jules
   - Logs session ID in task file
   - Marks status as INITIATED

2. **Monitoring**
   ```bash
   # After 5 minutes
   jules remote status --session [ID]
   ```
   - Check if complete
   - If not, wait another 5 minutes
   - Update "Last Checked" timestamp in task file

3. **Completion**
   ```bash
   jules remote pull --session [ID] --apply
   git status
   git diff
   ```
   - Pull and apply changes
   - Review changes carefully
   - Update task status to EXECUTED

4. **Checkpoint**
   - Commit changes at next checkpoint task
   - Push to remote
   - Verify success

---

### SOP 3: Recovering from Interruption

**When Gemini crashes or loses context:**

1. **Read Recovery Instructions**
   ```bash
   gemini "Read .dev-pipeline/GEMINI-CONTINUE-INSTRUCTIONS.md and execute"
   ```

2. **Check Jules Status**
   - Identify any in-progress Jules sessions
   - Check their completion status
   - Pull completed work

3. **Resume from Last Checkpoint**
   - Find last executed task
   - Continue with next pending task
   - Update STATUS-REPORT.md

4. **Verify State**
   ```bash
   git status                  # Check for uncommitted work
   jules remote list --session # Check for pending sessions
   ```

---

### SOP 4: Quality Checkpoints

**Before Each Git Commit:**

1. **Review Changes**
   ```bash
   git status
   git diff
   ```

2. **Verification Checks**
   ```bash
   pnpm install    # Dependencies up to date
   pnpm build      # Project compiles
   pnpm test       # Tests pass
   ```

3. **Task File Updates**
   - All completed tasks marked EXECUTED
   - Session IDs logged
   - Results documented

4. **Commit & Push**
   - Use conventional commit format
   - Include meaningful commit message
   - Verify push success

---

## 🚨 Known Issues & Solutions

### Issue 1: Gemini Polling Overload

**Problem:**  
Gemini repeatedly checks Jules status without waiting, overwhelming the API.

**Solution:**
- Explicit `Start-Sleep` commands between checks
- Minimum 5-minute (300 second) waits
- Track "Last Checked" timestamp in task files

**Implementation:**
```markdown
## In task file
**Last Checked:** 2025-11-03 14:45
**Next Check:** 2025-11-03 14:50 (after 5-min wait)

## In Gemini instructions
After checking status:
Start-Sleep -Seconds 300
Then check again
```

---

### Issue 2: Gemini Crashes Mid-Process

**Problem:**  
Gemini loses context when crashed, doesn't know what was happening.

**Solution:**
- Maintain `GEMINI-CONTINUE-INSTRUCTIONS.md`
- Update file after each significant action
- Include current state, Jules session IDs, next steps

**Prevention:**
- Checkpoint often
- Keep instructions file current
- Log all Jules session IDs immediately

---

### Issue 3: Jules Session Lost

**Problem:**  
Lost track of which Jules session was for which task.

**Solution:**
- Always log session ID immediately in task file
- Use descriptive task descriptions when creating Jules sessions
- Maintain session ID log in task file

**Format:**
```markdown
**Jules Session:** 4933882015444625191
**Initiated:** 2025-11-03 14:30
**Description:** "implement authentication service with JWT and RBAC"
```

---

### Issue 4: Merge Conflicts from Jules

**Problem:**  
Jules modifies files that were changed locally, causing conflicts.

**Solution:**
- Always pull latest before starting Jules task
- Review git status before dispatching to Jules
- Commit local changes before Jules execution

**Recovery:**
```bash
git status              # Identify conflicts
git diff                # Review conflicts
# Manually resolve conflicts
git add [resolved-files]
git commit -m "fix: resolve merge conflicts from Jules pull"
```

---

### Issue 5: No Procedure for Unexpected Agent Behavior

**Problem:**  
When agents behave unexpectedly (hang, error, incorrect output), no clear procedure.

**Current Status:** ⚠️ UNRESOLVED  
**Priority:** HIGH  
**Next Level of Organization Needed**

**Proposed Solutions to Develop:**

1. **Error Classification System**
   - Define error categories (timeout, invalid output, crash, etc.)
   - Create response procedures for each category

2. **Agent Health Checks**
   - Periodic verification that agents are responsive
   - Fallback procedures when agent unavailable

3. **Manual Override Procedures**
   - When to intervene manually
   - How to safely take over from agent
   - How to hand back to agent after manual work

4. **Rollback Procedures**
   - When to rollback changes
   - How to safely revert Jules work
   - Re-running tasks after failure

5. **Escalation Path**
   - When to stop automated workflow
   - When to consult human
   - When to abandon current approach

**Action Item:** Develop comprehensive error handling specification as next workflow evolution.

---

## 📊 Success Metrics

### Workflow Efficiency

- **Task Completion Rate:** % of tasks completed without manual intervention
- **Agent Uptime:** % of time agents are responsive and functional
- **Recovery Time:** Average time to recover from agent interruption
- **Commit Quality:** % of commits that don't require immediate fixes

### Quality Indicators

- **Build Success:** % of commits that build successfully
- **Test Pass Rate:** % of test runs that pass after agent work
- **Merge Conflict Rate:** How often Jules creates conflicts
- **Manual Fix Rate:** % of Jules work requiring manual correction

### Process Metrics

- **Average Task Duration:** Time from initiation to EXECUTED
- **Jules Session Success Rate:** % of Jules sessions that complete successfully
- **Checkpoint Frequency:** Commits per feature (target: 1 per 3-5 tasks)
- **Documentation Currency:** How often task files accurately reflect reality

---

## 🔧 Implementation Checklist

### Setup Phase

- [ ] Create `.dev-pipeline/` directory
- [ ] Add `.dev-pipeline/` to `.gitignore`
- [ ] Create initial template files:
  - [ ] ACTION-QUEUE.md
  - [ ] GEMINI-CONTINUE-INSTRUCTIONS.md
  - [ ] STATUS-REPORT.md
  - [ ] STRATEGIC-QUESTIONS.md
- [ ] Verify Gemini CLI installed and working
- [ ] Verify Jules CLI installed and authenticated
- [ ] Test Jules session creation and pulling

### Operational Phase

- [ ] Human + Claude define first feature
- [ ] Claude generates task breakdown
- [ ] Save task file to `.dev-pipeline/`
- [ ] Gemini begins executing tasks
- [ ] Monitor Jules sessions with proper wait times
- [ ] Commit at checkpoints
- [ ] Update STATUS-REPORT.md regularly
- [ ] Maintain GEMINI-CONTINUE-INSTRUCTIONS.md

### Optimization Phase

- [ ] Review success metrics
- [ ] Identify bottlenecks in workflow
- [ ] Refine task breakdowns based on learnings
- [ ] Improve error recovery procedures
- [ ] Document lessons learned
- [ ] Update this specification with improvements

---

## 🎓 Training a New Agent on This Workflow

### Onboarding Steps

1. **Read This Document**
   - Full specification understanding
   - Understand agent roles clearly
   - Know the `.dev-pipeline/` directory purpose

2. **Review Example Task File**
   - See `module-scaffolding-tasks.md` as reference
   - Note task structure
   - Understand status progression

3. **Practice Session**
   - Execute a simple task end-to-end
   - Create a Jules session
   - Monitor and pull results
   - Commit changes

4. **Shadow Existing Work**
   - Review existing task files
   - See how tasks were broken down
   - Observe commit patterns

5. **First Solo Feature**
   - Start with small feature
   - Work through full cycle
   - Document issues encountered

### Key Principles to Internalize

- **Claude leads strategy, not execution**
- **Gemini coordinates, doesn't implement deeply**
- **Jules handles broad context, not quick tasks**
- **`.dev-pipeline/` is communication hub**
- **Wait between Jules checks (5+ minutes)**
- **Commit at checkpoints, not after every task**
- **Update task files immediately after actions**
- **Maintain GEMINI-CONTINUE-INSTRUCTIONS.md**

---

## 🔮 Future Enhancements

### Planned Improvements

1. **Automated Jules Monitoring**
   - Script that polls Jules at proper intervals
   - Notifications when sessions complete
   - Automatic status updates in task files

2. **Workflow Orchestration Tool**
   - CLI tool to manage entire workflow
   - Handles agent coordination automatically
   - Built-in recovery procedures

3. **Error Classification & Response**
   - Comprehensive error taxonomy
   - Automated error detection
   - Predefined response procedures
   - Self-healing capabilities

4. **Metrics Dashboard**
   - Real-time workflow health
   - Success rate tracking
   - Bottleneck identification
   - Performance trends

5. **Enhanced Recovery**
   - Automatic context reconstruction
   - Checkpoint restoration
   - Session replay capability
   - State verification tools

---

## 📞 Support & Troubleshooting

### When Things Go Wrong

**Step 1: Check Current State**
```bash
# What's the git state?
git status

# Any in-progress Jules sessions?
jules remote list --session

# What was last completed task?
# Check task file in .dev-pipeline/
```

**Step 2: Consult Recovery Instructions**
```bash
# Read the continue file
cat .dev-pipeline/GEMINI-CONTINUE-INSTRUCTIONS.md
```

**Step 3: Verify Agent Availability**
```bash
# Can Gemini respond?
gemini "test message"

# Can Jules create sessions?
jules remote list --session
```

**Step 4: Manual Intervention**
- If agents unresponsive, work manually
- Document what was done manually
- Update task file to reflect manual work
- Restore agent workflow when able

---

## 📝 Appendix: File Templates

### Template: Feature Task File

```markdown
# [Feature Name] - Task Breakdown

**Created:** [Date]
**Owner:** [Human Name]
**Target Completion:** [Date]

---

## Feature Overview

[Brief description of what this feature does]

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## Task List

### TASK-001: [Task Name]
**Agent:** [Gemini|Jules]
**Status:** PENDING
**Dependencies:** None
**Estimated Duration:** [Time]

**Description:**
[Detailed description]

**Instructions:**
- Step 1
- Step 2
- Verification: [how to verify]

**Result:**
_Pending execution_

---

### TASK-002: 💾 COMMIT CHECKPOINT
**Agent:** Gemini
**Status:** PENDING

**Instructions:**
```bash
git add .
git commit -m "[conventional commit message]"
git push origin master
```

---

## Progress Tracking

- [ ] TASK-001
- [ ] TASK-002
[etc.]

---

## Notes & Learnings

[Space for documenting issues, solutions, improvements]
```

---

### Template: STATUS-REPORT.md

```markdown
# [Project Name] - Status Report

**Generated:** [Date & Time]
**Reporter:** [Agent Name]

---

## Current Status

[One-line summary]

---

## Completed Tasks

### [Task Name]
- **Completed:** [Date]
- **Agent:** [Gemini|Jules]
- **Notes:** [Brief notes]

---

## In Progress

### [Task Name]
- **Agent:** [Agent]
- **Jules Session:** [ID if applicable]
- **Started:** [Date]
- **Status:** [Status]

---

## Pending Tasks

### [Task Name]
- **Dependencies:** [What must complete first]
- **Estimated Start:** [Date]

---

## Issues & Blockers

### [Issue Description]
- **Impact:** [High|Med|Low]
- **Action:** [What needs to happen]

---

## Next Steps

1. [Action 1]
2. [Action 2]
3. [Action 3]

---

## Metrics

- **Tasks Completed:** X/Y
- **Jules Sessions:** X active, Y complete
- **Git Commits:** X
- **Project Health:** [Green|Yellow|Red]
```

---

### Template: GEMINI-CONTINUE-INSTRUCTIONS.md

```markdown
# Instructions for Gemini CLI - Continue Processing

**Last Updated:** [Date & Time]

---

## Current Status

- **Last Task:** [TASK-ID] ([Description]) - [Status]
- **Jules Session:** [Session ID] [Status]
- **Next Task:** [TASK-ID]

---

## Immediate Actions Required

### Step 1: [Action Name]
```bash
[command to run]
```

**Expected Outcome:**
[What should happen]

**If Success:** [Next step]
**If Failure:** [Recovery procedure]

### Step 2: [Action Name]
[Continue with next steps...]

---

## Important Context

- Last Commit: [hash] - [message]
- Last Jules Pull: [Session ID] - [Result]
- Working Directory: [Clean|Has Changes]

---

## Recovery Procedures

### If Jules Session Stuck
[What to do]

### If Git Conflicts
[How to resolve]

### If Build Fails
[Troubleshooting steps]

---

## Session ID Log

| Task | Session ID | Status | Started | Completed |
|------|-----------|--------|---------|-----------|
| TASK-X | 123... | complete | [time] | [time] |
```

---

## 🎉 Conclusion

This specification captures a proven workflow for multi-agent development that has successfully delivered complex monorepo projects. The key innovations are:

1. **Clear agent hierarchy** - Each agent has defined role and expertise
2. **`.dev-pipeline/` communication hub** - Shared state outside version control
3. **Explicit async handling** - Documented waiting and polling strategy
4. **Recovery procedures** - Built-in resilience to interruptions
5. **Git checkpoint strategy** - Logical commit points preserve progress

The workflow's biggest strength is its **resilience through documentation**: every state change is recorded in markdown files that agents can read to reconstruct context after interruptions.

**Current Limitations:**
- Manual polling of Jules status (could be automated)
- No procedure for unexpected agent behavior (next to develop)
- Requires discipline in updating task files

**Recommended Next Steps:**
1. Implement this workflow on new projects
2. Document issues and improvements as they arise
3. Develop error handling procedures (Issue 5)
4. Build automation tools for common patterns
5. Iterate and refine based on real-world usage

This is a living document. Update it as the workflow evolves.

---

**Document End**

*This specification encodes the collective wisdom of successfully managing Claude, Gemini CLI, and Jules in production projects. Use it as both guide and template for your own multi-agent development workflows.*
