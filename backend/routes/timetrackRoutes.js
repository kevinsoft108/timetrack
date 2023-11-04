const express = require('express')
const router = express.Router()
const {
  getTimetrack,
  setTimetrack
} = require('../controllers/timetrackController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(getTimetrack)
router.route('/settime').post(setTimetrack)

module.exports = router
