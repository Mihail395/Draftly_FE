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
- Collaboration (INSTALLED): `yjs` 13.6.31, `y-websocket` 3.0.0, `y-prosemirror` 1.3.7,
  `@tiptap/extension-collaboration` + `@tiptap/extension-collaboration-caret` (note: `-caret`, the TipTap v3
  rename of the old `-cursor` extension)
- Mammoth (installed, planned for .docx import — not yet integrated)
- PDF export (INSTALLED): `pdfmake` 0.2.23 + `html-to-pdfmake` 2.5.33 (pinned), dev `@types/pdfmake` 0.2.11.
  (jspdf was never re-added — pdfmake gives searchable text-based PDFs instead.)

## Project Structure

```
src/
├── api/
│   ├── types/  common.ts (PageResponse<T>), auth.ts, user.ts (incl. ChangePasswordRequest),
│   │           document.ts (UpdateDocumentRequest incl. contentLength), collaborator.ts, version.ts
│   ├── authAPI.ts, documentAPI.ts, collaboratorAPI.ts, versionAPI.ts, userAPI.ts
│   └── utils.ts  (getErrorMessage helper that reads err.response.data.message from Axios errors)
├── axios/
│   └── axiosInstance.ts  (JWT interceptor, 401 redirect with isAuthEndpoint check)
├── context/
│   ├── AuthContext.tsx (incl. refreshUser), SnackbarContext.tsx
├── hooks/
│   ├── useAuth, useDocuments (paginated), useDocument, useCollaborators, useVersions (paginated),
│   │   useProfile, useSnackbar, useDebounce, useAutoSave, useInView, useCollaboration (Yjs gate+session)
├── providers/
│   ├── AuthProvider.tsx (incl. refreshUser), SnackbarProvider.tsx
├── theme.ts  (MUI theme — primary #2B579A Word blue, Merriweather serif headings,
│              Source Sans 3 body. Use MuiCssBaseline not CssBaseline)
├── tiptap.d.ts  (TipTap type references for all extensions — fixes TS errors with chain commands)
├── html-to-pdfmake.d.ts  (ambient type shim — html-to-pdfmake ships no types)
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
    │   ├── editor/         Editor.css (TipTap content styles), SaveStatus, EditableTitle,
    │   │   │               LinkDialog, ImageUploadDialog, ColorPickerButton,
    │   │   │               EditorToolbar, BubbleMenuBar, TipTapEditor (live/collaborative),
    │   │   │               VersionPreview (read-only, non-collab), editorExtensions.ts
    │   │   │               (shared buildBaseExtensions), exportToPdf.ts (PDF export util),
    │   │   │               DocumentBar, TableFloatingMenu
    │   │   └── side-panel/ EditorSidePanel (tabbed drawer), HistoryPanel (with preview/restore),
    │   │                   CollaboratorsPanel, SharePanel (debounced user search)
    │   ├── landing/        FeatureRow, landingColors.ts, mockups/ (HeroEditorMock, AutoSaveMock,
    │   │                   VersionHistoryMock, FormattingMock)
    │   └── profile/        ProfileSidebar, ProfileSection, ProfileInfoForm, ProfileAccountInfo,
    │                       ProfileSecurityForm, ProfileDangerZone
    └── pages/  LandingPage (DONE — hero + feature rows + CTA), LoginPage, RegisterPage,
                DashboardPage (paginated), EditorPage, ProfilePage (DONE — two-column settings)
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
- `AuthContext`: user, token, isAuthenticated, isLoading, login(), logout(), refreshUser()
  - `refreshUser()` re-fetches /me and updates context — used after profile name change so the
    AppNavbar avatar and ProfileSidebar update instantly without a page reload
- Axios interceptor: attaches `Bearer <token>`, on 401 → if NOT auth endpoint clears token and redirects to `/login`
- `getErrorMessage(err, fallback)` in `api/utils.ts` extracts real backend error from Axios error

## Design Decisions

### Theme
- Word blue `#2B579A` primary
- Merriweather (Google Fonts CDN) for headings, Source Sans 3 for body, Roboto fallback
- `borderRadius: 8` global default
- Theme component overrides use `MuiCssBaseline` not `CssBaseline` (MUI v6)

