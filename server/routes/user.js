import express from "express";
const router = express.Router();

import { signin, signup, googleAuth, setPassword, requestPasswordSetup, verifyTokenAndSetPassword, forgotPassword } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/google", googleAuth);
router.post("/request-password-setup", requestPasswordSetup);
router.post("/forgot-password", forgotPassword);
router.post("/verify-token-set-password", verifyTokenAndSetPassword);
router.post("/set-password", setPassword); // Keep for backward compatibility

export default router;