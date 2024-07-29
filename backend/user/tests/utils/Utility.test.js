const Utility = require('../../utils/Utility');

describe('Utility', () => {
  describe('findDeltaBetwn2Sets', () => {
    it('should return the difference between two sets', () => {
      const set1 = new Set([1, 2, 3, 4]);
      const set2 = new Set([3, 4, 5, 6]);
      const result = Utility.findDeltaBetwn2Sets(set1, set2);
      expect(result).toEqual(new Set([1, 2]));
    });

    it('should return an empty set when both sets are identical', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2, 3]);
      const result = Utility.findDeltaBetwn2Sets(set1, set2);
      expect(result).toEqual(new Set());
    });

    it('should return the first set when the second set is empty', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set();
      const result = Utility.findDeltaBetwn2Sets(set1, set2);
      expect(result).toEqual(new Set([1, 2, 3]));
    });

    it('should return an empty set when the first set is empty', () => {
      const set1 = new Set();
      const set2 = new Set([1, 2, 3]);
      const result = Utility.findDeltaBetwn2Sets(set1, set2);
      expect(result).toEqual(new Set());
    });
  });

  describe('updateChangedFields', () => {
    it('should return an object with updated fields', async () => {
      const reqBody = { name: 'New Name', email: 'newemail@example.com' };
      const user = { name: 'Old Name', email: 'oldemail@example.com' };
      const result = await Utility.updateChangedFields(reqBody, user);
      expect(result).toEqual({ name: 'New Name', email: 'newemail@example.com' });
    });

    it('should return an empty object when no fields are updated', async () => {
      const reqBody = { name: 'Same Name', email: 'sameemail@example.com' };
      const user = { name: 'Same Name', email: 'sameemail@example.com' };
      const result = await Utility.updateChangedFields(reqBody, user);
      expect(result).toEqual({});
    });

    it('should ignore fields that are undefined in reqBody', async () => {
      const reqBody = { name: 'New Name', email: undefined };
      const user = { name: 'Old Name', email: 'oldemail@example.com' };
      const result = await Utility.updateChangedFields(reqBody, user);
      expect(result).toEqual({ name: 'New Name' });
    });

    it('should only update fields that are different', async () => {
      const reqBody = { name: 'New Name', email: 'oldemail@example.com' };
      const user = { name: 'Old Name', email: 'oldemail@example.com' };
      const result = await Utility.updateChangedFields(reqBody, user);
      expect(result).toEqual({ name: 'New Name' });
    });
  });
});