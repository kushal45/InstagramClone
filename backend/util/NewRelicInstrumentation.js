
const newRelic = require("newrelic");
class NewRelicInstrumentation {
    
    /**
     * Starts a New Relic segment.
     * @param {string} transactionName - The name of the transaction.
     * @param {boolean} [recordMetric=true] - Whether to record the metric or not.
     * @param {Function} asyncFunction - The asynchronous function to execute.
     * 
     * @returns {Promise<any>} - The result of the async function.
     */
   static async  startSegment(transactionName,recordMetric =true ,asyncFunction) {
        return await newRelic.startSegment(transactionName, recordMetric, asyncFunction);
   }

}

module.exports = NewRelicInstrumentation;