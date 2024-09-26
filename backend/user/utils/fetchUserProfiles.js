require("../../database");
const ElasticSearch = require("../../util/ElasticSearch");
const UserDAO = require("../dao/UserDao");



async function indexUserProfiles() {
    UserDAO.fetchUserProfiles().then(userProfiles=>{
        new ElasticSearch().bulkIndexStream(userProfiles, "userprofiles").
        then((response) => console.log("Bulk User profiles indexed:", response)).
        catch((error) => console.error("Error indexing user profiles:", error));
    })
}

indexUserProfiles().catch((error) => console.error("Bubbled up error from indexing profiles", error));