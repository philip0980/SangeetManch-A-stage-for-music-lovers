import User from "../models/user.js";

const checkBanOrSuspension = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({
        error:
          "Your are banned from accessing this service. Please contact support",
      });
    }

    const now = new Date();
    if (user.suspensionEnd && user.suspensionEnd > now) {
      return res.status(403).json({
        error: `You are suspended until ${user.suspensionEnd}. Please wait until the suspension ends.`,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to check user status" });
  }
};

export { checkBanOrSuspension };
