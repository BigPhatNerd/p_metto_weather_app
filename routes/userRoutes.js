const express = require('express')
const router = express.Router()
const {
  getUser,
  addFavorite,
  addLocation,
} = require('../controllers/userController')
const { authUser } = require('../middleware/userAuth')

router.get('/', authUser, getUser)
router.post('/favorites', authUser, addFavorite)
router.put('/location', authUser, addLocation)

module.exports = router
