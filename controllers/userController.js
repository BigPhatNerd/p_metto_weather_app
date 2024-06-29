const User = require('../models/userModel')

const getUser = async (req, res) => {
  try {
    const user = req.user
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addFavorite = async (req, res) => {
  const { location } = req.body
  try {
    const user = req.user
    if (user) {
      user.favorites.push(location)
      await user.save()
      res.json(user.favorites)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addLocation = async (req, res) => {
  const { location } = req.body
  try {
    const user = req.user
    if (user) {
      user.currentLocation = location
      await user.save()
      res.json(user.currentLocation)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteFavorite = async (req, res) => {
  const { location } = req.body
  try {
    const user = req.user

    if (user) {
      user.favorites = user.favorites.filter((fav) => {
        return (
          fav.address !== location?.address &&
          !(fav.city === location?.city && fav.state === location?.state) &&
          !(
            fav.latitude === location?.latitude &&
            fav.longitude === location?.longitude
          )
        )
      })
      await user.save()

      res.json(user.favorites)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUser, addFavorite, addLocation, deleteFavorite }
