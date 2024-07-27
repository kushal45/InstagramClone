const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
require("dotenv").config();

function getRandomItems(items) {
  const numberOfItems = Math.floor(Math.random() * items.length) + 1; // Random number between 1 and tags.length
  const shuffledItems = items.sort(() => 0.5 - Math.random()); // Shuffle the array
  return shuffledItems.slice(0, numberOfItems); // Return a random subset
}

function checkIfContentExists(filePath) {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    if (fileContent) {
      return JSON.parse(fileContent);
    }
  }
  return [];
}

function getToken(context) {
  const tokens = checkIfContentExists(path.join(__dirname, "token.json"));
  const currentTokenIdx = getRandomTokenIdx();
  //console.log("currentTokenIdx fetched", currentTokenIdx);
  const token = tokens[currentTokenIdx];
  console.log("token fetched", token);
  return token;
}

function getRandomTokenIdx(){
  const tokens = checkIfContentExists(path.join(__dirname, "token.json"));
  return Math.floor(Math.random() * tokens.length);
}

async function deleteAllTablesData() {
  const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  await client.connect();

  try {
    const tables = ["users", "assets", "posts", "comments", "likes", "follows"];
    for (const table of tables) {
      await client.query(`DELETE FROM ${table}`);
    }
   // console.log("All tables data deleted successfully.");
  } catch (err) {
    //console.error("Error deleting tables data:", err);
  } finally {
    await client.end();
  }
}

module.exports = {
  initialize: async function (context, events, done) {
    console.log("Initializing the test");
    await deleteAllTablesData();
    const token = [];
    const postIds = [];
    context.vars.currentTokenIdx = -1;
    fs.writeFileSync(
      path.join(__dirname, "token.json"),
      JSON.stringify(token),
      "utf8"
    );
    fs.writeFileSync(
      path.join(__dirname, "postIds.json"),
      JSON.stringify(postIds),
      "utf8"
    );
    done();
  },
  logRequest(requestParams, context, ee, next) {
   // console.log(`Requesting: ${requestParams.url}`);
    return next(); // Proceed to the next request
  },
  logResponse(requestParams, response, context, ee, next) {
    if (response.statusCode === 200) {
      console.log(`Success: ${requestParams.url}`);
    } else {
      console.error(
        `Failure: ${requestParams.url}, Status Code: ${response.statusCode}`
      );
    }
    return next(); // Proceed to the next request
  },
  incrementTokenIdx: function (context, ee, done) {
    if(context.vars.currentTokenIdx== null){
      context.vars.currentTokenIdx =0 ;
    }
   
    console.log("incrementing currentTokenIdx", context.vars.currentTokenIdx,"tokens length", tokens.length);
    done();
  },
  saveToken: function (context, events, done) {
    const tokens = checkIfContentExists(path.join(__dirname, "token.json"));
    const token = context.vars.loginToken;
    tokens.push(token);
    fs.writeFileSync(
      path.join(__dirname, "token.json"),
      JSON.stringify(tokens),
      "utf8"
    );
    done();
  },
  readToken: function (requestParams, context, ee, next) {
    console.log("reading url, ", requestParams.url);
    const token = getToken(context);
    context.vars.loginToken = token;
    return next();
  },
  fetchUserProfileDataToUpdate: function (requestParams, context, ee, next) {
    const supportedTags = [
      "politics",
      "sports",
      "technology",
      "entertainment",
      "science",
      "health",
      "business",
      "education",
      "lifestyle",
      "other",
    ];
    const supportedLanguages = [
      "English",
      "Spanish",
      "French",
      "German",
      "Japanese",
    ];
    context.vars.tags = getRandomItems(supportedTags);
    context.vars.langPrefs = getRandomItems(supportedLanguages);
    return next();
  },
  readUsersToFollow: function (context, ee, done) {
    const tokens = checkIfContentExists(path.join(__dirname, "token.json"));
    const usersToFollow = [];
    if (tokens.length > 1) {
      for (let token of tokens) {
        const decoded = jwt.verify(token, process.env.SIGNATURE_TOKEN);
        usersToFollow.push(decoded.id);
      }
    }
    context.vars.usersToFollow = usersToFollow;
    done();
  },
  readUserIdFrmToken: function (requestParams, context, ee, next) {
    const token = getToken(context);
    //console.log("trying to decode token", token);
    const decoded = jwt.verify(token, process.env.SIGNATURE_TOKEN);
   // console.log("decoded token", decoded);
    // Assuming 'userId' is stored in the token payload
    const userId = decoded.id;
    // console.log("UserId extracted from token:", userId);
    context.vars.userId = userId;
    return next();
  },
  shouldSkipPostCommentScenario : function(requestParams, context, ee, next) {
    let shouldRequestForPostComm = true;
    const tokens = checkIfContentExists(path.join(__dirname, "token.json"));
    if (Array.isArray(tokens) && tokens.length ==0 ) {
      shouldRequestForPostComm = false;
    }
    //console.log("shouldSkipPostCommentScenario", shouldRequestForPostComm);
    context.vars.shouldRequestForPostComm = shouldRequestForPostComm;
    return next();
  },
  loadPostData: function (requestParams, context, ee, next) {
    const postStr = fs.readFileSync(
      path.join(__dirname, "postsData.json"),
      "utf8"
    );
    //console.log("postStr", postStr);
    const postsData = JSON.parse(postStr);
    // Select a random post from the array
    const randomIndex = Math.floor(Math.random() * postsData.length);
    const randomPost = postsData[randomIndex];
    // console.log("random post chosen", randomPost);
    context.vars.postData = randomPost; // Make AI data available in the test context
    return next();
  },
  savePostId: function (requestParams,response, context,events, done) {
    //console.log("saving postIds");
    const filePath = path.join(__dirname, "postIds.json");

    // Step 1 & 2: Read the file and parse the content if it exists
    const postIds = checkIfContentExists(filePath);
    console.log("response recieved", response.body);
    const postId = context.vars.postId;
   // console.log("postId to push", postId);
    postIds.push(postId);

    // Step 4: Write the updated array back to the file
    fs.writeFileSync(filePath, JSON.stringify(postIds), "utf8");

    done();
  },
  loadPostId: function (requestParams, context, ee, next) {
    const filePath = path.join(__dirname, "postIds.json");

    //console.log("loading postIds");
    // Step 1 & 2: Read the file and parse the content if it exists
    const postIds = checkIfContentExists(filePath);
   // console.log("postIds fetched", postIds);
    // Step 3: Select a random postId
    if (postIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * postIds.length);
      const randomPostId = postIds[randomIndex];
      // Step 4: Assign the selected postId to context.vars
      context.vars.postId = randomPostId;
      //console.log("postId chosen", context.vars.postId);
    }

    // Step 5: Call done() to signal completion
    return next();
  },
  logCaptureError: function (requestParams, response, context, ee, next) {
    if (response.statusCode !== 200) {
      console.error(
        `Request to ${requestParams.url} failed with status code ${response.statusCode}`
      );
    }

    // Check if the capture failed
    if (context.vars.loginToken === undefined) {
      console.error(
        `Failed to capture loginToken from response: ${JSON.stringify(
          response.body
        )}`
      );
    }

    return next();
  },
};
