const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const weatherRoutes = require('./routes/weatherRoutes')

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use('/api/user', userRoutes)
app.use('/api/weather', weatherRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'app', 'client', 'dist', 'index.html'))
  })
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
