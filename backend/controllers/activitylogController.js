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

const formatDuration = (duration) => {
  const format = "HH:mm:ss";
  let hours = (Math.floor(duration / 3600)).toString()
  let minutes = (Math.floor((duration % 3600) / 60)).toString()
  let seconds = (duration % 60).toString()

  hours = hours.length === 1 ? '0' + hours : hours;
  minutes = minutes.length === 1 ? '0' + minutes : minutes;
  seconds = seconds.length === 1 ? '0' + seconds : seconds;

  const formattedDate = format
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);

  console.log(formattedDate);

  return formattedDate;
}

const setActivityLog = asyncHandler(async (req, res) => {
  const { user_id, start_time, screen_recording, computer_name, keystrokes, process_url, duration, app_webpage } = req.body;

  // const format_duration = formatDuration(duration)
  console.log("user_id", user_id)


  // console.log(screen_recording);
  if (user_id) {

    const newLog = await ActivityLog.create({
      userid: user_id,
      start_time: formatDateString(new Date()),
      screen_recording: screen_recording,
      computer_name: computer_name,
      keystrokes: keystrokes,
      process_url: process_url,
      duration: formatDuration(duration),
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


