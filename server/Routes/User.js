const express = require("express");
const router = express.Router();
const authTokenHandler = require("../Middlewares/checkAuthToken");
const User = require('../Models/UserSchema'); // Import the User model

router.get("/profile", authTokenHandler, async (req, res) => {
  try {
    const userId = req.userId; // Extract the userId from the middleware

    // Fetch user details from the database
    const user = await User.findById(userId).select("-password") // Exclude the password field

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      userDetails: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
