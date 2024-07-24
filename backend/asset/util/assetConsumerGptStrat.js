const axios = require("axios");
require("dotenv").config();

async function getChatGptResponse(prompt) {
  const openaiApiKey = "";
 const url = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
 const data = {
    prompt: prompt,
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7,
  };
  const headers = {
    'Authorization': `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json',
  };
  const response = await axios.post(url, data, { headers });
  const messageContent = response.data.choices[0].text.trim();

  return messageContent;
}

const SUPPORTED_TAGS = [
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

async function assetConsumer(kafaConsumerInst) {
  const text =
    "this is a multimillion dollar company which is into sports and entertainment does a lot of favour to other political parties";
  const prompt = `Extract tags from the following text: ${text} which lies in the ${SUPPORTED_TAGS.join(
    ", "
  )}  categories . return the tags as an array`;
  const response = await getChatGptResponse(prompt);
  console.log("tags extracted", response);
  // kafaConsumerInst.run(async(asset)=>{
  //     const text = 'this is a multimillion dollar company which is into sports and entertainment does a lot of favour to other political parties';

  //     const prompt = `Extract tags from the following text: ${asset.text} which lies in the ${SUPPORTED_TAGS.join(', ')}  categories . return the tags as an array`;
  //     const response = await getChatGptResponse(prompt);
  //     console.log("tags extracted",response);
  //     //await AssetService.updateAsset(asset.id,{tags:response});
  // });
}

module.exports = assetConsumer;
