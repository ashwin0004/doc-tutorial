# WriteOne — Collaborative Document Workspace

A collaborative workspace for writing, planning and visual thinking. **WriteOne** brings rich-text documents, a shared whiteboard, to-do lists, flowcharts and spreadsheets into one browser-based application.

Built with **Next.js 15, React, TypeScript, Tiptap, Liveblocks, Convex and Clerk**.

[View the source code](https://github.com/ashwin0004/doc-tutorial)

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [Application views](#application-views)
- [Document templates](#document-templates)
- [Technology stack](#technology-stack)
- [How the application works](#how-the-application-works)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running the application](#running-the-application)
- [Available scripts](#available-scripts)
- [Deployment](#deployment)
- [Current scope and notes](#current-scope-and-notes)
- [Future improvements](#future-improvements)
- [Author](#author)
- [License](#license)

---

## Overview

WriteOne is a Google Docs-inspired collaborative editing application. Users can create documents from ready-made templates or start with a blank page, edit content with a rich-text editor, and collaborate with other members in real time.

A document is not limited to text. Each document workspace also provides dedicated views for:

- **Document** — rich-text writing and formatting
- **Whiteboard** — drawing and arranging visual elements
- **To-do** — shared task lists
- **Flowchart** — connected process diagrams
- **Spreadsheet** — collaborative grid-based data entry

The home page provides a template gallery, a searchable document list, pagination, account controls and organization switching.

---

## Features

### Document management

- Create a blank document or create one from a template.
- Rename and delete documents.
- Search documents by title.
- Browse documents with paginated results.
- Organize document access around the signed-in user or the active Clerk organization.
- See connection/synchronization status in the document title area.

### Rich-text editor

The editor is powered by Tiptap and ProseMirror. Its configured extensions and toolbar provide:

- Bold, italic, underline and strikethrough
- Text color and multicolor highlighting
- Heading levels 1–6
- Font family and font-size controls
- Paragraph line-height controls
- Left, center, right and justified text alignment
- Bullet lists and ordered lists
- Task/check lists
- Links
- Images through upload or URL insertion
- Tables with configurable initial row and column counts
- Undo and redo
- Page-style editing layout with a ruler and adjustable left/right margins
- Collaborative comments/threads and collaborator presence

### Real-time collaboration

Liveblocks provides shared room state and live collaboration features, including:

- Collaborative Tiptap editing
- Live cursors and collaborator presence
- Shared whiteboard layers
- Shared to-do items
- Shared flowchart nodes and connections
- Shared spreadsheet cell values and grid sizing
- Undo/redo support in the collaborative canvas and data views
- User information and mention suggestions for organization members

The Liveblocks authorization route checks that the signed-in user owns the document or belongs to the document's organization before granting room access.

### Whiteboard

The whiteboard provides a shared canvas with:

- Selection and movement of elements
- Freehand pencil drawing
- Rectangle and ellipse shapes
- Resize handles for selected shapes
- Color changes for selected elements
- Delete and deselect actions
- Zoom in, zoom out and reset zoom
- Undo and redo
- Live collaborator cursors

### To-do list

- Add tasks
- Mark tasks as completed or incomplete
- Delete tasks
- See task changes in the shared Liveblocks room

### Flowchart editor

The flowchart view is built with React Flow and supports:

- Rectangle nodes for processes
- Circle nodes for start/end points
- Diamond nodes for decisions
- Dragging nodes to reposition them
- Connecting nodes with directional edges
- Renaming a node by double-clicking it
- Deleting selected nodes and edges
- Undo and redo
- Canvas background, zoom controls and minimap
- Printing the flowchart

### Spreadsheet

The spreadsheet view uses `react-spreadsheet` with Liveblocks-backed shared storage.

- Edit cell values
- Add rows and columns
- Insert and delete rows
- Insert and delete columns
- Reorder rows and columns
- Resize rows and columns
- Adjust row-header and column-header dimensions
- Undo and redo
- Collaborate on the same spreadsheet data

**Note:** The current implementation is a collaborative cell grid. The source does not implement a spreadsheet formula/calculation engine.

### Export and print

The document menu includes:

- **JSON** — exports the Tiptap document structure
- **HTML** — exports the editor's HTML
- **Text** — exports plain text; for the to-do, spreadsheet and flowchart views it creates a text representation of that active view
- **PDF** — opens the browser print dialog, where the user can choose a PDF destination
- **Print** — opens the browser print dialog

---

## Application views

| View | Main purpose | Main implementation |
|---|---|---|
| Document | Rich-text writing | Tiptap / ProseMirror |
| Whiteboard | Freehand drawing and shapes | SVG + Liveblocks |
| To-do | Shared task tracking | React + Liveblocks |
| Flowchart | Process diagrams and connectors | React Flow + Liveblocks |
| Spreadsheet | Shared editable grid | react-spreadsheet + Liveblocks |

The views are available from the navigation bar inside a document workspace. Spreadsheet data is initialized as a small empty grid when a room is created.

---

## Document templates

The home page includes these starter templates:

1. Blank Document
2. Software development proposal
3. Project proposal
4. Business letter
5. Resume
6. Cover letter
7. Letter
8. Report
9. Recipe
10. Brochure
11. Class-note

Templates are defined in `src/constants/templates.ts`. Selecting a template creates a document with its initial content.

---

## Technology stack

### Core application

| Technology | Role |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework, App Router and server/client components |
| [React 18](https://react.dev/) | User interface |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application code |
| [Tailwind CSS 3](https://tailwindcss.com/) | Styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |
| [Lucide React](https://lucide.dev/) | Icons |

### Editor and collaboration

| Technology | Role |
|---|---|
| [Tiptap 2](https://tiptap.dev/) | Rich-text editor |
| [ProseMirror](https://prosemirror.net/) | Editor document model |
| [Liveblocks](https://liveblocks.io/) | Real-time collaboration, presence and shared room storage |

### Backend and authentication

| Technology | Role |
|---|---|
| [Convex](https://www.convex.dev/) | Document database, queries and mutations |
| [Clerk](https://clerk.com/) | Authentication and organization identity |

### Canvas and data views

| Technology | Role |
|---|---|
| [React Flow / XYFlow](https://reactflow.dev/) | Flowchart nodes and connections |
| [react-spreadsheet](https://github.com/iddan/react-spreadsheet) | Spreadsheet grid |
| [perfect-freehand](https://github.com/steveruizok/perfect-freehand) | Smooth freehand stroke geometry |
| [html-to-image](https://github.com/bubkoo/html-to-image) | Flowchart image generation for printing |

Other project dependencies include Zustand for client state, React Hook Form, Zod, date-fns, Sonner, next-themes, nuqs and supporting Radix UI components.

---

## How the application works

### 1. Authentication — Clerk

The application uses Clerk for sign-in and user identity. The home and document interfaces include user controls and an organization switcher.

The document page requests a Clerk token using the `convex` JWT template before preloading document data.

### 2. Document data — Convex

The Convex `documents` table stores document metadata, including:

- Title
- Owner ID
- Optional initial content
- Optional Liveblocks room ID
- Optional organization ID
- Optional document type

Convex queries and mutations handle document creation, listing, searching, renaming and deletion. The list is scoped to the signed-in user or the current organization.

### 3. Live collaboration — Liveblocks

Each document workspace uses a Liveblocks room keyed by its document ID. The room stores collaborative editor state and shared data for the other views.

The application initializes storage for whiteboard layers, to-do items, flowchart nodes and edges, spreadsheet cells, and spreadsheet row/column sizing. Cursor presence is also configured.

### 4. Rich text — Tiptap

Tiptap renders and edits the document content. The Liveblocks Tiptap extension supplies collaborative editing, while custom extensions add font size and line height controls.

### High-level architecture

```text
Browser
  |
  |-- Clerk authentication
  |
  |-- Next.js App Router
  |     |-- Home / document library
  |     |-- Document workspace
  |     |-- Liveblocks authorization API
  |
  |-- Convex
  |     |-- Document metadata
  |     |-- Queries and mutations
  |
  |-- Liveblocks
        |-- Collaborative document editing
        |-- Presence and cursors
        |-- Whiteboard state
        |-- To-do state
        |-- Flowchart state
        |-- Spreadsheet state
```

---

## Project structure

The following is a high-level guide to the main source folders and files.

```text
doc-tutorial/
|
|-- convex/
|   |-- documents.ts              # Document queries and mutations
|   |-- schema.ts                 # Convex database schema
|   |-- auth.config.ts            # Convex authentication provider
|   |-- _generated/               # Generated Convex API and types
|
|-- public/                       # Logos, template previews and static assets
|
|-- src/
|   |-- app/
|   |   |-- (home)/
|   |   |   |-- page.tsx          # Home page
|   |   |   |-- navbar.tsx        # Home navigation
|   |   |   |-- templates-gallery.tsx
|   |   |   |-- documents-table.tsx
|   |   |   |-- search-input.tsx
|   |   |
|   |   |-- api/
|   |   |   |-- liveblocks-auth/
|   |   |       |-- route.ts      # Liveblocks room authorization
|   |   |
|   |   |-- documents/
|   |       |-- [documentId]/
|   |           |-- page.tsx      # Document route
|   |           |-- document.tsx  # Workspace view switching
|   |           |-- editor.tsx    # Tiptap editor
|   |           |-- toolbar.tsx   # Rich-text toolbar
|   |           |-- navbar.tsx    # Document menu and export
|   |           |-- room.tsx      # Liveblocks room provider
|   |           |-- whiteboard.tsx
|   |           |-- todo-list.tsx
|   |           |-- flowchart.tsx
|   |           |-- spreadsheet.tsx
|   |
|   |-- components/
|   |   |-- ui/                    # Reusable UI components
|   |   |-- convex-client-provider.tsx
|   |
|   |-- constants/
|   |   |-- templates.ts           # Starter document templates
|   |   |-- margins.ts
|   |
|   |-- extensions/
|   |   |-- font-size.ts           # Custom Tiptap font-size extension
|   |   |-- line-height.ts          # Custom Tiptap line-height extension
|   |
|   |-- hooks/                     # Reusable React hooks
|   |-- lib/                       # Utility functions
|   |-- store/                     # Zustand editor store
|   |-- middleware.ts              # Clerk middleware
|
|-- liveblocks.config.ts           # Liveblocks Presence and Storage types
|-- next.config.ts
|-- tailwind.config.ts
|-- tsconfig.json
|-- package.json
|-- package-lock.json
|-- components.json
|-- README.md
```

---

## Getting started

### Prerequisites

Install the following before running the project:

- **Node.js** (Node.js 20 LTS is a suitable starting point)
- **npm**
- A [Clerk](https://clerk.com/) application
- A [Convex](https://www.convex.dev/) deployment
- A [Liveblocks](https://liveblocks.io/) account and secret key

You will need to configure the authentication and service credentials before the app can fully run.

### 1. Clone the repository

```bash
git clone https://github.com/ashwin0004/doc-tutorial.git
cd doc-tutorial
```

### 2. Install dependencies

```bash
npm ci
```

Use `npm install` instead if you intentionally want npm to update the lockfile.

### 3. Configure environment variables

Create a file named `.env.local` in the project root. Add the credentials for Clerk, Convex and Liveblocks.

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Liveblocks
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
```

Replace the placeholder values with credentials from your own service accounts. Never commit `.env.local` or expose secret keys in client-side code.

### 4. Configure Clerk and Convex authentication

This project requests a Clerk JWT template named `convex` and uses the application ID `convex` in `convex/auth.config.ts`.

- Configure a Clerk JWT template with the name/slug `convex` and the claims required by Convex.
- Configure the Convex authentication provider to use the issuer domain for your Clerk application.
- The checked-in `convex/auth.config.ts` currently contains a Clerk development issuer domain. When using your own Clerk instance, replace it with your own issuer domain and deploy the Convex configuration.

The issuer domain in the Convex auth configuration must match the Clerk JWT issuer used by your application.

### 5. Start Convex

In a terminal at the project root, run:

```bash
npx convex dev
```

Follow the Convex CLI prompts to sign in and select or create a development deployment. Make sure the generated deployment URL is assigned to `NEXT_PUBLIC_CONVEX_URL` in `.env.local`.

Keep this terminal running while developing.

### 6. Start the Next.js application

Open a second terminal and run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and sign in through Clerk.

---

## Environment variables

| Variable | Used for | Required |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Initializes Clerk in the client application | Yes |
| `CLERK_SECRET_KEY` | Clerk server-side integration | Yes for a normal Clerk deployment |
| `NEXT_PUBLIC_CONVEX_URL` | Connects the app and Liveblocks authorization route to Convex | Yes |
| `LIVEBLOCKS_SECRET_KEY` | Server-side Liveblocks room authorization | Yes |

The repository also includes a Convex auth provider configuration in `convex/auth.config.ts`. Its issuer domain is configured in that file rather than read from an environment variable.

---

## Running the application

Once the services are configured:

1. Sign in with Clerk.
2. Use the home page to select a starter template or create a document.
3. Open the document workspace.
4. Rename the document from its title area.
5. Use the view controls to switch between Document, Whiteboard, To-do, Flowchart and Spreadsheet.
6. Invite or work with members of the relevant Clerk organization to collaborate in the same workspace/room.
7. Use the File menu to export content or open the browser print dialog.

---

## Available scripts

The scripts are defined in `package.json`.

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs the configured Next.js lint command |

Convex development runs separately with `npx convex dev`.

---

## Deployment

The Next.js application can be deployed to a platform such as [Vercel](https://vercel.com/).

Before deploying:

1. Create/configure a production Clerk application and use its production keys.
2. Configure the `convex` JWT template and update `convex/auth.config.ts` to match the production Clerk issuer.
3. Deploy the Convex backend and configure the production `NEXT_PUBLIC_CONVEX_URL`.
4. Configure the production `LIVEBLOCKS_SECRET_KEY`.
5. Add all required environment variables to the hosting platform.
6. Configure the correct allowed application URLs in Clerk and any relevant service dashboards.
7. Run a production build and test sign-in, document access and collaboration with more than one user.

Do not copy development credentials into a public repository or production environment.

---

## Current scope and notes

A few implementation details are useful to know:

- Document metadata is stored in Convex; the editor and the auxiliary views use Liveblocks collaborative room state.
- Organization-aware document queries and Liveblocks authorization are based on the active Clerk organization.
- The spreadsheet currently supports cell editing and grid operations, but no formula engine is present in the checked-in implementation.
- PDF export is implemented through the browser's print dialog; choose **Save as PDF** in the browser's print destination.
- The document's JSON and HTML export actions serialize the Tiptap editor content. The Text export also handles the active to-do, spreadsheet and flowchart views.
- Images can be inserted into the editor; external image URLs and uploaded images may have their own hosting or portability considerations.
- The application depends on Clerk, Convex and Liveblocks credentials. A clone is not fully functional until those services are configured.
- The generated `convex/_generated` files are managed by the Convex tooling. Avoid manually editing generated files.

---

## Future improvements

Possible next steps for the project include:

- Improve spreadsheet functionality with formulas, cell formatting, and import/export formats.
- Add more document export formats and richer page layout controls.
- Expand whiteboard tools, shape types and object styling.
- Add more flowchart node types and diagram export options.
- Improve document sharing and permission management.
- Add richer template previews and user-created templates.
- Add automated tests and continuous integration.
- Improve accessibility, responsive behavior and loading/error states.

These are potential improvements, not claims about features already implemented.

---

## Author

**Ashwin Biju**

- GitHub: [@ashwin0004](https://github.com/ashwin0004)
- Repository: [doc-tutorial](https://github.com/ashwin0004/doc-tutorial)

---

## License

No `LICENSE` file is currently present in this repository. Until a license is added, the repository being public should not be taken as permission to reuse, modify or redistribute the project. Dependencies and any third-party assets remain subject to their own licenses.
