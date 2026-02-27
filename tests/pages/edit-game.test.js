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
      mechanics: JSON.stringify((formData.mechanics || []).sort()) !== JSON.stringify((originalFormData.mechanics || []).sort()),
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
        mechanics: ['Deck building', 'Draft'],
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

    it('should detect mechanics change (added mechanic)', () => {
      const original = { mechanics: ['Deck building', 'Draft'] };
      const modified = { mechanics: ['Deck building', 'Draft', 'Bluff'] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.mechanics).toBe(true);
    });

    it('should detect mechanics change (removed mechanic)', () => {
      const original = { mechanics: ['Deck building', 'Draft'] };
      const modified = { mechanics: ['Deck building'] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.mechanics).toBe(true);
    });

    it('should not detect mechanics change for same values different order', () => {
      const original = { mechanics: ['Deck building', 'Draft'] };
      const modified = { mechanics: ['Draft', 'Deck building'] };
      
      const result = computeFieldChanges(modified, original);
      
      expect(result.mechanics).toBe(false);
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
        mechanics: ['Deck building'],
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
        mechanics: ['Deck building'], // unchanged
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

    it('should detect change from empty array to array with values', () => {
      const original = { mechanics: [] };
      const modified = { mechanics: ['Deck building'] };
      
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

// Tests for player count validation
describe('Edit Game Page - Player Count Validation', () => {
  // Simulating the playerErrors logic from the component
  function computePlayerErrors(minPlayersStr, maxPlayersStr) {
    const errors = {};
    const minPlayers = parseInt(minPlayersStr);
    const maxPlayers = parseInt(maxPlayersStr);
    
    // Validate minPlayers
    if (minPlayersStr !== '') {
      if (isNaN(minPlayers) || minPlayers < 1) {
        errors.minPlayers = 'Le minimum doit être au moins 1';
      }
    }
    
    // Validate maxPlayers
    if (maxPlayersStr !== '') {
      if (isNaN(maxPlayers) || maxPlayers < 1) {
        errors.maxPlayers = 'Le maximum doit être au moins 1';
      }
    }
    
    // Validate max >= min (only if both are valid numbers)
    if (!errors.minPlayers && !errors.maxPlayers && 
        minPlayersStr !== '' && maxPlayersStr !== '' &&
        maxPlayers < minPlayers) {
      errors.maxPlayers = 'Le maximum doit être supérieur ou égal au minimum';
    }
    
    return errors;
  }

  describe('computePlayerErrors', () => {
    describe('minPlayers validation', () => {
      it('should return no error for valid minPlayers', () => {
        const errors = computePlayerErrors('1', '');
        expect(errors.minPlayers).toBeUndefined();
      });

      it('should return error for minPlayers = 0', () => {
        const errors = computePlayerErrors('0', '');
        expect(errors.minPlayers).toBe('Le minimum doit être au moins 1');
      });

      it('should return error for negative minPlayers', () => {
        const errors = computePlayerErrors('-5', '');
        expect(errors.minPlayers).toBe('Le minimum doit être au moins 1');
      });

      it('should return error for minPlayers = -1', () => {
        const errors = computePlayerErrors('-1', '');
        expect(errors.minPlayers).toBe('Le minimum doit être au moins 1');
      });

      it('should return no error for empty string', () => {
        const errors = computePlayerErrors('', '');
        expect(errors.minPlayers).toBeUndefined();
      });
    });

    describe('maxPlayers validation', () => {
      it('should return no error for valid maxPlayers', () => {
        const errors = computePlayerErrors('', '6');
        expect(errors.maxPlayers).toBeUndefined();
      });

      it('should return error for maxPlayers = 0', () => {
        const errors = computePlayerErrors('', '0');
        expect(errors.maxPlayers).toBe('Le maximum doit être au moins 1');
      });

      it('should return error for negative maxPlayers', () => {
        const errors = computePlayerErrors('', '-3');
        expect(errors.maxPlayers).toBe('Le maximum doit être au moins 1');
      });

      it('should return error for maxPlayers = -1', () => {
        const errors = computePlayerErrors('', '-1');
        expect(errors.maxPlayers).toBe('Le maximum doit être au moins 1');
      });
    });

    describe('max >= min validation', () => {
      it('should return no error when max > min', () => {
        const errors = computePlayerErrors('2', '4');
        expect(errors.maxPlayers).toBeUndefined();
      });

      it('should return no error when max = min', () => {
        const errors = computePlayerErrors('2', '2');
        expect(errors.maxPlayers).toBeUndefined();
      });

      it('should return error when max < min', () => {
        const errors = computePlayerErrors('4', '2');
        expect(errors.maxPlayers).toBe('Le maximum doit être supérieur ou égal au minimum');
      });

      it('should return error when max < min with larger values', () => {
        const errors = computePlayerErrors('10', '5');
        expect(errors.maxPlayers).toBe('Le maximum doit être supérieur ou égal au minimum');
      });
    });

    describe('combined validations', () => {
      it('should return both errors for negative values', () => {
        const errors = computePlayerErrors('-1', '-2');
        expect(errors.minPlayers).toBe('Le minimum doit être au moins 1');
        expect(errors.maxPlayers).toBe('Le maximum doit être au moins 1');
      });

      it('should return only minPlayers error when min is negative and max is valid', () => {
        const errors = computePlayerErrors('-1', '4');
        expect(errors.minPlayers).toBe('Le minimum doit être au moins 1');
        expect(errors.maxPlayers).toBeUndefined();
      });

      it('should return only maxPlayers error when max is negative and min is valid', () => {
        const errors = computePlayerErrors('2', '-1');
        expect(errors.minPlayers).toBeUndefined();
        expect(errors.maxPlayers).toBe('Le maximum doit être au moins 1');
      });

      it('should return no errors for valid player counts', () => {
        const errors = computePlayerErrors('2', '6');
        expect(Object.keys(errors)).toHaveLength(0);
      });

      it('should return no errors for single player game', () => {
        const errors = computePlayerErrors('1', '1');
        expect(Object.keys(errors)).toHaveLength(0);
      });
    });
  });
});

// Tests for Award dropdown functionality
describe('Edit Game Page - Award Dropdown', () => {
  // Simulating the AwardList component logic
  function processAwardAdd(selectedAward, customAwardName, showCustomInput, awardYear) {
    const awardName = showCustomInput ? customAwardName.trim() : selectedAward;
    if (!awardName) return null;
    
    const award = { name: awardName };
    if (awardYear) {
      award.year = parseInt(awardYear);
    }
    return award;
  }

  // Predefined award options
  const AWARD_OPTIONS = [
    { value: 'Spiel des Jahres', label: 'Spiel des Jahres' },
    { value: 'Kennerspiel des Jahres', label: 'Kennerspiel des Jahres' },
    { value: 'As d\'Or', label: 'As d\'Or' },
    { value: 'Other', label: 'Autre (préciser)' },
  ];

  describe('processAwardAdd', () => {
    describe('predefined awards', () => {
      it('should create award from predefined selection', () => {
        const award = processAwardAdd('Spiel des Jahres', '', false, '2020');
        
        expect(award).toEqual({
          name: 'Spiel des Jahres',
          year: 2020
        });
      });

      it('should create award without year', () => {
        const award = processAwardAdd('Kennerspiel des Jahres', '', false, '');
        
        expect(award).toEqual({
          name: 'Kennerspiel des Jahres'
        });
      });

      it('should create award from As d\'Or', () => {
        const award = processAwardAdd('As d\'Or', '', false, '2023');
        
        expect(award).toEqual({
          name: 'As d\'Or',
          year: 2023
        });
      });
    });

    describe('custom awards (Other)', () => {
      it('should create custom award when Other is selected', () => {
        const award = processAwardAdd('Other', 'Prix du Public', true, '2021');
        
        expect(award).toEqual({
          name: 'Prix du Public',
          year: 2021
        });
      });

      it('should create custom award without year', () => {
        const award = processAwardAdd('Other', 'Local Award', true, '');
        
        expect(award).toEqual({
          name: 'Local Award'
        });
      });

      it('should trim custom award name', () => {
        const award = processAwardAdd('Other', '  Spaced Award  ', true, '');
        
        expect(award).toEqual({
          name: 'Spaced Award'
        });
      });

      it('should return null for empty custom award name', () => {
        const award = processAwardAdd('Other', '', true, '2020');
        
        expect(award).toBeNull();
      });

      it('should return null for whitespace-only custom award name', () => {
        const award = processAwardAdd('Other', '   ', true, '2020');
        
        expect(award).toBeNull();
      });
    });

    describe('validation', () => {
      it('should return null when no award selected', () => {
        const award = processAwardAdd('', '', false, '2020');
        
        expect(award).toBeNull();
      });

      it('should parse year as integer', () => {
        const award = processAwardAdd('Spiel des Jahres', '', false, '2020');
        
        expect(award.year).toBe(2020);
        expect(typeof award.year).toBe('number');
      });

      it('should handle year as empty string', () => {
        const award = processAwardAdd('Spiel des Jahres', '', false, '');
        
        expect(award.year).toBeUndefined();
      });
    });

    describe('award options list', () => {
      it('should contain common board game awards', () => {
        const awardValues = AWARD_OPTIONS.map(o => o.value);
        
        expect(awardValues).toContain('Spiel des Jahres');
        expect(awardValues).toContain('Kennerspiel des Jahres');
        expect(awardValues).toContain('As d\'Or');
      });

      it('should contain Other option for custom awards', () => {
        const otherOption = AWARD_OPTIONS.find(o => o.value === 'Other');
        
        expect(otherOption).toBeDefined();
        expect(otherOption.label).toBe('Autre (préciser)');
      });
    });
  });
});

// Tests for Mechanics select functionality
describe('Edit Game Page - Mechanics Select', () => {
  // Simulating the MechanicsSelect component logic
  function processMechanicsToggle(selectedValues, value) {
    if (selectedValues.includes(value)) {
      return selectedValues.filter(v => v !== value);
    } else {
      return [...selectedValues, value];
    }
  }

  function processCustomMechanicAdd(selectedValues, customMechanic) {
    const trimmed = customMechanic.trim();
    if (trimmed && !selectedValues.includes(trimmed)) {
      return [...selectedValues, trimmed];
    }
    return selectedValues;
  }

  // Predefined mechanics options
  const MECHANICS_OPTIONS = [
    { value: 'Deck building', label: 'Deck building' },
    { value: 'Placement d\'ouvriers', label: 'Placement d\'ouvriers' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Bluff', label: 'Bluff' },
    { value: 'Other', label: 'Autre (préciser)' },
  ];

  describe('processMechanicsToggle', () => {
    describe('selecting mechanics', () => {
      it('should add mechanic when not already selected', () => {
        const result = processMechanicsToggle(['Deck building'], 'Draft');
        
        expect(result).toEqual(['Deck building', 'Draft']);
      });

      it('should add multiple mechanics', () => {
        let result = processMechanicsToggle([], 'Deck building');
        result = processMechanicsToggle(result, 'Draft');
        result = processMechanicsToggle(result, 'Bluff');
        
        expect(result).toEqual(['Deck building', 'Draft', 'Bluff']);
      });
    });

    describe('deselecting mechanics', () => {
      it('should remove mechanic when already selected', () => {
        const result = processMechanicsToggle(['Deck building', 'Draft'], 'Draft');
        
        expect(result).toEqual(['Deck building']);
      });

      it('should remove all mechanics', () => {
        let result = processMechanicsToggle(['Deck building'], 'Deck building');
        
        expect(result).toEqual([]);
      });
    });
  });

  describe('processCustomMechanicAdd', () => {
    describe('adding custom mechanics', () => {
      it('should add custom mechanic to empty list', () => {
        const result = processCustomMechanicAdd([], 'Tile placement');
        
        expect(result).toEqual(['Tile placement']);
      });

      it('should add custom mechanic to existing list', () => {
        const result = processCustomMechanicAdd(['Deck building'], 'Tile placement');
        
        expect(result).toEqual(['Deck building', 'Tile placement']);
      });

      it('should trim custom mechanic name', () => {
        const result = processCustomMechanicAdd([], '  Spaced Mechanic  ');
        
        expect(result).toEqual(['Spaced Mechanic']);
      });
    });

    describe('validation', () => {
      it('should not add empty custom mechanic', () => {
        const result = processCustomMechanicAdd(['Deck building'], '');
        
        expect(result).toEqual(['Deck building']);
      });

      it('should not add whitespace-only custom mechanic', () => {
        const result = processCustomMechanicAdd(['Deck building'], '   ');
        
        expect(result).toEqual(['Deck building']);
      });

      it('should not add duplicate mechanic', () => {
        const result = processCustomMechanicAdd(['Deck building'], 'Deck building');
        
        expect(result).toEqual(['Deck building']);
      });

      it('should not add duplicate with different case (case sensitive)', () => {
        const result = processCustomMechanicAdd(['Deck building'], 'DECK BUILDING');
        
        // Case sensitive - should add as different
        expect(result).toEqual(['Deck building', 'DECK BUILDING']);
      });
    });
  });

  describe('mechanics options list', () => {
    it('should contain common board game mechanics', () => {
      const mechanicsValues = MECHANICS_OPTIONS.map(o => o.value);
      
      expect(mechanicsValues).toContain('Deck building');
      expect(mechanicsValues).toContain('Placement d\'ouvriers');
      expect(mechanicsValues).toContain('Draft');
      expect(mechanicsValues).toContain('Bluff');
    });

    it('should contain Other option for custom mechanics', () => {
      const otherOption = MECHANICS_OPTIONS.find(o => o.value === 'Other');
      
      expect(otherOption).toBeDefined();
      expect(otherOption.label).toBe('Autre (préciser)');
    });
  });
});
