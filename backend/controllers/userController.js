const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/adminModel')
const express = require("express");
const router = express.Router()
const Image = require("../models/imageModel");

var saveImg = '';

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body

  if (!name || !email || !password || !image) {
    res.status(400)
    throw new Error('Please add all fields')
  }
  // Check if user exists
  const userExists = await User.findOne({ email: email })


  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Check if email is allowed
  // if (!allowedEmails.includes(email)) {
  //   res.status(400)
  //   throw new Error('Email now allowed')
  // }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    image,
  })
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, image } = req.body
  const loginImage = image;
  // console.log(loginImage,"llllllllllllllllllllllllllllll")

  // Check for user email
  const user = await User.findOne({ email })
  if (user) {
    saveImg = user.image;
    // console.log(saveImg,'sssssssssssssssssssssssssssssssssssssssssssss');
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
    });
  }
  else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// // ------------ Here! You compare dashboard image
const work = asyncHandler(async (req, res) => {
  const { image } = req.body;
  // const newImage = req.body.image;
  console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
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
