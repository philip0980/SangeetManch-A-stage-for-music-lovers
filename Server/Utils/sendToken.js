import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY);
};

const sendToken = async (res, user, statuscode, message) => {
  const token = await generateToken(user);

  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  };

  return res
    .status(statuscode)
    .cookie("token", token, options)
    .json({ success: true, message, user, token });
};

export { sendToken };
