# Deployment Guide — AI Productivity Hub

Step-by-step instructions to deploy the blog to Vercel with MongoDB Atlas and Cloudinary.

---

## 1. MongoDB Atlas (database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
2. Create a new organization and project (or use existing).
3. Click **Build a Database** → choose **M0 Free** → select a region close to your app → Create.
4. Create a database user:
   - Database Access → Add New Database User.
   - Choose **Password** auth, set a username and a strong password. Save the password securely.
   - User Privileges: **Read and write to any database** (or restrict to your DB if you prefer).
5. Allow network access:
   - Network Access → Add IP Address.
   - For Vercel: **Allow Access from Anywhere** (0.0.0.0/0). For local dev you can add your IP only.
6. Get your connection string:
   - Clusters → **Connect** on your cluster → **Connect your application**.
   - Copy the URI. It looks like: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`.
7. Replace `<password>` with your database user password (URL-encode special characters).
8. Add the database name before the `?`: e.g. `...mongodb.net/ai-productivity-blog?retryWrites=...`.
9. This final URI is your **MONGODB_URI** for env vars.

---

## 2. Cloudinary (images)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier is enough).
2. In the Dashboard you’ll see:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click “Reveal” if hidden)
3. In the project you need:
   - **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME** = Cloud name
   - **CLOUDINARY_API_KEY** = API Key
   - **CLOUDINARY_API_SECRET** = API Secret

---

## 3. Create admin user (seed)

After MongoDB is set up:

1. Copy `.env.local.example` to `.env.local`.
2. Fill in at least: **MONGODB_URI**, **JWT_SECRET**, **ADMIN_EMAIL**, **ADMIN_PASSWORD**.
3. From the project root run:
   ```bash
   npm install
   npm run seed
   ```
4. You should see: `Admin user created for: <your ADMIN_EMAIL>` (or “already exists” if run again).
5. Use this email and password to log in at `/admin/login` after deployment.

---

## 4. Deploy to Vercel

### 4.1 Push code to GitHub

1. Create a new repository on GitHub.
2. In your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 4.2 Connect repo to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. Leave **Framework Preset** as Next.js and **Root Directory** as `.` unless you changed structure.
5. Before deploying, add environment variables (see below).

### 4.3 Environment variables in Vercel

In the Vercel project: **Settings** → **Environment Variables**. Add each variable for **Production** (and optionally Preview/Development):

| Name | Value | Notes |
|------|--------|--------|
| `MONGODB_URI` | Your Atlas connection string | From step 1 |
| `JWT_SECRET` | Long random string | e.g. `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin login email | Same as used in seed |
| `ADMIN_PASSWORD` | Admin login password | Same as used in seed |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From step 2 |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From step 2 |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From step 2 |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL or custom domain | e.g. `https://your-app.vercel.app` |

- **Important:** Run `npm run seed` **after** the first deploy (or from a machine that has MongoDB access and these env vars), so the admin user exists in the production database. You can also run seed locally with `.env.local` pointing to the same **MONGODB_URI** as production.

### 4.4 Deploy

1. Click **Deploy**.
2. Wait for the build to finish. Your site will be at `https://<project>.vercel.app`.

---

## 5. Custom domain on Vercel

1. In the Vercel project: **Settings** → **Domains**.
2. Add your domain (e.g. `blog.yourdomain.com` or `yourdomain.com`).
3. Follow Vercel’s instructions to add the required DNS records (A/CNAME) at your DNS provider.
4. After the domain is verified, set **NEXT_PUBLIC_SITE_URL** (and optionally **NEXT_PUBLIC_APP_URL**) to your custom URL (e.g. `https://blog.yourdomain.com`) and redeploy so sitemap, robots, and Open Graph use the correct URL.

---

## Checklist

- [ ] MongoDB Atlas cluster created and **MONGODB_URI** set.
- [ ] Cloudinary account created and three Cloudinary env vars set.
- [ ] Admin user created with `npm run seed` (same **ADMIN_EMAIL** / **ADMIN_PASSWORD** as in Vercel).
- [ ] Repo pushed to GitHub and connected to Vercel.
- [ ] All environment variables added in Vercel.
- [ ] First deployment successful.
- [ ] **NEXT_PUBLIC_SITE_URL** set to your live URL (Vercel or custom domain).
- [ ] Optional: custom domain added and **NEXT_PUBLIC_SITE_URL** updated.
- [ ] Optional: add `public/og-image.png` (1200×630) for social previews.
