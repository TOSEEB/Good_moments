# 🚀 Deployment Guide - Vercel + Render

Complete guide to deploy your MERN stack application for your resume.

## 📋 Overview

- **Frontend (React)**: Deploy on Vercel (free, fast)
- **Backend (Node.js/Express)**: Deploy on Render (free tier available)
- **Database**: MongoDB Atlas (free tier)

---

## Part 1: Prepare Backend for Deployment

### Step 1: Create MongoDB Atlas Account (Free)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a **Free M0 Cluster** (free forever)
4. Create database user:
   - Username: `your-username`
   - Password: `your-password` (save this!)
   - **⚠️ Forgot password?** Go to "Database Access" → Click on user → "Edit" → Reset password
5. Whitelist IP: Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
6. Get Connection String: 
   - Click **"Drivers"** (not Compass, Shell, etc.)
   - You'll see "Connect your application"
   - Select **"Node.js"** as driver
   - Copy connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority`
   - **Important**: Replace `<password>` with your actual database password
   - Example: If password is `mypassword123`, replace `<password>` → `mypassword123`
   - Final string should look like: `mongodb+srv://admin:mypassword123@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority`

### Step 2: Prepare Server Code

1. Update `server/package.json`:
   ```json
   {
     "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js"
     }
   }
   ```
   (Remove nodemon for production)

2. Create `server/.env` file (you'll add this to Render):
   ```env
   PORT=10000
   MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

3. Update `server/index.js` to use `PORT` from environment:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```
   (Already done if using process.env.PORT)

---

## Part 2: Deploy Backend on Render

### Step 1: Create Render Account

1. Go to: https://render.com
2. Sign up (free with GitHub)
3. Connect your GitHub account

### Step 2: Deploy Backend

1. Click **"New +"** → **"Web Service"** ✅ (NOT Key Value, NOT Static Sites)
   - ⚠️ **Important**: Choose **"Web Services"** (for your Node.js/Express backend)
   - ❌ Don't choose "Key Value Instance" (that's Redis, not needed)
   - ❌ Don't choose "Static Sites" (that's for frontend only)
   
2. Connect your GitHub repository
3. Select repository: `Good_Moments`
4. Configure:
   - **Name**: `good-moments-api` (or your choice like `Good_moments`)
   - **Language**: `Node` ✅
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`) ✅
   - **Branch**: `main` ✅
   - **Root Directory**: `server` ⚠️ **IMPORTANT** - Set this to `server`
   - **Build Command**: `npm install` ⚠️ Change from `yarn` to `npm install`
   - **Start Command**: `npm start` ⚠️ Change from `yarn start` to `npm start`
   - **Instance Type**: `Free` ✅ (for testing, upgrade later if needed)
   - **Auto-Deploy**: `Yes` (auto-deploys on git push)

5. **Add Environment Variables** (click "Advanced" → "Environment"):
   - Click **"Add Environment Variable"** for each:
   
   | Variable Name | Value |
   |--------------|-------|
   | `PORT` | `10000` |
   | `MONGODB_URL` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `your-super-secret-jwt-key-change-this-to-random-string` |
   | `EMAIL_SERVICE` | `gmail` |
   | `EMAIL_USER` | `your-email@gmail.com` |
   | `EMAIL_PASSWORD` | `your-app-password` |
   | `FRONTEND_URL` | `https://your-app-name.vercel.app` (update after deploying frontend) |
   
   ⚠️ **Important**: 
   - Replace `<password>` in `MONGODB_URL` with your actual MongoDB password
   - Update `FRONTEND_URL` after deploying frontend on Vercel!

6. **Review Settings**:
   - Make sure **"Root Directory"** is set to `server`
   - Check **"Environment"** is `Node`

7. Click **"Create Web Service"**
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL: `https://your-api-name.onrender.com`

**🔗 How MongoDB Connection Works:**
- Your **Express backend** (Web Service on Render) connects to **MongoDB Atlas** (cloud database)
- Connection happens via `MONGODB_URL` environment variable
- No need to "connect" anything manually - your app code does it automatically!

