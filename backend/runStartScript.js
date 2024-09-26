const { execSync } = require("child_process");

const getFollowerListPath = "./follower/util/getFollowerList.js";
const bulkIndexUserProfilesPath = "./user/utils/fetchUserProfiles.js";

try {

  // Execute the script to fetch user profiles and bulk index them in Elasticsearch stream
  const bulkIndexCommand = `nodemon --exec "node ${bulkIndexUserProfilesPath}"`;
  execSync(bulkIndexCommand, { stdio: 'inherit' });

  // Execute the script to get the follower list and maintain the initial following counts in the sorted set by keeping scores against each users
  const followerCommand = `nodemon --exec "node ${getFollowerListPath}"`;

  execSync(followerCommand, { stdio: 'inherit' });

} catch (error) {
  console.error(`Error executing script: ${error.message}`);
}