const { Player } = require('./Player.js');
const { ShipPlacer } = require('../utils/ShipPlacer.js');

/**
 * AI-powered CPU player with hunt and target modes
 */
class CPUPlayer extends Player {
  constructor(name = 'CPU', boardSize = 10) {
    super(name, boardSize);
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = [];
    this.hitLocations = [];
  }

  /**
   * Make an intelligent guess
   * @returns {string} - Location to guess
   */
  makeIntelligentGuess() {
    let location;

    if (this.mode === 'target' && this.targetQueue.length > 0) {
      // Target mode: continue attacking around known hits
      location = this.targetQueue.shift();

      // Validate the location hasn't been guessed
      while (location && this.opponentBoard.hasBeenGuessed(location)) {
        location = this.targetQueue.shift();
      }

      // If no valid targets, switch to hunt mode
      if (!location) {
        this.mode = 'hunt';
        return this.makeIntelligentGuess();
      }
    } else {
      // Hunt mode: make random guesses
      this.mode = 'hunt';
      location = this.generateRandomGuess();
    }

    return location;
  }

  /**
   * Generate a random guess that hasn't been made yet
   * @returns {string} - Random location
   */
  generateRandomGuess() {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const row = Math.floor(Math.random() * this.boardSize);
      const col = Math.floor(Math.random() * this.boardSize);
      const location = `${row}${col}`;

      if (!this.opponentBoard.hasBeenGuessed(location)) {
        return location;
      }
      attempts++;
    }

    // Fallback: find first unguessed location
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const location = `${row}${col}`;
        if (!this.opponentBoard.hasBeenGuessed(location)) {
          return location;
        }
      }
    }

    throw new Error('No valid moves remaining');
  }

  /**
   * Process the result of a guess and update AI state
   * @param {string} location - Location that was guessed
   * @param {boolean} hit - Whether it was a hit
   * @param {boolean} sunk - Whether a ship was sunk
   */
  processGuessResult(location, hit, sunk) {
    this.updateOpponentBoard(location, hit);

    if (hit) {
      this.hitLocations.push(location);

      if (sunk) {
        // Ship was sunk, clear targets and return to hunt mode
        this.mode = 'hunt';
        this.targetQueue = [];
        // Remove sunk ship hits from hit locations
        this.hitLocations = this.hitLocations.filter(
          (loc) => !this.isPartOfSunkenShip(loc)
        );
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = 'target';
        this.addAdjacentTargets(location);
      }
    } else if (this.targetQueue.length === 0) {
      // Miss and no more targets, return to hunt mode
      this.mode = 'hunt';
    }
  }

  /**
   * Add adjacent locations to target queue
   * @param {string} location - Center location
   */
  addAdjacentTargets(location) {
    const adjacentLocations = ShipPlacer.getAdjacentLocations(
      location,
      this.boardSize
    );

    for (const adjLocation of adjacentLocations) {
      if (
        !this.opponentBoard.hasBeenGuessed(adjLocation) &&
        !this.targetQueue.includes(adjLocation)
      ) {
        this.targetQueue.push(adjLocation);
      }
    }
  }

  /**
   * Check if a location is part of a sunken ship
   * @param {string} location - Location to check
   * @returns {boolean} - True if part of sunken ship
   */
  isPartOfSunkenShip(location) {
    // This is a simplified check - in a real implementation,
    // we'd need to track which ships are sunk more precisely
    const grid = this.opponentBoard.getGrid();
    const { row, col } = this.opponentBoard.parseLocation(location);
    return grid[row][col] === 'X';
  }

  /**
   * Get current AI mode
   * @returns {string} - Current mode ('hunt' or 'target')
   */
  getMode() {
    return this.mode;
  }

  /**
   * Get current target queue
   * @returns {string[]} - Array of target locations
   */
  getTargetQueue() {
    return [...this.targetQueue];
  }

  /**
   * Reset AI state
   */
  reset() {
    this.mode = 'hunt';
    this.targetQueue = [];
    this.hitLocations = [];
  }
}

module.exports = { CPUPlayer };
