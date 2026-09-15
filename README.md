# Doc Tutorial

A modern collaborative document editor built with Next.js, TypeScript, Tiptap, Liveblocks, Convex, and Clerk.

## 🚀 Overview

Doc Tutorial is a web-based document editing application designed to provide a modern and collaborative writing experience.

The application allows users to create and manage documents through a rich text editor while supporting real-time collaboration and user authentication.

## ✨ Features

- 📝 Rich text document editor
- 👥 Real-time collaborative editing
- 🔐 User authentication with Clerk
- 💾 Document data management with Convex
- 🎨 Modern responsive UI
- 🖊️ Tiptap-based editor
- 🔄 Live collaboration using Liveblocks
- 📄 Document management
- 🧩 Reusable UI components
- 🌙 Modern interface with theme support
- 📊 Tables, images, links, highlighting and text formatting
- ✏️ Multiple text editing tools
- ⚡ Fast Next.js application

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React

### Editor
- Tiptap
- ProseMirror
- Tiptap Collaboration

### Backend & Database
- Convex

### Authentication
- Clerk

### Real-Time Collaboration
- Liveblocks

## 📁 Project Structure

```text
doc-tutorial/
│
├── convex/              # Convex backend and database
│
├── public/              # Static assets
│
├── src/
│   ├── app/             # Next.js application routes
│   │   ├── api/         # API routes
│   │   ├── documents/   # Document pages
│   │   └── ...
│   │
│   ├── components/      # Reusable UI components
│   ├── constants/       # Application constants
│   ├── extensions/      # Editor extensions
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── store/           # Application state management
│
├── liveblocks.config.ts # Liveblocks configuration
├── next.config.ts       # Next.js configuration
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation


⚙️ Getting Started
1. Clone the repository
git clone https://github.com/ashwin0004/doc-tutorial.git

2. Navigate to the project
cd doc-tutorial

3. Install dependencies
npm install

4. Configure environment variables

Create a .env.local file in the root directory and add the required environment variables for:

Clerk
Convex
Liveblocks

Example:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

CONVEX_DEPLOYMENT=your_deployment

LIVEBLOCKS_SECRET_KEY=your_key

Do not commit your .env.local file to GitHub.

5. Start the development server
npm run dev
Open:

http://localhost:3000
📜 Available Scripts
npm run dev

Starts the development server.

npm run build

Creates a production build.

npm run start

Starts the production server.

npm run lint

Runs the project's linting checks.

🌐 Deployment

The application can be deployed using platforms such as Vercel.

Before deployment, make sure all required environment variables are configured in the deployment platform.

🔑 Environment Variables

The project uses external services that require environment variables.

Make sure the following services are configured:

Service	Purpose
Clerk	Authentication
Convex	Backend and database
Liveblocks	Real-time collaboration
🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Fork the repository
Create a feature branch
Make your changes
Commit your changes
Push the branch
Open a Pull Request
📄 License

This project is for educational and development purposes.

👨‍💻 Author

Ashwin Biju

GitHub:
https://github.com/ashwin0004


### How it will look

After you put this into `README.md` and commit it, GitHub will automatically render the Markdown on the repository's front page — exactly like the screenshot you showed. GitHub specifically recommends README files as the place to explain what a project does, how to install it, and how to use it. :contentReference[oaicite:4]{index=4}

**Important:** I wouldn't put the environment-variable example in exactly that form unless those are actually the variable names your project uses. We should verify your `.env` usage first so the README doesn't contain incorrect setup instructions.

If you want, **I can update the `README.md` directly in your `ashwin0004/doc-tutorial` GitHub repository with a proper project-specific README** rather than you manually copying it.
