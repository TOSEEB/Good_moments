# 🔐 Vercel Environment Variables Guide

Add these environment variables in Vercel: **Project Settings** → **Environment Variables**

---

## 📋 Required Environment Variables

### Frontend Variables (REACT_APP_*)

#### 1. `REACT_APP_API_URL` ⚠️ **REQUIRED**
- **Value**: `https://your-project.vercel.app/api`
- **Description**: Backend API base URL
- **Important**: 
  - Replace `your-project.vercel.app` with your actual Vercel URL
  - Must include `/api` prefix for Vercel deployment
  - Example: `https://good-moments.vercel.app/api`

#### 2. `REACT_APP_GOOGLE_CLIENT_ID` ⚠️ **REQUIRED**
- **Value**: Your Google OAuth 2.0 Client ID
- **Description**: Google Sign-In client ID
- **Where to get**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Format**: Usually looks like `123456789-abcdefghijklmnop.apps.googleusercontent.com`

---

### Backend Variables (API/Serverless Functions)

#### 3. `MONGODB_URL` ⚠️ **REQUIRED**
- **Value**: Your MongoDB Atlas connection string
- **Description**: MongoDB database connection
- **Format**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority`
- **Important**: 
  - Replace `<password>` with your actual MongoDB password
  - Replace `username` with your MongoDB username
  - Get from: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### 4. `JWT_SECRET` ⚠️ **REQUIRED**
- **Value**: A random secret string (minimum 32 characters)
- **Description**: Secret key for JWT token signing
- **Generate**: Use a secure random string generator
- **Example**: `your-super-secret-jwt-key-min-32-chars-change-this`

---

## 🔧 Optional Environment Variables (Email Features)

### Email Configuration (Optional - for password reset/setup emails)

#### 5. `EMAIL_SERVICE` (Optional)
- **Value**: `gmail` (default)
- **Description**: Email service provider
- **Default**: `gmail`
- **Options**: `gmail`, `sendgrid`, `mailgun`, etc.

#### 6. `EMAIL_USER` (Optional)
- **Value**: Your email address (e.g., `your-email@gmail.com`)
- **Description**: Email address for sending password reset/setup emails
- **Required if**: You want password reset/setup emails to work

#### 7. `EMAIL_PASSWORD` (Optional)
- **Value**: Your Gmail App Password (not regular password!)
- **Description**: Email password for authentication
- **How to get**: 
  1. Go to Google Account → Security
  2. Enable 2-Step Verification
  3. Generate App Password
  4. Use that 16-character password here
- **Required if**: You want password reset/setup emails to work

#### 8. `EMAIL_HOST` (Optional)
- **Value**: `smtp.gmail.com` (default)
- **Description**: SMTP host for email service
- **Default**: `smtp.gmail.com`
- **Only needed**: If using custom SMTP (not Gmail)

#### 9. `EMAIL_PORT` (Optional)
- **Value**: `587` (default)
- **Description**: SMTP port for email service
- **Default**: `587`
- **Only needed**: If using custom SMTP

#### 10. `FRONTEND_URL` (Recommended)
- **Value**: `https://your-project.vercel.app`
- **Description**: Frontend URL for email links
- **Important**: 
  - Replace `your-project.vercel.app` with your actual Vercel URL
  - Used in password reset/setup email links
  - Example: `https://good-moments.vercel.app`

---

## 📝 Quick Copy-Paste List

Add these in Vercel Environment Variables:

```
REACT_APP_API_URL=https://your-project.vercel.app/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=https://your-project.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

---

## ⚠️ Important Notes

### 1. **After First Deployment:**
Once you deploy and get your Vercel URL, update these:
- `REACT_APP_API_URL` → Use your actual Vercel URL with `/api`
- `FRONTEND_URL` → Use your actual Vercel URL

### 2. **Replace Placeholders:**
- `your-project.vercel.app` → Your actual Vercel domain
- `your-google-client-id-here` → Your actual Google Client ID
- `username:password` in MONGODB_URL → Your actual MongoDB credentials

### 3. **MongoDB URL:**
- Make sure there's **NO** `<password>` placeholder
- Format: `mongodb+srv://admin:actualpassword123@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority`

### 4. **Environment Scope:**
- You can set variables for: **Production**, **Preview**, and **Development**
- For now, set them for **Production** (or **All Environments**)

### 5. **Sensitive Data:**
- Never commit these to GitHub
- Always use environment variables
- Vercel encrypts these values automatically

---

## ✅ Minimum Required Variables

**At minimum, add these 4:**

1. `REACT_APP_API_URL`
2. `REACT_APP_GOOGLE_CLIENT_ID`
3. `MONGODB_URL`
4. `JWT_SECRET`

**Add `FRONTEND_URL` for email links to work.**

**Add `EMAIL_USER` and `EMAIL_PASSWORD` for password reset emails to work.**

---

## 🎯 How to Add in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Click **"Add New"** or **"Add Environment Variable"**
3. Enter **Name** (e.g., `REACT_APP_API_URL`)
4. Enter **Value** (e.g., `https://your-project.vercel.app/api`)
5. Select **Environment** (Production, Preview, Development)
6. Click **"Save"**
7. Repeat for each variable

---

## 🔄 After Adding Variables

**Important:** After adding/updating environment variables:

1. **Redeploy** your project (Vercel will auto-redeploy)
2. Or manually trigger a new deployment
3. Wait for build to complete
4. Test your app

---

## 📚 Need Help?

- **Missing `REACT_APP_API_URL`**: Frontend can't connect to API
- **Missing `MONGODB_URL`**: Backend can't connect to database
- **Missing `JWT_SECRET`**: Authentication won't work
- **Missing `REACT_APP_GOOGLE_CLIENT_ID`**: Google Sign-In won't work
- **Missing email variables**: Password reset/setup emails won't be sent (app still works, just no emails)

