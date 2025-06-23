// Blockchain integration utilities for Flow and Ethereum
export interface BlockchainGame {
  id: string;
  contractAddress: string;
  blockchain: 'flow' | 'ethereum';
  gameType: 'dice' | 'card' | 'roulette' | 'number' | 'coinflip';
  isActive: boolean;
  entryFee: number; // in wei/smallest unit
  maxPlayers: number;
  currentPlayers: number;
}

export interface FlowGameState {
  gameId: string;
  isOpen: boolean;
  players: string[];
  roundNumber: number;
  lastRoll?: number;
  commitBlockHeight?: number;
}

export interface EthereumGameState {
  gameId: string;
  number: number;
  isActive: boolean;
}

// Flow blockchain utilities
export class FlowGameService {
  private contractAddress: string;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
  }

  async createGame(): Promise<string> {
    // This would integrate with Flow SDK to create a new game
    // For now, return a mock game ID
    return `flow_game_${Date.now()}`;
  }

  async joinGame(gameId: string, playerAddress: string, guess: number): Promise<boolean> {
    // This would call the Flow contract's join function
    console.log(`Joining Flow game ${gameId} with guess ${guess} for player ${playerAddress}`);
    return true;
  }

  async getGameState(gameId: string): Promise<FlowGameState | null> {
    // This would query the Flow blockchain for game state
    return {
      gameId,
      isOpen: true,
      players: [],
      roundNumber: 1,
    };
  }

  async commitRandom(gameId: string, commitHash: string): Promise<boolean> {
    // This would call the Flow contract's commitRandom function
    console.log(`Committing random for Flow game ${gameId}`);
    return true;
  }

  async revealAndClose(gameId: string, secret: string): Promise<boolean> {
    // This would call the Flow contract's revealAndClose function
    console.log(`Revealing and closing Flow game ${gameId}`);
    return true;
  }
}

// Ethereum blockchain utilities
export class EthereumGameService {
  private contractAddress: string;
  private proxyAddress: string;

  constructor(contractAddress: string, proxyAddress: string) {
    this.contractAddress = contractAddress;
    this.proxyAddress = proxyAddress;
  }

  async setNumber(number: number): Promise<boolean> {
    // This would call the Ethereum contract's setNumber function
    console.log(`Setting number ${number} on Ethereum contract`);
    return true;
  }

  async increment(): Promise<boolean> {
    // This would call the Ethereum contract's increment function
    console.log(`Incrementing number on Ethereum contract`);
    return true;
  }

  async getNumber(): Promise<number> {
    // This would query the Ethereum contract for the current number
    return 42;
  }

  async getGameState(): Promise<EthereumGameState> {
    // This would query the Ethereum blockchain for game state
    return {
      gameId: `eth_game_${Date.now()}`,
      number: await this.getNumber(),
      isActive: true,
    };
  }
}

// Factory for creating blockchain services
export class BlockchainServiceFactory {
  static createFlowService(contractAddress: string): FlowGameService {
    return new FlowGameService(contractAddress);
  }

  static createEthereumService(contractAddress: string, proxyAddress: string): EthereumGameService {
    return new EthereumGameService(contractAddress, proxyAddress);
  }
}

// Mock contract addresses for development
export const CONTRACT_ADDRESSES = {
  flow: {
    guessTheDice: '0x0dd7dc583201e8b1',
  },
  ethereum: {
    game: '0x1234567890123456789012345678901234567890',
    proxy: '0x0987654321098765432109876543210987654321',
  },
};