const { Kafka, Partitioners } = require("kafkajs");
require("dotenv").config();

class KafkaProducer {
  constructor(clientId) {
    this.kafkaBrokers = process.env.KAFKA_BROKERS.split(",");
    this.kafka = new Kafka({
      clientId,
      brokers: ["kafka1:9092"],
    });
  }

  async produce(topic, event,options) {
    const {correlationId} = options;
    const producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
      allowAutoTopicCreation: true,
      idempotent: true,
    });
    console.log("Producing message to topic", topic, "with correlation ID", correlationId);
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) ,partition:0,key:"assetId",timestamp:Date.now(),headers: {
        'correlation-id': correlationId
      }}],
    });
    await producer.disconnect();
  }
}

module.exports = KafkaProducer;
