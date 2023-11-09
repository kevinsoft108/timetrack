const asyncHandler = require('express-async-handler')
const Timetrack = require('../models/timetrackModel')
const formatDateString = require('../config/formatDate')

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getTimetrack = asyncHandler(async (req, res) => {
  const userId = req.body.userid;
  const timetrack = await Timetrack.find({ userid: userId });
  res.status(200).json(timetrack)
})

const setTimetrack = asyncHandler(async (req, res) => {
  const { userid, flag, newid } = req.body;
  if (!newid && flag == 1) {
    const newTrack = await Timetrack.create({
      userid: userid,
      detect_start: formatDateString(new Date()),
      detect_end: formatDateString(new Date(new Date().getTime() + 2000)),
      update: new Date()
    })
    // console.log(newTrack._id);
    res.json(newTrack._id)
  }
  if (flag == 1 && newid) {
    const track = await Timetrack.findOne({ userid: userid, _id: newid })
    const standard = new Date().getTime() - new Date(track.update).getTime()
    if (standard < 310000) {
      track.update = new Date()
      track.detect_end = formatDateString(new Date(new Date().getTime() + 2000))
      track.save()
      res.json(track._id)
    }
  }
  if (newid && flag == 0) {
    const track = await Timetrack.findOne({ userid: userid, _id: newid })
    if (!track.detect_end) {
      track.detect_end = formatDateString(new Date(new Date().getTime() + 2000))
      track.check = formatDateString(new Date(new Date().getTime() + 2000))
      track.save()
      res.json('')
    } else {
      res.json('')
    }
  }
  if (flag == 0) {
    res.json('')
  }

})

module.exports = {
  getTimetrack,
  setTimetrack
}


