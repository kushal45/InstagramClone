// kafkaProducer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'] // Adjust the broker address according to your setup
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const sendEvent = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(message) },
    ],
  });
};

module.exports = { connectProducer, sendEvent };