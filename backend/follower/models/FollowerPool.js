const pool = require("../../database/connectionPool");
class FollowerPool {
  static async insertFollower({ followerId, followingId }) {
    const query = `
        INSERT INTO followers ("followerId", "followingId")
        VALUES ($1, $2)
        RETURNING *;
        `;
    const values = [followerId, followingId];

    try {
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error("Error inserting follower:", error);
      throw error;
    }
  }

  static async fetchFollowersByUserId(userId) {
    const query = `
        SELECT followers.*, users.*
        FROM followers
        JOIN users ON followers."followerId" = users."id"
        WHERE followers."followingId" = $1;
        `;
    const values = [userId];

    try {
      const res = await pool.query(query, values);
      return res.rows;
    } catch (error) {
      console.error("Error fetching followers by user ID:", error);
      throw error;
    }
  }

  static async fetchFollowingListByFollowerId(followerId) {
    const query = `
        SELECT followers.*, users.*
        FROM followers
        JOIN users ON followers."followingId" = users."id"
        WHERE followers."followerId" = $1;
        `;
    const values = [followerId];
    console.log("query", query);
    try {
      const res = await pool.query(query, values);
      return res.rows;
    } catch (error) {
      console.error("Error fetching following list by follower ID:", error);
      throw error;
    }
  }

  static async getTopUsersByFollowers(numList) {
    const query = `
        SELECT u."id", u."username",u."name", f."followerCount"
FROM (
    SELECT "followingId", COUNT("followerId") AS "followerCount"
    FROM followers
    GROUP BY "followingId"
) f
JOIN users u ON f."followingId" = u."id"
ORDER BY f."followerCount" DESC
LIMIT $1;
        `;
    const values = [numList];

    try {
      const res = await pool.query(query, values);
      return res.rows;
    } catch (error) {
      console.error("Error fetching top users by followers:", error);
      throw error;
    }
  }
}

module.exports = FollowerPool;
