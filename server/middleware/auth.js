import jwt from "jsonwebtoken";
import UserModal from "../models/user.js";

const secret = process.env.JWT_SECRET || 'test';

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Invalid token format" });
    }

    // Check if token is a JWT (custom auth tokens are JWTs, typically < 500 chars and have 3 parts)
    const isJWT = token.length < 500 && token.split('.').length === 3;

    let decodedData;
    let user;

    if (isJWT) {
      // This is a JWT token from signin/signup/googleAuth
      try {
        decodedData = jwt.verify(token, secret);
        
        // Look up user by ID to ensure they exist and get latest info
        user = await UserModal.findById(decodedData.id);
        
        if (!user) {
          return res.status(401).json({ message: "Unauthorized - User not found" });
        }
        
        req.userId = user._id.toString();
        req.userName = user.name || decodedData.name;
        req.userEmail = user.email || decodedData.email;
      } catch (jwtError) {
        // If JWT verification fails, return error
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
    } else {
      // This might be an old Google OAuth access token (opaque, not a JWT)
      // For backward compatibility, try to look up user by email/googleId from headers
      const googleUserId = req.headers['x-google-user-id'] || req.headers['X-Google-User-Id'];
      const userEmail = req.headers['x-user-email'] || req.headers['X-User-Email'];
      const userName = req.headers['x-user-name'] || req.headers['X-User-Name'];
      
      if (userEmail) {
        // Try to find user by email first (for account linking)
        user = await UserModal.findOne({ email: userEmail });
        
        if (user) {
          req.userId = user._id.toString();
          req.userName = user.name || userName || 'User';
          req.userEmail = user.email;
        } else if (googleUserId) {
          // Fallback: try to find by googleId
          user = await UserModal.findOne({ googleId: googleUserId });
          if (user) {
            req.userId = user._id.toString();
            req.userName = user.name || userName || 'User';
            req.userEmail = user.email;
          } else {
            // User not found - should authenticate with Google endpoint first
            return res.status(401).json({ message: "Unauthorized - Please sign in again" });
          }
        } else {
          return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
      } else if (googleUserId) {
        // Try to find by googleId
        user = await UserModal.findOne({ googleId: googleUserId });
        if (user) {
          req.userId = user._id.toString();
          req.userName = user.name || userName || 'User';
          req.userEmail = user.email;
        } else {
          return res.status(401).json({ message: "Unauthorized - Please sign in again" });
        }
      } else {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
    }    

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Authentication failed" });
  }
};

export default auth;
