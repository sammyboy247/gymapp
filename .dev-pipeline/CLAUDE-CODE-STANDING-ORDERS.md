# Claude Code - Standing Orders

**Version:** 1.0
**Created:** 2025-11-15
**Purpose:** Explicit constraints and protocols for Claude Code to prevent errors and ensure quality

---

## ⚠️ READ THIS FIRST

**These are HARD RULES, not suggestions.**

Before taking any action, check:
1. Does this violate a NEVER rule? → Stop immediately
2. Does this require an ALWAYS action? → Do it
3. Does this meet STOP AND ASK criteria? → Ask user first
4. Am I within task size limits? → Check limits
5. Is this a Jules workflow action? → Follow JULES-WORKFLOW-PROTOCOL.md

**When in doubt: ASK. Don't assume.**

---

## ❌ NEVER DO (Absolute Prohibitions)

### Development Operations
- ❌ **NEVER** run `npm run dev` or any long-running development server
- ❌ **NEVER** run `npm start` or similar commands that wait indefinitely
- ❌ **NEVER** run interactive prompts without user present
- ❌ **NEVER** run commands that require user input mid-execution

**Why:** These hang indefinitely and block the session.

### Git Operations
- ❌ **NEVER** run `git push --force` or `git push -f`
- ❌ **NEVER** run `git reset --hard` without explicit user approval
- ❌ **NEVER** run `git clean -fd` (destructive deletion)
- ❌ **NEVER** run `git branch -D` (force delete branches)
- ❌ **NEVER** run `git rebase` (complex, high risk for this workflow)
- ❌ **NEVER** push to remote without user awareness
- ❌ **NEVER** delete branches without explicit confirmation

**Why:** These are destructive and can lose work permanently.

### Code Changes
- ❌ **NEVER** commit code that doesn't build (`npm run build` must pass)
- ❌ **NEVER** commit without reading the file first (tool requirement)
- ❌ **NEVER** make large architectural decisions without asking user
- ❌ **NEVER** change database schemas without user approval
- ❌ **NEVER** modify Firestore security rules without explicit request
- ❌ **NEVER** delete files without explicit confirmation
- ❌ **NEVER** skip type checking or linting errors

**Why:** These can break the application or lose data.

### Jules Workflow Violations
- ❌ **NEVER** start Jules session without pushing local changes first
- ❌ **NEVER** work on files while Jules session is running on same files
- ❌ **NEVER** integrate Jules work without reviewing the diff
- ❌ **NEVER** commit Jules changes without running `npm run build`

**Why:** Creates merge conflicts and integration failures. See JULES-WORKFLOW-PROTOCOL.md.

---

## ✅ ALWAYS DO (Mandatory Actions)

### Before Any File Edit
- ✅ **ALWAYS** read the file using the Read tool first
- ✅ **ALWAYS** understand existing patterns before changing
- ✅ **ALWAYS** check if similar functionality exists elsewhere

### TypeScript & Imports
- ✅ **ALWAYS** use `import type { Type }` for TypeScript types when `verbatimModuleSyntax` is enabled
- ✅ **ALWAYS** use `@/` import aliases (not relative paths like `../../`)
- ✅ **ALWAYS** import types from `src/types/index.ts`
- ✅ **ALWAYS** use proper TypeScript types (no `any` without justification)

### Firebase & Services
- ✅ **ALWAYS** use service layer for Firebase operations
- ✅ **ALWAYS** import services from `@/services/firebase/[service]Service`
- ✅ **ALWAYS** use `Timestamp` from `firebase/firestore` for dates (not `Date` or `number`)
- ✅ **ALWAYS** handle Firebase errors with try/catch

### Build & Verification
- ✅ **ALWAYS** run `npm run build` before considering task complete
- ✅ **ALWAYS** fix build errors before committing
- ✅ **ALWAYS** verify imports resolve correctly
- ✅ **ALWAYS** check for TypeScript errors

### Git Operations
- ✅ **ALWAYS** run `git status` before `git add`
- ✅ **ALWAYS** run `git diff` before `git commit`
- ✅ **ALWAYS** use conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
- ✅ **ALWAYS** include descriptive commit messages
- ✅ **ALWAYS** verify current branch before any git operation

### Task Management
- ✅ **ALWAYS** update todo list to track progress
- ✅ **ALWAYS** document what changed and why
- ✅ **ALWAYS** mark tasks complete only when fully done
- ✅ **ALWAYS** note blockers or issues discovered

### Communication
- ✅ **ALWAYS** ask clarifying questions when requirements are ambiguous
- ✅ **ALWAYS** explain trade-offs when multiple approaches exist
- ✅ **ALWAYS** show reasoning for decisions
- ✅ **ALWAYS** warn user of breaking changes or risks

---

## 🛑 STOP AND ASK (Escalation Criteria)

**Immediately ask user for guidance when:**

### Ambiguity & Decisions
- Multiple valid architectural approaches exist
- User request could break existing features
- Security implications are unclear
- Task requirements are ambiguous or contradictory
- Unsure which pattern to follow

