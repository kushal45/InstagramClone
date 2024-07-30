const FollowerService = require("../services/FollowerService");



async function topFollowerConsumer(kafaConsumerInst) {
    kafaConsumerInst.processMessage(async (followerObj) => {
        console.log("topFollowerConsumer running called with", followerObj);
        const topFollowers = await fetchTopFollower(followerObj.numberOfTopFollowers);
        console.log(`top ${followerObj.numberOfTopFollowers}:`,JSON.stringify(topFollowers));
    });
}

async function fetchTopFollower(numList) {
    const topFollowers = FollowerService.getTopUsersByFollowers(numList);
    return topFollowers;
}

module.exports = topFollowerConsumer;