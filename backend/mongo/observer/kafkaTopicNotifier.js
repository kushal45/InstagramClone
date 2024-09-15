// kafkaTopicNotifier.js
const Subject = require("./subject");
const KafkaConsumer = require("../../kafka/Consumer");
const logger = require("../../logger/logger");

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
    const prefixTopics = topics.filter((topic) => topic.startsWith(prefix));
    logger.debug(`Topics with prefix ${prefix}:`, prefixTopics);
    await admin.disconnect();
    return prefixTopics;
  }

  async subscribeToTopics(prefix) {
    try {
      const topics = await this.fetchTopicsWithPrefix(prefix);
      const deltaTopics = [];
      for (const topic of topics) {
        if (!this.subscribedPrefixTopics.has(topic)) {
          this.subscribedPrefixTopics.add(topic);
          deltaTopics.push(topic);
         // logger.debug(`Subscribed to topic ${topic}`);
        }
      }
      //logger.debug("subscribe topics", this.subscribedPrefixTopics);
      const groupId=process.env.GROUP_ID || "mongo-consumer";
      const isTopicSubscribed = await this.kafkaConsumer.isSubscribedToTopics(groupId,deltaTopics)
      console.log("isTopicSubscribed",isTopicSubscribed);
      if (deltaTopics.length > 0 && !isTopicSubscribed) {
        logger.debug("going for kafkaConsumer subscribe call");
        await this.kafkaConsumer.subscribe({
          topics: deltaTopics,
          groupId: "mongo-consumer",
        });
        this.kafkaConsumer.processMessage((message, topic) => {
          logger.debug(`Received message from topic ${topic}:`, message);
          this.notifyObservers(topic, message);
        });
      }
    } catch (error) {
      logger.error("Error subscribing to topics:", error.message);
    }
  }

  async unsubscribeFromTopics() {
    try {
      const isTopicSubscribed = await this.kafkaConsumer.isSubscribedToTopics(
        "mongo-consumer",
        Array.from(this.subscribedPrefixTopics)
      );
      if(!isTopicSubscribed){
        logger.info("Not subscribed to topics");
        return;
      } 
      //await this.kafkaConsumer.unsubscribe();
     // this.subscribedPrefixTopics.clear();
      logger.debug("Unsubscribed from topics");
    } catch (error) {
      logger.error("Error unsubscribing from topics:", error.message);
    }
  }
}

module.exports = KafkaTopicNotifier;
