module.exports = {
  user: process.env.POSTGRES_USERNAME || "nishideyasuhito",
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  database: process.env.POSTGRES_DATABASE || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  port: process.env.POSTGRES_PORT || 5432,
};