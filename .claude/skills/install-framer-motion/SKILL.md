---
name: install-framer-motion
description: Install the framer-motion package via npm in the current project. Use when the user asks to add framer-motion, install motion/animation library, or set up framer-motion for React.
---

# Install framer-motion

Run `npm install framer-motion` from the project root to add the framer-motion animation library to the project's dependencies.

## Steps

1. Verify you are in a Node.js project (a `package.json` exists at the project root).
2. Run: `npm install framer-motion`
3. If `package.json` already lists `framer-motion`, the install will just ensure `node_modules` is in sync — no further action needed.
4. Report the installed version (from `package.json`) back to the user.

## Notes

- Do not commit `node_modules/`.
- If `package.json` is modified by the install (new entry or version bump), the change should be committed along with the updated `package-lock.json`.
- For React 18+ projects, framer-motion v11 is appropriate. For older React, pin to a compatible major.
