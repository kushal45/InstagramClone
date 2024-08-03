const pool = require("../../database/connectionPool");
class AssetPool {
  static async insertAsset({
    text,
    imageUrl = null,
    videoUrl = null,
    tags = [],
  }) {
    const query = `
          INSERT INTO assets ("text", "imageUrl", "videoUrl", "tags", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4,NOW(), NOW())
          RETURNING *;
        `;
    const values = [text, imageUrl, videoUrl, tags];

    try {
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error("Error inserting asset:", error);
      throw error;
    }
  }

  static async findAssetById(id) {
    const query = "SELECT * FROM assets WHERE id = $1";
    const values = [id];

    try {
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error("Error finding asset:", error);
      throw error;
    }
  }

  static async findAll({ where }) {
    const conditions = [];
    const values = [];
    let index = 1;

    for (const [key, condition] of Object.entries(where)) {
      if (condition.contains && condition.equal) {
        throw new Error(
          `Both "contains" and "equal" cannot be provided for ${key}`
        );
      }

      if (condition.contains) {
        const pgArrayLiteral = condition.contains
          .map((tag) => `'${tag}'::enum_assets_tags`)
          .join(",");
        conditions.push(`"${key}" && ARRAY[${pgArrayLiteral}]`);
        index++;
      }

      if (condition.equal) {
        conditions.push(`"${key}" = $${index}`);
        values.push(condition.equal);
        index++;
      }
    }

    const query = `
      SELECT * FROM assets
      WHERE ${conditions.join(" AND ")}
    `;
    console.log("query", query);
    try {
      const res = await pool.query(query, values);
      return res.rows;
    } catch (error) {
      console.error("Error finding assets:", error);
      throw error;
    }
  }
}

module.exports = AssetPool;
