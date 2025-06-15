const { Ship } = require('../models/Ship.js');
const { Board } = require('../models/Board.js');
const { ShipPlacer } = require('../utils/ShipPlacer.js');

/**
 * Represents a player in the Sea Battle game
 */
class Player {
  constructor(name = 'Player', boardSize = 10) {
    this.name = name;
    this.boardSize = boardSize;
    this.board = new Board(boardSize);
    this.ships = [];
    this.opponentBoard = new Board(boardSize);
  }

  /**
   * Place ships randomly on the player's board
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   * @param {boolean} showShips - Whether to show ships on the board
   */
  placeShipsRandomly(numShips, shipLength, showShips = true) {
    const placements = ShipPlacer.generateRandomPlacements(
      this.boardSize,
      numShips,
      shipLength
    );

    this.ships = [];
    this.board.clear();

    for (const locations of placements) {
      const ship = new Ship(shipLength);
      ship.place(locations);
      this.ships.push(ship);
      this.board.placeShip(locations, showShips);
    }
  }

  /**
   * Make a guess on the opponent's board
   * @param {string} location - Location to guess
   * @returns {{hit: boolean, sunk: boolean, alreadyGuessed: boolean}} - Result of the guess
   */
  makeGuess(location) {
    if (this.opponentBoard.hasBeenGuessed(location)) {
      return { hit: false, sunk: false, alreadyGuessed: true };
    }

    this.opponentBoard.makeGuess(location);
    return { hit: false, sunk: false, alreadyGuessed: false };
  }

  /**
   * Receive a guess from opponent
   * @param {string} location - Location being guessed
   * @returns {{hit: boolean, sunk: boolean, shipSunk?: Ship}} - Result of the guess
   */
  receiveGuess(location) {
    let hit = false;
    let sunk = false;
    let shipSunk = null;

    for (const ship of this.ships) {
      if (ship.hit(location)) {
        hit = true;
        this.board.markHit(location);

        if (ship.isSunk()) {
          sunk = true;
          shipSunk = ship;
        }
        break;
      }
    }

    if (!hit) {
      this.board.markMiss(location);
    }

    return { hit, sunk, shipSunk };
  }

  /**
   * Update opponent board with guess result
   * @param {string} location - Location that was guessed
   * @param {boolean} hit - Whether it was a hit
   */
  updateOpponentBoard(location, hit) {
    if (hit) {
      this.opponentBoard.markHit(location);
    } else {
      this.opponentBoard.markMiss(location);
    }
  }

  /**
   * Check if all ships are sunk
   * @returns {boolean} - True if all ships are sunk
   */
  hasLost() {
    return this.ships.every((ship) => ship.isSunk());
  }

  /**
   * Get remaining ships count
   * @returns {number} - Number of ships still alive
   */
  getRemainingShipsCount() {
    return this.ships.filter((ship) => !ship.isSunk()).length;
  }

  /**
   * Get the player's board
   * @returns {Board} - The player's board
   */
  getBoard() {
    return this.board;
  }

  /**
   * Get the opponent's board (from player's perspective)
   * @returns {Board} - The opponent's board
   */
  getOpponentBoard() {
    return this.opponentBoard;
  }

  /**
   * Get all ships
   * @returns {Ship[]} - Array of ships
   */
  getShips() {
    return [...this.ships];
  }
}

module.exports = { Player };
