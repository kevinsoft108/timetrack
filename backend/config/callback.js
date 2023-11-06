const mongoose = require('mongoose')
const Timetrack = require('../models/timetrackModel')
const formatDateString = require('./formatDate')
const callBack = async () => {
  const conn = mongoose.connect(process.env.MONGO_URI)
  const documents = await Timetrack.find({ check: { $exists: false } })

  for (let item in documents) {
    // console.log(documents[item])
    const time = documents[item]
    const standard = 400000
    if ((new Date().getTime() - new Date(time.update).getTime()) >= standard) {
      console.log('--------end--callback-----', new Date())
      time.detect_end = formatDateString(new Date(new Date(time.update).getTime() + 2000))
      time.check = formatDateString(new Date(new Date(time.update).getTime() + 2000))
      time.save()
    }
  }
}

module.exports = callBack;