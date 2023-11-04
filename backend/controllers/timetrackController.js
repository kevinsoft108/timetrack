const asyncHandler = require('express-async-handler')

const Timetrack = require('../models/timetrackModel')

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getTimetrack = asyncHandler(async (req, res) => {
  const userId = req.body.userid;
  const timetrack = await Timetrack.find({ userid: userId });
  res.status(200).json(timetrack)
})

const setTimetrack = asyncHandler(async (req, res) => {
  const { userid, flag, _id } = req.body;

  const inputDateString = "11/4/2023, 9:56:46 PM";
  const inputDateFormat = "MM/DD/YYYY, h:mm:ss A";
  const outputDateFormat = "YYYY-MM-DDTHH:mm:ssZ";

  const inputDate = new Date(inputDateString);
  const outputDateString = formatDateString(inputDate, outputDateFormat);

  // Get the current local time in Japan
  let today = new Date();
  let today_change = today.toLocaleString();

  //Get the current local time + one minute
  const currentTime = new Date();
  const newTime = new Date(currentTime.getTime() + 60000);
  const newTime_one = newTime.toLocaleString()

  // res.json(formatDateString(new Date(today_change), outputDateFormat))

  if (flag == 1) {
    console.log("-------------startime--------------");
    const setStartTime = await Timetrack.create({
      userid: userid,
      detect_start: formatDateString(new Date(today_change), outputDateFormat),
      detect_end: formatDateString(new Date(newTime_one), outputDateFormat)
    })
    res.json(setStartTime._id)
  } else {
    console.log("-------------endtime--------------");
    beforeTime = await Timetrack.findOne({ user: userid, _id: _id })
    beforeTime.detect_end = formatDateString(new Date(today_change), outputDateFormat);
    beforeTime.save()
    // res.json(beforeTime);
  }

  function formatDateString(date, format) {
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();

    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;
    hours = hours.length === 1 ? '0' + hours : hours;
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
    seconds = seconds.length === 1 ? '0' + seconds : seconds;

    const formattedDate = format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('Z', 'Z');

    return formattedDate;
  }
})

module.exports = {
  getTimetrack,
  setTimetrack
}


