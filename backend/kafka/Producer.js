const { Kafka } = require("kafkajs");
require("dotenv").config();

async function initiateProducer() {
    const kafkaBrokers = process.env.KAFKA_BROKERS.split(",");
    console.log(kafkaBrokers);
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: kafkaBrokers
    });
  
    const producer = kafka.producer();
    await producer.connect();
    return producer;
  }
  
  // Function to emit an event when an asset is created
  async function emitEvent(topic,event) {
    const producer = await initiateProducer();
  
    try {
      const messages = [{
        value: JSON.stringify(event),
      }];
  
      await producer.send({
        topic,
        messages,
      });
  
      console.log('event emitted:', event);
    } catch (error) {
      console.error('Error emitting event:', error);
    } finally {
      await producer.disconnect();
    }
  }

  module.exports= emitEvent;