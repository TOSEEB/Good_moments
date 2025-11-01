import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import UserModal from "../models/user.js";
import { sendPasswordSetupEmail, sendPasswordResetEmail } from "../utils/emailService.js";

const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('❌ ERROR: JWT_SECRET is not defined in environment variables.');
  console.error('Please create a .env file in the server directory with JWT_SECRET');
  throw new Error('JWT_SECRET is required for authentication');
}

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // Check if user has no password (Google login only)
    if (!oldUser.password) {
      // User exists but has no password - they logged in with Google first
      // Generate verification token and send email
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = Date.now() + 3600000; // 1 hour from now
      
      oldUser.passwordResetToken = resetToken;
      oldUser.passwordResetExpires = new Date(resetTokenExpires);
      await oldUser.save();

      // Send verification email
      const emailResult = await sendPasswordSetupEmail(oldUser.email, resetToken, oldUser.name);
      
      return res.status(400).json({ 
        message: "This account was created with Google login. We've sent you an email with a link to set your password. Please check your inbox.",
        needsPassword: true,
        emailSent: emailResult.sent,
        googleId: oldUser.googleId ? true : false
      });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id, name: oldUser.name }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) {
      // If user exists with Google OAuth, allow password to be added
      if (oldUser.googleId && !oldUser.password) {
        // User exists with Google login, add password to link accounts
        const hashedPassword = await bcrypt.hash(password, 12);
        oldUser.password = hashedPassword;
        if (!oldUser.name && firstName && lastName) {
          oldUser.name = `${firstName} ${lastName}`;
        }
        await oldUser.save();
        
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id, name: oldUser.name }, secret, { expiresIn: "1h" });
        return res.status(200).json({ result: oldUser, token });
      }
      // User already exists with password
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id, name: result.name }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const googleAuth = async (req, res) => {
  const { email, googleId, name, picture } = req.body;

  try {
    if (!email || !googleId || !name) {
      return res.status(400).json({ message: "Missing required fields: email, googleId, name" });
    }

    // Find user by email first (to link accounts)
    let user = await UserModal.findOne({ email });

    if (user) {
      // User exists - update Google ID if not set, link accounts
      if (!user.googleId) {
        user.googleId = googleId;
      }
      // Update name if not set
      if (!user.name) {
        user.name = name;
      }
      await user.save();
    } else {
      // Check if user exists with this Google ID
      user = await UserModal.findOne({ googleId });
      
      if (!user) {
        // Create new user with Google OAuth
        user = await UserModal.create({ 
          email, 
          googleId, 
          name, 
          password: null // No password for Google OAuth users
        });
      }
    }

    // Generate JWT token for consistent authentication
    const token = jwt.sign({ 
      email: user.email, 
      id: user._id, 
      name: user.name 
    }, secret, { expiresIn: "1h" });

    // Return user with token (same format as signin/signup)
    res.status(200).json({ 
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Endpoint to request password setup email (for Google-only users)
export const requestPasswordSetup = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModal.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.status(200).json({ 
        message: "If an account exists with this email, we've sent a password setup link."
      });
    }

    // Check if user already has a password
    if (user.password) {
      return res.status(400).json({ message: "Password already set. Please use Sign In or Forgot Password." });
    }

    // Generate verification token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour from now
    
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(resetTokenExpires);
    await user.save();

    // Send verification email
    const emailResult = await sendPasswordSetupEmail(user.email, resetToken, user.name);

    res.status(200).json({ 
      message: "Password setup email sent. Please check your inbox.",
      emailSent: emailResult.sent,
      // Include link for development if email not configured
      ...(emailResult.link && !emailResult.sent ? { devLink: emailResult.link } : {})
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Endpoint to request password reset email (for users with existing passwords)
// This can also handle Google-only users (password setup)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModal.findOne({ email });

    if (!user) {
      // Return specific error if user doesn't exist (for better UX)
      return res.status(404).json({ 
        message: "Email does not exist in our system. Please check your email address or sign up first.",
        emailNotFound: true
      });
    }

    // Generate verification token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour from now
    
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(resetTokenExpires);
    await user.save();

    // If user has a password, send password reset email
    // If user doesn't have a password (Google-only), send password setup email
    let emailResult;
    try {
      if (user.password) {
        emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);
      } else {
        emailResult = await sendPasswordSetupEmail(user.email, resetToken, user.name);
      }
      
      // Log result for debugging
      if (emailResult.sent) {
        console.log(`✅ Password reset email sent successfully to ${user.email}`);
      } else {
        console.log(`⚠️ Email not sent to ${user.email}. Reason: ${emailResult.error || 'Email service not configured'}`);
        if (emailResult.link) {
          console.log(`📧 Development link: ${emailResult.link}`);
        }
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      emailResult = { sent: false, error: emailError.message };
    }

    res.status(200).json({ 
      message: user.password 
        ? "Password reset email sent. Please check your inbox." 
        : "Password setup email sent. Please check your inbox.",
      emailSent: emailResult.sent,
      // Include link for development if email not configured
      ...(emailResult.link && !emailResult.sent ? { devLink: emailResult.link } : {})
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Endpoint to verify token and set/reset password
// Handles both password setup (Google-only users) and password reset (users with existing passwords)
export const verifyTokenAndSetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  try {
    if (!token || !email || !password) {
      return res.status(400).json({ message: "Token, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await UserModal.findOne({ 
      email,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired token. Please request a new password reset link."
      });
    }

    // Check if this was a password reset (user already had password) or password setup (Google-only user)
    const isPasswordReset = !!user.password;

    // Set or reset password (works for both password setup and password reset)
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate JWT token and return (same as signin)
    const jwtToken = jwt.sign({ email: user.email, id: user._id, name: user.name }, secret, { expiresIn: "1h" });

    res.status(200).json({ 
      message: isPasswordReset ? "Password reset successfully" : "Password set successfully",
      result: user, 
      token: jwtToken
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Endpoint to set password for Google-only users (DEPRECATED - use verifyTokenAndSetPassword)
export const setPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModal.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // Check if user already has a password
    if (user.password) {
      return res.status(400).json({ message: "Password already set. Please use Sign In instead." });
    }

    // Set password for Google-only user
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    // Generate JWT token and return (same as signin)
    const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, secret, { expiresIn: "1h" });

    res.status(200).json({ 
      message: "Password set successfully",
      result: user, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
