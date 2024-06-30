const User = require('../models/userModel')
const { v4: uuidv4 } = require('uuid')

const authUser = async (req, res, next) => {
  try {
    let userId = req.cookies.userId
    let user

    if (userId) {
      user = await User.findOne({ userId })
    }

    if (!user) {
      const ipAddress = req.ip

      user = await User.findOne({ ipAddress })

      if (!user) {
        userId = uuidv4()
        user = new User({ userId, ipAddress, favorites: [] })
        await user.save()
      }

      res.cookie('userId', user.userId, { httpOnly: true })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Error in authUser middleware: ', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { authUser }
