# **jules-cli-usage.md**

## **1\. Introduction to Jules CLI for AI Agents**

This document provides a **strict guide** for AI coding agents (Claude, Gemini, and ChatGPT) on using the Google Jules command-line interface (CLI) for code-related tasks within our project.

Jules is an asynchronous coding agent that operates on your remote **Git repository**. It works in a cloud-based virtual machine (VM), not directly on your local file system, and handles the full context of your codebase.

The primary goal of using Jules is to **offload complex, time-consuming, or large-scope coding tasks** from the main Large Language Model (LLM) services, thereby **significantly saving LLM context and generation tokens** and improving overall efficiency.

### **Key Principles**

1. **Remote Operation:** All Jules tasks are executed on a cloned version of the Git repository in a remote VM. The local project folder on the agent's machine is used *only* to invoke the CLI command, which points to the Git repository.  
2. **Git-Centric Workflow:** Every change made by Jules is encapsulated in a dedicated Git branch and, ideally, a Pull Request (PR).  
3. **Token Conservation:** Jules handles tasks that require broad codebase context, extensive file modifications, or lengthy, iterative steps, which would consume excessive tokens if attempted via direct LLM prompts.

---

## **2\. When to Use Jules (Token-Saving Strategy)**

The decision to use Jules via the CLI should be based on the potential for token savings and the complexity of the task.

| Task Characteristic | Recommended Tool | Rationale |
| :---- | :---- | :---- |
| **Small, Local Context** | **Main LLM** (e.g., Gemini CLI) | Single function refinement, quick syntax check, short docstring generation. Minimal context needed. |
| **Broad Context / Multiple Files** | **Jules CLI** | **Refactoring** an API across five files, **adding a unit test** that touches business logic and test config, **upgrading a dependency** that requires multiple code changes. **Large context is handled once by Jules's remote VM.** |
| **Iterative / Asynchronous** | **Jules CLI** | Tasks requiring multiple steps, like **"Fix all TODO comments"** or **"Implement feature X"** which require planning and multiple commits. The main LLM doesn't have to wait or manage state. |
| **Boilerplate / Repetitive** | **Jules CLI** | **Writing boilerplate tests** for all service handlers, generating scaffolding for a new module, or **updating file headers**. |
| **Fast, Interactive** | **Main LLM** (e.g., Gemini CLI) | Direct question-answering, code snippets, or quick command generation. |

---

## **3\. Core Jules CLI Commands**

The AI agent must use these specific commands for interaction. Assume the @google/jules package is installed globally (npm install \-g @google/jules).

| Command | Description | Usage Example |
| :---- | :---- | :---- |
| jules remote new | Submits a new task to Jules to work on the linked Git repository. | jules remote new \--repo . \--session "Add a new endpoint /health\_check and its unit test." |
| jules remote list | Lists all active and completed tasks for the current repository. | jules remote list \--repo . |
| jules remote pull | Retrieves a completed task's changes (a patch) locally. | *Avoid this for automated workflow; use Git PR process instead.* |
| jules remote new \--branch | Instructs Jules to work on a *new* branch instead of the repository's default. **(Mandatory for new tasks)** | jules remote new \--repo . \--session "Fix issue \#101" \--branch "fix/issue-101-db-bug" |

---

## **4\. Robust Git Workflow Procedures**

The correct handling of Git state is critical to prevent conflicts and ensure a clean, reviewable audit trail.

### **4.1. Starting a New, Single Task**

This is the standard, safest workflow for offloading a task to Jules.

| Step | Action by AI Agent | Rationale |
| :---- | :---- | :---- |
| **1\. Local Sync** | Ensure the local branch is clean and up-to-date with the remote branch (usually main or develop). | Jules works from the remote Git state. A local, un-pushed change is invisible to it. |
| **2\. Push Local to Remote** | **If any local changes exist that are *not* part of the Jules task, push them immediately.** (git push) | Jules must be given the most current codebase to avoid working on stale context. |
| **3\. Create Task & Branch** | Use jules remote new with the \--branch flag. The branch name should be descriptive. | Forces Jules to create a new, isolated branch on the remote Git repo. |
| **CLI Command:** | jules remote new \--repo . \--session "My clear task description" \--branch "feat/jules-task-X" | This initiates the task. The agent can now move to the next task while Jules works asynchronously. |

