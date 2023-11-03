const express = require('express')
const router = express.Router()

const {
  registerUser,
  loginUser,
  getMe,
  work
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.post('/work', work)

module.exports = router

