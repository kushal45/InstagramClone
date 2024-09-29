const Transport = require('winston-transport');
const { Kafka } = require('kafkajs');

class KafkaTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.kafka = new Kafka({
      clientId: 'winston-logger',
      brokers: process.env.KAFKA_INT_BROKERS.split(',')
    });
    this.producer = this.kafka.producer();
    this.topic = opts.topic || 'logs';
    this.connectProducer();
  }


  async connectProducer() {
    try {
      await this.producer.connect();
      console.log('Kafka producer connected');
    } catch (error) {
      console.error('Error connecting Kafka producer:', error);
    }
  }

  async log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    const message = {
      level: info.level,
      message: info.message,
      timestamp: info.timestamp,
      ...info.meta
    };

    try {
      await this.producer.send({
        topic: this.topic,
        messages: [{ value: JSON.stringify(message) }]
      });
    } catch (error) {
      console.error('Error sending log to Kafka:', error);
    }

    callback();
  }
}

module.exports = KafkaTransport;