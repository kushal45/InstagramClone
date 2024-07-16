// consumerModule.js
const { Kafka } = require('kafkajs');

class KafkaConsumer {
  constructor({ clientId, brokers, groupId }) {
    this.kafka = new Kafka({ clientId, brokers });
    this.consumer = this.kafka.consumer({ groupId });
  }

  async connect() {
    await this.consumer.connect();
    console.log('Consumer connected');
  }

  async subscribe(topic, fromBeginning = true) {
    console.log(`Subscribing to ${topic}`);
    await this.consumer.subscribe({ topic, fromBeginning });
    console.log(`Subscribed to ${topic}`);
  }

  async run(handler) {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await handler({ topic, partition, message });
      },
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
    console.log('Consumer disconnected');
  }
}

// Expose a function to create a new consumer instance
module.exports.createConsumer = ({ clientId, brokers, groupId }) => {
  const consumer = new KafkaConsumer({ clientId, brokers, groupId });
  return {
    connect: () => consumer.connect(),
    subscribe: (topic, fromBeginning) => consumer.subscribe(topic, fromBeginning),
    run: (handler) => consumer.run(handler),
    disconnect: () => consumer.disconnect(),
  };
};