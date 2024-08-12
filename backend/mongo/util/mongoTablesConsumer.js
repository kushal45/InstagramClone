const KafkaConsumer = require("../../kafka/Consumer");
const logger = require("../../logger/logger");
const { connectToMongo, mongoClient } = require("../mongoClient");

const subscribedPrefixTopics = new Set();

async function createCollectionsAndConsume() {
  try {
    const kakaConusmer = new KafkaConsumer();
    await connectToMongo();
    const db = mongoClient.db("instagram");

    const connectHost =
      process.env.CONNECT_REST_ADVERTISED_HOST_NAME || "connector";
    const connectorsResponse = await axios.get(
      `http://${connectHost}:8083/connectors`
    );
    const connectors = connectorsResponse.data;
    logger.debug("connectors:", connectors);
    for (const connector of connectors) {
      const connectorConfigResponse = await axios.get(
        `http://${connectHost}:8083/connectors/${connector}/config`
      );
      const connectorConfig = connectorConfigResponse.data;
      logger.debug("connectorConfig:", connectorConfig);
      //const topics = connectorConfig['table.whitelist'].split(',');
      const prefixTopic = connectorConfig["topic.prefix"];
      const topics = await fetchTopicsWithPrefix({
        prefixTopic,
        kakaConusmer,
        subscribedPrefixTopics,
      });

      for (const topic of topics) {
        const collectionName = topic.split(".").pop();
        const collections = await db
          .listCollections({ name: collectionName })
          .toArray();
        if (collections.length > 0) {
          console.log(`Collection "${collectionName}" already exists.`);
        } else {
          // Create the collection
          await db.createCollection(collectionName);
          console.log(`Collection "${collectionName}" created.`);
        }
        logger.debug(`Created collection ${collectionName} in MongoDB`);
      }
    }
  } catch (error) {
    logger.error(
      "Error creating collections and consuming messages:",
      error.message
    );
  }
}

async function fetchTopicsWithPrefix({ prefix, kafkaConusmer }) {
  const admin = kafaConsumer.fetchAdminClient();
  await admin.connect();
  const deltaTopics = [];
  const topics = await admin.listTopics();
  const prefixTopics = topics.filter((topic) => topic.startsWith(prefix));
  for (const topic of prefixTopics) {
    if (!subscribedPrefixTopics.has(topic)) {
      await kafkaConusmer.subscribe({ topic, groupId: "mongo-consumer" });
      processKafkaMessage(kafkaConusmer);
      subscribedPrefixTopics.add(topic);
      logger.debug(`Subscribed to topic ${topic}`);
    } else {
      deltaTopics.push(topic);
    }
  }

  await admin.disconnect();
  return deltaTopics;
}

async function processKafkaMessage(kafkaConusmer){
    await kafkaConusmer.processMessage(async (data, topic) => {
        const collectionName = topic.split(".").pop();
        const collection = db.collection(collectionName);

        await collection.insertOne(data.payload);
        logger.debug(`Inserted data into ${collectionName}:`, data.payload);
      });
}

module.exports = createCollectionsAndConsume;
