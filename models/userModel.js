const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ipAddress: { type: String, required: true },
  favorites: [
    {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
      city: { type: String },
      state: { type: String },
    },
  ],
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String },
    city: { type: String },
    state: { type: String },
  },
})

module.exports = mongoose.model('User', userSchema)
