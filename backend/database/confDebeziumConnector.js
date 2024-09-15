const axios = require("axios");
const logger = require("../logger/logger");
require("dotenv").config();


async function validateAndConfigure(connectorConfig) {
  try {
    const connectHost = process.env.CONNECT_REST_ADVERTISED_HOST_NAME || "connector";
    const connectorsResponse = await axios.get(
      `http://${connectHost}:8083/connectors`
    );
    const connectors = connectorsResponse.data;

    if (connectors.includes(connectorConfig.name)) {
      logger.debug(`Connector ${connectorConfig.name} is already configured.`);
    } else {
      // Configure the connector if not already configured
      const response = await axios.post(
        `http://${connectHost}:8083/connectors`,
        connectorConfig,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      logger.debug("Debezium connector configured:", response.data);
    }
  } catch (error) {
    if (error.response) {
      console.error(
        "Error configuring Debezium connector:",
        error.response.data
      );
    } else {
      console.error("Error configuring Debezium connector:", error.message);
    }
  }
}



const configureDebeziumConnector = async () => {
  const connectorConfig = {
    name: "postgres-connector",
    config: {
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "tasks.max": "5",
      "database.hostname": process.env.DB_HOST,
      "database.port": process.env.DB_PORT,
      "database.user": process.env.DB_USERNAME,
      "database.password": process.env.DB_PASSWORD,
      "database.dbname": process.env.DB_DATABASE,
      "database.server.name": "postgres_server",
      "plugin.name": "pgoutput",
      "publication.name": "my_publication",
      "slot.name": "test_slot",
      "database.history.kafka.bootstrap.servers": process.env.KAFKA_BROKERS,
      "database.history.kafka.topic": "schema-changes.postgres",
      "table.include.list": "public.users,public.posts,public.comments,public.likes,public.followers,public.assets",
      "topic.prefix": "my_topic_prefix",
    },
  };
  await validateAndConfigure(connectorConfig);
  
  //await createCollectionsAndConsume();

  // const response = await axios.post('http://connector:8083/connectors', connectorConfig, {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // });
  // console.log('Debezium connector configured:', response.data);
};

module.exports = configureDebeziumConnector;
