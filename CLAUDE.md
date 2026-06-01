# Draftly Frontend

React + TypeScript + Vite app for "Draftly" — a Google Docs-like collaborative document editing app. Local development only, no deployment.

## Tech Stack
- React 19
- TypeScript
- Vite 8 (port 3000, locked via `strictPort: true`)
- MUI v6.4.0 + Emotion (`@mui/icons-material`)
- TipTap v3.23.6 (all extensions same version), `@tiptap/pm` peer dep
- React Router v6
- React Hook Form 7.76.1 (pinned, no `^`)
- axios 1.16.1 (pinned, no `^` — supply chain safety)
- npm `.npmrc`: `min-release-age=3`
- Mammoth (planned for .docx import — not yet integrated)
- jspdf was removed temporarily — will re-add for PDF export later

## Project Structure

```
src/
├── api/
│   ├── types/  common.ts, auth.ts, user.ts, document.ts, collaborator.ts, version.ts
│   ├── authAPI.ts, documentAPI.ts, collaboratorAPI.ts, versionAPI.ts, userAPI.ts
│   └── utils.ts  (getErrorMessage helper that reads err.response.data.message from Axios errors)
├── axios/
│   └── axiosInstance.ts  (JWT interceptor, 401 redirect with isAuthEndpoint check)
├── context/
│   ├── AuthContext.tsx, SnackbarContext.tsx
├── hooks/
│   ├── useAuth, useDocuments, useDocument, useCollaborators, useVersions,
│   │   useSnackbar (global via SnackbarContext), useDebounce, useAutoSave
├── providers/
│   ├── AuthProvider.tsx, SnackbarProvider.tsx
├── theme.ts  (MUI theme — primary #2B579A Word blue, Merriweather serif headings,
│              Source Sans 3 body. Use MuiCssBaseline not CssBaseline)
├── tiptap.d.ts  (TipTap type references for all extensions — fixes TS errors with chain commands)
├── App.tsx, main.tsx
└── ui/
    ├── components/
    │   ├── common/         ProtectedRoute (uses Outlet pattern + isLoading check)
    │   ├── layout/         LandingNavbar, AppNavbar (avatar dropdown menu with initials),
    │   │                   LandingFooter, LandingLayout, AppLayout
    │   ├── dashboard/      DashboardHeader (time-aware greeting), DashboardToolbar
    │   │                   (search/filter/sort/view-toggle), DocumentCard, DocumentListRow,
    │   │                   DocumentGrid, DocumentList, EmptyState, DocumentCardSkeleton,
    │   │                   NewDocumentDialog, RenameDialog, DeleteConfirmDialog
    │   └── editor/         Editor.css (TipTap content styles), SaveStatus, EditableTitle,
    │       │               LinkDialog, ImageUploadDialog, ColorPickerButton,
    │       │               EditorToolbar, BubbleMenuBar, TipTapEditor, DocumentBar,
    │       │               TableFloatingMenu
    │       └── side-panel/ EditorSidePanel (tabbed drawer), HistoryPanel (with preview/restore),
    │                       CollaboratorsPanel, SharePanel (debounced user search)
    └── pages/  LandingPage (placeholder), LoginPage, RegisterPage, DashboardPage,
                EditorPage, ProfilePage (placeholder)
```

## Routing (App.tsx)

- `/` → LandingPage (with LandingLayout)
- `/login`, `/register` → standalone, no layout
- Protected via `<Route element={<ProtectedRoute />}>` wrapping `<Route element={<AppLayout />}>`:
  - `/dashboard`, `/documents/:id`, `/profile`
- Catch-all → `/`
- ProtectedRoute uses `Outlet` pattern and waits for `AuthProvider`'s `isLoading` before deciding

## Auth Flow

- `AuthProvider` on mount calls `GET /api/v1/auth/me` if token exists in localStorage
- `AuthResponse` has token + email/firstName/lastName/role (NO id)
- `AuthContext`: user, token, isAuthenticated, isLoading, login(), logout()
- Axios interceptor: attaches `Bearer <token>`, on 401 → if NOT auth endpoint clears token and redirects to `/login`
- `getErrorMessage(err, fallback)` in `api/utils.ts` extracts real backend error from Axios error

