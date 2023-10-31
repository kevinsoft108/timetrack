const asyncHandler = require('express-async-handler')

const Timetrack = require('../models/timetrackModel')

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getTimetrack = asyncHandler(async (req, res) => {
  const userId = 'user1';
  const timetrack = await Timetrack.find({ userid: userId });
  res.status(200).json(timetrack)
})

module.exports = {
  getTimetrack,
}


// Query the database for documents where userid is "user1"
