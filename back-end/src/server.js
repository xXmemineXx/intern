require('dotenv').config()

const users = require('./controllers/user_controller')

const cors = require('cors')
const express = require('express')

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || '')
						.split(',')
						.map(o => o.trim())
						.filter(Boolean)

app.use(express.json())
app.use(cors({origin : allowedOrigins }))

app.use('/api/permit', require('./routes/permit_routes'))
app.use('/api/review', require('./routes/review_routes'))
app.use('/api/users', require('./routes/users_routes'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));