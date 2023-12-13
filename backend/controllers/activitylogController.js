const asyncHandler = require('express-async-handler')
const ActivityLog = require('../models/activityLogModel')
const formatDateString = require('../config/formatDate')


const getActivityLog = asyncHandler(async (req, res) => {
  // const userId = req.body.userid;
  // const activitylog = await ActivityLog.find({ userid: userId });

  //get all data for test
  const activitylog = await ActivityLog.find({});
  // console.log(activitylog[0])
  res.status(200).json(activitylog)
})

const setActivityLog = asyncHandler(async (req, res) => {
  const { user_id, email, start_time, screen_recording, keystrokes, process_url, duration, app_webpage } = req.body;

  console.log("user_id", user_id)

  // if (!user_id) {
  //   console.log('finding employ')
  //   const user = await Employ.findOne({ email })
  //   console.log(user)
  //   if (user) {
  //     user_id = user._id
  //     console.log('user_id', user_id)
  //   } else {
  //     console.log('invalid credentials')
  //     res.status(400)
  //     res.json('Invalid credentials')
  //   }
  // }

  // console.log(screen_recording);
  if (screen_recording || keystrokes) {

    const newLog = await ActivityLog.create({
      userid: user_id,
      start_time: formatDateString(new Date()),
      screen_recording: screen_recording,
      keystrokes: keystrokes,

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


