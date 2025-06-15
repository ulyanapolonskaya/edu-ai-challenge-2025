const { Player } = require('../players/Player.js');
const { CPUPlayer } = require('../players/CPUPlayer.js');

/**
 * Main game engine for Sea Battle
 */
class GameEngine {
  constructor(config = {}) {
    this.boardSize = config.boardSize || 10;
    this.numShips = config.numShips || 3;
    this.shipLength = config.shipLength || 3;

    this.player = new Player('Player', this.boardSize);
    this.cpu = new CPUPlayer('CPU', this.boardSize);

    this.gameState = 'setup'; // 'setup', 'playing', 'finished'
    this.winner = null;
    this.currentTurn = 'player'; // 'player' or 'cpu'
  }

  /**
   * Initialize the game
   */
  async initializeGame() {
    try {
      // Place ships for both players
      this.player.placeShipsRandomly(this.numShips, this.shipLength, true);
      this.cpu.placeShipsRandomly(this.numShips, this.shipLength, false);

      this.gameState = 'playing';
      this.currentTurn = 'player';

      return {
        success: true,
        message: `Game initialized! ${this.numShips} ships placed for both players.`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to initialize game: ${error.message}`,
      };
    }
  }

  /**
   * Process player's guess
   * @param {string} location - Location to guess (e.g., '34')
   * @returns {Object} - Result of the guess
   */
  processPlayerGuess(location) {
    if (this.gameState !== 'playing') {
      return {
        success: false,
        message: 'Game is not in playing state',
      };
    }

    if (this.currentTurn !== 'player') {
      return {
        success: false,
        message: "Not player's turn",
      };
    }

    try {
      // Validate location format
      if (!this.isValidLocationFormat(location)) {
        return {
          success: false,
          message: 'Invalid location format. Use two digits (e.g., 00, 34, 98)',
        };
      }

      // Check if already guessed
      if (this.player.getOpponentBoard().hasBeenGuessed(location)) {
        return {
          success: false,
          message: 'You already guessed that location!',
        };
      }

      // Process the guess against CPU
      const result = this.cpu.receiveGuess(location);
      this.player.updateOpponentBoard(location, result.hit);

      let message = result.hit ? 'PLAYER HIT!' : 'PLAYER MISS.';
      if (result.sunk) {
        message += ' You sunk an enemy battleship!';
      }

      // Check for win condition
      if (this.cpu.hasLost()) {
        this.gameState = 'finished';
        this.winner = 'player';
        message += ' *** CONGRATULATIONS! You sunk all enemy battleships! ***';
      } else {
        this.currentTurn = 'cpu';
      }

      return {
        success: true,
        message,
        hit: result.hit,
        sunk: result.sunk,
        gameOver: this.gameState === 'finished',
        winner: this.winner,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Process CPU's turn
   * @returns {Object} - Result of CPU's guess
   */
  processCPUTurn() {
    if (this.gameState !== 'playing') {
      return {
        success: false,
        message: 'Game is not in playing state',
      };
    }

    if (this.currentTurn !== 'cpu') {
      return {
        success: false,
        message: "Not CPU's turn",
      };
    }

    try {
      const location = this.cpu.makeIntelligentGuess();
      const result = this.player.receiveGuess(location);

      // Update CPU's knowledge
      this.cpu.processGuessResult(location, result.hit, result.sunk);

      let message = `CPU ${result.hit ? 'HIT' : 'MISS'} at ${location}`;
      if (result.sunk) {
        message += ' - CPU sunk your battleship!';
      }

      // Check for win condition
      if (this.player.hasLost()) {
        this.gameState = 'finished';
        this.winner = 'cpu';
        message += ' *** GAME OVER! The CPU sunk all your battleships! ***';
      } else {
        this.currentTurn = 'player';
      }

      return {
        success: true,
        message,
        location,
        hit: result.hit,
        sunk: result.sunk,
        cpuMode: this.cpu.getMode(),
        gameOver: this.gameState === 'finished',
        winner: this.winner,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Validate location format
   * @param {string} location - Location string to validate
   * @returns {boolean} - True if valid format
   */
  isValidLocationFormat(location) {
    if (typeof location !== 'string' || location.length !== 2) {
      return false;
    }

    const row = parseInt(location[0]);
    const col = parseInt(location[1]);

    return (
      !isNaN(row) &&
      !isNaN(col) &&
      row >= 0 &&
      row < this.boardSize &&
      col >= 0 &&
      col < this.boardSize
    );
  }

  /**
   * Get current game state
   * @returns {Object} - Current game state information
   */
  getGameState() {
    return {
      state: this.gameState,
      currentTurn: this.currentTurn,
      winner: this.winner,
      playerShipsRemaining: this.player.getRemainingShipsCount(),
      cpuShipsRemaining: this.cpu.getRemainingShipsCount(),
      playerBoard: this.player.getBoard().getGrid(),
      opponentBoard: this.player.getOpponentBoard().getGrid(),
      cpuMode: this.cpu.getMode(),
    };
  }

  /**
   * Reset the game
   */
  resetGame() {
    this.player = new Player('Player', this.boardSize);
    this.cpu = new CPUPlayer('CPU', this.boardSize);
    this.gameState = 'setup';
    this.winner = null;
    this.currentTurn = 'player';
  }

  /**
   * Get game configuration
   * @returns {Object} - Game configuration
   */
  getConfig() {
    return {
      boardSize: this.boardSize,
      numShips: this.numShips,
      shipLength: this.shipLength,
    };
  }
}

module.exports = { GameEngine };
