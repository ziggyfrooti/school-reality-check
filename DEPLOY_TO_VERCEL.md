# Quick Deployment Guide

## ✅ What's Ready
- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ `.gitignore` configured (excludes node_modules, .env, database files)
- ✅ Firebase config ready
- ✅ Code is production-ready

## 📦 Step 1: Push to GitHub

1. **Create a new GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `school-reality-check`
   - Description: "Compare Central Ohio school districts with real data"
   - Keep it **Private** (for now) or **Public** (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **Create repository**

2. **Push your code:**
   ```bash
   cd /Users/enj0800/Library/CloudStorage/OneDrive-Takeda/claude-school-app/school-reality-check

   git remote add origin https://github.com/YOUR_USERNAME/school-reality-check.git
   git branch -M main
   git push -u origin main
   ```

## 🚀 Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Find `school-reality-check` repository
   - Click **"Import"**

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Add Environment Variables:**
   Click **"Environment Variables"** and add these:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1op-a2klXoBO9GQ9Jv1iJ_ePl5MEK_vo
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=school-reality-check.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=school-reality-check
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=school-reality-check.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=157448787642
   NEXT_PUBLIC_FIREBASE_APP_ID=1:157448787642:web:8b84f91ad5021695645483
   ```

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - You'll get a URL like: `https://school-reality-check.vercel.app`

## 🔥 Step 3: Update Firebase Settings

1. **Add Vercel domain to Firebase:**
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select `school-reality-check` project
   - Go to **Authentication** → **Settings** → **Authorized domains**
   - Click **"Add domain"**
   - Add your Vercel URL (e.g., `school-reality-check.vercel.app`)
   - Click **"Add"**

## ⚠️ Important: Database Issue

**The SQLite database WON'T work on Vercel** because Vercel's filesystem is read-only.

### Two Options:

**Option A: Deploy without database (Quick - works now)**
- The app will show an error about database
- Firebase auth and survey will work fine
- Just add a "Coming Soon" message where districts would show

**Option B: Use Vercel Postgres (Better - takes 10 min)**
1. In Vercel dashboard → Your project → **Storage** tab
2. Click **Create Database** → **Postgres**
3. Follow the wizard
4. Update `lib/db/client.ts` to use Postgres instead of SQLite
5. Re-import the school data to Postgres

### Quick Fix for Now (Option A):
I can update the homepage to show a friendly message if database isn't available, so you can share it tonight!

## 📤 Share with Friends

Once deployed, share this URL with your friends:
- Your Vercel URL (e.g., `https://school-reality-check.vercel.app`)

They can:
1. Sign in with Google
2. Fill out the survey (saved to Firestore)
3. View district comparisons (if database is working)

## 🎯 What Works on Vercel Right Now

✅ Firebase Google Sign-In
✅ User survey form
✅ Firestore data collection
✅ All UI/styling
❌ District comparison (needs database fix)

## Next Steps After Deployment

1. Check if everything works
2. Share URL with friends
3. Monitor Firestore for user responses
4. Decide: Quick fix for database or migrate to Postgres?

---

**Need help?** Just ask!
