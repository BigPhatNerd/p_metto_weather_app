const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const {
  getUser,
  addFavorite,
  addLocation,
  deleteFavorite,
} = require('../controllers/userController')
const { authUser } = require('../middleware/userAuth')
const User = require('../models/userModel')

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

const authUserMiddleware = require('../middleware/userAuth').authUser
app.get('/api/user', authUserMiddleware, getUser)
app.post('/api/user/favorites', authUserMiddleware, addFavorite)
app.put('/api/user/location', authUserMiddleware, addLocation)
app.delete('/api/user/favorites', authUserMiddleware, deleteFavorite)
app.get('/api/user/test', (req, res) => {
  res.send('User route working')
})
jest.mock('../middleware/userAuth')

describe('User Controller', () => {
  let user

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    user = await User.create({
      userId: '123',
      ipAddress: '127.0.0.1',
      favorites: [],
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('GET api/user/test - testRoute', async () => {
    const response = await request(app).get('/api/user/test')
    expect(response.status).toBe(200)
    expect(response.text).toBe('User route working')
  })

  test('GET api/user - getUser', async () => {
    authUser.mockImplementation((req, res, next) => {
      req.user = user
      next()
    })

    const response = await request(app).get('/api/user')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      userId: '123',
      ipAddress: '127.0.0.1',
      favorites: [],
    })
  })

  test('POST api/user/favorites - addFavorite', async () => {
    const newFavorite = {
      address: '123 Main St',
      city: 'Test City',
      state: 'TS',
    }

    authUser.mockImplementation((req, res, next) => {
      req.user = user
      next()
    })

    const response = await request(app)
      .post('/api/user/favorites')
      .send({ location: newFavorite })

    expect(response.status).toBe(200)
    const updatedUser = await User.findById(user._id)

    expect(updatedUser.favorites[0].address).toBe('123 Main St')
    expect(updatedUser.favorites[0].city).toBe('Test City')
    expect(updatedUser.favorites[0].state).toBe('TS')
  })

  test('PUT api/user/location - addLocation', async () => {
    const newLocation = { address: '456 Elm St', city: 'New City', state: 'NC' }

    authUser.mockImplementation((req, res, next) => {
      req.user = user
      next()
    })

    const response = await request(app)
      .put('/api/user/location')
      .send({ location: newLocation })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(newLocation)
    const updatedUser = await User.findById(user._id)
    expect(updatedUser.currentLocation).toEqual(newLocation)
  }, 10000) // Increased timeout to 10 seconds

  test('DELETE api/user/favorites - deleteFavorite', async () => {
    user.favorites.push({
      address: '123 Main St',
      city: 'Test City',
      state: 'TS',
    })
    await user.save()

    const favoriteToDelete = {
      address: '123 Main St',
      city: 'Test City',
      state: 'TS',
    }

    authUser.mockImplementation((req, res, next) => {
      req.user = user
      next()
    })

    const response = await request(app)
      .delete('/api/user/favorites')
      .send({ location: favoriteToDelete })

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
    const updatedUser = await User.findById(user._id)
    expect(updatedUser.favorites).toEqual([])
  })
})
