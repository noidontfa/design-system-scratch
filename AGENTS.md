## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (`noidontfa/design-system-scratch`) via `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` and `docs/adr/`. See `docs/agents/domain.md`.

### Apps monorepo

UI, Storybook, and the web app live in `apps-monorepo/`. Before any `pnpm` script there, run `nvm use` (`.nvmrc` is 26). The shell leaves `node` on the system version until then. `pnpm --filter` drops extra flags, so set `PORT` for `next start`.
