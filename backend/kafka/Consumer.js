const { Kafka } = require("kafkajs");
require("dotenv").config();

class KafkaConsumer {
  constructor(clientId) {
    this.kafkaBrokers = process.env.KAFKA_BROKERS.split(",");
    this.kafka = new Kafka({
      clientId,
      brokers: ["kafka1:9092"],
    });
  }

  async subscribe(topic, groupId) {
    console.log("Subscribing to topic", topic, "with group ID", groupId);
    this.consumer = this.kafka.consumer({ groupId });
    await this.consumer.connect();
    this.consumer.on('consumer.crash', (err) => {
      console.error(`Error in consumer: ${err.message}`);
    });
    await this.consumer.subscribe({ topic, fromBeginning: true });
    console.log(`Successfully subscribed to ${topic}`);
  }

  async run(handler) {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // Attempt to process the message
          const eventData = JSON.parse(message.value.toString());
          await handler(eventData);
        } catch (error) {
          console.error(`Error processing message: ${error.message}`);
          // Implement retry logic here
          await this.retryMessageProcessing(handler, message);
        }
      },
    });
  }

  async retryMessageProcessing(handler, message, retries = 5, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Retry attempt ${attempt} for message ${message.offset}`);
        const eventData = JSON.parse(message.value.toString());
        await handler(eventData);
        console.log(`Message ${message.offset} processed successfully on attempt ${attempt}`);
        break; // Break out of the loop if processing succeeds
      } catch (error) {
        console.error(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === retries) throw new Error(`Failed after ${retries} retries`);
        // Wait for a specified delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  async createTopics(topic) {
    const admin = this.kafka.admin();
    await admin.connect();
    const topics= await admin.listTopics();
    if(! topics.includes(topic)){
      const isTopicCreated=await admin.createTopics({
        topics: [
          { topic, numPartitions: 1, replicationFactor: 1 },
          // Add more topics here if needed
        ],
      });
      console.log("isTopic created",topic,isTopicCreated);
     
    }
    await admin.disconnect();
  }

}





module.exports = KafkaConsumer;
