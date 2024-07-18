//runs the consumer logic in background process and extract tags from the asset's text
const consumeEvent= require('../../kafka/Consumer');
const stringSimilarity = require('string-similarity');
const AssetService = require('../services/AssetService');
const generateTagsFromText = require('./extractTags');

const SUPPORTED_TAGS=['politics', 'sports', 'technology', 'entertainment', 'science', 
    'health', 'business', 'education', 'lifestyle', 'other'];

async function assetConsumer(kafaConsumerInst){

    kafaConsumerInst.run(async(asset)=>{
        console.log("assetConsumer running called with",asset);
        const tags = generateTagsFromText(asset.text);
        // Map each tag to its best match in SUPPORTED_TAGS if the similarity is above a threshold
      const matchedTags = tags.map(tag => {
          const matches = stringSimilarity.findBestMatch(tag, SUPPORTED_TAGS);
          if (matches.bestMatch.rating > 0.7) { // Assuming a threshold of 0.7 for similarity
              return matches.bestMatch.target;
          }
          return null; // or return tag to keep the original tag if no close match is found
      }).filter(tag => tag !== null); // Remove nulls (no close match)
        console.log("tags extracted",matchedTags,asset.id);
        await AssetService.updateAsset(asset.id,{tags:matchedTags});
    });
}

module.exports = assetConsumer;

