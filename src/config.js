module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://josh_young:R4chelJ0sh11@localhost/v-able',
  JWT_SECRET: process.env.JWT_SECRET || 'testing-secret',
}
