const crypto = require("crypto");
const { UserDAO, AssetDAO, PostDAO } = require("../../dao");
const { NotFoundError } = require("../../errors");
const KafkaProducer = require("../../kafka/Producer");
const httpContext = require("express-http-context");
const PostPool = require("../models/PostPool");
const logger = require("../../logger/logger");

class PostService {
  static async createPost(postData, userId) {
    try {
      const user = await UserDAO.findUserById(userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      let assetId = postData.assetId;
      if (assetId == null) {
        const asset = await AssetDAO.create(postData);
        assetId = asset.id;
        // Publish the event to Kafka
        const topic = "assetCreated";
        //await emitEvent(topic,asset);
        const kafkaProducerInst = new KafkaProducer("producer-1");
        const correlationId = httpContext.get("correlationId");
       // await kafkaProducerInst.produce(topic, asset, { correlationId });
       await this.retryProduce(kafkaProducerInst, topic, asset, { correlationId });
      }
      const post = await PostDAO.create({
        userId: user.id,
        assetId,
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
      throw error;
    }
  }

  static async retryProduce(producer, topic, message, options, retries = 10, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await producer.produce(topic, message, options);
        return;
      } catch (error) {
        if (attempt === retries) {
          logger.error(`Failed to produce message after ${retries} attempts: ${error.message}`);
          throw error;
        }
        logger.warn(`Retrying produce message (attempt ${attempt}): ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  static async getPostById(postId) {
    // Logic to fetch a post by ID
    const post = await PostDAO.getById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  }

  static async listPostsByAttr(attr, redisClient) {
    const attrHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(attr))
      .digest("hex");
    const cacheKey = `posts:${attrHash}`;

    // Check if the data is in the cache
    const cachedPosts = await redisClient.get(cacheKey, (err, data) => {
      if (err) return reject(err);
      if (data) return resolve(JSON.parse(data));
      resolve(null);
    });

    if (cachedPosts) {
      return cachedPosts;
    }
    let posts = [];
    if (attr.hasOwnProperty("tags")) {
      const assetIds = await AssetDAO.findAssetIdsByTag(attr.tags || []);
      //posts = await PostDAO.listByAssets(assetIds);
      posts = await PostPool.listPostsByAttributeList([
        {
          assetId: assetIds,
        },
      ]);
    } else {
      posts = [...posts, ...(await PostDAO.listByAttr(attr))];
    }
    redisClient.set(cacheKey, JSON.stringify(posts), "EX", 3600);
    return posts;
  }

  static async updatePost(postId, updateData) {
    // Logic to update a post
    const post = await PostDAO.update(postId, updateData);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  }

  static async deletePost(postId) {
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
  }

  static async listPosts(
    userId,
    redisClient,
    { page = 1, pageSize = 10 } = {}
  ) {
    const user = await UserDAO.findUserById(userId);
    if (!user) throw new NotFoundError("User not found");
    const skip = (page - 1) * pageSize;
    const cacheKey = `posts:${userId}:${page}:${pageSize}`;

    const cachedPosts = await redisClient.get(cacheKey, (err, data) => {
      if (err) return reject(err);
      if (data) return resolve(JSON.parse(data));
      resolve(null);
    });

    logger.debug("cachedPosts", cachedPosts);
    // if (cachedPosts) {
    //   return cachedPosts;
    // }

    const posts = await PostDAO.listByUsers([user.id], {
      offset: skip,
      limit: pageSize,
    });
    redisClient.set(cacheKey, JSON.stringify(posts), "EX", 10);
    return posts;
  }

  static async listPostsByUserIds(userIds) {
    const userList = await UserDAO.findUserList(userIds);
    if (!userList) {
      throw new NotFoundError("Users not found");
    }
    const filteredUserIds = userList.map((user) => user.id);
    //console.log("filteredUserIds",filteredUserIds);
    const posts = await PostDAO.listByUsers(filteredUserIds);
    return posts;
  }
}

module.exports = PostService;
