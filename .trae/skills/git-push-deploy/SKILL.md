---
name: "git-push-deploy"
description: "Commits all changes, pushes to git remote, and triggers deployment. Invoke when user asks to deploy, push to git, publish, or upload to server after verifying changes locally."
---

# Git Push & Deploy

This skill automates the workflow of committing code, pushing to the git remote repository, and triggering server deployment.

## Critical Context

- **Working directory**: `c:\Users\Administrator\Desktop\装\中天央著装修方案`
- **Shell**: PowerShell 5 — NEVER use `&&` (use `;` instead), NEVER use heredoc `<<EOF`
- **Git accounts**: This project uses PRIVATE account `asa615293-create / asa615293@gmail.com` (local config only). ALL other projects use global account `wangjingbo / jingbo.wang@dhc.com.cn`. NEVER touch global git config or Windows Credential Manager!
- **Network**: Sandbox network is unstable for GitHub HTTPS. Push may timeout. Retry up to 3 times before escalating.

## Workflow (Follow Exactly)

### Step 1: Backup
```powershell
node scripts/backup.js
```
If backup fails, continue anyway (non-blocking).

### Step 2: Check Status
```powershell
git status
```
Only read the output — do NOT run `git diff` (it may produce huge output and waste context).

### Step 3: Stage Files
Stage ONLY source code files. NEVER stage:
- `.trae/` directory
- `tsconfig.tsbuildinfo`
- `backups/` directory
- Reference `.md` files (调研报告、指令、嘉伟装修知识等)
- Any files with secrets/credentials

Use specific `git add` for each file, NOT `git add .` or `git add -A`.

### Step 4: Commit
```powershell
git commit -m "type: concise description"
```
Types: `fix:` / `feat:` / `chore:` / `style:` / `refactor:`

### Step 5: Push (with retry)
```powershell
git push
```
If fails with timeout/SSL error:
1. Wait 3 seconds, retry (max 3 times)
2. If still fails after 3 retries → tell user to push manually in their own terminal:
   ```
   请在你自己的终端（非 Trae 终端）执行：
   cd "C:\Users\Administrator\Desktop\装\中天央著装修方案"
   git push
   ```

### Step 6: Verify
After successful push, Railway auto-deploys in ~2-3 minutes.

## Strict Rules

1. **NEVER modify global git config** — only `git config --local`
2. **NEVER delete Windows Credential Manager entries** — those belong to the global account used by ALL other projects
3. **NEVER change remote URL** to SSH or embed credentials
4. **NEVER run `git diff`** — use `git status` only to check what changed
5. **NEVER stage `.trae/` directory** — it contains IDE config, skills, and documents
6. **NEVER stage reference documents** — 调研报告、指令、嘉伟装修知识 etc.
7. **Use `;` not `&&`** in PowerShell commands
8. **Retry push 3 times** before asking user to manually intervene
9. **Keep commit messages in English** to avoid encoding issues
