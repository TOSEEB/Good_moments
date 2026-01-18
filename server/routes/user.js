import express from "express";
const router = express.Router();

import { signin, signup, googleAuth, setPassword, requestPasswordSetup, verifyTokenAndSetPassword, forgotPassword } from "../controllers/user.js";

// Add logging middleware to debug route matching
router.use((req, res, next) => {
  console.log(`🔵 User route matched: ${req.method} ${req.path} | Full URL: ${req.url}`);
  next();
});

// Ensure all methods are explicitly handled
router.post("/signin", (req, res, next) => {
  console.log(`✅ POST /signin route handler called`);
  signin(req, res, next);
});
router.post("/signup", (req, res, next) => {
  console.log(`✅ POST /signup route handler called`);
  signup(req, res, next);
});
router.post("/google", (req, res, next) => {
  console.log(`✅ POST /google route handler called`);
  googleAuth(req, res, next);
});
router.post("/request-password-setup", requestPasswordSetup);
router.post("/forgot-password", forgotPassword);
router.post("/verify-token-set-password", verifyTokenAndSetPassword);
router.post("/set-password", setPassword); // Keep for backward compatibility

export default router;