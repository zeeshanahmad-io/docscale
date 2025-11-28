---
description: Clean install dependencies, rebuild the project, and start the dev server.
---

1. Clean up old artifacts and dependencies
// turbo
rm -rf node_modules dist

2. Re-install dependencies
// turbo
npm install

3. Re-build the project (regenerates sitemap, optimizes images, prerenders pages)
// turbo
npm run build

4. Start the development server
npm run dev
