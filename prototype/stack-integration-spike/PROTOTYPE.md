# PROTOTYPE — throwaway

Question: does the repo layout from "Decide the repo and tooling layout" work end to end?

One themed button lives in `packages/ui` (`"use client"`, token colours, click count on the button). `apps/web` and `apps/other` each own an entry `globals.css` that imports `@workspace/ui/globals.css`. `apps/storybook` renders the same button.

Run from this directory, on Node 26 (see `.nvmrc`). Node 20 cannot run the pinned pnpm 11.25.0.

```sh
pnpm dev
```

- web: http://localhost:3000
- other: http://localhost:3010
- storybook: http://localhost:6006

The click count on the button is the client state. The "Server render" timestamp is rendered by the page, which has no `"use client"`.
