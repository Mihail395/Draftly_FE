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
- (PLANNED for collaboration) yjs, y-websocket, y-prosemirror,
  @tiptap/extension-collaboration, @tiptap/extension-collaboration-cursor
- Mammoth (planned for .docx import — not yet integrated)
- jspdf was removed temporarily — will re-add for PDF export later

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
│   │   useProfile, useSnackbar, useDebounce, useAutoSave, useInView
├── providers/
│   ├── AuthProvider.tsx (incl. refreshUser), SnackbarProvider.tsx
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
    │   ├── editor/         Editor.css (TipTap content styles), SaveStatus, EditableTitle,
    │   │   │               LinkDialog, ImageUploadDialog, ColorPickerButton,
    │   │   │               EditorToolbar, BubbleMenuBar, TipTapEditor, DocumentBar,
    │   │   │               TableFloatingMenu
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
- **EditorToolbar** (sticky at `top: 60`) — TipTap formatting controls, takes over the DocumentBar position when scrolling
- **Preview Banner** (sticky at `top: 108`, below toolbar) — shown when previewing an older version, has Exit/Restore buttons
- **Paper-like centered editor surface** (max-width 880px, generous padding)
- **TipTap v3** with extensions: StarterKit (link disabled, underline disabled — added separately),
  Underline, TextAlign, Link (extended with `inclusive: false`), Image, Table set, TaskList/Item,
  Placeholder, CharacterCount, Typography, TextStyle, Color, Highlight
- **Custom keyboard handling**: Tab indents in lists / inserts spaces in text, Ctrl+Click opens links in new tab
- **Auto-save** every 3s after stop typing + manual Ctrl+S; sends contentLength (editor.getText().length)
- **SaveStatus** next to title (pill style): Saved (green) / Saving / Unsaved / Error
- **BubbleMenuBar** dark pill appears on text selection with Bold/Italic/Underline/Strike/Code/Link/RemoveLink
- **TableFloatingMenu** appears at bottom when cursor inside table — add/remove rows/cols, delete table
- **Right side panel** (persistent Drawer 380px, pushes editor) with tabs: History, People, Share
- **Version preview** loads version content into editor read-only; main page banner shows when previewing
- **Image upload** by URL only (file upload = TODO)
- Editor saves on `visibilitychange` (tab switch) in addition to beforeunload

### Save Status Management
- Single source of truth: `EditorPage` manages `saveState` directly inside `handleAutoSave`
- `setSaveState("saving")` at start of save, `setSaveState("saved")` on success, `setSaveState("error")` on failure
- `suppressUpdateRef` (useRef) prevents programmatic content changes (preview/restore) from falsely marking unsaved
- `setEditorContentSilent()` helper wraps `editor.commands.setContent()` calls to set the suppression flag
- `useDocument` hook does NOT show success snackbar on save; re-throws errors so EditorPage sets error state
- NOTE: the suppressUpdateRef + setEditorContentSilent machinery will be RETIRED when collaboration lands
  (see Real-Time Collaboration section — live restore is dropped)

## Real-Time Collaboration (Yjs — Option 2 auth)  [PLANNED / IN PROGRESS]

Adding live multi-user editing + live cursors via Yjs. Decisions:

- **Libraries:** `yjs`, `y-websocket`, `y-prosemirror`, `@tiptap/extension-collaboration`,
  `@tiptap/extension-collaboration-cursor`
- **Yjs is the LIVE layer only.** The Spring Boot `documents` table stays the real storage. The live Yjs
  doc is serialized to text and saved through the EXISTING save flow (`PUT /api/v1/documents/{id}`).
- **Sync server:** a SEPARATE Node process at `Draftly/collab-server` running `@y/websocket-server` (the
  maintained successor to the old bundled server), in-memory relay on ws://localhost:1234, no auth/persistence.
  IMPORTANT: the FRONTEND installs and imports the stable `y-websocket` package for `WebsocketProvider`
  (`import { WebsocketProvider } from 'y-websocket'`) — this is unchanged. Only the relay SERVER uses
  `@y/websocket-server`. Do not confuse the two..
- **Auth (Option 2):** before opening the WebSocket, the frontend makes an authenticated REST call to Spring
  Boot asking "may I access document X?". Only on yes does it open the Yjs `WebsocketProvider`. The Node
  server stays a dumb unauthenticated relay.
- **Version history is NON-LIVE.** Snapshots are saved copies of serialized content (existing flow).
  Restore = reload the doc from saved content, NOT injection into the live Yjs session. Live restore dropped.

### Required editor changes (when implementing)
- Disable StarterKit `history` (Yjs Collaboration owns undo/redo) — add `history: false` to StarterKit.configure
- Stop setting editor `content` directly; instead hydrate initial content into the Yjs doc on load
- Remove/retire the `suppressUpdateRef` + `setEditorContentSilent()` preview-restore machinery (live restore dropped)
- Keep existing extensions (Tab-in-lists, link mark `inclusive: false`, etc.) — unaffected
- Add Collaboration + CollaborationCursor extensions bound to the Yjs doc + provider awareness

### Persistence note
The Yjs relay is transient/in-memory. If all clients disconnect from a document, the relay loses that doc's
live state; the next client to open it rehydrates the Yjs doc from the DB content. Expected and acceptable
for this local project.

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
2. **Preview/restore** — suppressUpdateRef + setEditorContentSilent prevent false "unsaved" (TO BE RETIRED with collab)
3. **Toolbar/DocumentBar scroll** — DocumentBar not sticky, EditorToolbar sticky at top:60
4. **Content length to frontend** — handleAutoSave sends editor.getText().length as contentLength
5. **Pagination** — useDocuments + useVersions paginated; MUI Pagination on dashboard + history panel
6. **Server-side search** — dashboard search sends `search` param to backend, searches ALL docs
7. **Tab handling, link inclusive:false, Ctrl+Click links, focus outline removed** — editor polish
8. **Landing page** — full build with mockups + scroll animations
9. **Profile page** — two-column settings with name edit + change password + logout
10. **refreshUser in AuthContext** — name changes propagate to navbar/sidebar instantly

## Open TODOs (Frontend)

### Collaboration (current focus)
- Install Yjs deps; add Collaboration + CollaborationCursor extensions
- Gate WebsocketProvider on the Spring Boot collab-access check (Option 2)
- Disable StarterKit history; hydrate into Yjs; retire suppressUpdateRef/setEditorContentSilent
- See Real-Time Collaboration section

### Known minor console warnings (low priority)
- `<button> inside <button>` in DocumentCard (CardActionArea wraps an IconButton) — needs component="div" fix
- TipTap "Duplicate extension: underline" — fix by adding `underline: false` to StarterKit.configure

### Other TODOs
- PDF export (jsPDF + html2canvas) — removed from deps, need to re-add
- File upload for images (currently URL only) — needs backend endpoint first
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
