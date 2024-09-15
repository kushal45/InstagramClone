async function viewFollowerResult(redisClient,sortedKey) {
  const topFollowers = await redisClient.zRangeWithScores(sortedKey, 0, -1, {
    WITHSCORES: true,
  });
  console.log("Top followers: ", topFollowers);

  // Log each member with its associated score
  for (let i = 0; i < topFollowers.length; i++) {
    const member = topFollowers[i].value;
    const score = parseFloat(topFollowers[i].score);
    console.log(`Member: ${member}, Score: ${score}`);
  }
}

module.exports = viewFollowerResult;
