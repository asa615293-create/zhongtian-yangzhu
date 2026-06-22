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
- **Network**: Sandbox network is unstable for GitHub HTTPS. Push may timeout. Retry up to 5 times before escalating.
- **Railway**: Every deployment rebuilds the container and **wipes the entire filesystem** (including data.json). Data must be restored after deployment if Volume is not configured.

## Workflow (Follow Exactly)

### Step 1: Backup Server Data
```powershell
node scripts/backup.js
```
If backup fails, continue anyway (non-blocking).

### Step 2: Build & Verify
```powershell
npm run build
```
If build fails, STOP and fix errors before proceeding.

### Step 3: Check Status
```powershell
git status
```
Only read the output — do NOT run `git diff` (it may produce huge output and waste context).

### Step 4: Stage Files
Stage ONLY source code files. NEVER stage:
- `.trae/` directory
- `tsconfig.tsbuildinfo`
- `backups/` directory
- Reference `.md` files (调研报告、指令、嘉伟装修知识等)
- Any files with secrets/credentials

Use specific `git add` for each file, NOT `git add .` or `git add -A`.

### Step 5: Commit
```powershell
git commit -m "type: concise description"
```
Types: `fix:` / `feat:` / `chore:` / `style:` / `refactor:`

### Step 6: Push (with retry)
```powershell
git push origin main
```
If fails with timeout/SSL error:
1. Wait 3 seconds, retry (max 5 times)
2. If still fails after 5 retries → tell user to push manually in their own terminal:
   ```
   请在你自己的终端（非 Trae 终端）执行：
   cd "C:\Users\Administrator\Desktop\装\中天央著装修方案"
   git push origin main
   ```

### Step 7: Post-Deploy Verification
After successful push, Railway auto-deploys in ~2-3 minutes. Then:
1. Check `/api/health` to confirm server is up
2. Check `/api/data` to verify data integrity (deliverySpecs count, furnishingItems count, photos count)
3. **If data is missing** (container rebuild wiped data.json): Restore from backup immediately
   ```powershell
   node scripts/restore.js backups/最新备份文件.json
   ```

## Strict Rules

1. **NEVER modify global git config** — only `git config --local`
2. **NEVER delete Windows Credential Manager entries** — those belong to the global account used by ALL other projects
3. **NEVER change remote URL** to SSH or embed credentials
4. **NEVER run `git diff`** — use `git status` only to check what changed
5. **NEVER stage `.trae/` directory** — it contains IDE config, skills, and documents
6. **NEVER stage reference documents** — 调研报告、指令、嘉伟装修知识 etc.
7. **Use `;` not `&&`** in PowerShell commands
8. **Retry push 5 times** before asking user to manually intervene
9. **Keep commit messages in English** to avoid encoding issues
10. **ALWAYS backup before push** — `node scripts/backup.js`
11. **ALWAYS verify data after deployment** — check server data integrity, restore if lost
12. **NEVER store user data as separate files** (e.g. photos/) — Railway container rebuilds wipe the filesystem. All data must be in data.json
