const { UserDAO, AssetDAO, PostDAO } = require("../../dao");
const { NotFoundError } = require("../../errors");
const KafkaProducer = require("../../kafka/Producer");
const httpContext = require("express-http-context");
const PostPool = require("../models/PostPool");

class PostService {
  static async createPost(postData, userId) {
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
      await kafkaProducerInst.produce(topic, asset, { correlationId });
    }
    const post = await PostDAO.create({
      userId: user.id,
      assetId,
    });

    return post;
  }

  static async getPostById(postId) {
    // Logic to fetch a post by ID
    const post = await PostDAO.getById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  }

  static async listPostsByAttr(attr) {
    let posts = [];
    if (attr.hasOwnProperty("tags")) {
      const assetIds = await AssetDAO.findAssetIdsByTag(attr.tags);
      //posts = await PostDAO.listByAssets(assetIds);
      posts = await PostPool.listPostsByAttributeList([
        {
          assetId: assetIds,
        },
      ]);
    } else {
      posts = [...posts, ...(await PostDAO.listByAttr(attr))];
    }

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

  static async listPosts(userId, { page = 1, pageSize = 10 } = {}) {
    const user = await UserDAO.findUserById(userId);
    if (!user) throw new NotFoundError("User not found");
    const skip = (page - 1) * pageSize;
    const posts = await PostDAO.listByUsers([user.id], {
      offset: skip,
      limit: pageSize,
    });
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
