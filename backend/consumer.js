
//const assetConsumer = require("./asset/util/assetConsumerGptStrat");
const assetConsumer = require("./asset/util/assetConsumerGenNLPStrat");
const KafkaConsumer = require("./kafka/Consumer");
const fs = require('fs').promises;
const path = require('path');

let isRunnable = true;

const consumerServices =Object.freeze({
  ASSETCONSUMER: 'assetConsumer'
});

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
    if (process.env.CONSUMER_NAME === consumerServices.ASSETCONSUMER) {
      await assetConsumer(kafaConsumerInst); 
    }
   
   
    const filePath = path.join(__dirname, 'example.txt');
    await touchFile(filePath);
    // Introduce a delay to prevent tight looping
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

async function touchFile(filePath) {
  try {
    // Try to update the file's timestamps
    const time = new Date();
    await fs.utimes(filePath, time, time);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // If the file does not exist, create it
      try {
        const fileHandle = await fs.open(filePath, 'a'); // Open the file in append mode, which creates the file if it doesn't exist
      await fileHandle.close(); // Close the file immediately
      await fs.utimes(filePath, time, time); // Update the timestamps to now
      } catch (createErr) {
        console.error(`Failed to create file: ${createErr}`);
      }
    } else {
      console.error(`Failed to touch file: ${err}`);
    }
  }
}

// Handle interrupt signals
const handleSignal = (signal) => {
  console.log(`Received ${signal}. Gracefully shutting down.`);
  isRunnable = false;
};

process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);

process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception: ${error.message}`);
  handleSignal(error.name);
});

// Handling unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  handleSignal(error.name);
});
