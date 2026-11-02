import 'dotenv/config'
import '../models/index.js'
import { sequelize } from '../config/database.js'
import { seedDatabase } from './seed-data.js'

await sequelize.authenticate()
await sequelize.sync()
await seedDatabase()
console.log('Dummy data seeded.')
console.log('SUPERADMIN: admin@hhcosmetics.co.uk / Admin@12345')
console.log('CUSTOMER: customer@example.com / User@12345')
await sequelize.close()
