const AssetService = require('../../services/AssetService');
const AssetDAO = require('../../dao/AssetDao');

jest.mock('../../dao/AssetDao');

describe('AssetService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAsset', () => {
    it('should create a new asset', async () => {
      const assetData = { name: 'Test Asset' };
      const createdAsset = { id: 1, ...assetData };
      AssetDAO.create.mockResolvedValue(createdAsset);

      const result = await AssetService.createAsset(assetData);

      expect(result).toEqual(createdAsset);
      expect(AssetDAO.create).toHaveBeenCalledWith(assetData);
    });

    it('should throw an error if creation fails', async () => {
      const assetData = { name: 'Test Asset' };
      const error = new Error('Creation failed');
      AssetDAO.create.mockRejectedValue(error);

      await expect(AssetService.createAsset(assetData)).rejects.toThrow(error);
      expect(AssetDAO.create).toHaveBeenCalledWith(assetData);
    });
  });

  describe('findAssetById', () => {
    it('should find an asset by ID', async () => {
      const assetId = 1;
      const foundAsset = { id: assetId, name: 'Test Asset' };
      AssetDAO.findById.mockResolvedValue(foundAsset);

      const result = await AssetService.findAssetById(assetId);

      expect(result).toEqual(foundAsset);
      expect(AssetDAO.findById).toHaveBeenCalledWith(assetId);
    });

    it('should throw an error if finding fails', async () => {
      const assetId = 1;
      const error = new Error('Find failed');
      AssetDAO.findById.mockRejectedValue(error);

      await expect(AssetService.findAssetById(assetId)).rejects.toThrow(error);
      expect(AssetDAO.findById).toHaveBeenCalledWith(assetId);
    });
  });

  describe('updateAsset', () => {
    it('should update an existing asset', async () => {
      const assetId = 1;
      const updateData = { name: 'Updated Asset' };
      const updatedAsset = { id: assetId, ...updateData };
      AssetDAO.update.mockResolvedValue(updatedAsset);

      const result = await AssetService.updateAsset(assetId, updateData);

      expect(result).toEqual(updatedAsset);
      expect(AssetDAO.update).toHaveBeenCalledWith(assetId, updateData);
    });

    it('should throw an error if update fails', async () => {
      const assetId = 1;
      const updateData = { name: 'Updated Asset' };
      const error = new Error('Update failed');
      AssetDAO.update.mockRejectedValue(error);

      await expect(AssetService.updateAsset(assetId, updateData)).rejects.toThrow(error);
      expect(AssetDAO.update).toHaveBeenCalledWith(assetId, updateData);
    });
  });
});