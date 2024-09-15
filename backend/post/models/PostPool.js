const pool = require("../../database/connectionPool");
const logger = require("../../logger/logger");
 class PostPool {
    
    static async insertPost({ assetId, postId }) {
        const query = `
          INSERT INTO posts (assetId, postId)
          VALUES ($1, $2)
          RETURNING *;
        `;
        const values = [assetId, postId];
    
        try {
          const res = await pool.query(query, values);
          return res.rows[0];
        } catch (error) {
          logger.error("Error inserting post:", error);
          throw error;
        }
      }

      static async fetchPostById(postId) {
        const query = `
          SELECT posts.*, assets.*
          FROM posts
          JOIN assets ON posts.assetId = assets.id
          WHERE posts.postId = $1;
        `;
        const values = [postId];
    
        try {
          const res = await pool.query(query, values);
          return res.rows;
        } catch (error) {
          logger.error("Error fetching post by ID:", error);
          throw error;
        }
      }


    static async listPostsByAttributeList(options, additionalConditions = '', additionalValues = []) {
        if (!Array.isArray(options) || options.length === 0) {
          throw new Error("options must be a non-empty array");
        }
      
        const conditions = [];
        const values = [];
        let index = 1;
      
        for (const option of options) {
          if (typeof option !== 'object' || option === null) {
            throw new Error("Each item in options must be a non-null object");
          }
          for (const [key, value] of Object.entries(option)) {
            conditions.push(`p."${key}" = ANY($${index}::int[])`);
            values.push(value);
            index++;
          }
        }
      
        const query = `
          SELECT p."assetId",p."userId", a."text",a."imageUrl",a."videoUrl",
          FROM posts as p
          JOIN assets as a ON p."assetId" = a."id"
          WHERE ${conditions.join(' AND ')}
          ${additionalConditions};
        `;
        values.push(...additionalValues);
      
        try {
          const res = await pool.query(query, values);
          return res.rows;
        } catch (error) {
          logger.error("Error fetching posts by attributes:", error);
          throw error;
        }
      }
 }

 module.exports = PostPool;