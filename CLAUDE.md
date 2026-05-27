# CLAUDE.md — Draftly Frontend

## Project Overview

Frontend for Draftly — a Google Docs-like collaborative document editing application.
Built with React TypeScript + Vite. Connects to Spring Boot backend at `http://localhost:8080`.
Local development only — no deployment/hosting required.

---

## Tech Stack

| Concern            | Choice                          |
|--------------------|---------------------------------|
| Language           | TypeScript                      |
| Framework          | React 18                        |
| Build Tool         | Vite (port 3000)                |
| UI Library         | Material UI (MUI v5)            |
| Rich Text Editor   | TipTap                          |
| HTTP Client        | Axios                           |
| Routing            | React Router v6                 |
| State Management   | React Context API               |
| Form Handling      | React Hook Form                 |
| PDF Export         | jsPDF + html2canvas             |
| Word Import        | mammoth.js                      |

---

## Dependencies

### MUI
- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`

### TipTap Extensions
- `@tiptap/react`
- `@tiptap/starter-kit` — bold, italic, headings, lists, blockquote, code
- `@tiptap/extension-underline` — underline text
- `@tiptap/extension-text-align` — left, center, right, justify alignment
- `@tiptap/extension-link` — clickable hyperlinks
- `@tiptap/extension-image` — insert images
- `@tiptap/extension-table` — insert and edit tables
- `@tiptap/extension-table-row`
- `@tiptap/extension-table-cell`
- `@tiptap/extension-table-header`
- `@tiptap/extension-placeholder` — placeholder text when editor is empty
- `@tiptap/extension-character-count` — word and character count
- `@tiptap/extension-code-block-lowlight` — syntax highlighted code blocks
- `@tiptap/extension-task-list` — checkbox todo lists
- `@tiptap/extension-task-item`
- `@tiptap/extension-typography` — smart quotes, em dashes
- `@tiptap/extension-color` — text color picker
- `@tiptap/extension-text-style` — required by Color extension
- `@tiptap/extension-highlight` — text highlighting

### Other
- `axios`
- `react-router-dom`
- `react-hook-form`
- `jspdf`
- `html2canvas`
- `mammoth`
- `lowlight` — required by CodeBlockLowlight extension

---

## Project Structure

```
src/
├── api/
│   ├── authAPI.ts               ← register, login, getCurrentUser
│   ├── documentAPI.ts           ← CRUD, search, filter, sort, rename
│   ├── collaboratorAPI.ts       ← share, remove, list collaborators
│   ├── versionAPI.ts            ← get versions, restore version
│   ├── userAPI.ts               ← get profile, update, search by email
│   └── types/
│       ├── auth.types.ts        ← LoginRequest, RegisterRequest, AuthResponse
│       ├── document.types.ts    ← DocumentResponse, DocumentSummaryResponse, CreateDocumentRequest, UpdateDocumentRequest, Permission, DocumentFilter, SortField
│       ├── collaborator.types.ts← ShareDocumentRequest, CollaboratorResponse
│       ├── version.types.ts     ← VersionResponse
│       └── user.types.ts        ← UserResponse, UpdateUserRequest
│
├── axios/
│   └── axiosInstance.ts         ← Axios instance with base URL + JWT interceptor + 401 redirect
│
├── context/
│   └── AuthContext.tsx          ← Auth state shape: user, token, login(), logout(), isAuthenticated
│
├── hooks/
│   ├── useAuth.ts               ← Access AuthContext
│   ├── useDocuments.ts          ← Fetch and manage documents list for dashboard
│   ├── useDocument.ts           ← Fetch single document for editor
│   ├── useCollaborators.ts      ← Fetch and manage collaborators
│   └── useVersions.ts           ← Fetch and manage version history
│
├── providers/
│   └── AuthProvider.tsx         ← Wraps app with AuthContext, restores session on load via /me
│
└── ui/
    ├── components/
    │   ├── common/
    │   │   ├── ProtectedRoute.tsx       ← Redirects to /login if not authenticated
    │   │   ├── LoadingSpinner.tsx       ← MUI CircularProgress wrapper
    │   │   └── ErrorMessage.tsx         ← MUI Alert error display
    │   ├── layout/
    │   │   ├── Navbar.tsx               ← Top navigation bar with logo, user menu, logout
    │   │   └── PageLayout.tsx           ← Common page wrapper with Navbar
    │   ├── dashboard/
    │   │   ├── DocumentCard.tsx         ← Single document card in grid view
    │   │   ├── DocumentList.tsx         ← Renders documents in grid or list view
    │   │   ├── DocumentFilters.tsx      ← Filter (ALL/OWNED/SHARED) + Sort controls
    │   │   └── SearchBar.tsx            ← Debounced document title search input
    │   ├── editor/
    │   │   ├── TipTapEditor.tsx         ← Main TipTap editor component with all extensions
    │   │   ├── EditorToolbar.tsx        ← Formatting toolbar (bold, italic, align, color etc.)
    │   │   └── EditorMenuBar.tsx        ← Top menu bar (File, Edit, Insert etc.)
    │   ├── collaboration/
    │   │   ├── ShareDialog.tsx          ← Dialog for sharing document with users
    │   │   ├── CollaboratorList.tsx     ← List of collaborators with permission badges
    │   │   └── UserSearchInput.tsx      ← Search users by email for sharing
    │   └── versions/
    │       ├── VersionHistoryPanel.tsx  ← Side panel showing version list
    │       └── VersionItem.tsx          ← Single version row with restore button
    │
    └── pages/
        ├── LoginPage.tsx                ← Login form
        ├── RegisterPage.tsx             ← Register form
        ├── DashboardPage.tsx            ← Document list + search + filters + create button
        ├── EditorPage.tsx               ← Full document editor page
        └── ProfilePage.tsx              ← User profile view and edit
