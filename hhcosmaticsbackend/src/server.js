import 'dotenv/config'
import app from './app.js'
import { sequelize } from './config/database.js'

const port = Number(process.env.PORT || 4000)

async function start() {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in .env')
  }
  await sequelize.authenticate()
  console.log('MySQL connection established')
  app.listen(port, () => console.log(`H&H API running on http://localhost:${port}${process.env.API_PREFIX || '/api/v1'}`))
}

start().catch((error) => {
  console.error('Failed to start API:', error)
  process.exit(1)
})
