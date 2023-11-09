const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const adminSeed = asyncHandler(async () => {
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt)
  // Define the data to be seeded
  const data = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword
  }

  // Seed the data
  Admin.create(data)
    .then(() => {
      console.log('Data seeded successfully');
    })
    .catch(error => {
      console.error('Error seeding data:', error);
    });
})

module.exports = adminSeed