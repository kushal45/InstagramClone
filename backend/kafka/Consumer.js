const { Kafka, AssignerProtocol } = require("kafkajs");
require("dotenv").config();
const newRelic = require("newrelic");

class KafkaConsumer {
  static consumerInstance = null;
  constructor(clientId) {
    this.kafkaBrokers = this.kafkaBrokers = "kafka1:9092,kafka2:9094,kafka3:9096".split(",");
    this.isConsumerRunning = false;
    this.kafka = new Kafka({
      clientId,
      brokers: this.kafkaBrokers,
    });
  }

  fetchAdminClient() {
    return this.kafka.admin();
  }

  async subscribe({ topics, groupId }) {
    try {
     let consumer=this.consumer = this.kafka.consumer({ groupId,heartbeatInterval: 1000, // should be lower than sessionTimeout
        sessionTimeout: 6000, });
      const parentTransaction = newRelic.getTransaction();
      parentTransaction.end();
      const transactionName = "kafkaConsumerTransactionSubscribe";
      await newRelic.startBackgroundTransaction(transactionName, async function () {
        const transaction = newRelic.getTransaction();
        await handleConsumerSubTransaction(consumer,topics,groupId);
        transaction.end();
      });
      async function handleConsumerSubTransaction(consumer,topics,groupId){
      console.log("inside background transaction subscribe");
      console.log("Subscribing to topics", topics, "with group ID", groupId);
      await consumer.connect();
      await consumer.subscribe({ topics, fromBeginning: true });
      console.log("Subscribing to topic", topics, "with group ID", groupId);
      consumer.on("consumer.crash", (err) => {
        console.error(`Error in consumer: ${err.message}`);
      });
     }
    
      
    } catch (error) {
      console.error(
        "Error subscribing to topics from KafKaConsumer class:",
        error.message
      );
    }
  }

  async processMessage(handler) {
    if (this.isConsumerRunning) {
      // console.warn("Consumer is already running");
      return;
    }

    this.isConsumerRunning = true;
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const transactionName = "kafkaConsumerTransactionProcessMessage";
        try {
          const parentTransaction = newRelic.getTransaction();
          parentTransaction.end();
          newRelic.startBackgroundTransaction(
            transactionName,
            async function () {
              const transaction = newRelic.getTransaction();
              const correlationId = message.headers["correlation-id"]
                ? message.headers["correlation-id"].toString()
                : null;
              console.log(
                `Received message: ${message.offset} with correlation ID: ${correlationId}`
              );
              const eventData = JSON.parse(message.value.toString());
              await handler(eventData, topic);
              transaction.end();
            }
          );
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
        console.log(
          `Message ${message.offset} processed successfully on attempt ${attempt}`
        );
        break; // Break out of the loop if processing succeeds
      } catch (error) {
        console.error(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === retries)
          throw new Error(`Failed after ${retries} retries`);
        // Wait for a specified delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async createTopics(topic) {
    const admin = this.kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes(topic)) {
      const isTopicCreated = await admin.createTopics({
        topics: [
          { topic, numPartitions: 1, replicationFactor: 1 },
          // Add more topics here if needed
        ],
      });
      console.log("isTopic created", topic, isTopicCreated);
    }
    await admin.disconnect();
  }

  async unsubscribe() {
    if (this.consumer) {
      await this.consumer.stop();
      await this.consumer.disconnect();
    } else {
      console.error("No active consumer to unsubscribe");
    }
  }

  async isSubscribedToTopics(groupId, topics) {
    let isTopicsSubscribed = false;
    const admin = this.fetchAdminClient();
    await admin.connect();
    const groupDescription = await admin.describeGroups([groupId]);
    console.log("Group description with members:", groupDescription);
    await admin.disconnect();

    const subscribedTopics = new Set();
    groupDescription.groups.forEach((group) => {
      console.log("each group details", group);
      group.members.forEach((member) => {
        const memberAssignmentBuffer = member.memberAssignment;
        const assignment = AssignerProtocol.MemberAssignment.decode(
          memberAssignmentBuffer
        );
        if (!assignment) {
          return false;
        }
        //console.log("assignment", assignment);
        const topics = Object.keys(assignment.assignment);
        topics.forEach((tp) => {
          subscribedTopics.add(tp);
        });
      });
      isTopicsSubscribed = topics.every((topic) => subscribedTopics.has(topic));
      console.log(
        "fetched subscribed topics in kafka consumer",
        subscribedTopics,
        isTopicsSubscribed
      );
    });
    return isTopicsSubscribed;
  }
}

module.exports = KafkaConsumer;
