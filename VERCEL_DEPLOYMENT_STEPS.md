# 🚀 Vercel Deployment Steps - Complete Migration Guide

## ✅ What's Been Prepared

### 1. **Backend Converted to Serverless**
- `api/index.js` - Vercel serverless function wrapper
- `server/index.js` - Updated to work as serverless (exports app, no app.listen() on Vercel)
- MongoDB connection optimized for serverless (singleton pattern)

### 2. **Vercel Configuration**
- `vercel.json` - Configured for full-stack deployment
- Routes API requests to `/api/` handler
- Routes frontend to `/client/` build

---

## 📋 Step-by-Step Deployment

### Step 1: Push Changes to GitHub

Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Sign in** (or create account if needed)
3. **Click "Add New Project"** or **"Import Project"**
4. **Import your GitHub repository**: Select `Good_Moments` repository
5. **Configure Project Settings**:

   **Framework Preset**: `Other` (or let Vercel auto-detect)
   
   **Root Directory**: Leave empty (root of repo)
   
   **Build Command**: (Auto-detected)
   - For client: `cd client && npm run build`
   
   **Output Directory**: `client/build`
   
   **Install Command**: (Auto-detected)
   - Vercel will run `npm install` in root and `client/`

### Step 3: Configure Environment Variables

Go to **Project Settings** → **Environment Variables** and add:

#### Frontend Variables:
```
REACT_APP_API_URL=https://your-project.vercel.app/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

#### Backend Variables (for API serverless functions):
```
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-project.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**⚠️ Important Notes:**
- Replace `your-project.vercel.app` with your actual Vercel URL (you'll get this after deployment)
- Use `/api` prefix for `REACT_APP_API_URL` (Vercel routes all API calls to `/api`)
- Copy all values from your Render environment variables
- Make sure to remove any `<password>` placeholders in `MONGODB_URL`

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (5-10 minutes)
3. Watch build logs for any errors
4. When deployment succeeds, you'll get a URL like: `https://good-moments.vercel.app`

### Step 5: Update Environment Variables (After First Deploy)

1. **Get your Vercel URL**: Copy from deployment page
2. **Update `REACT_APP_API_URL`**:
   ```
   REACT_APP_API_URL=https://your-actual-url.vercel.app/api
   ```
3. **Update `FRONTEND_URL`**:
   ```
   FRONTEND_URL=https://your-actual-url.vercel.app
   ```
4. **Redeploy** (Vercel auto-redeploys when you save env vars, or trigger manually)

### Step 6: Update Google OAuth

1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client ID
3. Update **Authorized JavaScript origins**:
   ```
   https://your-actual-url.vercel.app
   ```
4. Update **Authorized redirect URIs**:
   ```
   https://your-actual-url.vercel.app/auth
   ```
5. Save changes

---

## 🔍 Verify Deployment

### Test Frontend:
- Visit: `https://your-url.vercel.app`
- Should load the React app

### Test API:
- Visit: `https://your-url.vercel.app/api`
- Should show: `{"message":"Good Moments API is running!",...}`

### Test API Routes:
- Visit: `https://your-url.vercel.app/api/posts`
- Should return posts JSON or empty array

---

## ⚠️ Important Notes

### API Routes on Vercel

All API routes are prefixed with `/api` on Vercel:
- `/posts` → `/api/posts`
- `/user` → `/api/user`

The `vercel.json` rewrites handle this automatically, but your frontend needs `REACT_APP_API_URL` to include `/api`.

### Serverless Function Limits

**Vercel Free Tier:**
- **Execution Timeout**: 10 seconds (Hobby plan)
- **File Size Limit**: 4.5MB
- **Memory**: 1GB
- **Cold Starts**: First request may take 300-500ms, subsequent requests are fast

### MongoDB Connection

- Connection is cached (singleton pattern)
- Reconnects automatically if connection drops
- Works well with serverless functions

### Environment Variables

- Set them in Vercel Dashboard: **Project Settings** → **Environment Variables**
- Available to both frontend build and serverless functions
- Can set for different environments (Production, Preview, Development)

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check Node.js version (Vercel auto-detects)

### Issue: API Routes 404

**Solution:**
- Verify `api/index.js` exists and exports the app
- Check `vercel.json` routes configuration
- Ensure `REACT_APP_API_URL` includes `/api` prefix

### Issue: MongoDB Connection Fails

**Solution:**
- Verify `MONGODB_URL` is set correctly in Vercel env vars
- Check MongoDB Atlas Network Access (allow all IPs: 0.0.0.0/0)
- Verify database user has correct permissions

### Issue: Frontend Can't Reach API

**Solution:**
- Check `REACT_APP_API_URL` includes `/api`
- Verify CORS is enabled in `server/index.js`
- Check browser console for CORS errors

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Repository connected to Vercel
- [ ] All environment variables set
- [ ] Build successful
- [ ] Frontend loads correctly
- [ ] API endpoints work (`/api`, `/api/posts`)
- [ ] Google OAuth updated with Vercel URL
- [ ] User can sign in/sign up
- [ ] Posts load correctly

---

## 🎉 Result

Your app is now running on Vercel:
- ✅ No auto-suspension (unlike Render free tier)
- ✅ Fast deployments (automatic on git push)
- ✅ Global CDN (fast worldwide)
- ✅ Free SSL certificates
- ✅ Both frontend and backend on same domain

**No more Render service suspension issues!** 🚀