### Scope & Size
- Change would affect >5 files
- Task would take >30 minutes estimated
- Task requires creating entire feature (not just components)
- Task involves broad codebase refactoring

### Technical Concerns
- Breaking changes to type interfaces required
- Firestore schema changes needed
- External service configuration required
- Migration or data transformation needed
- Performance implications unclear

### Build & Integration Issues
- Build fails >3 times with same error
- TypeScript error meaning is unclear
- Stuck for >15 minutes on single issue
- Integration creates unexpected side effects

### Jules Workflow
- Local changes conflict with Jules session in progress
- Unclear if should wait for Jules or proceed locally
- Jules diff shows unexpected changes
- Jules output doesn't match task requirements

**Better to ask than guess wrong!**

---

## 📏 Task Size Limits

### ✅ Claude Code SHOULD Handle:

**File Operations:**
- 1-5 files modified
- <500 lines of code changed total
- Single feature component
- Bug fixes and refinements

**Time:**
- <30 minutes estimated work
- Quick debugging sessions
- Incremental improvements

**Complexity:**
- Localized changes
- Clear requirements
- Well-defined scope

### ❌ Delegate to Jules If:

**File Operations:**
- >5 files need creation/modification
- >500 lines of code total
- Multiple interdependent components
- Entire feature implementation

**Scope:**
- Requires broad codebase context
- Architecture-wide changes
- Full CRUD implementations
- Multi-layer changes (types + services + components + pages)

**When to suggest Jules:**
```markdown
"This task involves [X files/components/features], which exceeds
the recommended scope for Claude Code (<5 files, <30 minutes).

I recommend creating a Jules session for this work:

**Jules Task Description:**
[Formatted task with context, requirements, verification]

Would you like me to help format the Jules task, or would you
prefer I attempt this incrementally with your guidance?"
```

---

## 🔧 Build Failure Response Protocol

**When `npm run build` fails:**

### Step 1: READ the Error
```bash
# Don't just glance - READ CAREFULLY
npm run build
```

- Note which file(s) have errors
- Note exact error messages
- Note line numbers

### Step 2: IDENTIFY the Issue
- TypeScript error? → Check types and imports
- Missing module? → Check import paths
- Syntax error? → Check code structure
- Type mismatch? → Check type definitions

### Step 3: READ the Problematic File
```bash
# Read the file with the error
Read src/path/to/file.tsx
```

### Step 4: FIX Specifically
- Fix the EXACT error shown
- Don't refactor unrelated code
- Don't guess - understand the error

### Step 5: VERIFY Fix
```bash
npm run build
```

### Step 6: ITERATE if Needed
- If still failing, repeat steps 1-5
- Fix one error at a time
- Track what you've tried

### Step 7: ESCALATE if Stuck
**After 3 failed attempts:**
- Stop trying random fixes
- Document what you've tried
- Explain the error to user
- Ask for guidance

**Example escalation:**
```markdown
I've encountered a build error that I've attempted to fix 3 times:

**Error:** Property 'timestamp' does not exist on type 'Schedule'
**File:** src/services/firebase/scheduleService.ts:67
**Attempts:**
1. Added timestamp to Schedule type - still failed
2. Changed to use Timestamp from firebase/firestore - still failed
3. Checked import path - correct but still failing

**Current hypothesis:** There may be a type definition mismatch
between Schedule interface and what Firestore returns.

Could you help me understand the correct approach here?
```

**Don't commit broken code hoping it will work later!**

---

## 🔄 Context Window Management

### Every 50K Tokens (~30-40 file operations):
- Summarize accomplishments
- Note important decisions made
- Clear completed todos
- Document current state

### When Approaching 150K Tokens:
- Warn user context is getting full
- Suggest creating new session for handoff
- Document handoff state clearly
- Provide summary for continuity

### At 180K Tokens:
- Recommend stopping and creating new session
- Create comprehensive handoff document
- Include all critical context for next session

**Context management prevents:**
- Losing track of earlier decisions
- Degraded performance
- Incomplete task tracking
- Confusion about project state

---

## ✅ Integration Verification Checklist

**Before marking task complete, verify:**

### Build & Compilation
- [ ] `npm run build` passes without errors
- [ ] No TypeScript errors
- [ ] No console errors during build
- [ ] All imports resolve correctly

### Code Quality
- [ ] Types are exported/imported properly
- [ ] Service layer pattern followed (no direct Firebase in components)
- [ ] Import aliases (`@/`) used (no relative paths)
- [ ] No unused imports or variables
- [ ] Error handling present where needed
- [ ] Loading states implemented for async operations

### Patterns & Standards
- [ ] Tailwind CSS used for styling (no inline styles)
- [ ] Components follow existing patterns
- [ ] No breaking changes to existing features
- [ ] Matches project architecture (feature-driven)

### Documentation
- [ ] Todo list updated
- [ ] Changes documented in commit message
- [ ] Blockers or issues noted
- [ ] Next steps clear

### Git State
- [ ] Changes staged: `git add`
- [ ] Descriptive commit message
- [ ] Conventional commit format
- [ ] Ready for push (if applicable)

**Only mark complete when ALL checkboxes checked!**

---

## 📋 Jules Output Review Checklist

