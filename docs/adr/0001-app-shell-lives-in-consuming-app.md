# The app shell lives in the consuming app, not the design system

The app shell (navigation sidebar, header and content area) is built from design-system core components but owned by each consuming app, so it stays out of `@workspace/ui`. Sidebar is not on the v1 core-component list, and the shadcn `sidebar-07` block is added to `apps/web` only, because the shell's navigation, projects and user data are specific to one product.
