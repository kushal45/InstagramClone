const { Kafka, Partitioners } = require("kafkajs");
const { ErrorWithContext, ErrorContext } = require("../errors/ErrorContext");
require("dotenv").config();

class KafkaProducer {
  // Static property to hold the single instance
  static producerInstance = null;
  CLIENT_ID = "kafka-producer";
  constructor(clientId) {
    this.kafkaBrokers = process.env.KAFKA_BROKERS.split(",");
    this.kafka = new Kafka({
      clientId,
      brokers: ["kafka1:9092"],
    });
  }

  static getInstance() {
    if (!KafkaProducer.producerInstance) {
      KafkaProducer.producerInstance = new KafkaProducer(CLIENT_ID);
    }
    return KafkaProducer.producerInstance;
  }

  async produce(topic, event, options) {
    const logLocation = "KafkaProducer.produce";
    try {
      const { correlationId } = options;
      const producer = this.kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner,
        allowAutoTopicCreation: true,
        idempotent: true,
      });
      console.log(
        "Producing message to topic",
        topic,
        "with correlation ID",
        correlationId
      );
      await producer.connect();
      await producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(event),
            partition: 0,
            key: "assetId",
            timestamp: Date.now(),
            headers: {
              "correlation-id": correlationId,
            },
          },
        ],
      });
      await producer.disconnect();
    } catch (error) {
      throw ErrorWithContext(error, new ErrorContext(logLocation), __filename);
    }
  }
}

module.exports = KafkaProducer;