```

---

## Routing

```
/                    → redirect to /dashboard if logged in, else /login
/login               → LoginPage (public)
/register            → RegisterPage (public)
/dashboard           → DashboardPage (protected)
/documents/:id       → EditorPage (protected)
/profile             → ProfilePage (protected)
```

All routes except `/login` and `/register` are protected.
Unauthenticated users are redirected to `/login`.

---

## API Layer

Each file in `api/` maps directly to a backend controller.
All calls go through the Axios instance so the JWT token is always attached automatically.

### `authAPI.ts` → `/api/v1/auth`
- `register` → `POST /register`
- `login` → `POST /login`
- `getCurrentUser` → `GET /me`

### `documentAPI.ts` → `/api/v1/documents`
- `getAllDocuments(filter, sort)` → `GET /`
- `createDocument(request)` → `POST /`
- `getDocumentById(id)` → `GET /:id`
- `updateDocument(id, request)` → `PUT /:id`
- `deleteDocument(id)` → `DELETE /:id`
- `renameDocument(id, title)` → `PATCH /:id/rename`
- `searchDocuments(title)` → `GET /search?title=`

### `collaboratorAPI.ts` → `/api/v1/documents/:id/collaborators`
- `getCollaborators(documentId)` → `GET /`
- `addCollaborator(documentId, request)` → `POST /`
- `removeCollaborator(documentId, userId)` → `DELETE /:userId`

### `versionAPI.ts` → `/api/v1/documents/:id/versions`
- `getVersions(documentId)` → `GET /`
- `restoreVersion(documentId, versionId)` → `PUT /:versionId/restore`

### `userAPI.ts` → `/api/v1/users`
- `getUserById(id)` → `GET /:id`
- `updateUser(id, request)` → `PUT /:id`
- `searchUsersByEmail(email)` → `GET /search?email=`

---

## Types

All types in `api/types/` mirror the backend DTOs exactly.
Use the same field names as the backend response JSON.

### `auth.types.ts`
- `LoginRequest` — email, password
- `RegisterRequest` — firstName, lastName, email, password
- `AuthResponse` — token, email, firstName, lastName, role

### `document.types.ts`
- `DocumentSummaryResponse` — id, title, ownerName, permission, createdAt, updatedAt
- `DocumentResponse` — id, title, content, ownerName, permission, createdAt, updatedAt
- `CreateDocumentRequest` — title
- `UpdateDocumentRequest` — title, content
- `Permission` — union type: 'OWNER' | 'EDIT' | 'VIEW'
- `DocumentFilter` — union type: 'ALL' | 'OWNED' | 'SHARED'
- `SortField` — union type: 'TITLE' | 'CREATED_AT' | 'UPDATED_AT'

### `collaborator.types.ts`
- `CollaboratorResponse` — userId, email, fullName, permission
- `ShareDocumentRequest` — email, permission ('EDIT' | 'VIEW')

### `version.types.ts`
- `VersionResponse` — id, savedByName, createdAt

### `user.types.ts`
- `UserResponse` — id, email, firstName, lastName
- `UpdateUserRequest` — firstName, lastName

---

## Axios Instance

- Base URL: `http://localhost:8080`
- Request interceptor: reads token from `localStorage` and attaches `Authorization: Bearer <token>` header to every request
- Response interceptor: on 401 response, clears token from `localStorage` and redirects to `/login`

