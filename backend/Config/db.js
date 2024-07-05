require("dotenv").config();

module.exports = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  PORT: process.env.DB_PORT,
  define: {
    timestamps: true,
    underscored: true
  },
  logging: console.log,
};