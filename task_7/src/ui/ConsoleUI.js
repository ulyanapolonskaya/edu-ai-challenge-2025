const readline = require('readline');

/**
 * Console-based user interface for the Sea Battle game
 */
class ConsoleUI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Display the game boards
   * @param {string[][]} playerBoard - Player's board grid
   * @param {string[][]} opponentBoard - Opponent's board grid (from player's view)
   */
  displayBoards(playerBoard, opponentBoard) {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');

    // Display column headers
    let header = '  ';
    for (let h = 0; h < playerBoard.length; h++) {
      header += h + ' ';
    }
    console.log(header + '     ' + header);

    // Display rows
    for (let i = 0; i < playerBoard.length; i++) {
      let rowStr = i + ' ';

      // Opponent board
      for (let j = 0; j < opponentBoard[i].length; j++) {
        rowStr += opponentBoard[i][j] + ' ';
      }
      rowStr += '    ' + i + ' ';

      // Player board
      for (let j = 0; j < playerBoard[i].length; j++) {
        rowStr += playerBoard[i][j] + ' ';
      }
      console.log(rowStr);
    }
    console.log('');
  }

  /**
   * Display a message to the console
   * @param {string} message - Message to display
   */
  displayMessage(message) {
    console.log(message);
  }

  /**
   * Display game initialization message
   * @param {number} numShips - Number of ships in the game
   */
  displayGameStart(numShips) {
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${numShips} enemy ships.`);
    console.log(
      'Enter coordinates as two digits (e.g., 00 for top-left, 99 for bottom-right)'
    );
  }

  /**
   * Display game statistics
   * @param {Object} gameState - Current game state
   */
  displayGameStats(gameState) {
    console.log(`\nPlayer ships remaining: ${gameState.playerShipsRemaining}`);
    console.log(`CPU ships remaining: ${gameState.cpuShipsRemaining}`);
    if (gameState.cpuMode) {
      console.log(`CPU mode: ${gameState.cpuMode}`);
    }
  }

  /**
   * Prompt user for input
   * @param {string} question - Question to ask the user
   * @returns {Promise<string>} - Promise that resolves with user input
   */
  promptUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Display victory message
   * @param {string} winner - Winner of the game ('player' or 'cpu')
   */
  displayGameEnd(winner) {
    if (winner === 'player') {
      console.log(
        '\n🎉 *** CONGRATULATIONS! You sunk all enemy battleships! *** 🎉'
      );
    } else {
      console.log(
        '\n💥 *** GAME OVER! The CPU sunk all your battleships! *** 💥'
      );
    }
  }

  /**
   * Display help information
   */
  displayHelp() {
    console.log('\n=== SEA BATTLE HELP ===');
    console.log('• Enter coordinates as two digits (row, column)');
    console.log(
      '• Examples: 00 (top-left), 34 (row 3, col 4), 99 (bottom-right)'
    );
    console.log('• Board symbols:');
    console.log('  ~ = Water (unknown)');
    console.log('  S = Your ships');
    console.log('  X = Hit');
    console.log('  O = Miss');
    console.log('• Goal: Sink all enemy ships before they sink yours!');
    console.log('========================\n');
  }

  /**
   * Display error message
   * @param {string} error - Error message to display
   */
  displayError(error) {
    console.log(`❌ Error: ${error}`);
  }

  /**
   * Clear the console screen
   */
  clearScreen() {
    console.clear();
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }

  /**
   * Display loading message
   * @param {string} message - Loading message
   */
  displayLoading(message) {
    process.stdout.write(`${message}...`);
  }

  /**
   * Display CPU turn information
   * @param {string} location - Location CPU is targeting
   * @param {string} mode - CPU's current mode
   */
  displayCPUTurn(location, mode) {
    console.log(`\n--- CPU's Turn ---`);
    console.log(
      `CPU ${mode === 'target' ? 'targets' : 'hunts at'}: ${location}`
    );
  }

  /**
   * Create a separator line
   */
  displaySeparator() {
    console.log('─'.repeat(60));
  }
}

module.exports = { ConsoleUI };