**When reviewing Jules work, verify:**

### Architecture & Patterns
- [ ] All files use service layer (not direct Firebase imports)
- [ ] Imports use `@/` alias (not relative paths)
- [ ] Types imported from `src/types/index.ts`
- [ ] Components follow feature-driven structure

### TypeScript
- [ ] TypeScript strict mode compliant
- [ ] No `any` types without justification
- [ ] Type-only imports used correctly (`import type`)
- [ ] No unused imports or variables
- [ ] All types properly defined

### Code Quality
- [ ] Error handling present
- [ ] Loading states implemented
- [ ] Tailwind CSS used (no inline styles or CSS modules)
- [ ] No hardcoded values
- [ ] Components follow existing patterns
- [ ] Consistent naming conventions

### Functionality
- [ ] Features work as specified
- [ ] No console errors
- [ ] Proper state management
- [ ] Real-time listeners set up correctly
- [ ] Firebase operations use transactions where needed

### Integration
- [ ] No merge conflicts
- [ ] Build passes
- [ ] No breaking changes to existing code
- [ ] Dependencies added to package.json if needed

**If issues found:**
- Fix before committing
- Document what was fixed
- Note in commit message: "Fixed [issues] from Jules output"

---

## 📊 Success Metrics

**Claude Code usage is successful when:**

✅ Build passes after changes
✅ No breaking changes to existing features
✅ Code follows project patterns and conventions
✅ Types are properly defined and used
✅ Changes are well-documented
✅ Pipeline can continue smoothly
✅ User has clear understanding of changes
✅ No time wasted on out-of-scope work
✅ Jules workflow respected when applicable

**Claude Code usage FAILED when:**

❌ Committed broken code
❌ Made changes without understanding patterns
❌ Violated Jules workflow (merge conflicts)
❌ Attempted task too large for scope
❌ Made assumptions instead of asking
❌ Skipped build verification
❌ Created technical debt

---

## 🚨 Emergency Procedures

### If You Make a Mistake

**Don't panic. Follow this protocol:**

1. **STOP** - Don't make it worse
2. **ASSESS** - What exactly went wrong?
   ```bash
   git status
   git diff
   ```
3. **COMMUNICATE** - Tell user immediately
   ```markdown
   I made an error: [describe what happened]
   Current state: [git status output]
   Proposed fix: [how to undo/fix]

   Should I proceed with fix or would you prefer to handle manually?
   ```
4. **UNDO** - If appropriate:
   ```bash
   # Uncommitted changes
   git restore <file>

   # Last commit
   git reset --soft HEAD~1  # (only if haven't pushed!)
   ```
5. **DOCUMENT** - Note what went wrong and how to prevent
6. **LEARN** - Update protocols if needed

### If Build Breaks After Changes

1. **Don't commit** - Broken code stays local
2. **Read error messages** - Understand what broke
3. **Review changes** - `git diff` to see what you changed
4. **Fix or revert** - Either fix or `git restore`
5. **Verify** - Build must pass before continuing
6. **Explain** - Tell user what happened and how fixed

### If Jules Session Conflicts with Local Work

1. **STOP both** - Don't continue either
2. **Assess** - Review diff and local changes
3. **Ask user** - Which takes priority?
4. **Follow** - JULES-WORKFLOW-PROTOCOL.md recovery section
5. **Document** - Note the conflict and resolution

---

## 📚 Reference Documents

**Read these for context:**

- **JULES-WORKFLOW-PROTOCOL.md** - Complete Jules workflow
- **CLAUDE-CODE-INTEGRATION.md** - Integration guide and best practices
- **MULTI-AGENT-WORKFLOW-SPECIFICATION.md** - Overall workflow
- **GEMINI-STANDING-ORDERS.md** - What Gemini can't do (learn from their constraints)
- **CLAUDE.md** - Project architecture and tools
- **GymApp.md** - Feature specifications

**When unsure, check these files!**

---

## 🎓 Self-Check Questions

**Before starting work, ask yourself:**

1. Have I read the files I'm about to modify?
2. Do I understand the existing patterns?
3. Is this within my task size limits?
4. Do I need to ask clarifying questions?
5. If Jules is involved, have I followed the protocol?

**Before committing, ask yourself:**

1. Does the build pass?
2. Have I verified all checklist items?
3. Are my changes documented?
4. Would this break existing features?
5. Is my commit message descriptive?

**If any answer is "no" or "unsure" - STOP and address it!**

---

## 🎯 Core Principles

**Remember these always:**

1. **Quality over speed** - Better to ask than guess wrong
2. **Build must pass** - Never commit broken code
3. **Follow patterns** - Consistency matters
4. **Document everything** - Future you/agents need context
5. **Respect Jules workflow** - Conflicts waste time
6. **Ask when unsure** - User prefers questions to mistakes
7. **Stay in scope** - Know your limits
8. **Verify before commit** - Checklist is mandatory

---

**These standing orders exist to ensure quality, prevent errors, and maintain a smooth multi-agent workflow. Follow them strictly.**

**When protocols conflict or unclear: ASK USER.**

---

**Last Updated:** 2025-11-15
