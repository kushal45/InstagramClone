const Observer = require('./observer');
const { mongoClient } = require('../mongoClient');
const logger = require('../../logger/logger');

class KafkaMongoObserver extends Observer {
  constructor() {
    super();
    this.db = mongoClient.db('instagram');
  }

  async update(topic, message) {
    const collectionName = topic.split('.').pop();
    const collection = this.db.collection(collectionName);

    await collection.insertOne(message.payload);
    logger.debug(`Inserted data into ${collectionName}:`, message.payload);
  }
}

module.exports = KafkaMongoObserver;