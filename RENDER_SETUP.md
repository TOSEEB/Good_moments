# 🚀 Render Setup Guide - Step by Step

## Which Service to Choose on Render?

When you see the service selection screen:

### ✅ Choose: **"Web Services"**
- This is for your **Node.js/Express backend**
- Dynamic application that runs continuously
- Perfect for API servers like yours

### ❌ Don't Choose:
- **"Static Sites"** - This is for static frontend (but we're using Vercel for that)
- **"Key Value Instance"** - This is Redis (caching service, not needed)
- **"Postgres"** - This is PostgreSQL database (you're using MongoDB Atlas)
- **"Private Services"** - Only if you need private network
- **"Background Workers"** - Only for background job processing
- **"Cron Jobs"** - Only for scheduled tasks

## Step-by-Step Render Setup

### Step 1: Choose Service
1. Go to Render Dashboard: https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"** ✅

### Step 2: Connect Repository
1. Click **"Connect GitHub"** or **"Connect GitLab"**
2. Authorize Render to access your repositories
3. Select repository: `Good_Moments`

### Step 3: Configure Service

**Basic Settings:**
- **Name**: `good-moments-api` (or your choice)
- **Environment**: `Node`
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main` (or `master`)

**Build & Deploy:**
- **Root Directory**: `server` ⚠️ Important!
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Runtime:**
- **Instance Type**: `Free` (for testing)
- **Auto-Deploy**: `Yes` (auto-deploys when you push to GitHub)

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Environment"** → **"Add Environment Variable"**

Add these one by one:

```
PORT=10000
```

```
MONGODB_URL=mongodb+srv://username:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
```
⚠️ Replace `YOUR_PASSWORD` with your actual MongoDB password!

```
JWT_SECRET=your-super-secret-random-string-min-32-chars
```
Generate a random string for security (can use: https://randomkeygen.com/)

```
EMAIL_SERVICE=gmail
```

```
EMAIL_USER=your-email@gmail.com
```

```
EMAIL_PASSWORD=your-gmail-app-password
```

```
FRONTEND_URL=https://your-app-name.vercel.app
```
⚠️ Update this after deploying frontend on Vercel!

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building your app
3. Watch the build logs
4. Wait 5-10 minutes for deployment
5. When done, you'll see: **"Your service is live"**
6. Copy your backend URL: `https://your-api-name.onrender.com`

## 🔗 How MongoDB Connection Works

**You don't need to "connect" MongoDB manually!**

1. **MongoDB Atlas** = Cloud database (separate service)
2. **Render Web Service** = Your Express backend
3. **Connection** = Happens automatically via `MONGODB_URL` environment variable

**How it works:**
```
Your Express App (Render) 
    ↓ (uses MONGODB_URL)
MongoDB Atlas (Cloud Database)
```

Your `server/index.js` already has:
```javascript
mongoose.connect(CONNECTION_URL, ...)
```

When Render starts your app, it reads `MONGODB_URL` from environment variables and connects automatically!

## ✅ Checklist

- [ ] Selected "Web Services" (not Key Value)
- [ ] Set Root Directory to `server`
- [ ] Added all environment variables
- [ ] Replaced `<password>` in MONGODB_URL
- [ ] Deployment successful
- [ ] Backend URL copied

## 🐛 Troubleshooting

**Issue**: Build fails
- Check Root Directory is set to `server`
- Check Build Command is `npm install`
- Check Start Command is `npm start`

**Issue**: MongoDB connection fails
- Verify MONGODB_URL has correct password (no `<password>` placeholder)
- Check MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)
- Check database user has correct privileges

**Issue**: Port error
- Make sure PORT environment variable is set (Render auto-assigns port)
- Your code should use `process.env.PORT` (already done)

## 🎯 Next Step

After backend is deployed:
1. Copy your Render backend URL
2. Deploy frontend on Vercel
3. Update `REACT_APP_API_URL` on Vercel with your Render URL
4. Update `FRONTEND_URL` on Render with your Vercel URL

