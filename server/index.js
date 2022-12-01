import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

// Routes
import AuthRoutes from './Routes/AuthRoutes.js'
import UserRoutes from './Routes/UserRoutes.js'
import PostRoutes from './Routes/PostRoutes.js'

const app = express()
const PORT = 4000 || process.env.PORT

// MidlleWares
app.use(bodyParser.json({limit: '30mb',extended: true}))

app.use(bodyParser.urlencoded({limit: '30mb',extended: true}))

app.use(cors())

dotenv.config()

// ---------------------------
mongoose.connect(process.env.MONGO_DB,
  { useNewUrlParser: true, useUnifiedTopology: true
  }).then(() => {
  console.log('Database is connected!')}).catch((err) => {
  console.log(err)
})

// Usage of routes
app.use('/auth', AuthRoutes)
app.use('/user', UserRoutes)
app.use('/post', PostRoutes)

app.listen(PORT, () => {
  console.log('server is running :')
})
