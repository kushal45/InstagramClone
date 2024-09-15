//runs the consumer logic in background process and extract tags from the asset's text

const postAssetExtraction = require("./generalTagsExtraction");




async function assetConsumerNLP(kafaConsumerInst) {
  kafaConsumerInst.processMessage(async (asset) => {
    postAssetExtraction(asset);
  });
}

module.exports = assetConsumerNLP;
