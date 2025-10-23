const mongoose = require("mongoose");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ errors: true, message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists)
      return res
        .status(400)
        .json({ errors: true, message: "User Already Exists" });

    const newUser = await User.create({
      name: name,
      email: email,
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ errors: true, message: error.message });
  }
};

//login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errors: true, message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email: email });

    if (!userExists)
      return res
        .status(400)
        .json({ errors: true, message: "Email or password is invalid" });

    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ errors: true, message: "Email or password is invalid" });

    const token = jwt.sign({ id: userExists._id }, process.env.SEC, {
      expiresIn: "1d",
    });

    res.status(200).json({
      errors: false,
      data: {
        user: {
          id: userExists._id,
          name: userExists.name,
          email: userExists.email,
        },
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({ errors: true, message: error.message });
  }
};
