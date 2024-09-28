const { Client } = require("@elastic/elasticsearch");
const { Readable } = require('stream');
const split = require("split2");
const { ErrorWithContext, ErrorContext } = require("../errors/ErrorContext");
class ElasticSearch {
  constructor() {
    this.client = new Client({
      node: "http://es_container_3:9200",
      log: "debug",
      requestTimeout: 60000, // 60 seconds timeout
      sniffOnStart: true, // Sniff the cluster on startup
      maxRetries: 5,
    });
  }

  async bulkIndexStream(sourceData, indexVal) {
   // console.log("sourceData", sourceData);
    const logLocation = "ElasticSearch.bulkIndexStream";
    try {
      try {
        const health = await this.client.cluster.health({});

        console.log("Elasticsearch cluster health:", health);
        const clientPingResult = await this.client.ping();
        console.log("clientPingResult", clientPingResult);
      } catch (error) {
        console.error("Error pinging client:", error);
      }


      const bulkResponse = await this.client.helpers.bulk({
        datasource: createReadStreamFromArray(sourceData),
        onDocument (doc) {
          return {
            index: { _index: indexVal }
          }
        }
      });
      console.log("result", bulkResponse);

      if (bulkResponse.errors) {
        const erroredDocuments = [];
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              // If the status is 429 it means that you can retry the document,
              // otherwise it's very likely a mapping error, and you should
              // fix the document before to try it again.
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });
        console.log("errorDocuments len", erroredDocuments.length);
      }

      const countRes = await this.client.count({ index: indexVal });
      console.log("countRes", countRes);
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          sourceData,
          indexVal,
        }),
        __filename
      );
    }
  }

  async checkAndDeleteIndex(indexVal) {
    const logLocation = "ElasticSearch.checkAndDeleteIndex";
    try {
      const exists = await this.client.indices.exists({
        index: indexVal
      })
      console.log("exists", exists);
      if (exists) {
        await this.client.indices.delete({ index: indexVal });
      }
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          indexVal,
        }),
        __filename
      );
    }
  }

  async indexDocument(indexVal, document, id) {
    return this.client.index({
      index: indexVal,
      id,
      body: document,
    });
  }

  async search(indexVal, query) {
    const logLocation = "ElasticSearch.search";
    try {
      const result = await this.client.search({
        index: indexVal,
        body: {
          query: {
            multi_match: {
              query: query,
              fields: ["name", "username", "bio"],
            },
          },
          collapse:{
            field: "username.keyword",
          }
        },
      });
      console.log("seach result", JSON.stringify(result));
      return result;
    } catch (error) {
      throw new ErrorWithContext(
        error,
        new ErrorContext(logLocation, {
          indexVal,
          query,
        }),
        __filename
      );
    }
  }
}

function createReadStreamFromArray(data) {
  return new Readable({
    objectMode: true,
    read() {
      for (const item of data) {
        this.push(item); // Push each item to the stream
      }
      this.push(null); // Signal the end of the stream
    }
  });
}

module.exports = ElasticSearch;
