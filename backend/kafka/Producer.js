const { Kafka, Partitioners } = require("kafkajs");
const { ErrorWithContext, ErrorContext } = require("../errors/ErrorContext");
require("dotenv").config();

class KafkaProducer {
  // Static property to hold the single instance
  static producerInstance = null;
  static CLIENT_ID = "kafka-producer";
  constructor(clientId) {
    this.kafkaBrokers = "kafka1:9092,kafka2:9094,kafka3:9096".split(",");
    this.kafka = new Kafka({
      clientId,
      brokers: this.kafkaBrokers,
    });
  }

  static getInstance() {
    if (!KafkaProducer.producerInstance) {
      KafkaProducer.producerInstance = new KafkaProducer(KafkaProducer.CLIENT_ID);
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
      const result=await producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(event),
            timestamp: Date.now(),
            headers: {
              "correlation-id": correlationId??`kafka-${Date.now()}`,
            },
          },
        ],
      });
      console.log("producer send result", result);
      await producer.disconnect();
    } catch (error) {
      console.error("Error producing message from KafkaProducer class:", error.message);
      throw ErrorWithContext(error, new ErrorContext(logLocation), __filename);
    }
  }
}

module.exports = KafkaProducer;