## Design Decisions

### Theme
- Word blue `#2B579A` primary
- Merriweather (Google Fonts CDN) for headings, Source Sans 3 for body, Roboto fallback
- `borderRadius: 8` global default
- Theme component overrides use `MuiCssBaseline` not `CssBaseline` (MUI v6)

### Login/Register Pages
- Centered card with animated radial-gradient mesh background using `::before` pseudo-element + opacity fade (smooth, GPU-accelerated)
- 3px blue top border accent on card
- React Hook Form validation
- Email already-registered error clears email field + shows red error using `setError` + `resetField`, `clearErrors` on typing

### Dashboard
- Greeting time-aware: `Working late` (<5), `Good morning` (<12), `Good afternoon` (<18), `Good evening` (else)
- Document cards with hover lift + staggered fade-in animation (`animationDelay: idx * 40`)
- Skeleton loading using MUI Skeleton component
- 300ms debounced search via `useDebounce` hook (client-side filtering on already-fetched docs)
- Grid/List view toggle
- NewDocumentDialog asks for title first (innovative flow vs Google Docs auto-create)
- Dialogs use `key` prop in parent to force remount instead of useEffect to reset state (avoids ESLint `react-hooks/set-state-in-effect`)

### Editor (most complex page)
- **DocumentBar** (NOT sticky — scrolls away) — title (inline editable), save status, permission badge, History/Share/Export/Save buttons
- **EditorToolbar** (sticky at `top: 60`) — TipTap formatting controls, takes over the DocumentBar position when scrolling
- **Preview Banner** (sticky at `top: 108`, below toolbar) — shown when previewing an older version, has Exit/Restore buttons
- **Paper-like centered editor surface** (max-width 880px, generous padding)
- **TipTap v3** with extensions: StarterKit (link disabled), Underline, TextAlign, Link (extended with `inclusive: false`), Image, Table set, TaskList/Item, Placeholder, CharacterCount, Typography, TextStyle, Color, Highlight
- **Custom keyboard handling**: Tab indents in lists / inserts spaces in text, Ctrl+Click opens links in new tab
- **Auto-save** every 3s after stop typing + manual Ctrl+S
- **SaveStatus** next to title: Saved / Saving / Unsaved / Error
- **BubbleMenuBar** dark pill appears on text selection with Bold/Italic/Underline/Strike/Code/Link/RemoveLink
- **TableFloatingMenu** appears at bottom when cursor inside table — add/remove rows/cols, delete table
- **Right side panel** (persistent Drawer 380px, pushes editor) with tabs: History, People, Share
- **Version preview** loads version content into editor read-only; main page banner shows when previewing with Exit/Restore buttons
- **Image upload** by URL only (file upload = TODO)
- Editor saves on `visibilitychange` (tab switch) in addition to beforeunload

### Save Status Management (CRITICAL — RECENTLY FIXED)
- Single source of truth: `EditorPage` manages `saveState` directly inside `handleAutoSave`
- `setSaveState("saving")` at start of save, `setSaveState("saved")` on success, `setSaveState("error")` on failure
- `suppressUpdateRef` (useRef) prevents programmatic content changes (preview/exit/restore) from falsely marking the document as unsaved
- `setEditorContentSilent()` helper wraps all `editor.commands.setContent()` calls to set the suppression flag
- `useDocument` hook does NOT show success snackbar on save — SaveStatus indicator handles this
- `useDocument` re-throws errors so `EditorPage` can set its own error state

## MUI v6 Migration Notes (Critical)

- `Grid` → `Grid2` from `@mui/material/Grid2`, uses `size={{ xs: 6 }}` syntax
- `PaperProps` → `slotProps={{ paper: {...} }}` on Menu/Dialog
- `CssBaseline` override key in theme is `MuiCssBaseline` not `CssBaseline`
- `BubbleMenu` import path: `@tiptap/react/menus`
- `TextStyle` is named export: `import { TextStyle } from "@tiptap/extension-text-style"`
- `Color` is also named export
- TipTap v3: `Table` extension consolidates Table/TableRow/TableCell/TableHeader; `TaskList`/`TaskItem` come from `@tiptap/extension-list`
- TipTap v3 requires `@tiptap/pm` peer dependency
- Use `immediatelyRender: false` in useEditor for SSR safety
- `e.returnValue` in beforeunload is deprecated — use only `e.preventDefault()`

