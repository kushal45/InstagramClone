const connectorConfig= {
    [process.env.CONSUMER_NAME]: require("./cronJob/sinkConnectorCronJob")
}

connectorConfig[process.env.CONSUMER_NAME];