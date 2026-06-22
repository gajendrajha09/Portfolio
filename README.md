# Portfolio Website

A beautiful, Adobe Portfolio-inspired creative portfolio with a built-in editor for managing projects, uploading images, and customizing your site — no coding required.

## Features

- **Clean portfolio layout** — Responsive project grid, fullscreen lightbox, About & Contact pages
- **Built-in editor** at `/editor` — Manage projects, upload files, customize site settings
- **Photo grid modules** — Drag-and-drop image uploads with captions and alt text
- **Layout controls** — Adjust grid columns, gutter spacing, and masthead visibility
- **Password-protected admin** — Secure editor access via environment variable

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and set your editor password
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for your portfolio, or [http://localhost:3000/editor](http://localhost:3000/editor) to manage content.

Default editor password: `changeme` (change this in `.env.local`)

## Editor Guide

1. Go to `/editor` and sign in with your password
2. **Projects** — Add/edit projects, upload photos, set cover images
3. **Site Settings** — Update your name, bio, contact info, social links, and grid layout
4. **Upload Files** — Bulk upload images via drag-and-drop
5. Click **Save & Publish** to persist changes

## Deployment

This is a Next.js full-stack app. Deploy to [Vercel](https://vercel.com) for the best experience (supports API routes and file uploads).

```bash
npm run build
npm start
```

Set the `EDITOR_PASSWORD` environment variable in your hosting provider.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- TypeScript
- File-based JSON storage

## License

MIT
