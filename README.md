## Introduction
This is a full-stack MERN application called "Good Moments" - a social media app that allows users to post interesting events that happened in their lives. Built with modern web technologies and best practices.

The application demonstrates comprehensive full-stack development skills including frontend React development, backend API design, database management, and modern deployment practices.

## Quick Start

1. **Set up environment variables** (see [Getting Started](#-getting-started) section for details)
2. **Run `npm i && npm start`** for both client and server side to start the app
3. **Configure Google OAuth** for local testing (see [Google OAuth Setup](#google-oauth-setup-for-local-testing) below)

# 🎯 MERN Good Moments Project

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Project Overview

This is a **Good Moments** application where users can:
- ✨ Create, read, update, and delete memory posts
- 🖼️ Upload and share images with their memories
- ❤️ Like and interact with posts
- 🏷️ Organize content with tags
- 📱 Enjoy a responsive design that works on all devices 

## 🚀 Technologies Used

### Frontend
- **React.js 16** - Modern UI framework with hooks
- **Material-UI** - Beautiful, responsive design components
- **Redux** - State management
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime 
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 🏗️ Architecture

- **Full-stack MERN application**
- **RESTful API design**
- **Component-based React architecture**
- **Modern ES6+ syntax**
- **Cross-platform compatibility**

## 🎯 Features

- ✅ **CRUD Operations** - Full Create, Read, Update, Delete functionality
- ✅ **Image Management** - Upload and store images with posts
- ✅ **Social Features** - Like/unlike posts
- ✅ **Tag System** - Organize memories with custom tags
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile
- ✅ **Real-time Updates** - Dynamic content updates

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TOSEEB/mern-memories-project.git
   cd mern-memories-project
   ```

2. **Set up environment variables**

   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   CONNECTION_URL=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   FRONTEND_URL=http://localhost:3001
   ```
   
   **Note**: Get your `REACT_APP_GOOGLE_CLIENT_ID` from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) after creating an OAuth 2.0 Client ID.

3. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

4. **Start the application**
   ```bash
   # Start server (Terminal 1)
   cd server
   npm start
   
   # Start client (Terminal 2)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000 (or http://localhost:3001 depending on port availability)
   - Backend API: http://localhost:5000

### Google OAuth Setup (For Local Testing)

To enable Google Sign-In functionality in local development:

1. **Go to Google Cloud Console**
   - Direct link: **https://console.cloud.google.com/apis/credentials**
   - Or navigate: https://console.cloud.google.com → Select your project → APIs & Services → Credentials

2. **Configure OAuth 2.0 Client ID**
   - Click on your existing OAuth 2.0 Client ID (or create one if you don't have it)
   - Under **"Authorized JavaScript origins"**, click **"+ ADD URI"** and add:
     ```
     http://localhost:3001
     ```
     (Note: Use `http://localhost:3000` if your app runs on port 3000)

3. **Add Redirect URI**
   - Under **"Authorized redirect URIs"**, click **"+ ADD URI"** and add:
     ```
     http://localhost:3001/auth
     ```
     (Note: Use `http://localhost:3000/auth` if your app runs on port 3000)

4. **Save and Wait**
   - Click **"SAVE"** at the bottom
   - Wait 1-2 minutes for changes to propagate
   - Try Google Sign-In again

**Common Error Fix**: If you see "Error 400: redirect_uri_mismatch", make sure:
- The redirect URI exactly matches what's in Google Cloud Console (including http/https and trailing slashes)
- You've saved the changes in Google Cloud Console
- You've waited a few minutes after saving for changes to take effect

## 📱 Screenshots

The application features a clean, modern interface with:
- Beautiful card-based post layout
- Intuitive navigation
- Responsive design for all screen sizes
- Material-UI components for consistent styling

## 🔧 Technical Highlights

- **Modern React patterns** with functional components and hooks
- **Redux state management** for scalable application state
- **RESTful API** with proper HTTP methods and status codes
- **Database schema design** with Mongoose models
- **Error handling** and validation throughout the stack
- **Cross-origin resource sharing** (CORS) enabled

## 🌟 Learning Outcomes

This project demonstrates:
- Full-stack development capabilities
- Modern web development practices
- API design and implementation
- Database design and management
- State management in React applications
- Responsive UI/UX design

## 📚 What I Learned

Building this project helped me understand:
- How to structure a full-stack application
- Modern JavaScript (ES6+) features
- React component architecture
- Redux state management patterns
- RESTful API design principles
- Database modeling with MongoDB
- Modern development workflow

## 🔄 Keep Your App Alive 24/7

**Important for Deployed Apps**: If you're using Render's free tier for backend, it spins down after 15 minutes of inactivity, causing slow load times.

**FREE Solution**: Set up UptimeRobot to ping your backend every 5 minutes and keep it alive 24/7!

👉 **See [KEEP_ALIVE_SETUP.md](./KEEP_ALIVE_SETUP.md) for 2-minute setup guide**

This ensures your app loads instantly for visitors and recruiters!

## 🎉 Future Enhancements

Potential improvements could include:
- User authentication and authorization
- Real-time notifications
- Advanced search and filtering
- Social sharing features
- Mobile app development
- Performance optimizations



## 👨‍💻 Message From Toseeb 

This project was developed as part of my learning journey in full-stack web development. It showcases my ability to work with modern web technologies and build complete, production-ready applications.

