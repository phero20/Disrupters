import express from 'express'
import connectDB from './configs/mongoDB.js'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()
const port = 3000

// Allow all origins with cors()
app.use(cors())

connectDB()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

import feedbackRouter from './routes/feedbackRoutes.js'

app.use('/api/auth', authRouter)
app.use('/api/feedback', feedbackRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})