## ESLint Patterns Used

- `void fetch();` inside useEffect to handle async functions
- `err instanceof Error ? err.message : "fallback"` for error handling (or use `getErrorMessage()` helper)
- Hooks must be called BEFORE any early returns (rule of hooks) — use `<Navigate>` component for redirects
- `key` prop pattern on dialogs to force remount instead of useEffect resetting state
- `tiptap.d.ts` file with `/// <reference types="..." />` lines for all TipTap extensions to fix TypeScript chain command errors
- Some `// eslint-disable-next-line react-hooks/set-state-in-effect` comments where the pattern is intentional and correct

## Recent Fixes Applied (Reference)

1. **Save status stuck on "Saving..."** — removed useEffect watching `isSaving`; `EditorPage.handleAutoSave` now manages save state directly with single source of truth
2. **False "Unsaved changes" after preview/restore** — `suppressUpdateRef` flag + `setEditorContentSilent()` helper prevent programmatic content changes from triggering update events
3. **Toolbar visibility while scrolling** — DocumentBar is NOT sticky, EditorToolbar IS sticky at `top: 60`. When scrolling, DocumentBar scrolls away and toolbar takes its place
4. **Preview banner positioning** — `top: 108` to sit below the sticky toolbar (toolbar at 60 + ~48 toolbar height)
5. **No success snackbar spam** — `useDocument.updateDocument` no longer shows snackbar on success
6. **Errors re-thrown from hooks** — `useDocument.updateDocument` re-throws so EditorPage can catch and show error state
7. **Tab key handling** — always preventDefault, indents in lists or inserts spaces in regular text
8. **Link "inclusive: false"** — typing after a link does NOT extend the link mark
9. **Ctrl+Click on link** — opens link in new tab even in edit mode
10. **Editor focus outline removed** — aggressive CSS in Editor.css with multiple selectors

## Known Issues

- None currently — all major bugs from recent sessions are fixed

## Open TODOs (Frontend)

### High Priority — Scaling Improvements (NEXT)
- **Pagination** support in hooks/components when backend adds it:
  - `useDocuments` should accept `page` and `size` params
  - Dashboard should show pagination controls
  - Same for `useVersions` and user search in SharePanel
- **Move content length to frontend**:
  - In `EditorPage.handleAutoSave`, calculate `editor.getText().length` (TipTap built-in)
  - Add `contentLength` field to `UpdateDocumentRequest` type
  - Pass it in the API call — backend will use it instead of recalculating

### Other TODOs
- PDF export (jsPDF + html2canvas) — removed from deps, need to re-add
- File upload for images (currently URL only) — needs backend endpoint first
- `.docx`/`.md`/`.txt` import using mammoth
- ProfilePage actual implementation (currently placeholder — needs view/edit firstName, lastName)
- LandingPage hero/features/CTA implementation (currently placeholder)
- Address any remaining ESLint `react-hooks/set-state-in-effect` warnings throughout the app
- Code-split editor page via `React.lazy()` for smaller initial dashboard bundle

## Development Notes

- User on Windows, IntelliJ Ultimate, username "Mishoe"
- Project located at `C:\Users\Mishoe\Desktop\Faks\VebP_2025\Draftly\Draftly_FE\`
  - Parent folder `Draftly\` contains both `Draftly_BE\` and `Draftly_FE\`
  - Can open parent folder in IntelliJ to work on both at once
  - Backend and frontend are SEPARATE git repos
- Claude Code can be used from parent folder for full-stack changes
- Vite locked to port 3000 in `vite.config.ts`
- Google Fonts loaded via CDN in `index.html` — internet required for fonts to load (graceful fallback to default serif/sans-serif)
- npm packages pinned (no `^`) for supply chain safety; `min-release-age=3` in `.npmrc`

## Backend Reference

Backend at `http://localhost:8080`. CORS configured to allow `http://localhost:3000`. See backend CLAUDE.md for endpoint list. JWT stored in `localStorage` under key `token`.
