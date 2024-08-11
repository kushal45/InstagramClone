const axios = require('axios');
require("dotenv").config();

const configureDebeziumConnector = async () => {
  const connectorConfig = {
    name: "postgres-connector-1",
    config: {
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "tasks.max": "1",
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
      "topic.prefix": "my_topic_prefix" 
    }
  };

  try {
    const response = await axios.post('http://connector:8083/connectors', connectorConfig, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Debezium connector configured:', response.data);
  } catch (error) {
    if (error.response) {
        console.error('Error configuring Debezium connector:', error.response.data);
      } else {
        console.error('Error configuring Debezium connector:', error.message);
      }
  }
};

module.exports = configureDebeziumConnector;