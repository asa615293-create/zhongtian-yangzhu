---
name: "git-push-deploy"
description: "Commits all changes, pushes to git remote, and triggers deployment. Invoke when user asks to deploy, push to git, publish, or upload to server after verifying changes locally."
---

# Git Push & Deploy

This skill automates the workflow of committing code, pushing to the git remote repository, and triggering server deployment.

## Workflow

1. **Backup Data**: Before any git operation, run `node scripts/backup.js` to backup server data to `backups/` directory. This ensures user data is preserved even if the server resets during deployment.
2. **Check Status**: Run `git status` and `git diff` to see all modified and untracked files.
3. **Stage Files**: Stage all relevant source files with `git add`. Do NOT stage:
   - `.trae/` directory
   - `tsconfig.tsbuildinfo`
   - `backups/` directory (local only, not for repo)
   - Any `.md` files that are reference documents (调研报告、指令等)
   - Any files containing secrets or credentials
4. **Commit**: Create a commit with a concise message describing the changes. Use the format:
   - `fix:` for bug fixes
   - `feat:` for new features
   - `chore:` for maintenance tasks
5. **Push**: Run `git push` to push to the remote repository. The server will automatically deploy from the git push.
   - **Network retry**: If push fails with SSL/connection error, retry up to 5 times. Company network may be unstable. Do NOT ask user to manually push until all retries exhausted.
   - **Do NOT change remote URL** to SSH (SSH is not configured in sandbox).
   - **Do NOT modify system-level git config** (only project-level with `--local`).
6. **Verify Data**: After push, check if server data was lost during deployment by calling `GET /api/data`. If data is empty, restore from the latest backup in `backups/` directory by reading the file and `PUT /api/data`.

## Important Notes

- This project is a Vite + React app deployed via GitHub. Pushing to `main` branch triggers automatic deployment.
- The working directory is: `c:\Users\Administrator\Desktop\装\中天央著装修方案`
- PowerShell is the shell environment — do NOT use bash-specific syntax like `&&` or heredoc `<<EOF`.
- Use `;` to chain commands in PowerShell instead of `&&`.
- For commit messages with special characters, use simple quoted strings: `git commit -m "message"`
- Always verify the push succeeded by checking the command output.
- If there are untracked files that are reference documents (调研报告, etc.), skip them — they should not be in the repo.
- **NEVER overwrite server data** when deploying. Code changes and user data are separate. Only restore data if server lost it during deployment.
- **Backup before every deployment** — this is mandatory, not optional.
- **NEVER modify system-level configuration** — only use `git config --local` for project-level changes. This is a work computer, system config must not be touched.
- **Self-resolve before asking user** — retry failed operations (especially git push) multiple times before asking user to manually intervene. Only escalate to user after exhausting all reasonable attempts.
