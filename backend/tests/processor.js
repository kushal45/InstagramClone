const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  logUrl(requestParams, context, events) {
    console.log("log url");
    console.log("Request URL:", requestParams.url);
    return next(); // Proceed to the next middleware or send the request
  },
  logRequest(requestParams, context, ee, next) {
    console.log(`Requesting: ${requestParams.url}`);
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
  saveToken: function (context, events, done) {
    // Assuming `loginToken` is the variable where the token is stored
    const token = context.vars.loginToken;
    // Write the token to a file
    //console.log("writing token to file", token);
    fs.writeFileSync(path.join(__dirname, "token.txt"), token, "utf8");
    done();
  },
  readToken: function (context, events, done) {
    // Read the token from the file
    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf8");
    //console.log("reading token from file", token);
    // Set the token in the scenario context
    context.vars.loginToken = token;
    done();
  },
  readUserIdFrmToken: function (context, ee, done) {
    const token = fs.readFileSync(path.join(__dirname, "token.txt"), "utf8");
    const decoded = jwt.verify(token, process.env.SIGNATURE_TOKEN);
   // console.log("decoded token", decoded);
    // Assuming 'userId' is stored in the token payload
    const userId = decoded.id;
   // console.log("UserId extracted from token:", userId);
    context.vars.userId = userId;
    done();
  },
  loadPostData: function (context, ee, done) {
    const postStr=fs.readFileSync(path.join(__dirname, "postsData.json"), "utf8");
    //console.log("postStr", postStr);
    const postsData = JSON.parse(postStr);
    // Select a random post from the array
    const randomIndex = Math.floor(Math.random() * postsData.length);
    const randomPost = postsData[randomIndex];
   // console.log("random post chosen", randomPost);
    context.vars.postData = randomPost; // Make AI data available in the test context
    return done();
  },
  savePostId: function (context, events, done) {
    console.log("saving postIds");
    const filePath = path.join(__dirname, "postIds.json");
    let postIds = [];

    // Step 1 & 2: Read the file and parse the content if it exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      if (fileContent) {
        postIds = JSON.parse(fileContent);
      }
    }

    // Step 3: Append the new postId
    const postId = context.vars.postId;
    console.log("postId to push", postId);
    postIds.push(postId);

    // Step 4: Write the updated array back to the file
    fs.writeFileSync(filePath, JSON.stringify(postIds), "utf8");

    done();
  },
  loadPostId: function (context, events, done) {
    const filePath = path.join(__dirname, "postIds.json");
    let postIds = [];
    //console.log("loading postIds");
    // Step 1 & 2: Read the file and parse the content if it exists
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      if (fileContent) {
        postIds = JSON.parse(fileContent);
      }
    }
    console.log("postIds fetched",postIds);
    // Step 3: Select a random postId
    if (postIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * postIds.length);
      const randomPostId = postIds[randomIndex];
      // Step 4: Assign the selected postId to context.vars
      context.vars.postId = randomPostId;
      console.log("postId chosen", context.vars.postId);
    }

    // Step 5: Call done() to signal completion
    done();
  },
};
