const { ShipPlacer } = require('../src/utils/ShipPlacer.js');

describe('ShipPlacer', () => {
  describe('generateRandomPlacements', () => {
    it('should generate correct number of ship placements', () => {
      const placements = ShipPlacer.generateRandomPlacements(10, 3, 3);
      expect(placements).toHaveLength(3);
      placements.forEach((placement) => {
        expect(placement).toHaveLength(3);
      });
    });

    it('should generate non-overlapping placements', () => {
      const placements = ShipPlacer.generateRandomPlacements(10, 3, 3);
      const allLocations = placements.flat();
      const uniqueLocations = new Set(allLocations);
      expect(uniqueLocations.size).toBe(allLocations.length);
    });

    it('should throw error if impossible to place all ships', () => {
      expect(() => ShipPlacer.generateRandomPlacements(3, 10, 3)).toThrow(
        'Unable to place all ships randomly'
      );
    });
  });

  describe('generateShipLocations', () => {
    it('should generate horizontal ship locations', () => {
      const locations = ShipPlacer.generateShipLocations(10, 3, 'horizontal');
      expect(locations).toHaveLength(3);

      if (locations) {
        const row = parseInt(locations[0][0]);
        for (let i = 0; i < locations.length; i++) {
          expect(parseInt(locations[i][0])).toBe(row);
          expect(parseInt(locations[i][1])).toBe(parseInt(locations[0][1]) + i);
        }
      }
    });

    it('should generate vertical ship locations', () => {
      const locations = ShipPlacer.generateShipLocations(10, 3, 'vertical');
      expect(locations).toHaveLength(3);

      if (locations) {
        const col = parseInt(locations[0][1]);
        for (let i = 0; i < locations.length; i++) {
          expect(parseInt(locations[i][1])).toBe(col);
          expect(parseInt(locations[i][0])).toBe(parseInt(locations[0][0]) + i);
        }
      }
    });

    it('should return null if ship extends beyond board', () => {
      // Mock Math.random to force invalid placement
      const originalRandom = Math.random;
      Math.random = () => 0.9; // This should cause placement near edge

      const locations = ShipPlacer.generateShipLocations(5, 10, 'horizontal');
      expect(locations).toBeNull();

      Math.random = originalRandom;
    });
  });

  describe('isPlacementValid', () => {
    it('should return true for non-overlapping locations', () => {
      const locations = ['00', '01', '02'];
      const occupied = new Set(['10', '11', '12']);
      expect(ShipPlacer.isPlacementValid(locations, occupied)).toBe(true);
    });

    it('should return false for overlapping locations', () => {
      const locations = ['00', '01', '02'];
      const occupied = new Set(['01', '11', '12']);
      expect(ShipPlacer.isPlacementValid(locations, occupied)).toBe(false);
    });
  });

  describe('getAdjacentLocations', () => {
    it('should return all adjacent locations for middle position', () => {
      const adjacent = ShipPlacer.getAdjacentLocations('22', 5);
      expect(adjacent).toHaveLength(4);
      expect(adjacent).toContain('12'); // Up
      expect(adjacent).toContain('32'); // Down
      expect(adjacent).toContain('21'); // Left
      expect(adjacent).toContain('23'); // Right
    });

    it('should return limited adjacent locations for corner position', () => {
      const adjacent = ShipPlacer.getAdjacentLocations('00', 5);
      expect(adjacent).toHaveLength(2);
      expect(adjacent).toContain('10'); // Down
      expect(adjacent).toContain('01'); // Right
    });

    it('should return limited adjacent locations for edge position', () => {
      const adjacent = ShipPlacer.getAdjacentLocations('04', 5);
      expect(adjacent).toHaveLength(2);
      expect(adjacent).toContain('14'); // Down
      expect(adjacent).toContain('03'); // Left
    });

    it('should handle single cell board', () => {
      const adjacent = ShipPlacer.getAdjacentLocations('00', 1);
      expect(adjacent).toHaveLength(0);
    });
  });
});
