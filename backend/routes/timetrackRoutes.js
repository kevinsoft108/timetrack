const express = require('express')
const router = express.Router()
const {
  getTimetrack
} = require('../controllers/timetrackController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(getTimetrack)

module.exports = router
