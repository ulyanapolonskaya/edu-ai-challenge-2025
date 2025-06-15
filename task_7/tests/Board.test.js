const { Board } = require('../src/models/Board.js');

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(5);
  });

  describe('constructor', () => {
    it('should create a board with default size 10', () => {
      const defaultBoard = new Board();
      expect(defaultBoard.size).toBe(10);
      expect(defaultBoard.grid).toHaveLength(10);
      expect(defaultBoard.grid[0]).toHaveLength(10);
    });

    it('should create a board with specified size', () => {
      expect(board.size).toBe(5);
      expect(board.grid).toHaveLength(5);
      expect(board.grid[0]).toHaveLength(5);
    });

    it('should initialize grid with water symbols', () => {
      expect(board.grid[0][0]).toBe(Board.CELL_WATER);
      expect(board.grid[2][3]).toBe(Board.CELL_WATER);
      expect(board.grid[4][4]).toBe(Board.CELL_WATER);
    });
  });

  describe('isValidCoordinate', () => {
    it('should return true for valid coordinates', () => {
      expect(board.isValidCoordinate(0, 0)).toBe(true);
      expect(board.isValidCoordinate(2, 3)).toBe(true);
      expect(board.isValidCoordinate(4, 4)).toBe(true);
    });

    it('should return false for invalid coordinates', () => {
      expect(board.isValidCoordinate(-1, 0)).toBe(false);
      expect(board.isValidCoordinate(0, -1)).toBe(false);
      expect(board.isValidCoordinate(5, 0)).toBe(false);
      expect(board.isValidCoordinate(0, 5)).toBe(false);
    });
  });

  describe('parseLocation', () => {
    it('should parse valid location strings', () => {
      expect(board.parseLocation('00')).toEqual({ row: 0, col: 0 });
      expect(board.parseLocation('23')).toEqual({ row: 2, col: 3 });
      expect(board.parseLocation('44')).toEqual({ row: 4, col: 4 });
    });

    it('should throw error for invalid location format', () => {
      expect(() => board.parseLocation('0')).toThrow(
        'Location must be a 2-character string'
      );
      expect(() => board.parseLocation('000')).toThrow(
        'Location must be a 2-character string'
      );
      expect(() => board.parseLocation(null)).toThrow(
        'Location must be a 2-character string'
      );
    });

    it('should throw error for invalid coordinates', () => {
      expect(() => board.parseLocation('55')).toThrow(
        'Invalid location coordinates'
      );
      expect(() => board.parseLocation('ab')).toThrow(
        'Invalid location coordinates'
      );
    });
  });

  describe('placeShip', () => {
    it('should place ship on the board', () => {
      const locations = ['00', '01', '02'];
      board.placeShip(locations, true);
      expect(board.grid[0][0]).toBe(Board.CELL_SHIP);
      expect(board.grid[0][1]).toBe(Board.CELL_SHIP);
      expect(board.grid[0][2]).toBe(Board.CELL_SHIP);
    });

    it('should not show ship if showShips is false', () => {
      const locations = ['00', '01', '02'];
      board.placeShip(locations, false);
      expect(board.grid[0][0]).toBe(Board.CELL_WATER);
      expect(board.grid[0][1]).toBe(Board.CELL_WATER);
      expect(board.grid[0][2]).toBe(Board.CELL_WATER);
    });

    it('should throw error if location is already occupied', () => {
      board.placeShip(['00', '01'], true);
      expect(() => board.placeShip(['00', '10'], true)).toThrow(
        'Location 00 is already occupied'
      );
    });
  });

  describe('markHit and markMiss', () => {
    it('should mark location as hit', () => {
      board.markHit('23');
      expect(board.grid[2][3]).toBe(Board.CELL_HIT);
    });

    it('should mark location as miss', () => {
      board.markMiss('23');
      expect(board.grid[2][3]).toBe(Board.CELL_MISS);
    });
  });

  describe('hasBeenGuessed', () => {
    it('should return false for unguessed location', () => {
      expect(board.hasBeenGuessed('23')).toBe(false);
    });

    it('should return true for guessed location', () => {
      board.makeGuess('23');
      expect(board.hasBeenGuessed('23')).toBe(true);
    });
  });

  describe('makeGuess', () => {
    it('should add location to guesses', () => {
      board.makeGuess('23');
      expect(board.hasBeenGuessed('23')).toBe(true);
      expect(board.getGuesses()).toContain('23');
    });

    it('should throw error if location already guessed', () => {
      board.makeGuess('23');
      expect(() => board.makeGuess('23')).toThrow('Location already guessed');
    });
  });

  describe('getGrid', () => {
    it('should return copy of grid', () => {
      const grid = board.getGrid();
      expect(grid).toEqual(board.grid);
      expect(grid).not.toBe(board.grid);
    });
  });

  describe('clear', () => {
    it('should reset board to initial state', () => {
      board.placeShip(['00', '01'], true);
      board.makeGuess('23');
      board.clear();

      expect(board.grid[0][0]).toBe(Board.CELL_WATER);
      expect(board.grid[0][1]).toBe(Board.CELL_WATER);
      expect(board.hasBeenGuessed('23')).toBe(false);
    });
  });
});
