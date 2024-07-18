const assetConsumer = require("./asset/util/assetConsumer");
const KafkaConsumer = require("./kafka/Consumer");

let isRunnable = true;

const kafaConsumerInst = new KafkaConsumer("consumer-1");
initializeConsumer(kafaConsumerInst);

async function initializeConsumer(kafaConsumerInst) {
  try {
    await kafaConsumerInst.createTopics(process.env.TOPIC);
    await kafaConsumerInst.subscribe(process.env.TOPIC, process.env.GROUPID);
    await processConsumerInfinitely(kafaConsumerInst);
    console.log("Successfully subscribed to topic");
  } catch (error) {
    console.error(error);
  }
}

async function processConsumerInfinitely(kafaConsumerInst){
  while (isRunnable) {
    if (process.env.TOPIC === "assetCreated") {
      await assetConsumer(kafaConsumerInst); // Ensure this is async or has some delay
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Introduce a delay to prevent tight looping
   
   
  }
}

// Handle interrupt signals
const handleSignal = (signal) => {
  console.log(`Received ${signal}. Gracefully shutting down.`);
  isRunnable = false;
};

process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);
