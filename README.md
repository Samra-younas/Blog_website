# AI Tools & Productivity Tutorials — Blog

Full-stack blog focused on **AI Tools & Productivity Tutorials**. This document describes the project structure. No application logic is implemented yet; the repo is scaffolded for you to add it.

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ------------------------------------ |
| Frontend     | Next.js 14 (App Router) + Tailwind CSS |
| Backend      | Next.js API Routes                   |
| Database     | MongoDB with Mongoose                |
| Auth         | JWT (admin only)                     |
| Images       | Cloudinary                           |
| Rich text    | TipTap                               |

---

## Project Structure

```
blog/
├── app/                    # Next.js 14 App Router
├── components/              # React components
├── lib/                    # Utilities and shared logic
├── models/                 # Mongoose models
├── types/                  # TypeScript types
├── public/                 # Static assets
├── middleware.ts           # Auth protection for /admin
└── [config files]          # package.json, tsconfig, tailwind, etc.
```

---

### `/app` — Routes and layouts

All pages and API routes live here (App Router).

| Path | Purpose |
|------|--------|
| `app/layout.tsx` | Root HTML layout and global metadata. |
| `app/globals.css` | Global styles and Tailwind imports. |
| `app/page.tsx` | **Public** homepage. |
| `app/blog/page.tsx` | **Public** blog listing (all posts). |
| `app/blog/[slug]/page.tsx` | **Public** single post by slug. |
| `app/about/page.tsx` | **Public** about page. |
| `app/contact/page.tsx` | **Public** contact page. |
| `app/admin/layout.tsx` | **Admin** layout (sidebar, auth wrapper). |
| `app/admin/page.tsx` | **Admin** dashboard. |
| `app/admin/login/page.tsx` | **Admin** login (no auth required). |
| `app/admin/posts/page.tsx` | **Admin** list of posts (CRUD entry). |
| `app/admin/posts/new/page.tsx` | **Admin** create new post. |
| `app/admin/posts/[id]/page.tsx` | **Admin** edit post by ID. |

**API routes (under `app/api/`):**

| Path | Purpose |
|------|--------|
| `app/api/auth/login/route.ts` | POST — admin login, returns JWT. |
| `app/api/auth/logout/route.ts` | POST — clear auth (e.g. cookie). |
| `app/api/auth/me/route.ts` | GET — current admin user (JWT). |
| `app/api/posts/route.ts` | GET — list posts (public). POST — create (admin). |
| `app/api/posts/[slug]/route.ts` | GET — one post. PUT/DELETE — update/delete (admin). |
| `app/api/upload/route.ts` | POST — upload image to Cloudinary (admin). |

---

### `/components` — React components

Reusable UI and feature components.

| Folder | Purpose |
|--------|--------|
| `components/ui/` | Generic UI: `Button`, `Input`, etc. |
| `components/layout/` | Site-wide layout: `Header`, `Footer`, `Navbar`. |
| `components/blog/` | Public blog: `PostCard`, `PostList`, `PostContent`. |
| `components/admin/` | Admin-only: `AdminSidebar`, `RichTextEditor` (TipTap), `ProtectedRoute`. |

---

### `/lib` — Shared logic and config

Non-React code used across app and API.

| File | Purpose |
|------|--------|
| `lib/db.ts` | MongoDB connection (Mongoose). |
| `lib/auth.ts` | JWT create/verify and auth helpers. |
| `lib/cloudinary.ts` | Cloudinary client and image upload helpers. |

---

### `/models` — Mongoose models

MongoDB schemas.

| File | Purpose |
|------|--------|
| `models/User.ts` | Admin user (email, hashed password, etc.). |
| `models/Post.ts` | Blog post (title, slug, content, cover image, dates, etc.). |

---

### `/types` — TypeScript

| File | Purpose |
|------|--------|
| `types/index.ts` | Shared types/interfaces (e.g. `Post`, `User`, API payloads). |

---

### `/public` — Static files

Images, favicon, and other assets served at the site root. Add `favicon.ico` and any logos here.

- **OG image:** Add a file `public/og-image.png` (recommended 1200×630) for Open Graph and Twitter cards. Replace the placeholder with your own image; the default metadata points to `/og-image.png`.

---

### Root config files

| File | Purpose |
|------|--------|
| `package.json` | Dependencies and scripts (Next, Mongoose, JWT, TipTap, Cloudinary, etc.). |
| `tsconfig.json` | TypeScript and path alias (`@/*`). |
| `tailwind.config.ts` | Tailwind content paths and theme. |
| `postcss.config.js` | PostCSS (Tailwind, Autoprefixer). |
| `next.config.js` | Next.js config (e.g. Cloudinary `images.domains`). |
| `middleware.ts` | Runs on `/admin/*`; use to protect admin routes with JWT. |
| `.env.local.example` | Example env vars; copy to `.env.local` and fill in. |
| `.gitignore` | Ignores `node_modules`, `.env*.local`, `.next`, etc. |

---

## Getting started (after adding logic)

1. Copy `.env.local.example` to `.env.local` and set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - Cloudinary: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

---

## Summary

- **Public site:** `app/page.tsx`, `app/blog/*`, `app/about`, `app/contact` + `components/layout`, `components/blog`.
- **Admin:** `app/admin/*` (layout, dashboard, login, posts CRUD) + `components/admin`, protected by middleware and JWT.
- **API:** `app/api/auth/*`, `app/api/posts/*`, `app/api/upload/*`.
- **Data & config:** `lib/`, `models/`, `types/`, `.env.local` from `.env.local.example`.

No logic is implemented in this scaffold; implement it as you build the blog.
