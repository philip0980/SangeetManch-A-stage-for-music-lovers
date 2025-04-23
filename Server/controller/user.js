import User from "../models/user.js";
import { sendToken } from "../Utils/sendToken.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import fs from "fs";

// Authentication and Authorization
const Register = async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  const avatar = req.file?.path;

  if (!password || !cpassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password required" });
  }

  if (password !== cpassword) {
    return res
      .status(400)
      .json({ succcess: false, message: "Password do not match" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    let myCloud;
    if (avatar) {
      myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      fs.unlinkSync(avatar);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      avatar: myCloud
        ? {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          }
        : undefined,
      name,
      email,
      password: hashedPassword,
      cpassword: hashedPassword,
    });

    await newUser.save();
    sendToken(res, newUser, 201, "User created");
  } catch (error) {
    console.log(error);
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({
        error:
          "You are banned from accessing this service. Please contact support.",
      });
    }

    const now = new Date();
    if (user.suspensionEnd && user.suspensionEnd > now) {
      return res.status(403).json({
        message: `Your account is suspended until ${user.suspensionEnd} for ${user.suspensionReason}. Please wait until the suspension ends.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalidd credentials" });
    }

    sendToken(res, user, 200, "User logged in");
  } catch (error) {
    console.log(error);
  }
};

const Logout = async (req, res) => {
  res.cookie("token", " ", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Account Recovery

// Profile management

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const UpdateProfile = async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({
      success: false,
      message: "Either name or email should be filled",
    });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken by another account",
        });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error occured while updating the profile",
    });
  }
};

const ChangePassword = async (req, res) => {
  const { oldPassword, newPassword, cNewPassword } = req.body;

  if ((!oldPassword, !newPassword, !cNewPassword)) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (newPassword !== cNewPassword) {
    return res
      .status(400)
      .json({ success: false, message: "New password didn't match" });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    return res
      .status(400)
      .json({ success: false, message: "Old password is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedNewPassword;

  try {
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occured while updating the password",
    });
  }
};

const DeleteAccount = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid password",
      });
    }

    await User.findByIdAndDelete(user._id);
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "An error occured while deleting the account",
    });
  }
};

const BanAccount = async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.isBanned) {
      return res
        .status(400)
        .json({ success: false, error: "User is already banned" });
    }

    user.isBanned = true;
    user.banReason = reason;
    await user.save();

    res
      .status(200)
      .json({ success: false, message: "User has been banned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to ban user" });
  }
};

const SuspendAccount = async (req, res) => {
  const { userId } = req.params;
  const { reason, duration } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.isBanned) {
      return res
        .status(400)
        .json({ success: false, error: "User is already banned" });
    }

    const suspensionEndDate = new Date();
    suspensionEndDate.setDate(suspensionEndDate.getDate() + duration);

    user.suspensionEnd = suspensionEndDate;
    user.suspensionReason = reason;
    await user.save();

    res.status(200).json({
      success: false,
      message: "User has been suspended successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to suspend user" });
  }
};

const CheckSuspension = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isBanned) {
      return res.status(400).json({ error: "User is banned" });
    }

    const now = new Date();
    if (user.suspensionEnd && user.suspensionEnd > now) {
      return res.status(403).json({
        message: `User is suspended until ${user.suspensionEnd} for ${user.suspensionReason}`,
      });
    }

    res.status(200).json({ success: true, message: "User is not suspended" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to check suspension status" });
  }
};

// getting user data
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "Users not found" });
    }

    res.status(200).json({ success: true, message: "Users found", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Failed to find the users" });
  }
};

const singleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
};

export {
  Register,
  Login,
  Logout,
  ChangePassword,
  UpdateProfile,
  DeleteAccount,
  BanAccount,
  SuspendAccount,
  CheckSuspension,
  getProfile,
  getUsers,
  singleUser,
};
