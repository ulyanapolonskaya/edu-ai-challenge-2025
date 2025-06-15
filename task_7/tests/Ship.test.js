const { Ship } = require('../src/models/Ship.js');

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  describe('constructor', () => {
    it('should create a ship with default length 3', () => {
      const defaultShip = new Ship();
      expect(defaultShip.length).toBe(3);
      expect(defaultShip.locations).toEqual([]);
      expect(defaultShip.hits).toEqual([false, false, false]);
    });

    it('should create a ship with specified length', () => {
      const ship4 = new Ship(4);
      expect(ship4.length).toBe(4);
      expect(ship4.hits).toEqual([false, false, false, false]);
    });
  });

  describe('place', () => {
    it('should place ship at specified locations', () => {
      const locations = ['00', '01', '02'];
      ship.place(locations);
      expect(ship.locations).toEqual(locations);
    });

    it('should throw error if wrong number of locations provided', () => {
      expect(() => ship.place(['00', '01'])).toThrow(
        'Ship requires exactly 3 locations'
      );
      expect(() => ship.place(['00', '01', '02', '03'])).toThrow(
        'Ship requires exactly 3 locations'
      );
    });

    it('should create a copy of locations array', () => {
      const locations = ['00', '01', '02'];
      ship.place(locations);
      locations.push('03');
      expect(ship.locations).toEqual(['00', '01', '02']);
    });
  });

  describe('hit', () => {
    beforeEach(() => {
      ship.place(['00', '01', '02']);
    });

    it('should return true and mark hit for valid location', () => {
      expect(ship.hit('01')).toBe(true);
      expect(ship.hits[1]).toBe(true);
    });

    it('should return false for invalid location', () => {
      expect(ship.hit('99')).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    it('should allow multiple hits on same location', () => {
      ship.hit('00');
      expect(ship.hit('00')).toBe(true);
      expect(ship.hits[0]).toBe(true);
    });
  });

  describe('isSunk', () => {
    beforeEach(() => {
      ship.place(['00', '01', '02']);
    });

    it('should return false when ship is not fully hit', () => {
      expect(ship.isSunk()).toBe(false);
      ship.hit('00');
      expect(ship.isSunk()).toBe(false);
      ship.hit('01');
      expect(ship.isSunk()).toBe(false);
    });

    it('should return true when all parts are hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('isHitAt', () => {
    beforeEach(() => {
      ship.place(['00', '01', '02']);
    });

    it('should return false for unhit location', () => {
      expect(ship.isHitAt('00')).toBe(false);
    });

    it('should return true for hit location', () => {
      ship.hit('01');
      expect(ship.isHitAt('01')).toBe(true);
    });

    it('should return false for invalid location', () => {
      expect(ship.isHitAt('99')).toBe(false);
    });
  });

  describe('getLocations', () => {
    it('should return copy of locations array', () => {
      const locations = ['00', '01', '02'];
      ship.place(locations);
      const returnedLocations = ship.getLocations();
      expect(returnedLocations).toEqual(locations);
      expect(returnedLocations).not.toBe(ship.locations);
    });

    it('should return empty array for unplaced ship', () => {
      expect(ship.getLocations()).toEqual([]);
    });
  });
});
