// mongoTablesConsumer.js
const axios = require('axios');
const KafkaTopicNotifier = require('../observer/kafkaTopicNotifier');
const KafkaMongoObserver = require('../observer/debeziumMongoObserver');
const { connectToMongo } = require('../mongoClient');
const logger = require('../../logger/logger');

async function createCollectionsAndConsume() {
  try {
    await connectToMongo();
    const kafkaTopicNotifier = new KafkaTopicNotifier();
    const kafkaMongoObserver = new KafkaMongoObserver();

    kafkaTopicNotifier.addObserver(kafkaMongoObserver);

    const connectHost = process.env.CONNECT_REST_ADVERTISED_HOST_NAME || 'connector';
    const connectorsResponse = await axios.get(`http://${connectHost}:8083/connectors`);
    const connectors = connectorsResponse.data;
    logger.debug('connectors:', connectors);

    for (const connector of connectors) {
      const connectorConfigResponse = await axios.get(`http://${connectHost}:8083/connectors/${connector}/config`);
      const connectorConfig = connectorConfigResponse.data;
      logger.debug('connectorConfig:', connectorConfig);

      const prefixTopic = connectorConfig['topic.prefix'];
      await kafkaTopicNotifier.subscribeToTopics(prefixTopic);
    }
  } catch (error) {
    logger.error('Error creating collections and consuming messages:', error.message);
  }
}

module.exports = createCollectionsAndConsume;