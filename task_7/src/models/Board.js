/**
 * Represents a game board in the Sea Battle game
 */
class Board {
  static CELL_WATER = '~';
  static CELL_SHIP = 'S';
  static CELL_HIT = 'X';
  static CELL_MISS = 'O';

  constructor(size = 10) {
    this.size = size;
    this.grid = this.createGrid();
    this.guesses = new Set();
  }

  /**
   * Create an empty grid filled with water
   * @returns {string[][]} - 2D array representing the board
   */
  createGrid() {
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(Board.CELL_WATER));
  }

  /**
   * Check if coordinates are valid
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} - True if coordinates are valid
   */
  isValidCoordinate(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Convert location string to coordinates
   * @param {string} location - Location string (e.g., '34')
   * @returns {{row: number, col: number}} - Coordinate object
   */
  parseLocation(location) {
    if (typeof location !== 'string' || location.length !== 2) {
      throw new Error('Location must be a 2-character string');
    }

    const row = parseInt(location[0]);
    const col = parseInt(location[1]);

    if (isNaN(row) || isNaN(col) || !this.isValidCoordinate(row, col)) {
      throw new Error('Invalid location coordinates');
    }

    return { row, col };
  }

  /**
   * Place a ship on the board
   * @param {string[]} locations - Array of location strings
   * @param {boolean} showShips - Whether to show ships on the board
   */
  placeShip(locations, showShips = true) {
    for (const location of locations) {
      const { row, col } = this.parseLocation(location);
      if (this.grid[row][col] !== Board.CELL_WATER) {
        throw new Error(`Location ${location} is already occupied`);
      }
      if (showShips) {
        this.grid[row][col] = Board.CELL_SHIP;
      }
    }
  }

  /**
   * Make a guess on the board
   * @param {string} location - Location string
   * @returns {boolean} - True if hit, false if miss
   */
  makeGuess(location) {
    if (this.guesses.has(location)) {
      throw new Error('Location already guessed');
    }

    this.guesses.add(location);
    const { row, col } = this.parseLocation(location);

    // This method only handles the visual representation
    // The actual hit/miss logic is handled by the ships
    return false; // Will be overridden by game logic
  }

  /**
   * Mark a location as hit
   * @param {string} location - Location string
   */
  markHit(location) {
    const { row, col } = this.parseLocation(location);
    this.grid[row][col] = Board.CELL_HIT;
  }

  /**
   * Mark a location as miss
   * @param {string} location - Location string
   */
  markMiss(location) {
    const { row, col } = this.parseLocation(location);
    this.grid[row][col] = Board.CELL_MISS;
  }

  /**
   * Check if a location has been guessed
   * @param {string} location - Location string
   * @returns {boolean} - True if already guessed
   */
  hasBeenGuessed(location) {
    return this.guesses.has(location);
  }

  /**
   * Get the current state of the board
   * @returns {string[][]} - Copy of the current grid
   */
  getGrid() {
    return this.grid.map((row) => [...row]);
  }

  /**
   * Get all guesses made on this board
   * @returns {string[]} - Array of guessed locations
   */
  getGuesses() {
    return Array.from(this.guesses);
  }

  /**
   * Clear the board
   */
  clear() {
    this.grid = this.createGrid();
    this.guesses.clear();
  }
}

module.exports = { Board };
