const { GameEngine } = require('./game/GameEngine.js');
const { ConsoleUI } = require('./ui/ConsoleUI.js');

/**
 * Main application class
 */
class SeaBattleApp {
  constructor() {
    this.gameEngine = new GameEngine();
    this.ui = new ConsoleUI();
  }

  /**
   * Start the game application
   */
  async start() {
    try {
      this.ui.clearScreen();
      this.ui.displayHelp();

      const initResult = await this.gameEngine.initializeGame();
      if (!initResult.success) {
        this.ui.displayError(initResult.message);
        return;
      }

      this.ui.displayMessage(initResult.message);
      this.ui.displayGameStart(this.gameEngine.getConfig().numShips);

      await this.gameLoop();
    } catch (error) {
      this.ui.displayError(`Application error: ${error.message}`);
    } finally {
      this.ui.close();
    }
  }

  /**
   * Main game loop
   */
  async gameLoop() {
    while (this.gameEngine.getGameState().state === 'playing') {
      const gameState = this.gameEngine.getGameState();

      // Display current state
      this.ui.displayBoards(gameState.playerBoard, gameState.opponentBoard);
      this.ui.displayGameStats(gameState);

      if (gameState.currentTurn === 'player') {
        await this.handlePlayerTurn();
      } else {
        await this.handleCPUTurn();
      }
    }

    // Game ended
    const finalState = this.gameEngine.getGameState();
    this.ui.displayBoards(finalState.playerBoard, finalState.opponentBoard);
    this.ui.displayGameEnd(finalState.winner);
  }

  /**
   * Handle player's turn
   */
  async handlePlayerTurn() {
    let validMove = false;

    while (!validMove) {
      try {
        const guess = await this.ui.promptUser('Enter your guess (e.g., 00): ');

        // Handle special commands
        if (guess.toLowerCase() === 'help') {
          this.ui.displayHelp();
          continue;
        }

        if (guess.toLowerCase() === 'quit' || guess.toLowerCase() === 'exit') {
          this.ui.displayMessage('Thanks for playing!');
          return;
        }

        const result = this.gameEngine.processPlayerGuess(guess);

        if (result.success) {
          this.ui.displayMessage(result.message);
          validMove = true;
        } else {
          this.ui.displayError(result.message);
        }
      } catch (error) {
        this.ui.displayError(`Input error: ${error.message}`);
      }
    }
  }

  /**
   * Handle CPU's turn
   */
  async handleCPUTurn() {
    // Add a small delay for better user experience
    await this.sleep(1000);

    const result = this.gameEngine.processCPUTurn();

    if (result.success) {
      this.ui.displayCPUTurn(result.location, result.cpuMode);
      this.ui.displayMessage(result.message);
    } else {
      this.ui.displayError(result.message);
    }
  }

  /**
   * Simple sleep utility
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} - Promise that resolves after the delay
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Start the application
const app = new SeaBattleApp();
app.start().catch(console.error);
