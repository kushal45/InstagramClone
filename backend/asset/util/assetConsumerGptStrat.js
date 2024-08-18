require("dotenv").config();
const OpenAI = require("openai");
const postAssetExtraction = require("../util/generalTagsExtraction");
const logger = require("../../logger/logger");

async function getCompletion(prompt) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    //console.log(response);
    return response;
  } catch (error) {
    //console.error("Error calling the OpenAI API:", error);
    return error;
  }
  // console.log("openai key",process.env.OPENAI_API_KEY);
}

function extractArrayFromText(text) {
  // Step 1: Remove newline characters
  const cleanedText = text.replace(/\n/g, "");

  // Step 2: Extract the array string using a regular expression
  const arrayStringMatch = cleanedText.match(/\[.*\]/);
  if (!arrayStringMatch) {
    throw new Error("Array string not found in the text");
  }
  let arrayString = arrayStringMatch[0];
  arrayString = arrayString.replace(/'([^']*)'/g, '"$1"');

  // Step 3: Parse the array string into a JavaScript array
  const array = JSON.parse(arrayString);

  return array;
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

async function assetConsumerGPT(kafaConsumerInst) {
  //console.log(kafaConsumerInst);
  // const text =
  //   "this is a multimillion dollar company which is into sports and entertainment does a lot of favour to other political parties";
  // const prompt = `Extract tags from the following text: ${text} which lies in the ${SUPPORTED_TAGS.join(
  //   ", "
  // )}  categories . return the tags as an array`;
  // const response = await getCompletion(prompt);
  // console.log("tags extracted", response);
  kafaConsumerInst.processMessage(async (asset) => {
    //const text = 'this is a multimillion dollar company which is into sports and entertainment does a lot of favour to other political parties';

    const prompt = `Extract tags from the following text: ${
      asset.text
    }. Only include tags that match the following categories: ${SUPPORTED_TAGS.join(
      ", "
    )}. Return the supported tags as an array.`;
    const response = await getCompletion(prompt);
    logger.debug("response status code from openai", response.status);
    if (response.status !== 200) {
      postAssetExtraction(asset);
      return;
    }
    console.log("tags extracted", response.choices[0].text);
    const tags = extractArrayFromText(response.choices[0].text);
    console.log("tags after striping characters", tags);
    await AssetService.updateAsset(asset.id, { tags });
  });
}

module.exports = assetConsumerGPT;
