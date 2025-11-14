# Claude Code Integration Guide

**Created:** 2025-11-14
**Purpose:** Reference guide for using Claude Code effectively in the GymApp multi-agent workflow

---

## 🎯 What is Claude Code?

Claude Code (claude.ai/code) is an **interactive AI development assistant** that combines conversational AI with direct code execution capabilities. It serves as the "Interactive Executor" in the GymApp multi-agent workflow.

**Key Distinction:**
- **Claude (conversational):** Planning, design, specifications only
- **Claude Code (this tool):** Planning + execution + interactive feedback

---

## 📊 Claude Code in the Workflow Hierarchy

```
ARCHITECTURAL LAYER
├─ Claude (Strategic Architect) ──────┐
├─ Claude Code (Interactive Executor) ─┤ → Both provide strategic direction
                                       │
                                       ▼
COORDINATION LAYER
└─ Gemini CLI (Coordinator) ──────────┐
                                       │ → Can delegate to Claude Code
                                       ▼
IMPLEMENTATION LAYER
└─ Jules (Async Builder) ──────────────┐
                                       │ → Output reviewed by Claude Code
                                       ▼
                                  CODEBASE
```

---

## 💡 When to Use Claude Code

### ✅ Perfect Use Cases

1. **Bug Fixes & Debugging**
   - TypeScript errors requiring contextual understanding
   - Runtime issues needing step-by-step investigation
   - Build failures with unclear error messages

2. **Code Review & Quality**
   - Reviewing Jules output before committing
   - Suggesting improvements to existing code
   - Identifying potential issues or anti-patterns

3. **Small to Medium Refactoring**
   - Refactoring 1-5 files
   - Renaming components or functions
   - Restructuring component logic

4. **Interactive Exploration**
   - "How does the auth flow work?"
   - "Where are friend requests handled?"
   - Understanding complex code interactions

5. **Architectural Discussions**
   - Design decisions with code implications
   - Trade-off analysis with concrete examples
   - Prototyping alternative approaches

6. **Quick Fixes**
   - Linting errors
   - Import organization
   - Type definition updates
   - Missing dependencies

### ❌ Not Ideal Use Cases

1. **Large-Scale Scaffolding**
   - Creating 10+ files at once → Use Jules
   - Entire feature implementations → Use Jules
   - Architecture-wide changes → Use Jules

2. **Automated Pipeline Execution**
   - Running predefined task lists → Use Gemini CLI
   - Git checkpoints and commits → Use Gemini CLI
   - Monitoring Jules sessions → Use Gemini CLI

3. **Long-Running Processes**
   - Development servers (hangs indefinitely)
   - Deployment processes
   - Database migrations

---

## 🔄 Handoff Patterns

### From Gemini to Claude Code

**Scenario:** Gemini encounters a task requiring interactive work

**Process:**
1. Gemini documents issue in `ACTION-QUEUE.md`
2. Gemini marks task status: `REQUIRES_CLAUDE_CODE_REVIEW`
3. Gemini updates `GEMINI-CONTINUE-INSTRUCTIONS.md` with handoff context
4. Human invokes Claude Code
5. Claude Code completes work
6. Claude Code updates relevant files and documents changes
7. Gemini resumes pipeline execution

**Example:**
```markdown
### TASK-042: Fix TypeScript Error in scheduleService
**Agent:** Claude Code (delegated from Gemini)
**Status:** REQUIRES_CLAUDE_CODE_REVIEW
**Context:**
- Build failing after Jules TASK-036 integration
- Error: Type 'Timestamp' is not assignable to type 'number'
- Located in src/services/firebase/scheduleService.ts:67
**Action Needed:**
- Debug and fix TypeScript type mismatch
- Verify fix doesn't break other services
- Update types if needed
```

### From Jules to Claude Code

**Scenario:** Jules completes implementation that needs review/adjustment

**Process:**
1. Jules completes work (session marked "complete")
2. Gemini pulls Jules changes
3. Gemini runs build - may encounter issues
4. Gemini delegates to Claude Code for review
5. Claude Code reviews, provides feedback, makes adjustments
6. Claude Code ensures build passes
7. Changes committed to git

**Example:**
```markdown
### Code Review: Jules TASK-039 (Friend System)
**Agent:** Claude Code
**Status:** IN_REVIEW
**Jules Session:** 2889372153784130901
**Findings:**
- Implementation looks good overall
- Type definitions missing for PublicUserData
- FriendSearch component has unused import
- Consider adding error boundary
**Actions Taken:**
- Added missing type definitions
- Removed unused imports
- Added basic error handling
- Build now passes
```

