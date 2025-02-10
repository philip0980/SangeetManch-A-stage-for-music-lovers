import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  avatar: {
    public_id: String,
    url: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  isBanned: { type: Boolean, default: false },
  suspensionEnd: { type: Date, default: null },
  banReason: { type: String, default: " " },
  suspensionReason: { type: String, default: " " },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);

export default User;
