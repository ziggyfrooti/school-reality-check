# Deployment Guide - School Reality Check

## What's Been Set Up

✅ Firebase Authentication with Google Sign-In
✅ Firestore database for storing user responses
✅ Landing page with data collection form
✅ Environment variables configured locally

## Firebase Setup Checklist

### 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `school-reality-check`
3. Click **Firestore Database** in the left sidebar
4. Click **Create database**
5. Choose **Start in production mode** (we'll adjust rules next)
6. Select a location (choose `us-central` for Central Ohio)
7. Click **Enable**

### 2. Set Firestore Security Rules
Once Firestore is created, click on **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User responses collection
    match /user_responses/{document} {
      // Allow authenticated users to create their own responses
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;

      // Allow users to read only their own responses
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;

      // Deny updates and deletes for now
      allow update, delete: if false;
    }
  }
}
```

Click **Publish** to save the rules.

### 3. Configure Authorized Domains
1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your Vercel domain once you deploy (e.g., `school-reality-check.vercel.app`)
3. `localhost` should already be there for local development

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
cd /Users/enj0800/Library/CloudStorage/OneDrive-Takeda/claude-school-app/school-reality-check

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: School Reality Check with Firebase auth"

# Create GitHub repository (via GitHub web interface or CLI)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/school-reality-check.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. **Add Environment Variables** (click on "Environment Variables"):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1op-a2klXoBO9GQ9Jv1iJ_ePl5MEK_vo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=school-reality-check.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=school-reality-check
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=school-reality-check.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=157448787642
NEXT_PUBLIC_FIREBASE_APP_ID=1:157448787642:web:8b84f91ad5021695645483
```

6. Click **Deploy**
7. Wait 2-3 minutes for deployment to complete
8. You'll get a URL like: `https://school-reality-check.vercel.app`

### Step 3: Update Firebase Authorized Domain

1. Copy your Vercel URL
2. Go back to Firebase Console > Authentication > Settings > Authorized domains
3. Click **Add domain**
4. Paste your Vercel domain (without `https://`)
5. Save

## Database Setup for Vercel

**IMPORTANT:** The SQLite database won't work on Vercel (read-only filesystem).

### Option A: Quick Fix - Use Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# In Vercel dashboard:
# Storage > Create Database > Postgres
# Copy connection string to environment variables
```

### Option B: Use Turso (SQLite in the cloud)
```bash
# Install Turso
npm install @libsql/client

# Sign up at https://turso.tech
# Create database and get connection URL
```

### Option C: Development Only
For now, deploy without the database and just show the landing page. Add a "Coming Soon" message for the comparison data.

## Testing the Deployment

1. Visit your Vercel URL
2. You should see the landing page with Google Sign-In
3. Sign in with Google
4. Fill out the survey form
5. Click "Continue to Dashboard"
6. You should see the main comparison page

## Viewing Collected Data

1. Go to Firebase Console > Firestore Database
2. Click on `user_responses` collection
3. You'll see all submitted responses with:
   - User email
   - District preference
   - School level
   - ZIP code
   - Timestamp

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test authentication flow
3. ⏳ Migrate database to Vercel Postgres or Turso
4. ⏳ Add analytics to track usage
5. ⏳ Export Firestore data for analysis

## Troubleshooting

### "Auth domain not authorized"
- Make sure you added your Vercel domain to Firebase Authorized domains

### "Collection not found"
- Check Firestore rules are published
- Verify collection name is `user_responses`

### "Build failed on Vercel"
- Check environment variables are set correctly
- Make sure all dependencies are in `package.json`

### Database errors on Vercel
- SQLite doesn't work on Vercel - need to migrate to Postgres or Turso
- For now, comment out database calls in production

## Environment Variables Summary

Copy these to Vercel:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1op-a2klXoBO9GQ9Jv1iJ_ePl5MEK_vo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=school-reality-check.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=school-reality-check
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=school-reality-check.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=157448787642
NEXT_PUBLIC_FIREBASE_APP_ID=1:157448787642:web:8b84f91ad5021695645483
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Firebase configuration
4. Make sure Firestore is enabled and rules are set