### Claude Code to Gemini

**Scenario:** Claude Code completes focused work, pipeline continues

**Process:**
1. Claude Code completes interactive work
2. Claude Code runs build verification
3. Claude Code updates task status in relevant pipeline files
4. Claude Code documents changes made
5. Gemini picks up for next pipeline tasks

---

## 🛠️ Best Practices for GymApp

### 1. Service Abstraction Pattern

When working with Firebase, **always** use service layer:

```typescript
// ❌ DON'T: Direct Firebase import in component
import { getDoc, doc } from 'firebase/firestore';

// ✅ DO: Use service layer
import { scheduleService } from '@/services/firebase/scheduleService';
```

### 2. Type Safety

GymApp uses **TypeScript strict mode**:
- All types must be explicit
- Use types from `src/types/index.ts`
- For Firestore: use `Timestamp` type from `firebase/firestore`

### 3. Import Aliases

Always use `@/` alias for src imports:

```typescript
// ✅ GOOD
import { useAuthStore } from '@/store/authStore';
import { UserProfile } from '@/types';

// ❌ AVOID
import { useAuthStore } from '../../store/authStore';
```

### 4. Styling with Tailwind

Use Tailwind CSS v4 for all styling:
- Use `cn()` utility from `@/lib/utils` for conditional classes
- No inline styles or CSS modules
- Mobile-first responsive design

### 5. Build Before Commit

**Always** run build before committing:

```bash
npm run build
```

If build fails, **do not commit**. Fix issues first.

### 6. Update Pipeline Files

After completing work, update:
- `.dev-pipeline/STATUS-REPORT.md` - Current project state
- `.dev-pipeline/ACTION-QUEUE.md` - Next actions (if applicable)
- Task files - Mark completed tasks

---

## 📋 Common Tasks & Examples

### Example 1: Fix TypeScript Error

**Scenario:** Build failing with type error

**Approach:**
```bash
# 1. Read the file with error
Read src/services/firebase/scheduleService.ts

# 2. Identify the issue
# Error: Property 'timestamp' does not exist on type 'Schedule'

# 3. Check type definition
Read src/types/index.ts

# 4. Fix the issue (missing import or type definition)
Edit src/types/index.ts

# 5. Verify fix
npm run build

# 6. Document in pipeline if from task
```

### Example 2: Review Jules Output

**Scenario:** Jules completed TASK-036, needs review

**Approach:**
```bash
# 1. Check what files were modified
git status
git diff

# 2. Read key files
Read src/features/schedule/components/ScheduleView.tsx
Read src/services/firebase/scheduleService.ts

# 3. Look for issues:
# - Missing error handling?
# - Type inconsistencies?
# - Service abstraction followed?
# - Proper imports?

# 4. Make adjustments if needed
Edit [file]

# 5. Verify build
npm run build

# 6. Document review findings
```

### Example 3: Refactor Component

**Scenario:** Component is too large, needs splitting

**Approach:**
```bash
# 1. Read original component
Read src/features/schedule/components/ScheduleView.tsx

# 2. Identify logical separations
# - Date filter → separate component
# - Session list → separate component
# - Booking modal → already separate

# 3. Create new components
Write src/features/schedule/components/DateFilter.tsx
Write src/features/schedule/components/SessionList.tsx

# 4. Refactor original to use new components
Edit src/features/schedule/components/ScheduleView.tsx

# 5. Verify build and functionality
npm run build

# 6. Update task status if applicable
```

### Example 4: Add Missing Types

**Scenario:** Jules implementation missing type definitions

**Approach:**
```bash
# 1. Identify missing types from error messages
npm run build

# 2. Read types file
Read src/types/index.ts

# 3. Add missing types
Edit src/types/index.ts

# 4. Verify all usages
Grep "PublicUserData" --output_mode content

# 5. Ensure consistency
npm run build
```

---

## 🎭 Role Comparison Matrix

| Task | Claude | Claude Code | Gemini CLI | Jules |
|------|--------|-------------|-----------|-------|
| Plan architecture | ✅ Best | ✅ Good | ❌ | ❌ |
| Design specifications | ✅ Best | ✅ Good | ❌ | ❌ |
| Fix TypeScript error | ❌ | ✅ Best | ⚠️ Can try | ❌ |
| Review code | ✅ Good | ✅ Best | ❌ | ❌ |
| Refactor 2 files | ❌ | ✅ Best | ⚠️ Can do | ⚠️ Overkill |
| Refactor 10 files | ❌ | ⚠️ Possible | ❌ | ✅ Best |
| Debug interactively | ✅ Good | ✅ Best | ❌ | ❌ |
| Execute git commands | ❌ | ✅ Can do | ✅ Best | ❌ |
| Monitor Jules sessions | ❌ | ⚠️ Manual | ✅ Best | ❌ |
| Build entire feature | ❌ | ⚠️ Small only | ❌ | ✅ Best |
| Answer "how does X work?" | ✅ Good | ✅ Best | ⚠️ Can search | ❌ |

