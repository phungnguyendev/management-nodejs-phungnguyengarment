import express from 'express'
import routes from '~/routes/index'
import errorHandler from './api/middleware/errorHandler'
import sequelize from './api/models'

const app = express()
// Accept json body request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// (helmet) helps secure Express apps by setting HTTP response headers.
// app.use(morgan('dev'))
// app.use(helmet())
// app.use(compression())
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
// (morgan) HTTP request logger middleware for node.js
// (cors) Provide some options Headers for accept others localhost to allow request
// Handle custom formatter response express (middleware)
// app.use(responseEnhancer())
app.use('/api', routes)

app.use(errorHandler)

// Sync database
sequelize.sync()

export default app