### Landing Page (DONE)
- Cream/paper aesthetic (distinct from app's white) — `landingColors.ts` holds the palette
- Hero with serif headline + tilted editor mockup, 3 alternating FeatureRow sections
  (Auto-save, Version history, Rich formatting), dark navy final CTA
- `useInView` hook drives scroll-triggered fade-up animations
- Mockups are static visual-only components under `landing/mockups/` (NOT interactive)

### Profile Page (DONE)
- Two-column: sticky ProfileSidebar (avatar + name + email) + stacked ProfileSection cards
- Sections: Profile information (edit firstName/lastName), Account (read-only email),
  Security (change password), Session (logout)
- `useProfile` hook handles updateName + changePassword; takes refreshUser callback so name
  changes propagate to navbar/sidebar instantly
- ProfileInfoForm Save button disabled until dirty; ProfileSecurityForm has show/hide toggles + validation

### Dashboard
- Greeting time-aware: `Working late` (<5), `Good morning` (<12), `Good afternoon` (<18), `Good evening` (else)
- Document cards with hover lift + staggered fade-in animation
- Skeleton loading using MUI Skeleton component
- 300ms debounced search — sends `search` param to backend (server-side, searches ALL docs not just current page)
- Grid/List view toggle
- MUI Pagination at bottom; resets to page 0 on filter/sort/search change; hidden when totalPages <= 1
- NewDocumentDialog asks for title first
- Dialogs use `key` prop in parent to force remount (avoids ESLint `react-hooks/set-state-in-effect`)

### Editor (most complex page)
- **DocumentBar** (NOT sticky — scrolls away) — title (inline editable), save status, permission badge, History/Share/Export/Save buttons
- **PDF export** (Export button) — `exportToPdf.ts` converts `editor.getHTML()` via pdfmake + html-to-pdfmake
  into a searchable, text-based PDF approximating the editor theme (Roboto embedded; fonts approximated by
  size/weight). Read-only (no save/editor/Yjs side effects); disabled during version preview so it always
  captures the LIVE doc; shows a spinner while generating. Images are NOT embedded yet (URL-only images can't
  be fetched by pdfmake) — replaced with a placeholder; real embedding will come with image file upload.
- **EditorToolbar** (sticky at `top: 60`) — TipTap formatting controls, takes over the DocumentBar position when scrolling
- **Preview Banner** (sticky at `top: 108`, below toolbar) — shown when previewing an older version, has Exit/Restore buttons
- **Paper-like centered editor surface** (max-width 880px, generous padding)
- **Shared extension set in `editorExtensions.ts`** (`buildBaseExtensions`): StarterKit (link/underline
  disabled — added separately; `undoRedo: false` since Yjs owns history), Underline, TextAlign, Link
  (extended with `inclusive: false`), Image, Table set, TaskList/Item, Placeholder, CharacterCount,
  Typography, TextStyle, Color, Highlight. Both the live `TipTapEditor` and read-only `VersionPreview`
  reuse it so they render identically; the live editor additionally adds Collaboration + CollaborationCaret.
- **Custom keyboard handling**: Tab indents in lists / inserts spaces in text, Ctrl+Click opens links in new tab
- **Auto-save** every 3s after stop typing + manual Ctrl+S; serializes the live Yjs editor state at save time
  (`editor.getJSON()`) + sends contentLength (`editor.getText().length`)
- **SaveStatus** next to title (pill style): Saved (green) / Saving / Unsaved / Error
- **BubbleMenuBar** dark pill appears on text selection with Bold/Italic/Underline/Strike/Code/Link/RemoveLink
- **TableFloatingMenu** appears at bottom when cursor inside table — add/remove rows/cols, delete table
- **Right side panel** (persistent Drawer 380px, pushes editor) with tabs: History, People, Share
- **Version preview** renders into a SEPARATE read-only `VersionPreview` editor (no Yjs binding); the live
  editor stays mounted but hidden so the collab session + remote-edit persistence keep running during preview
- **Image upload** by URL only (file upload = current-focus TODO)
- Editor saves on `visibilitychange` (tab switch) in addition to beforeunload

### Save Status Management
- Single source of truth: `EditorPage` manages `saveState` directly inside `handleAutoSave`
- `setSaveState("saving")` at start of save, `setSaveState("saved")` on success, `setSaveState("error")` on failure
- `useDocument` hook does NOT show success snackbar on save; re-throws errors so EditorPage sets error state
- NOTE: the old `suppressUpdateRef` + `setEditorContentSilent()` machinery was RETIRED when collaboration landed.
  Programmatic content writes now pass `{ emitUpdate: false }` to `editor.commands.setContent()` (used by Yjs
  hydration and restore) so they don't falsely mark the doc unsaved. Preview no longer touches the live editor.

## Real-Time Collaboration (Yjs — Option 2 auth)  [IMPLEMENTED]

Live multi-user editing + live cursors via Yjs. How it works:

- **Libraries:** `yjs`, `y-websocket`, `y-prosemirror`, `@tiptap/extension-collaboration`,
  `@tiptap/extension-collaboration-caret` (the TipTap v3 rename of `-cursor`). The frontend imports
  `WebsocketProvider` from the stable `y-websocket` package — only the relay SERVER uses `@y/websocket-server`.
- **Sync server:** a SEPARATE Node process at `Draftly/collab-server` running `@y/websocket-server`, in-memory
  relay on `ws://localhost:1234`, no auth/persistence. Must be running for live editing; start with its npm
  `start` script.
- **`useCollaboration(documentId)` hook** is the gate + session: it calls `documentAPI.checkCollabAccess` FIRST,
  and only on `allowed=true` creates the `Y.Doc` + `WebsocketProvider` (room name = document id). Returns
  `{ status: "loading" | "denied" | "ready", ydoc, provider, permission }`. Any failure fails CLOSED (denied),
  so the socket never opens without confirmed access. EditorPage shows a "no access" screen on `denied`.
- **`TipTapEditor` is bound to the Yjs doc** via Collaboration + CollaborationCaret — it takes `ydoc`/`provider`/
  `user` props and does NOT use the `content` option (content lives in the shared Yjs doc; seeding `content`
  per client would duplicate text). Cursor label = user's name + a random per-session color (`CURSOR_COLORS`).
- **Hydration:** EditorPage seeds DB content into the Yjs doc only if the room is still empty (first client),
  gated on `provider.synced`, using `setContent(..., { emitUpdate: false })`. `hydratedRef` guards against
  re-seeding. This avoids duplicating content when joining an existing room.
- **Save:** auto-save serializes the LIVE editor state (`editor.getJSON()`) so concurrent remote edits are
  persisted, not a stale snapshot. Saved through the existing `PUT /api/v1/documents/{id}` flow.
- **Version history is NON-LIVE.** Preview renders into a separate read-only `VersionPreview` editor (no Yjs).
  Restore persists via the existing restore endpoint, then RESETS the live Yjs doc to the restored content with
  `setContent(..., { emitUpdate: false })` (so other clients converge) — a page reload can't work because the
  no-persistence relay keeps the stale room in memory. See memory note "Restore resets live Yjs".
- **Persistence model:** the relay is transient/in-memory. When all clients disconnect, the relay loses that
  doc's live state; the next client rehydrates from DB content. Expected and acceptable for this local project.

## MUI v6 Migration Notes (Critical)

- `Grid` → `Grid2` from `@mui/material/Grid2`, uses `size={{ xs: 6 }}` syntax
- `PaperProps` → `slotProps={{ paper: {...} }}` on Menu/Dialog
- `CssBaseline` override key in theme is `MuiCssBaseline` not `CssBaseline`
- `BubbleMenu` import path: `@tiptap/react/menus`
- `TextStyle` and `Color` are named exports
- TipTap v3: `Table` extension consolidates Table/TableRow/TableCell/TableHeader; `TaskList`/`TaskItem` from `@tiptap/extension-list`
- TipTap v3 requires `@tiptap/pm` peer dependency
- Use `immediatelyRender: false` in useEditor for SSR safety
- `e.returnValue` in beforeunload is deprecated — use only `e.preventDefault()`

## ESLint Patterns Used

- `void fetch();` inside useEffect to handle async functions
- `err instanceof Error ? err.message : "fallback"` for error handling (or use `getErrorMessage()` helper)
- Hooks must be called BEFORE any early returns (rule of hooks) — use `<Navigate>` component for redirects
- `key` prop pattern on dialogs to force remount instead of useEffect resetting state
- `tiptap.d.ts` file with `/// <reference types="..." />` lines for all TipTap extensions
- Some `// eslint-disable-next-line react-hooks/set-state-in-effect` comments where intentional

## Recent Work Completed (Reference)

1. **Save status** — single source of truth in EditorPage.handleAutoSave; SaveStatus is a pill (green when saved)
2. **Preview/restore** — now uses a separate read-only VersionPreview editor; restore resets the live Yjs doc
   (old suppressUpdateRef/setEditorContentSilent machinery RETIRED — see Save Status Management note)
3. **Toolbar/DocumentBar scroll** — DocumentBar not sticky, EditorToolbar sticky at top:60
4. **Content length to frontend** — handleAutoSave sends editor.getText().length as contentLength
5. **Pagination** — useDocuments + useVersions paginated; MUI Pagination on dashboard + history panel
6. **Server-side search** — dashboard search sends `search` param to backend, searches ALL docs
7. **Tab handling, link inclusive:false, Ctrl+Click links, focus outline removed** — editor polish
8. **Landing page** — full build with mockups + scroll animations
9. **Profile page** — two-column settings with name edit + change password + logout
10. **refreshUser in AuthContext** — name changes propagate to navbar/sidebar instantly
11. **Real-time collaboration (Yjs)** — useCollaboration gate+session, Yjs-bound TipTapEditor with live cursors,
    DB→Yjs hydration, separate VersionPreview, collab-server relay; see Real-Time Collaboration section
12. **PDF export** — `exportToPdf.ts` (pdfmake + html-to-pdfmake) renders `editor.getHTML()` to a searchable
    text-based PDF; wired to the DocumentBar Export button with spinner + snackbars; see Editor section

## Open TODOs (Frontend)

### Current focus
- **Image file upload in editor** — let users add images by uploading a file, not just by URL. Extend
  ImageUploadDialog with a file-upload path; needs the backend image upload endpoint first (see backend CLAUDE.md).
  Once images are served from the backend, also embed them in PDF export (exportToPdf.ts currently replaces
  images with a placeholder since remote-URL images can't be fetched by pdfmake).

### Known minor console warnings (low priority)
- `<button> inside <button>` in DocumentCard (CardActionArea wraps an IconButton) — needs component="div" fix
- TipTap "Duplicate extension: underline" — fix by adding `underline: false` to StarterKit.configure

### Other TODOs
- `.docx`/`.md`/`.txt` import using mammoth
- Code-split editor page via `React.lazy()` for smaller initial dashboard bundle

## Development Notes

- User on Windows, IntelliJ Ultimate, username "Mishoe"
- Project located at `C:\Users\Mishoe\Desktop\Faks\VebP_2025\Draftly\Draftly_FE\`
  - Parent folder `Draftly\` contains both `Draftly_BE\` and `Draftly_FE\` (and will contain a small Node relay)
  - Backend and frontend are SEPARATE git repos
- Claude Code can be used from parent folder for full-stack changes
- Vite locked to port 3000 in `vite.config.ts`
- Google Fonts loaded via CDN in `index.html`
- npm packages pinned (no `^`) for supply chain safety; `min-release-age=3` in `.npmrc`

## Backend Reference

Backend at `http://localhost:8080`. CORS allows `http://localhost:3000`. See backend CLAUDE.md for endpoint list.
JWT stored in `localStorage` under key `token`. Collaboration adds a separate Node y-websocket relay (default port 1234).
