const KafkaProducer = require("./Producer");
const newRelic = require("newrelic");
const logger = require("../logger/logger");

class KafkaNewRelicProducer {

    constructor() {}
    
    async produce(topic, event, options) {
        try {
     //   const parentTransaction = newRelic.getTransaction();
     //   parentTransaction.end();
      //  const transactionName = "kafkaProducerTransactionProduce";
     //  const result=  await newRelic.startSegment(transactionName, true, async function () {
      //  const transaction = newRelic.getTransaction();
        const kafkaProducer = KafkaProducer.getInstance();
        logger.debug("Producing message to topic within segment", topic, "with correlation ID", options.correlationId);
        await kafkaProducer.produce(topic, event, options);
       // transaction.end();
     //  });
       // console.log("new relic result segment", result);
        } catch (error) {
        console.error("Error producing message from KafkaNewRelicProducer class:", error.message);
        }
    }
}


module.exports = KafkaNewRelicProducer;