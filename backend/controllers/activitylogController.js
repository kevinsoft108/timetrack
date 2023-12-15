const asyncHandler = require('express-async-handler')
const ActivityLog = require('../models/activityLogModel')
const formatDateString = require('../config/formatDate')


const getActivityLog = asyncHandler(async (req, res) => {
  const userId = req.body.userid;
  const activitylog = await ActivityLog.find({ userid: userId });

  //get all data for test
  // const activitylog = await ActivityLog.find({});
  // console.log(activitylog.length)


  res.status(200).json(activitylog)
})

const setActivityLog = asyncHandler(async (req, res) => {
  const { user_id, start_time, screen_recording, keystrokes, process_url, duration, app_webpage } = req.body;

  console.log("user_id", user_id)


  // console.log(screen_recording);
  if (user_id) {

    const newLog = await ActivityLog.create({
      userid: user_id,
      start_time: formatDateString(new Date()),
      screen_recording: screen_recording,
      keystrokes: keystrokes,
      process_url: process_url,
      duration: duration,
      app_webpage: app_webpage

    })
    console.log(newLog);
    res.json(user_id)

  } else {
    res.json(user_id)
  }

})

module.exports = {
  getActivityLog,
  setActivityLog
}


