const { execSync } = require("child_process");

const filePath = "./follower/util/getFollowerList.js";

try {
  const command = `nodemon --exec "node ${filePath}"`;
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error(`Error executing script: ${error.message}`);
}