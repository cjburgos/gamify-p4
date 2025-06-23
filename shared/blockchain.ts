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
    // Mock implementation for frontend development
    return `flow_game_${Date.now()}`;
  }

  async joinGame(gameId: string, playerAddress: string, guess: number): Promise<boolean> {
    // Mock implementation for frontend development
    console.log(`Flow: Player ${playerAddress} joining game ${gameId} with guess ${guess}`);
    return true;
  }

  async getGameState(gameId: string): Promise<FlowGameState | null> {
    // Mock implementation for frontend development
    return {
      gameId,
      isOpen: true,
      players: [],
      roundNumber: 1
    };
  }

  async commitRandom(gameId: string, commitHash: string): Promise<boolean> {
    // Mock implementation for frontend development
    console.log(`Flow: Committing random for game ${gameId}: ${commitHash}`);
    return true;
  }

  async revealAndClose(gameId: string, secret: string): Promise<boolean> {
    // Mock implementation for frontend development
    console.log(`Flow: Revealing and closing game ${gameId} with secret ${secret}`);
    return true;
  }
}

export class EthereumGameService {
  private contractAddress: string;
  private proxyAddress: string;

  constructor(contractAddress: string, proxyAddress: string) {
    this.contractAddress = contractAddress;
    this.proxyAddress = proxyAddress;
  }

  async setNumber(number: number): Promise<boolean> {
    // Mock implementation for frontend development
    console.log(`Ethereum: Setting number to ${number}`);
    return true;
  }

  async increment(): Promise<boolean> {
    // Mock implementation for frontend development
    console.log(`Ethereum: Incrementing number`);
    return true;
  }

  async getNumber(): Promise<number> {
    // Mock implementation for frontend development
    return Math.floor(Math.random() * 100);
  }

  async getGameState(): Promise<EthereumGameState> {
    // Mock implementation for frontend development
    return {
      gameId: `eth_game_${Date.now()}`,
      number: await this.getNumber(),
      isActive: true
    };
  }
}

export class BlockchainServiceFactory {
  static createFlowService(contractAddress: string): FlowGameService {
    return new FlowGameService(contractAddress);
  }

  static createEthereumService(contractAddress: string, proxyAddress: string): EthereumGameService {
    return new EthereumGameService(contractAddress, proxyAddress);
  }
}

export const CONTRACT_ADDRESSES = {
  flow: {
    guessTheDice: "0x1234567890abcdef1234567890abcdef12345678"
  },
  ethereum: {
    game: "0xabcdef1234567890abcdef1234567890abcdef12",
    proxy: "0x9876543210fedcba9876543210fedcba98765432"
  }
};