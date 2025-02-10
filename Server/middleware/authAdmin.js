import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticateAdmin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authentication.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " Invalid or expired token" });
  }
};

export { authenticateAdmin };
