import 'dotenv/config'
import '../models/index.js'
import { sequelize } from '../config/database.js'
import { seedDatabase } from './seed-data.js'

if (process.env.NODE_ENV === 'production') throw new Error('db:reset is disabled in production')
await sequelize.authenticate()
await sequelize.sync({ force: true })
await seedDatabase()
console.log('Database reset and dummy data seeded.')
console.log('SUPERADMIN: admin@hhcosmetics.co.uk / Admin@12345')
console.log('CUSTOMER: customer@example.com / User@12345')
await sequelize.close()
