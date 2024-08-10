import compression from 'compression'
import cors, { CorsOptions } from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import routes from '~/routes/index'
import { responseEnhancer } from './api/middleware/express-formatter'
import sequelize from './api/models'
import errorHandler from './api/middleware/errorHandler'

const app = express()

const corsOptions: CorsOptions = {
  origin: [
    'https://management.phungnguyengarment.vn',
    'http://management.phungnguyengarment.vn',
    'http://27.71.26.53:8000',
    'http://localhost:8000'
  ]
}
// Accept json body request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// (helmet) helps secure Express apps by setting HTTP response headers.
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
// (morgan) HTTP request logger middleware for node.js
// (cors) Provide some options Headers for accept others localhost to allow request
app.use(cors(corsOptions))
// Handle custom formatter response express (middleware)
app.use(responseEnhancer())
app.use('/api', routes)
app.use(errorHandler)

// Sync database
sequelize.sync()

export default app
