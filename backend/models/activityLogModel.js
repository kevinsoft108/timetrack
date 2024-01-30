const mongoose = require('mongoose');

const activityLogModel = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    screen_recording: {
        type: String,
        required: false
    },
    computer_name: {
        type: String,
        required: false
    },
    keystrokes: {
        type: String,
        required: false
    },
    key_mouse_count: {
        type: String,
        required: false
    },
    process_url: {
        type: String,
        required: false
    },
    duration: {
        type: String,
        required: false
    },
    app_webpage: {
        type: String,
        required: false
    }
});

const ActivityLogModel = mongoose.model('ActivityLog', activityLogModel);

module.exports = ActivityLogModel;