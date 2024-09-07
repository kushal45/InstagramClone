const crypto = require("crypto");
const { UserDAO, AssetDAO, PostDAO } = require("../../dao");
const { NotFoundError } = require("../../errors");
const KafkaProducer = require("../../kafka/Producer");
const httpContext = require("express-http-context");
const PostPool = require("../models/PostPool");
const logger = require("../../logger/logger");
const { ErrorWithContext, ErrorContext } = require("../../errors/ErrorContext");
const { deducePostWithTags } = require("./InternalPostCursorService");

class PostService {
  static async createPost(postData, userId) {
    const logLocation = PostService.getLogLocation("createPost");
    try {
      const user = await UserDAO.findUserById(userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      let assetId = postData.assetId;
      let transaction = null;
      if (assetId == null) {
        const { transaction: postTransaction, asset } = await AssetDAO.create(
          postData
        );
        assetId = asset.id;
        transaction = postTransaction;
        // Publish the event to Kafka
        const topic = "assetCreated";
        //await emitEvent(topic,asset);
        const kafkaProducerInst = new KafkaProducer("producer-1");
        const correlationId = httpContext.get("correlationId");
        // await kafkaProducerInst.produce(topic, asset, { correlationId });
        await this.retryProduce(kafkaProducerInst, topic, asset, {
          correlationId,
        });
      }
      const post = await PostDAO.create({
        userId: user.id,
        assetId,
        transaction,
      });

      return post;
    } catch (error) {
      const dlqTopic = "dlQAssetCreated";
      const kafkaProducerInst = new KafkaProducer("dlQProducer1");
      const correlationId = httpContext.get("correlationId");
      await kafkaProducerInst.produce(
        dlqTopic,
        { message: error.message },
        { correlationId }
      );
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          postData,
          userId,
        }),
        __filename
      );
    }
  }

  static getLogLocation(methodName) {
    return `${this.name}.${methodName} - ${__filename}`;
  }

  static async retryProduce(
    producer,
    topic,
    message,
    options,
    retries = 10,
    delay = 1000
  ) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await producer.produce(topic, message, options);
        return;
      } catch (error) {
        if (attempt === retries) {
          logger.error(
            `Failed to produce message after ${retries} attempts: ${error.message}`
          );
          throw error;
        }
        logger.warn(
          `Retrying produce message (attempt ${attempt}): ${error.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  static async getPostById(postId) {
    const logLocation = this.getLogLocation("getPostById");
    try {
      const post = await PostDAO.getById(postId);
      if (!post) {
        throw new NotFoundError("Post not found");
      }
      return post;
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          postId,
        }),
        __filename
      );
    }
  }

  /**
   *
   * @param {*} attr  attributes with which to list the posts
   * @param {*} redisClient redisClient object
   * @param {*} {cursor,pageSize}
   * @returns list of posts matching the attributes passed in the query
   */
  static async listPostsByAttr(
    attr,
    redisClient,
    { cursor="", pageSize=10, sortOrder="ASC" }
  ) {
    const logLocation = this.getLogLocation("listPostsByAttr");
    try {
      const attrHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(attr))
        .digest("hex");
      const cacheKey = `posts:${attrHash}:${cursor}:${pageSize}`;

      // Check if the data is in the cache
      if (redisClient) {
        const cachedPosts = await redisClient.get(cacheKey, (err, data) => {
          if (err) return reject(err);
          if (data) return resolve(JSON.parse(data));
          resolve(null);
        });

        if (cachedPosts) {
          return cachedPosts;
        }
      }
      let postResult = {};
      const options = {
        cursor,
        limit: pageSize,
        sortOrder,
      };
      postResult= deducePostWithTags(attr.tags, options);
      
      //console.log("posts with tags", posts);
      // redisClient.set(cacheKey, JSON.stringify(posts), "EX", 3600);
      return postResult;
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          attr,
          cursor,
          pageSize,
        }),
        __filename
      );
    }
  }

  /**
   *
   * @param {number} postId - The ID of the post to update.
   * @param {object} updateData - post data to update ex:- tags,text,imageUrl, videoUrl.
   * @returns {Promise<object>} The updated post.
   * @throws {NotFoundError} If the post is not found.
   */
  static async updatePost(postId, updateData) {
    const post = await PostDAO.update(postId, updateData);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  }

  /**
   * Deletes a post and its associated asset.
   * @param {number} postId - The ID of the post to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundError} If the post or associated asset is not found.
   */
  static async deletePost(postId) {
    const logLocation = this.getLogLocation("deletePost");
    try {
      const post = await PostDAO.getById(postId);
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      // Assuming the post model has a reference to the assetId
      const assetId = post.assetId;

      // Step 2: Delete the associated asset
      const deletedAsset = await AssetDAO.delete(assetId);
      if (!deletedAsset) {
        throw new NotFoundError("Asset not found or already deleted");
      }

      // Step 3: Delete the post
      const postDeletionResult = await PostDAO.delete(postId);
      if (!postDeletionResult) {
        throw new NotFoundError("Post not found or already deleted");
      }
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          postId,
        }),
        __filename
      );
    }
  }

  /**
   * Lists posts for a given user with cursor-based pagination and caching.
   * @param {number} userId - The ID of the user.
   * @param {object} redisClient - The Redis client instance.
   * @param {object} options - Pagination options.
   * @param {string} [options.cursor=''] - The opaque cursor for pagination.
   * @param {number} [options.pageSize=10] - The number of posts per page.
   * @returns {Promise<object>} The paginated posts and the next cursor.
   * @throws {NotFoundError} If the user is not found.
   */
  static async listPosts(
    userId,
    redisClient,
    { cursor = "", pageSize = 10 } = {}
  ) {
    const logLocation = "PostService.lisPosts";
    try {
      const user = await UserDAO.findUserById(userId);
      if (!user) throw new NotFoundError("User not found");
      const cacheKey = `posts:${userId}:${cursor}:${pageSize}`;

      const cachedPosts = await redisClient.get(cacheKey, (err, data) => {
        if (err) return reject(err);
        if (data) return resolve(JSON.parse(data));
        resolve(null);
      });

      logger.debug("cachedPosts", cachedPosts);
      if (cachedPosts) {
        return cachedPosts;
      }

      const paginatedPosts = await PostDAO.listByUsers([user.id], {
        cursor,
        pageSize,
      });
      logger.debug("paginatedPosts", paginatedPosts);
      redisClient.set(cacheKey, JSON.stringify(paginatedPosts), "EX", 10);
      return paginatedPosts;
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          userId,
          cursor,
          pageSize,
        }),
        __filename
      );
    }
  }

  /**
   * Lists posts for multiple users with cursor-based pagination.
   * @param {number[]} userIds - The IDs of the users.
   * @param {object} options - Pagination options.
   * @param {string} [options.cursor] - The cursor for pagination.
   * @param {number} [options.pageSize] - The number of posts per page.
   * @returns {Promise<object>} The paginated posts and the next cursor.
   * @throws {NotFoundError} If the users are not found.
   */
  static async listPostsByUserIds(
    userIds,
    { cursor="", pageSize=10 }
  ) {
    const logLocation = this.getLogLocation("listPostsByUserIds");
    try {
      const userList = await UserDAO.findUserList(userIds);
      if (!userList) {
        throw new NotFoundError("Users not found");
      }
      const filteredUserIds = userList.map((user) => user.id);
      const paginatedPosts = await PostDAO.listByUsers(filteredUserIds, {
        cursor,
        pageSize,
      });
      //logger.debug("paginatedPosts", paginatedPosts);
      return paginatedPosts;
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          userIds,
          cursor,
          pageSize,
        }),
        __filename
      );
    }
  }
}

module.exports = PostService;
