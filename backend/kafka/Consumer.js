const { Kafka } = require("kafkajs");
require("dotenv").config();

function consumeEvent(topic, groupId,handler) {
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(",");
  console.log(kafkaBrokers);
  const kafka = new Kafka({
    clientId: "assetSubSriber",
    brokers: kafkaBrokers,
  });

  const consumer = kafka.consumer({ groupId });

  const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const eventData = JSON.parse(message.value.toString());
        await handler(eventData);
      },
    });
  };

  run().catch(console.error);
}

module.exports = consumeEvent;
