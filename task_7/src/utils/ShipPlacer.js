/**
 * Utility class for placing ships on the board
 */
class ShipPlacer {
  /**
   * Generate random ship placements
   * @param {number} boardSize - Size of the board
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   * @returns {string[][]} - Array of ship locations
   */
  static generateRandomPlacements(boardSize, numShips, shipLength) {
    const placements = [];
    const occupiedLocations = new Set();

    let attempts = 0;
    const maxAttempts = 1000;

    while (placements.length < numShips && attempts < maxAttempts) {
      attempts++;

      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const locations = this.generateShipLocations(
        boardSize,
        shipLength,
        orientation
      );

      if (locations && this.isPlacementValid(locations, occupiedLocations)) {
        placements.push(locations);
        locations.forEach((location) => occupiedLocations.add(location));
      }
    }

    if (placements.length < numShips) {
      throw new Error(
        'Unable to place all ships randomly. Try reducing ship count or size.'
      );
    }

    return placements;
  }

  /**
   * Generate locations for a single ship
   * @param {number} boardSize - Size of the board
   * @param {number} shipLength - Length of the ship
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {string[]|null} - Array of location strings or null if invalid
   */
  static generateShipLocations(boardSize, shipLength, orientation) {
    let startRow, startCol;

    if (orientation === 'horizontal') {
      startRow = Math.floor(Math.random() * boardSize);
      startCol = Math.floor(Math.random() * (boardSize - shipLength + 1));
    } else {
      startRow = Math.floor(Math.random() * (boardSize - shipLength + 1));
      startCol = Math.floor(Math.random() * boardSize);
    }

    const locations = [];

    for (let i = 0; i < shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;

      if (row >= boardSize || col >= boardSize) {
        return null;
      }

      locations.push(`${row}${col}`);
    }

    return locations;
  }

  /**
   * Check if a ship placement is valid (no overlaps)
   * @param {string[]} locations - Ship locations to check
   * @param {Set<string>} occupiedLocations - Already occupied locations
   * @returns {boolean} - True if placement is valid
   */
  static isPlacementValid(locations, occupiedLocations) {
    return locations.every((location) => !occupiedLocations.has(location));
  }

  /**
   * Get adjacent locations for AI targeting
   * @param {string} location - Center location
   * @param {number} boardSize - Size of the board
   * @returns {string[]} - Array of adjacent location strings
   */
  static getAdjacentLocations(location, boardSize) {
    const row = parseInt(location[0]);
    const col = parseInt(location[1]);

    const adjacent = [
      { r: row - 1, c: col }, // Up
      { r: row + 1, c: col }, // Down
      { r: row, c: col - 1 }, // Left
      { r: row, c: col + 1 }, // Right
    ];

    return adjacent
      .filter(({ r, c }) => r >= 0 && r < boardSize && c >= 0 && c < boardSize)
      .map(({ r, c }) => `${r}${c}`);
  }
}

module.exports = { ShipPlacer };
