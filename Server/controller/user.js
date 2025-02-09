import User from "../models/user.js";
import { sendToken } from "../Utils/sendToken.js";
import bcrypt from "bcryptjs";

const Register = async (req, res) => {
  const { name, email, password, cpassword } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
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

export { Register, Login };
