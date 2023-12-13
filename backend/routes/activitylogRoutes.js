const express = require('express')
const router = express.Router()
const {
  getActivityLog,
  setActivityLog
} = require('../controllers/activitylogController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(getActivityLog)
router.route('/setlog').post(setActivityLog)

module.exports = router
