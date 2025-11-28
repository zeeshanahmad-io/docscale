---
description: Switch to main, pull latest changes, and delete the merged feature branch.
---

1. Switch to the main branch
// turbo
git checkout main

2. Pull the latest changes from remote
// turbo
git pull origin main

3. Delete the local feature branch (Replace 'feature-branch-name' with your actual branch)
git branch -d dev

4. Delete the remote feature branch on GitHub
git push origin --delete dev

5. Prune remote tracking branches (optional, keeps your list clean)
// turbo
git fetch -p