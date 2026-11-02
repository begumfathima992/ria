import 'dotenv/config'
import '../models/index.js'
import { sequelize } from '../config/database.js'

await sequelize.authenticate()
await sequelize.sync()
console.log('Database tables synchronized.')
await sequelize.close()
