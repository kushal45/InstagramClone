const natural = require('natural');
const stopWords = require('stopword');

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

function preprocessText(text) {
  let tokens = tokenizer.tokenize(text.toLowerCase());
  tokens = stopWords.removeStopwords(tokens);
  tokens = tokens.map(token => stemmer.stem(token));
  console.log("tokens",tokens);
  return tokens;
}

function extractKeywords(text) {
    tfidf.addDocument(text);
    let keywords = [];
    tfidf.listTerms(0).forEach(item => {
      console.log(item.term + ': ' + item.tfidf);
      if (item.tfidf >= 1) { // Threshold can be adjusted
        keywords.push(item.term);
      }
    });
    return keywords;
  }

  function generateTagsFromText(inputText) {
    const preprocessedText = preprocessText(inputText).join(' ');
    const keywords = extractKeywords(preprocessedText);
    return keywords;
  }

  module.exports= generateTagsFromText;