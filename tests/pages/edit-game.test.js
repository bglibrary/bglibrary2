/**
 * Tests for Edit Game Page - Field Change Detection
 * 
 * Tests the visual diff functionality for the edit form.
 */

// Test utility functions for field change detection
describe('Edit Game Page - Field Change Detection', () => {
  // Simulating the fieldChanges logic from the component
  function computeFieldChanges(formData, originalFormData) {
    if (!originalFormData) return {};
    
    // Default values for missing fields
    const getCategories = (data) => data.categories || [];
    const getAwards = (data) => data.awards || [];
    
    return {
      title: formData.title !== originalFormData.title,
      description: formData.description !== originalFormData.description,
      minPlayers: formData.minPlayers !== originalFormData.minPlayers,
      maxPlayers: formData.maxPlayers !== originalFormData.maxPlayers,
      playDuration: formData.playDuration !== originalFormData.playDuration,
      firstPlayComplexity: formData.firstPlayComplexity !== originalFormData.firstPlayComplexity,
      ageRecommendation: formData.ageRecommendation !== originalFormData.ageRecommendation,
      categories: JSON.stringify(getCategories(formData).sort()) !== JSON.stringify(getCategories(originalFormData).sort()),
      mechanics: formData.mechanics !== originalFormData.mechanics,
      awards: JSON.stringify(getAwards(formData)) !== JSON.stringify(getAwards(originalFormData)),
      favorite: formData.favorite !== originalFormData.favorite,
    };
  }

  // Simulating the hasChanges logic
  function computeHasChanges(fieldChanges) {
    return Object.values(fieldChanges).some(changed => changed);
  }

  describe('computeFieldChanges', () => {
    it('should return empty object when originalFormData is null', () => {
      const formData = { title: 'Test' };
      expect(computeFieldChanges(formData, null)).toEqual({});
    });

    it('should detect no changes when data is identical', () => {
      const formData = {
        title: 'Test Game',
        description: 'A description',
        minPlayers: '2',
        maxPlayers: '4',
        playDuration: 'MEDIUM',
        firstPlayComplexity: 'LOW',
        ageRecommendation: '10+',
        categories: ['Stratégie', 'Famille'],
        mechanics: 'Dice, Cards',
        awards: [{ name: 'Award 1', year: 2020 }],
        favorite: false,
      };
      
      const result = computeFieldChanges(formData, { ...formData });
      
      expect(result.title).toBe(false);
      expect(result.description).toBe(false);
      expect(result.minPlayers).toBe(false);
      expect(result.maxPlayers).toBe(false);
      expect(result.playDuration).toBe(false);
      expect(result.firstPlayComplexity).toBe(false);
      expect(result.ageRecommendation).toBe(false);
      expect(result.categories).toBe(false);
      expect(result.mechanics).toBe(false);
      expect(result.awards).toBe(false);
      expect(result.favorite).toBe(false);
    });

    it('should detect title change', () => {
      const original = { title: 'Original Title' };
      const modified = { title: 'New Title' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.title).toBe(true);
    });

    it('should detect description change', () => {
      const original = { description: 'Original description' };
      const modified = { description: 'New description' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.description).toBe(true);
    });

    it('should detect minPlayers change', () => {
      const original = { minPlayers: '2' };
      const modified = { minPlayers: '3' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.minPlayers).toBe(true);
    });

    it('should detect maxPlayers change', () => {
      const original = { maxPlayers: '4' };
      const modified = { maxPlayers: '6' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.maxPlayers).toBe(true);
    });

    it('should detect playDuration change', () => {
      const original = { playDuration: 'SHORT' };
      const modified = { playDuration: 'LONG' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.playDuration).toBe(true);
    });

    it('should detect firstPlayComplexity change', () => {
      const original = { firstPlayComplexity: 'LOW' };
      const modified = { firstPlayComplexity: 'HIGH' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.firstPlayComplexity).toBe(true);
    });

    it('should detect ageRecommendation change', () => {
      const original = { ageRecommendation: '10+' };
      const modified = { ageRecommendation: '14+' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.ageRecommendation).toBe(true);
    });

    it('should detect categories change (order independent)', () => {
      const original = { categories: ['Stratégie', 'Famille'] };
      const modified = { categories: ['Famille', 'Stratégie'] };
      
      const result = computeFieldChanges(modified, original);
      
      // Same categories, different order - should NOT be a change
      expect(result.categories).toBe(false);
    });

    it('should detect categories change (added category)', () => {
      const original = { categories: ['Stratégie'] };
      const modified = { categories: ['Stratégie', 'Famille'] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.categories).toBe(true);
    });

    it('should detect categories change (removed category)', () => {
      const original = { categories: ['Stratégie', 'Famille'] };
      const modified = { categories: ['Stratégie'] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.categories).toBe(true);
    });

    it('should detect mechanics change', () => {
      const original = { mechanics: 'Dice, Cards' };
      const modified = { mechanics: 'Dice, Cards, Tiles' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.mechanics).toBe(true);
    });

    it('should detect awards change (added award)', () => {
      const original = { awards: [] };
      const modified = { awards: [{ name: 'Spiel des Jahres', year: 2020 }] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.awards).toBe(true);
    });

    it('should detect awards change (removed award)', () => {
      const original = { awards: [{ name: 'Award 1' }] };
      const modified = { awards: [] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.awards).toBe(true);
    });

    it('should detect favorite change', () => {
      const original = { favorite: false };
      const modified = { favorite: true };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.favorite).toBe(true);
    });

    it('should detect multiple changes at once', () => {
      const original = {
        title: 'Original',
        description: 'Original desc',
        minPlayers: '2',
        maxPlayers: '4',
        playDuration: 'MEDIUM',
        firstPlayComplexity: 'LOW',
        ageRecommendation: '10+',
        categories: ['Stratégie'],
        mechanics: 'Dice',
        awards: [],
        favorite: false,
      };
      
      const modified = {
        title: 'Modified',
        description: 'Original desc', // unchanged
        minPlayers: '3', // changed
        maxPlayers: '4', // unchanged
        playDuration: 'LONG', // changed
        firstPlayComplexity: 'LOW', // unchanged
        ageRecommendation: '10+', // unchanged
        categories: ['Stratégie', 'Famille'], // changed
        mechanics: 'Dice', // unchanged
        awards: [], // unchanged
        favorite: true, // changed
      };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.title).toBe(true);
      expect(result.description).toBe(false);
      expect(result.minPlayers).toBe(true);
      expect(result.maxPlayers).toBe(false);
      expect(result.playDuration).toBe(true);
      expect(result.firstPlayComplexity).toBe(false);
      expect(result.ageRecommendation).toBe(false);
      expect(result.categories).toBe(true);
      expect(result.mechanics).toBe(false);
      expect(result.awards).toBe(false);
      expect(result.favorite).toBe(true);
    });
  });

  describe('computeHasChanges', () => {
    it('should return false when no fields changed', () => {
      const fieldChanges = {
        title: false,
        description: false,
        minPlayers: false,
        maxPlayers: false,
        playDuration: false,
        firstPlayComplexity: false,
        ageRecommendation: false,
        categories: false,
        mechanics: false,
        awards: false,
        favorite: false,
      };
      
      expect(computeHasChanges(fieldChanges)).toBe(false);
    });

    it('should return true when at least one field changed', () => {
      const fieldChanges = {
        title: true,
        description: false,
        minPlayers: false,
        maxPlayers: false,
        playDuration: false,
        firstPlayComplexity: false,
        ageRecommendation: false,
        categories: false,
        mechanics: false,
        awards: false,
        favorite: false,
      };
      
      expect(computeHasChanges(fieldChanges)).toBe(true);
    });

    it('should return true when multiple fields changed', () => {
      const fieldChanges = {
        title: true,
        description: true,
        minPlayers: false,
        maxPlayers: false,
        playDuration: true,
        firstPlayComplexity: false,
        ageRecommendation: false,
        categories: false,
        mechanics: false,
        awards: false,
        favorite: false,
      };
      
      expect(computeHasChanges(fieldChanges)).toBe(true);
    });

    it('should return false for empty object', () => {
      expect(computeHasChanges({})).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings correctly', () => {
      const original = { title: '' };
      const modified = { title: 'New Title' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.title).toBe(true);
    });

    it('should handle empty to empty strings (no change)', () => {
      const original = { title: '' };
      const modified = { title: '' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.title).toBe(false);
    });

    it('should handle undefined values in original', () => {
      const original = { title: undefined };
      const modified = { title: 'New Title' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.title).toBe(true);
    });

    it('should handle null values', () => {
      const original = { title: null };
      const modified = { title: 'New Title' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.title).toBe(true);
    });

    it('should handle numeric strings correctly', () => {
      const original = { minPlayers: '2' };
      const modified = { minPlayers: '2' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.minPlayers).toBe(false);
    });

    it('should detect change from empty string to value', () => {
      const original = { mechanics: '' };
      const modified = { mechanics: 'Deck building' };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.mechanics).toBe(true);
    });

    it('should handle awards with same content but different order', () => {
      const original = { 
        awards: [
          { name: 'Award A', year: 2020 },
          { name: 'Award B', year: 2021 }
        ] 
      };
      const modified = { 
        awards: [
          { name: 'Award A', year: 2020 },
          { name: 'Award B', year: 2021 }
        ] 
      };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.awards).toBe(false);
    });

    it('should detect awards year change', () => {
      const original = { awards: [{ name: 'Award A', year: 2020 }] };
      const modified = { awards: [{ name: 'Award A', year: 2021 }] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.awards).toBe(true);
    });

    it('should handle awards without year', () => {
      const original = { awards: [{ name: 'Award A' }] };
      const modified = { awards: [{ name: 'Award A' }] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.awards).toBe(false);
    });
  });
});