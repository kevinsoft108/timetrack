const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const express = require("express");
const router = express.Router()
const Image = require("../models/imageModel");
const User = require('../models/userModel');
const Employ = require('../models/employModel');

const app = express();

var saveImg = '';



const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password, image } = req.body

  if (!name || !email || !password || !image) {
    res.status(400)
    throw new Error('Please add all fields')
  }
  // Check if user exists
  const employExists = await Employ.findOne({ email: email, username: name })

  if (employExists) {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    employExists.password = hashedPassword;
    employExists.face = image;
    employExists.save()
    let user = employExists;
    if (user) {

      // socketIO.on('connection', (socket) => {
      //   console.log(`⚡: ${socket.id} user just connected!`);

      //   socket.on('disconnect', () => {
      //     console.log('🔥: A user disconnected');
      //     socket.disconnect();
      //   });
      // });

      res.status(201).json({
        _id: user.id,
        name: user.username,
        email: user.email,
        image: user.face,
        token: generateToken(user._id)
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  }
  else {
    res.status(400)
    throw new Error('User already exists')
  }
})



// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, image } = req.body
  const loginImage = image;

  // Check for user email
  const user = await Employ.findOne({ email })
  if (user) {
    saveImg = user.image;
  }
  // else {
  //   // If the user is not found, you can throw an error or set a default value
  //   throw new Error('User not found');
  // }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      image: user.face
    });
  }
  else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})





// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  work
}

