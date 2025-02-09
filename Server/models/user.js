import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // avatar: {
  //   public_id: String,
  //   url: String,
  // },
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
});

const User = mongoose.model("User", userSchema);

export default User;
