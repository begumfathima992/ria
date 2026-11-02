import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'hh_cosmetics',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: String(process.env.DB_LOGGING || 'false') === 'true' ? console.log : false,
    define: {
      underscored: true,
      freezeTableName: false,
      timestamps: true
    },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  }
)
