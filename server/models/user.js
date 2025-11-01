import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google OAuth users
  googleId: { type: String, required: false }, // Google user ID
  passwordResetToken: { type: String, required: false }, // Token for password setup/reset
  passwordResetExpires: { type: Date, required: false }, // Token expiration
  id: { type: String },
});

export default mongoose.model("User", userSchema); 