---

## Part 3: Deploy Frontend on Vercel

### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Sign up (free with GitHub)
3. Connect your GitHub account

### Step 2: Prepare Frontend

1. Create `vercel.json` in root directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "client/build"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/client/$1"
       }
     ]
   }
   ```

2. Update `client/package.json` build script:
   ```json
   {
     "scripts": {
       "build": "react-scripts build",
       "start": "react-scripts start"
     }
   }
   ```

### Step 3: Deploy on Vercel

1. Go to Vercel Dashboard
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-api-name.onrender.com
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

6. Click **"Deploy"**
7. Wait for deployment (2-5 minutes)
8. Copy your frontend URL: `https://your-app-name.vercel.app`

---

## Part 4: Update Environment Variables

### Update Backend (Render)

1. Go to Render Dashboard
2. Click on your web service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will auto-redeploy

### Update Frontend (Vercel) - If needed

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Verify `REACT_APP_API_URL` matches your Render backend URL
5. Redeploy if needed

---

## Part 5: Update Google OAuth

### Step 1: Update Google OAuth Credentials

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Edit your OAuth 2.0 Client ID
5. Add to **"Authorized JavaScript origins"**:
   - `https://your-app-name.vercel.app`
6. Add to **"Authorized redirect URIs"**:
   - `https://your-app-name.vercel.app/auth`
7. Save changes

---

## Part 6: Test Deployment

1. **Test Frontend**: Open `https://your-app-name.vercel.app`
2. **Test Backend**: Open `https://your-api-name.onrender.com/posts` (should show JSON or error)
3. **Test Sign Up/Sign In**: Create account on deployed app
4. **Test Features**: 
   - Create post
   - Like post
   - Comment
   - Search by tags

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string copied
- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Frontend deployed on Vercel
- [ ] Frontend URL copied
- [ ] Environment variables set on Render
- [ ] Environment variables set on Vercel
- [ ] Google OAuth updated with Vercel URL
- [ ] All features tested
- [ ] Links working correctly

---

## 🔗 Add to Resume

Add these links to your resume:

- **Live Demo**: `https://your-app-name.vercel.app`
- **GitHub Repository**: `https://github.com/your-username/Good_Moments`
- **Backend API**: `https://your-api-name.onrender.com` (optional) 

---

## 🆓 Free Tier Limits

### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ Free SSL certificate
- ✅ Automatic deployments
- ✅ Custom domains

### Render (Backend)
- ⚠️ Free tier spins down after 15 minutes of inactivity
- ✅ Auto-wakes up on first request (may take 30-60 seconds)
- ✅ 750 hours/month free
- 💰 Consider paid tier ($7/month) for always-on service

### MongoDB Atlas
- ✅ 512 MB free storage
- ✅ Free forever (M0 cluster)
- ✅ Perfect for portfolio projects

---

## 🐛 Common Issues

### Issue 1: Backend takes long to respond
**Solution**: Render free tier spins down. First request takes 30-60 seconds to wake up.

### Issue 2: CORS errors
**Solution**: Check `server/index.js` has:
```javascript
app.use(cors());
```

### Issue 3: Environment variables not working
**Solution**: 
- Vercel: Variables must start with `REACT_APP_`
- Render: Check variable names match exactly (case-sensitive)

### Issue 4: Build fails on Vercel
**Solution**:  
- Check Node version in `client/package.json`
- Ensure build command is correct
- Check for TypeScript errors

---

## 💡 Pro Tips

1. **Always-On Service**: Consider Render's $7/month plan to keep backend always running
2. **Custom Domain**: Add custom domain on Vercel (looks more professional)
3. **Monitor**: Check Render and Vercel dashboards for errors
4. **Backup**: Keep `.env` files locally (never commit to GitHub!) 

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live demo link for your resume
- ✅ Professional portfolio project
- ✅ Full-stack deployment experience
- ✅ Something to discuss in interviews!

Good luck with your job search! 🚀

