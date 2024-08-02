const pool = require("../database/connectionPool");
class AssetPool {
  static async insertAsset({
    text,
    imageUrl = null,
    videoUrl = null,
    tags = [],
  }) {
    const query = `
          INSERT INTO assets (text, imageUrl, videoUrl, tags)
          VALUES ($1, $2, $3, $4)
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
}
