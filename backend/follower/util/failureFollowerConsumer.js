const { Counter } = require('prom-client');
const logger = require("../../logger/logger");
const alertCounter = new Counter({
    name: 'failed_follower_issues_total',
    help: 'Total number of failed follower issues',
});

function alertFailedFollowerIssue(errFollowerMessage) {
    
    logger.error(`Error processing follower message: `,errFollowerMessage);
    alertCounter.inc(); // Increment the Prometheus counter
    // Additional alerting logic can be added here (e.g., sending an email or Slack notification)
}
async function failureFollowerConsumer(kafaConsumerInst){
    
    await kafaConsumerInst.processMessage(alertFailedFollowerIssue);
}

module.exports= failureFollowerConsumer;

    


