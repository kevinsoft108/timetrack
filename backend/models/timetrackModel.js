const mongoose = require('mongoose');

const timetrackModel = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  detect_start: {
    type: String,
    required: true
  },
  detect_end: {
    type: String,
    required: false
  },
  update: Date,
  check: String
});

const TimetrackModel = mongoose.model('Timetrack', timetrackModel);

module.exports = TimetrackModel;