### **4.2. Handling Multiple, Dependent Tasks**

If a sequence of tasks needs to be passed to Jules, they must be made *consecutive* via separate sessions.

| Step | Action by AI Agent | Rationale |
| :---- | :---- | :---- |
| **1\. Task 1 (Base)** | Execute **Step 3** from **4.1** for Task 1 (e.g., branch feat/jules-task-1). | Creates the first set of changes in an isolated branch. |
| **2\. Task 1 Completion** | Monitor the task (via jules remote list). When complete, Jules provides an option to publish the branch/PR. **The agent must wait for a human to review and merge Task 1's PR.** | **Crucial:** Dependent tasks must be based on a *merged* change to ensure codebase stability. |
| **3\. Local & Remote Sync** | After Task 1 is merged, the agent must **pull the changes** to the local machine and ensure the remote repository is updated on the target branch (e.g., git pull origin main). | Task 2 must be based on the new, merged state. |
| **4\. Task 2 (Dependent)** | Execute **Step 3** from **4.1** again, targeting the now-updated main (or develop) branch with a new branch name (e.g., feat/jules-task-2). | Task 2 is now based on the changes from Task 1\. |

**Important:** Do **not** attempt to chain dependent tasks by asking Jules to branch off its own unmerged branch. This complicates review and leads to conflicts.

### **4.3. Reversing the Process (Jules is Finished)**

The goal is a zero-touch integration into the existing review process.

| Step | Action by AI Agent | Rationale |
| :---- | :---- | :---- |
| **1\. Task Completion** | Jules sends a notification that the task is complete (or the agent confirms via jules remote list). The summary includes the **branch name** and **commit message**. | Confirms the work is done in the remote VM. |
| **2\. Publish PR** | In the Jules web dashboard, the agent (or a human reviewer) must click the **"Publish PR"** button. *Alternatively, if an API is available, the agent should automate PR creation.* | This is the official hand-off. The changes are now in an official Git branch and ready for human review via a Pull Request. **The AI agent's task is now complete.** |
| **3\. Cleanup** | The branch created by Jules will be deleted automatically upon PR merge in most configurations, but the agent should not attempt local deletion or remote force-push unless explicitly instructed. | Clean branches maintain a clear Git history. |

---

## **5\. Automation and Optimization**

The most effective use of Jules is to integrate it as a scriptable tool in the LLM's workflow.

### **5.1. Automated Task Dispatch**

The LLM should automate the creation of a task prompt and dispatch it to Jules.

Bash

\# Script to automate dispatch of a boilerplate task (e.g., adding tests)  
\# 1\. Ensure the working directory is the repo root.  
\# 2\. Dynamically generate a branch name based on the task.  
TASK\_DESCRIPTION="Add unit tests for the core authentication module."  
BRANCH\_NAME="test/auth-module-$(date \+%s)" \# Use a unique timestamp or issue number

\# Execute the command  
jules remote new \--repo . \\  
                 \--session "${TASK\_DESCRIPTION}" \\  
                 \--branch "${BRANCH\_NAME}"

\# Log the task ID for later reference  
jules remote list \--repo . \> jules\_task\_log.txt

### **5.2. Using AGENTS.md for Context**

Jules automatically reads an AGENTS.md file at the root of the repository. The AI agent must ensure this file is **up-to-date and highly specific**.

**AI Agent Mandate:** Before dispatching a task to Jules, the agent must first **consult and utilize** the instructions found in AGENTS.md, especially regarding **build, test, and lint commands**.

| AGENTS.md Section | Key Information for Jules |
| :---- | :---- |
| \# Build & Test Commands | Exact commands: npm run build, pytest, go test ./... |
| \# Conventions | File naming, variable style (camelCase, snake\_case), and commit message format. |
| \# Git Workflow | The expected base branch (main or develop). |

By providing this context explicitly via AGENTS.md, the LLM (as the task dispatcher) saves tokens that would otherwise be used to explain the project structure in the jules remote new session prompt.