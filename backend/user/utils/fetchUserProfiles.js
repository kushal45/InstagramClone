require("../../database");
const ElasticSearch = require("../../util/ElasticSearch");
const UserDAO = require("../dao/UserDao");

async function indexUserProfiles() {
  const maxLimit = 50;
  let offset = 0;
  let hasMore = true;
  const elasticSearchInstance = new ElasticSearch();
  const indexName="userprofiles";
  await elasticSearchInstance.checkAndDeleteIndex(indexName);
  while (hasMore) {
    const users = await UserDAO.fetchUserProfiles(maxLimit, offset);
    if (users.length === 0) {
      hasMore = false;
    } else {
      await new ElasticSearch().bulkIndexStream(users, indexName);
      offset += maxLimit;
    }
  }
}

indexUserProfiles().catch((error) =>
  console.error("Bubbled up error from indexing profiles", error)
);
