const pool = require("../../database/connectionPool");
class UserPool {
  static async create(userData) {
    const keys = Object.keys(userData);
    const values = Object.values(userData);

    // Construct the query dynamically
    const columns = keys.join(", ");
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
    const query = `INSERT INTO users (${columns},"createdAt", "updatedAt") VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`;

    try {
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error executing query", err.stack);
      throw err;
    }
  }

  static async findByPk(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];

    try {
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error executing query", err.stack);
      throw err;
    }
  }

  static async findAll(options) {
    // Default to selecting all columns
    const selectColumns =
      options && options.attributes ? options.attributes.join(", ") : "*";
    let query = `SELECT ${selectColumns} FROM users`;
    const values = [];
    const whereClauses = [];

    if (options && options.where) {
      Object.keys(options.where).forEach((key, index) => {
        const value = options.where[key];
        if (Array.isArray(value)) {
          whereClauses.push(
            `${key} IN (${value
              .map((_, i) => `$${values.length + i + 1}`)
              .join(", ")})`
          );
          values.push(...value);
        } else {
          whereClauses.push(`${key} = $${values.length + 1}`);
          values.push(value);
        }
      });
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    try {
      const res = await pool.query(query, values);
      return res.rows;
    } catch (err) {
      console.error("Error executing query", err.stack);
      throw err;
    }
  }
}

module.exports = UserPool;
