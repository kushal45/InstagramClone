const Transport = require('winston-transport');
const KafkaNewRelicProducer = require('../kafka/KafkaNewRelicProducer');

class KafkaTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.topic = opts.topic || 'logs';
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
        await new KafkaNewRelicProducer().produce(this.topic, message, { correlationId: info.correlationId});
    } catch (error) {
      console.error('Error sending log to Kafka:', error);
    }

    callback();
  }
}

module.exports = KafkaTransport;