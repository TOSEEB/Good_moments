# 🔐 How to Reset MongoDB Atlas Password

If you forgot your MongoDB Atlas database password, follow these steps:

## Method 1: Reset Existing User Password (Recommended)

1. **Go to MongoDB Atlas Dashboard**
   - Login: https://cloud.mongodb.com
   - Select your project

2. **Go to Database Access**
   - Click **"Database Access"** in the left sidebar
   - You'll see a list of database users

3. **Find Your User**
   - Look for your database user (usually `admin` or the username you created)
   - Click the **"Edit"** button (pencil icon) next to the user

4. **Reset Password**
   - Click **"Edit Password"** or **"Change Password"**
   - Enter a **new password** (save this in a secure place!)
   - Confirm the new password
   - Click **"Update User"** or **"Save"**

5. **Update Connection String**
   - Replace `<password>` in your connection string with the new password
   - Example: `mongodb+srv://admin:NEW_PASSWORD@cluster0.xxxxx.mongodb.net/memories`

## Method 2: Create New Database User

If you can't reset the old user, create a new one:

1. **Go to Database Access**
   - Click **"Database Access"** in left sidebar
   - Click **"Add New Database User"**

2. **Create New User**
   - **Authentication Method**: Password
   - **Username**: `admin` (or any name you prefer)
   - **Password**: Create a strong password (save it!)
   - **Database User Privileges**: "Atlas admin" or "Read and write to any database"
   - Click **"Add User"**

3. **Use New Credentials**
   - Update your connection string with the new username and password
   - Example: `mongodb+srv://newusername:newpassword@cluster0.xxxxx.mongodb.net/memories`

## Method 3: Delete and Recreate User (If needed)

1. **Delete Old User**
   - Go to "Database Access"
   - Find the user you forgot password for
   - Click **"Delete"** → Confirm deletion

2. **Create New User**
   - Follow Method 2 steps above

## ✅ After Resetting Password

**Important:** Update your connection string in:

1. **Local `.env` file** (`server/.env`):
   ```env
   MONGODB_URL=mongodb+srv://username:NEW_PASSWORD@cluster0.xxxxx.mongodb.net/memories
   ```

2. **Render environment variables** (after deployment):
   - Go to Render dashboard
   - Click on your web service
   - Go to "Environment" tab
   - Update `MONGODB_URL` with new password
   - Save changes

## 🔑 Password Best Practices

- Use a strong password (mix of letters, numbers, special characters)
- Save it in a password manager or secure note
- Don't share it publicly
- Use environment variables (never commit to GitHub!)

## 💡 Pro Tip

Create a **dedicated database user** for your app:
- Username: `app-user` (or `good-moments-app`)
- Password: Save it securely
- Privileges: "Read and write to any database" (or specific database)

This way, you can reset it anytime without affecting other users!