---

## Auth Context

Stores globally: `user` (UserResponse), `token` (string), `isAuthenticated` (boolean)
Exposes: `login(token, user)`, `logout()`

On app load (`AuthProvider`):
- If token exists in `localStorage` → call `GET /api/v1/auth/me` to restore the user session
- If `/me` fails (expired token) → clear token and treat as logged out

On `login()`: save token to `localStorage`, set user and token in context
On `logout()`: clear `localStorage`, clear context, redirect to `/login`

---

## Theme & Styling

- **Primary color:** Microsoft Word blue — `#2B579A`
- **Dark primary:** `#185ABD`
- **Background:** `#F5F5F5` (light grey like Word's background)
- **Paper/Card:** `#FFFFFF`
- **Font:** Roboto (MUI default)
- **Mode:** Light only

Define theme in `theme.ts` at the root of `src/` and wrap the app with `ThemeProvider`.

---

## TipTap Editor

- Editor content is stored and sent to backend as a **JSON string**
- When loading a document, parse the JSON string back into TipTap editor format
- If content is `null` (new document), initialize editor with empty content
- Editor is **read-only** when the current user's permission is `VIEW`
- Show character and word count using `CharacterCount` extension

---

## Forms

All forms use **React Hook Form** with MUI `TextField` components.
Validation is handled by React Hook Form rules — no manual state for errors.
Forms: LoginPage, RegisterPage, ShareDialog, ProfilePage.

---

## Coding Conventions

- All components are functional components with TypeScript
- Use custom hooks for all data fetching — never call API directly from components
- All API types mirror backend DTOs exactly — same field names, same structure
- Use MUI components for all UI — avoid custom CSS unless absolutely necessary
- Use React Hook Form for all forms
- Always handle loading and error states in components that fetch data
- Never store sensitive data in `localStorage` except the JWT token
- Use `async/await` with `try/catch` for all API calls
- Use `Permission` type to conditionally render UI (e.g. hide edit button for VIEW users)

---

## Permission-Based UI Rules

| Action | OWNER | EDIT | VIEW |
|---|---|---|---|
| Edit document content | ✅ | ✅ | ❌ (read-only editor) |
| Save document | ✅ | ✅ | ❌ (no save button) |
| Rename document | ✅ | ✅ | ❌ |
| Delete document | ✅ | ❌ | ❌ |
| Share document | ✅ | ❌ | ❌ |
| Remove collaborator | ✅ | ❌ | ❌ |
| View version history | ✅ | ✅ | ✅ |
| Restore version | ✅ | ✅ | ❌ |

---

## Pages Overview

### `LoginPage`
- Email + password form using React Hook Form
- On success: save token + user to context and localStorage, redirect to `/dashboard`
- Link to `/register`

### `RegisterPage`
- firstName, lastName, email, password form using React Hook Form
- On success: same as login (auto logged in after register)
- Link to `/login`

### `DashboardPage`
- Fetches all documents via `useDocuments` hook
- Search bar (debounced) filters by title
- Filter tabs: ALL / OWNED / SHARED WITH ME
- Sort controls: Title / Created Date / Last Modified
- Toggle between grid and list view
- Create document button → dialog for title input → redirect to editor
- Each document card shows: title, owner name, permission badge, last modified
- Right click or menu on card: rename, delete (OWNER only)

### `EditorPage`
- Fetches document by ID via `useDocument` hook
- Editable title at the top
- Full TipTap editor with toolbar
- Save button → calls `updateDocument` → shows saved indicator
- Unsaved changes indicator when content has been modified
- Version history panel (toggle open/close from toolbar)
- Share dialog (OWNER only) — search users by email, assign permission
- Collaborators panel — list of people with access
- Export PDF button
- Import file button (.docx, .md, .txt)
- Read-only mode when permission is VIEW

### `ProfilePage`
- Shows current user's email, firstName, lastName
- Edit form for firstName and lastName using React Hook Form
- Save button calls `updateUser`

---

## Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. App runs at: `http://localhost:3000`
4. Backend must be running at: `http://localhost:8080`
