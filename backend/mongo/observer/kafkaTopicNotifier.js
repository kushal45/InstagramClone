// kafkaTopicNotifier.js
const Subject = require('./subject');
const KafkaConsumer = require('../../kafka/Consumer');
const logger = require('../../logger/logger');

class KafkaTopicNotifier extends Subject {
  constructor() {
    super();
    this.kafkaConsumer = new KafkaConsumer();
    this.subscribedPrefixTopics = new Set();
  }

  async fetchTopicsWithPrefix(prefix) {
    const admin = this.kafkaConsumer.fetchAdminClient();
    await admin.connect();
    const topics = await admin.listTopics();
    const prefixTopics = topics.filter(topic => topic.startsWith(prefix));
    await admin.disconnect();
    return prefixTopics;
  }

  async subscribeToTopics(prefix) {
    const topics = await this.fetchTopicsWithPrefix(prefix);
    for (const topic of topics) {
      if (!this.subscribedPrefixTopics.has(topic)) {
        await this.kafkaConsumer.subscribe({ topic, groupId: 'mongo-consumer' });
        this.kafkaConsumer.processMessage((message) => {
          this.notifyObservers(topic, message);
        });
        this.subscribedPrefixTopics.add(topic);
        logger.debug(`Subscribed to topic ${topic}`);
      }
    }
  }
}

module.exports = KafkaTopicNotifier;