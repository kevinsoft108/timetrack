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
  console.log(new Date(), req.body);
  const { userid, flag, newid } = req.body;
  if (!newid && flag == 1) {
    console.log('--------start-------', new Date())
    const newTrack = await Timetrack.create({
      userid: userid,
      detect_start: formatDateString(new Date()),
      detect_end: formatDateString(new Date()),
      update: formatDateString(new Date())
    })
    // console.log(newTrack._id);
    res.json(newTrack._id)
  }
  if (flag == 1 && newid) {
    const track = await Timetrack.findOne({ userid: userid, _id: newid })
    const standard = new Date().getTime() - new Date(track.update).getTime()
    if (standard < 310000) {
      console.log("------update------", new Date());
      track.update = formatDateString(new Date())
      track.detect_end = formatDateString(new Date())
      track.save()
      res.json(track._id)
    }
  }
  if (newid && flag == 0) {
    const track = await Timetrack.findOne({ userid: userid, _id: newid })
    console.log('--------end-------', new Date())
    if (!track.detect_end) {
      track.detect_end = formatDateString(new Date())
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


