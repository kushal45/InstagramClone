require("dotenv").config();

module.exports = {
  dialect: "postgres",
  host: process.env.DB_PGBOUNCER_HOST || process.env.DB_HOST, // Use PgBouncer host if specified
  port: process.env.PG_BOUNCER_PORT || process.env.DB_PORT, // Use PgBouncer port if specified
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  PORT: process.env.DB_PORT,
  define: {
    timestamps: true,
    underscored: true
  },
  logging: console.log,
  pool: {
    max: 5, // maximum number of connections in pool
    min: 0, // minimum number of connections in pool
    acquire: 3000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
  }
};
