const consumeEvent = require('../../../kafka/Consumer');
const stringSimilarity = require('string-similarity');
const AssetService = require('../../services/AssetService');
const generateTagsFromText = require('../../util/extractTags');
const assetConsumer = require('../../util/assetConsumerGenNLPStrat');

jest.mock('../../../kafka/Consumer', () => ({
  processMessage: jest.fn(),
}));

jest.mock('string-similarity', () => ({
  findBestMatch: jest.fn(),
}));

jest.mock('../../services/AssetService', () => ({
  updateAsset: jest.fn(),
}));

jest.mock('../../util/extractTags', () => jest.fn());

describe('assetConsumer', () => {
  let kafkaConsumerInst;

  beforeEach(() => {
    kafkaConsumerInst = {
      processMessage: jest.fn((callback) => {
        callback({
          text: 'Sample asset text',
          correlationId: '12345',
          id: 'asset123',
        });
      }),
    };

    generateTagsFromText.mockReturnValue(['sampleTag']);
    stringSimilarity.findBestMatch.mockReturnValue({
      bestMatch: { rating: 0.8, target: 'technology' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process the asset and update tags', async () => {
    await assetConsumer(kafkaConsumerInst);

    expect(kafkaConsumerInst.processMessage).toHaveBeenCalled();
    expect(generateTagsFromText).toHaveBeenCalledWith('Sample asset text');
    expect(stringSimilarity.findBestMatch).toHaveBeenCalledWith('sampleTag', [
      'politics',
      'sports',
      'technology',
      'entertainment',
      'science',
      'health',
      'business',
      'education',
      'lifestyle',
      'other',
    ]);
    expect(AssetService.updateAsset).toHaveBeenCalledWith('asset123', {
      tags: ['technology'],
    });
  });

  it('should default to "other" tag if no tags are matched', async () => {
    generateTagsFromText.mockReturnValue([]);
    await assetConsumer(kafkaConsumerInst);

    expect(AssetService.updateAsset).toHaveBeenCalledWith('asset123', {
      tags: ['other'],
    });
  });

  it('should keep the original tag if no close match is found', async () => {
    stringSimilarity.findBestMatch.mockReturnValue({
      bestMatch: { rating: 0.5, target: 'technology' },
    });
    generateTagsFromText.mockReturnValue(['unmatchedTag']);
    await assetConsumer(kafkaConsumerInst);

    expect(AssetService.updateAsset).toHaveBeenCalledWith('asset123', {
      tags: ['other'],
    });
  });
});