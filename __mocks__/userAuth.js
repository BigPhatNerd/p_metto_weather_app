module.exports.authUser = jest.fn((req, res, next) => {
  req.user = {
    userId: '123',
    ipAddress: '127.0.0.1',
    favorites: [],
  }
  next()
})
