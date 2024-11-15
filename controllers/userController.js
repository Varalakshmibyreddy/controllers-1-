// controllers/authController.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User')

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a verification token
  const signedToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    // Save the user to the database
    await newUser.save();

    // Generate verification URL
    const verificationUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    // Send verification email
    await sendVerificationEmail(email, verificationUrl);

    // Send response
    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Verify user's email
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // Update user's verification status
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email', error });
  }
};

// Helper function to send verification emails
const sendVerificationEmail = async (email, verificationUrl) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `
      <p>Welcome! Please verify your email by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify Email</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Export all functions as an object
module.exports = {registerUser,verifyEmail};