**Legend:**
- ✅ Best - This is the ideal tool
- ✅ Good - Can do well, reasonable choice
- ✅ Can do - Capable but not optimal
- ⚠️ - Possible but has drawbacks
- ❌ - Not capable or very inefficient

---

## 🔍 Decision Flowchart

```
New Task Arrives
│
├─ Is it planning/design only?
│  └─ YES → Claude (conversational)
│  └─ NO → Continue
│
├─ Does it need interactive debugging?
│  └─ YES → Claude Code
│  └─ NO → Continue
│
├─ Is it < 5 files and needs discussion?
│  └─ YES → Claude Code
│  └─ NO → Continue
│
├─ Is it automated pipeline task?
│  └─ YES → Gemini CLI
│  └─ NO → Continue
│
├─ Is it large multi-file implementation?
│  └─ YES → Jules
│  └─ NO → Continue
│
└─ Default: Start with Claude Code, delegate if needed
```

---

## 📝 Integration Checklist

When using Claude Code on GymApp:

- [ ] Read relevant files before making changes
- [ ] Follow service abstraction pattern for Firebase
- [ ] Use `@/` import aliases
- [ ] Add proper TypeScript types
- [ ] Use Tailwind CSS for styling
- [ ] Run `npm run build` before considering done
- [ ] Update `.dev-pipeline/STATUS-REPORT.md` if significant
- [ ] Document changes in task files if part of pipeline
- [ ] Check git status and review diff
- [ ] Ensure no breaking changes to existing features

---

## 🆘 Troubleshooting

### Build Fails After Changes

1. Read the error message carefully
2. Check import paths and aliases
3. Verify types are exported/imported correctly
4. Check for missing dependencies
5. Ensure Firebase Timestamp vs number types are correct

### Can't Find File

1. Use Glob tool: `Glob **/*ComponentName*`
2. Check if using correct path alias (`@/`)
3. Verify file exists: `Read src/path/to/file.tsx`

### Uncertain About Architecture

1. Read `CLAUDE.md` for architecture overview
2. Read service files to understand patterns
3. Grep for similar implementations
4. Ask questions before making changes

### Changes Break Existing Features

1. Run `npm run build` to catch TypeScript errors
2. Check imports in other files: `Grep "import.*YourComponent"`
3. Review service layer changes carefully
4. Test critical paths (auth, booking, friend system)

---

## 📚 Additional Resources

- **Project Architecture:** `CLAUDE.md` - Comprehensive architecture guide
- **Workflow Spec:** `MULTI-AGENT-WORKFLOW-SPECIFICATION.md` - Full workflow details
- **Gemini Constraints:** `GEMINI-STANDING-ORDERS.md` - What Gemini can't do
- **Current Status:** `STATUS-REPORT.md` - Project state and progress
- **Project Vision:** `GymApp.md` - Feature specifications and requirements

---

## 💬 Communication Tips

### With Human Developer

- Ask clarifying questions when requirements are ambiguous
- Explain trade-offs when multiple approaches exist
- Provide reasoning for architectural decisions
- Show code examples to illustrate concepts

### With Other Agents (via Pipeline Files)

- Document clearly what was done and why
- Mark tasks with appropriate status
- Include context for next agent in chain
- Note any issues or blockers discovered

### In Commit Messages

- Use conventional commit format: `feat:`, `fix:`, `refactor:`, etc.
- Be descriptive about what changed and why
- Reference task numbers if from pipeline
- Keep messages concise but informative

---

## 🎯 Success Metrics

Claude Code usage is successful when:

✅ Build passes after changes
✅ No breaking changes to existing features
✅ Code follows project patterns and conventions
✅ Types are properly defined and used
✅ Changes are well-documented
✅ Pipeline can continue smoothly
✅ Human developer has clear understanding of changes

---

**Remember:** Claude Code is about **interactive, focused work with immediate feedback**. For large-scale implementations, trust Jules. For automation, trust Gemini. For everything else, Claude Code excels.

---

**Last Updated:** 2025-11-14
