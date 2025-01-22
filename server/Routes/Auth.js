const User = require("../Models/UserSchema");
const express = require("express");
const router = express.Router();

const errorHandler = require("../Middlewares/errorMiddleware");
const authTokenHandler = require("../Middlewares/checkAuthToken");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shamiranchi@gmail.com", // Your Gmail address
    pass: "qgdaaad haassgrq fguu tovssk", // The App Password
  },
});

// Test route
router.get("/test", async (req, res) => {
  res.json({
    message: "User API is working",
  });
});

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

// Configure your transporter (ensure you have added the required environment variables)

router.post("/sendotp", async (req, res, next) => {
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    // Set up email options
    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: "OTP for Verification of blogApp",
      text: `Your OTP is ${otp}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    // Save OTP in your database or session (not included here)

    // res.json({   message: 'OTP sent successfully',otp:otp});
    return res.status(200).json(createResponse(true, "OTP sent successfully"));
  } catch (err) {
    console.error("Error sending email:", err);
    // res.status(500).json({ message: 'Failed to send OTP' });
    return res.status(500).json(createResponse(false, "Failed to send OTP"));
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return res.status(409).json({ message: "Email already exists" });
      return res
        .status(409)
        .json(createResponse(false, "Email already exists"));
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();
    // res.status(201).json({ message: "User registered successfully", user: newUser });
    return res
      .status(201)
      .json(createResponse(true, "user registerd succssfully"));
  } catch (err) {
    next(err);
  }
});

// Login route
// router.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user already exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       // return res.status(400).json({ message: "invalid email or password" });
//       return res
//         .status(409)
//         .json(createResponse(false, "Email already exists"));
//     }
// const isMatch = await bcrypt.compare(password, user.password);

// if (!isMatch) {
//   // return res.status(400).json({ message: "invalid email or password" });
//   return res
//     .status(400)
//     .json(createResponse(false, "invalid email or password"));
// }

//     const authToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "10m" }
//     );
//     const refreshToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_REFRESH_SECRET_KEY,
//       { expiresIn: "40m" }
//     );

//     res.cookie("authToken", authToken, { httpOnly: true });
//     res.cookie("refreshToken", refreshToken, { httpOnly: true });

//     // res.status(200).json({message:'login successfull'})
//     return res.status(200).json(createResponse(true, "login successfully"));
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Authenticate the user (this is just a simplified example)
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    // return res.status(400).json({ message: "invalid email or password" });
    return res
      .status(400)
      .json(createResponse(false, "invalid email or password"));
  }

  const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "10d" }
  );

  // Set tokens as response headers
  res.setHeader("Authorization", `Bearer ${authToken}`); // Send auth token
  res.setHeader("x-refresh-token", refreshToken); // Send refresh token

  res.json({
    ok: true,
    message: "Login successful",
    authToken: authToken,
    refreshToken: refreshToken,
  });
});

router.use(errorHandler);

router.get("/checklogin", authTokenHandler, async (req, res) => {
  console.log("Request received at /auth/checklogin");
  
  res.json({
    ok: true,
    message: "User authenticated successfully",
  });
});

module.exports = router;
