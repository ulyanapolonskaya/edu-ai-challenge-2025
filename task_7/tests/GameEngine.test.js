const { GameEngine } = require('../src/game/GameEngine.js');

describe('GameEngine', () => {
  let game;

  beforeEach(() => {
    game = new GameEngine({ boardSize: 5, numShips: 2, shipLength: 2 });
  });

  describe('constructor', () => {
    it('should create game with default configuration', () => {
      const defaultGame = new GameEngine();
      const config = defaultGame.getConfig();
      expect(config.boardSize).toBe(10);
      expect(config.numShips).toBe(3);
      expect(config.shipLength).toBe(3);
    });

    it('should create game with custom configuration', () => {
      const config = game.getConfig();
      expect(config.boardSize).toBe(5);
      expect(config.numShips).toBe(2);
      expect(config.shipLength).toBe(2);
    });

    it('should initialize in setup state', () => {
      const state = game.getGameState();
      expect(state.state).toBe('setup');
      expect(state.currentTurn).toBe('player');
      expect(state.winner).toBeNull();
    });
  });

  describe('initializeGame', () => {
    it('should successfully initialize game', async () => {
      const result = await game.initializeGame();
      expect(result.success).toBe(true);
      expect(result.message).toContain('Game initialized');

      const state = game.getGameState();
      expect(state.state).toBe('playing');
      expect(state.playerShipsRemaining).toBe(2);
      expect(state.cpuShipsRemaining).toBe(2);
    });
  });

  describe('isValidLocationFormat', () => {
    it('should return true for valid location formats', () => {
      expect(game.isValidLocationFormat('00')).toBe(true);
      expect(game.isValidLocationFormat('23')).toBe(true);
      expect(game.isValidLocationFormat('44')).toBe(true);
    });

    it('should return false for invalid location formats', () => {
      expect(game.isValidLocationFormat('0')).toBe(false);
      expect(game.isValidLocationFormat('000')).toBe(false);
      expect(game.isValidLocationFormat('ab')).toBe(false);
      expect(game.isValidLocationFormat('55')).toBe(false);
      expect(game.isValidLocationFormat(null)).toBe(false);
    });
  });

  describe('processPlayerGuess', () => {
    beforeEach(async () => {
      await game.initializeGame();
    });

    it('should reject guess when not player turn', async () => {
      // Force CPU turn
      game.currentTurn = 'cpu';
      const result = game.processPlayerGuess('00');
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not player's turn");
    });

    it('should reject invalid location format', () => {
      const result = game.processPlayerGuess('abc');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid location format');
    });

    it('should process valid guess', () => {
      const result = game.processPlayerGuess('00');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('sunk');
      expect(result).toHaveProperty('gameOver');
    });
  });

  describe('processCPUTurn', () => {
    beforeEach(async () => {
      await game.initializeGame();
      // Make a player move first to set turn to CPU
      game.processPlayerGuess('00');
    });

    it('should reject when not CPU turn', () => {
      game.currentTurn = 'player';
      const result = game.processCPUTurn();
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not CPU's turn");
    });

    it('should process CPU turn successfully', () => {
      const result = game.processCPUTurn();
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('sunk');
      expect(result).toHaveProperty('cpuMode');
    });
  });

  describe('game flow', () => {
    it('should alternate turns between player and CPU', async () => {
      await game.initializeGame();

      let state = game.getGameState();
      expect(state.currentTurn).toBe('player');

      // Player makes a move
      game.processPlayerGuess('00');
      state = game.getGameState();
      expect(state.currentTurn).toBe('cpu');

      // CPU makes a move
      game.processCPUTurn();
      state = game.getGameState();
      expect(state.currentTurn).toBe('player');
    });
  });

  describe('resetGame', () => {
    it('should reset game to initial state', async () => {
      await game.initializeGame();
      game.processPlayerGuess('00');

      game.resetGame();

      const state = game.getGameState();
      expect(state.state).toBe('setup');
      expect(state.currentTurn).toBe('player');
      expect(state.winner).toBeNull();
    });
  });

  describe('getGameState', () => {
    it('should return complete game state', async () => {
      await game.initializeGame();
      const state = game.getGameState();

      expect(state).toHaveProperty('state');
      expect(state).toHaveProperty('currentTurn');
      expect(state).toHaveProperty('winner');
      expect(state).toHaveProperty('playerShipsRemaining');
      expect(state).toHaveProperty('cpuShipsRemaining');
      expect(state).toHaveProperty('playerBoard');
      expect(state).toHaveProperty('opponentBoard');
      expect(state).toHaveProperty('cpuMode');
    });
  });
});
