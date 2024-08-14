const cron = require('node-cron');
const logger = require('../logger/logger'); // Assuming you have a logger module
const createCollectionsAndConsume = require('../mongo/util/mongoConsumer');

// Define the task you want to run
const fetchDataAndLog = async () => {
  try {
   await createCollectionsAndConsume();
  } catch (error) {
    logger.error('Error fetching data:', error.message);
  }
};

// Schedule the task to run every 15 secs
cron.schedule('*/15 * * * * *', fetchDataAndLog, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });

logger.info('Cron job scheduled to run every day at midnight.');