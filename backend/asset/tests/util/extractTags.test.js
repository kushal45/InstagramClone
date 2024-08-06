const natural = require('natural');
const stopWords = require('stopword');
const { preprocessText, extractKeywords,generateTagsFromText} = require('../../util/extractTags');


// Mocking natural and stopword modules
jest.mock('natural', () => {
  const actualNatural = jest.requireActual('natural');
  return {
    ...actualNatural,
    TfIdf: jest.fn().mockImplementation(() => ({
      addDocument: jest.fn(),
      listTerms: jest.fn().mockReturnValue([
        { term: 'keyword1', tfidf: 1.5 },
        { term: 'keyword2', tfidf: 0.5 },
      ]),
    })),
  };
});

jest.mock('stopword', () => ({
  removeStopwords: jest.fn((tokens) => tokens.filter(token => token !== 'the')),
}));

describe('extractTags.js', () => {
  describe('preprocessText', () => {
    it('should tokenize, remove stopwords, and stem the text', () => {
      const text = 'The quick brown fox jumps over the lazy dog';
      const expectedTokens = ['quick', 'brown', 'fox', 'jump', 'over', 'lazi', 'dog'];
      const result = preprocessText(text);
      expect(result).toEqual(expectedTokens);
    });
  });

  describe('extractKeywords', () => {
    it('should extract keywords with tfidf >= 1', () => {
      const text = 'sample text';
      const expectedKeywords = ['keyword1'];
      const result = extractKeywords(text);
      expect(result).toEqual(expectedKeywords);
    });
  });

  describe('generateTagsFromText', () => {
    it('should generate tags from input text', () => {
      const inputText = 'The quick brown fox jumps over the lazy dog';
      const expectedTags = ['keyword1'];
      const result = generateTagsFromText(inputText);
      expect(result).toEqual(expectedTags);
    });
  });
});