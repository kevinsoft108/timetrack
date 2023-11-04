const mongoose = require('mongoose');

const timetrackModel = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  detect_start: {
    type: Date,
    required: true
  },
  detect_end: {
    type: Date,
    required: true
  }
});

const TimetrackModel = mongoose.model('Timetrack', timetrackModel);

module.exports = TimetrackModel;