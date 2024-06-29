const User = require('../models/userModel')
const { v4: uuidv4 } = require('uuid')

const authUser = async (req, res, next) => {
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
}

module.exports = { authUser }
