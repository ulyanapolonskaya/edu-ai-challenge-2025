/**
 * Represents a ship in the Sea Battle game
 */
class Ship {
  constructor(length = 3) {
    this.length = length;
    this.locations = [];
    this.hits = new Array(length).fill(false);
  }

  /**
   * Place the ship at specified locations
   * @param {string[]} locations - Array of location strings (e.g., ['00', '01', '02'])
   */
  place(locations) {
    if (locations.length !== this.length) {
      throw new Error(`Ship requires exactly ${this.length} locations`);
    }
    this.locations = [...locations];
  }

  /**
   * Hit the ship at a specific location
   * @param {string} location - Location string (e.g., '00')
   * @returns {boolean} - True if hit, false if location not part of ship
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index === -1) {
      return false;
    }
    this.hits[index] = true;
    return true;
  }

  /**
   * Check if the ship is sunk
   * @returns {boolean} - True if all parts are hit
   */
  isSunk() {
    return this.hits.every((hit) => hit);
  }

  /**
   * Check if location is already hit
   * @param {string} location - Location string
   * @returns {boolean} - True if already hit
   */
  isHitAt(location) {
    const index = this.locations.indexOf(location);
    return index !== -1 && this.hits[index];
  }

  /**
   * Get all ship locations
   * @returns {string[]} - Array of location strings
   */
  getLocations() {
    return [...this.locations];
  }
}

module.exports = { Ship };
