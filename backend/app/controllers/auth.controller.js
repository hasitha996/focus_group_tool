const axios = require('axios');
const jwt = require("jsonwebtoken");
const db = require("../models");
const { oauth2Client } = require("../config/auth.config");
const User = db.user;
const Op = db.Sequelize.Op;

exports.signin = async (req, res, next) => {
  const code = req.query.code;

  // Ensure the authorization code is present
  if (!code) {
    return res.status(400).json({ message: "Authorization code is required" });
  }

  try {
    // Get the tokens from Google OAuth2 client
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);

    // Fetch user information from Google using the access token
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;

    // Check if the user already exists in the database
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // If user doesn't exist, create a new user record
      user = await User.create({
        name,
        email,
        image: picture,
        user_role_id:1
      });
    }

    // Create a JWT token
     const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: 3600, // 1 hour
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 * 1000, // 1 hour
      path: "/",
    });

    // Send the success response with the token and user data
    res.status(200).json({
      message: 'Success',
      accessToken,
      user,
    });

  } catch (err) {
    // Handle specific errors from Google API
    if (err.response && err.response.data) {
      console.error("Google API error:", err.response.data);
      return res.status(400).json({
        message: "Google sign-in failed",
        details: err.response.data,
      });
    }

    // Handle unexpected errors
    console.error("Unexpected error during Google sign-in:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getUserList = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'image', 'user_role_id'],
      order: [['createdAt', 'DESC']], 
    });

  
    res.status(200).json({
      message: 'User list fetched successfully',
      users,
    });
  } catch (err) {
    console.error("Error fetching user list:", err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

