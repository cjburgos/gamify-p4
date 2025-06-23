import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";
import { z } from "zod";
import { FlowGameService, EthereumGameService, CONTRACT_ADDRESSES } from "@shared/blockchain";

import fs from 'fs/promises';
import path from 'path';

interface DeployedGame {
  id: string;
  gameType: string;
  gameMaster: string;
  entryCost: number;
  transactionId: string;
  deployedAt: string;
  isActive: boolean;
  blockHeight?: string;
  players?: string[];
}

const DEPLOYED_GAMES_FILE = path.join(process.cwd(), 'server/data/deployed_games.json');

async function ensureDataDirectory() {
  const dataDir = path.dirname(DEPLOYED_GAMES_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readDeployedGames(): Promise<DeployedGame[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DEPLOYED_GAMES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

async function writeDeployedGames(games: DeployedGame[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(DEPLOYED_GAMES_FILE, JSON.stringify(games, null, 2));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Deployed games routes - ADD THESE FIRST
  app.get("/api/deployed-games", async (req, res) => {
    try {
      const games = await readDeployedGames();
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/deployed-games", async (req, res) => {
    try {
      const gameData: DeployedGame = req.body;
      
      // Validate required fields
      if (!gameData.id || !gameData.gameType || !gameData.gameMaster || !gameData.transactionId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const games = await readDeployedGames();
      
      // Check if game already exists
      const existingGame = games.find(g => g.id === gameData.id || g.transactionId === gameData.transactionId);
      if (existingGame) {
        return res.status(409).json({ message: "Game already exists" });
      }

      // Initialize players array for new games
      gameData.players = gameData.players || [];
      
      games.push(gameData);
      await writeDeployedGames(games);
      
      res.status(201).json(gameData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/deployed-games/:id/players", async (req, res) => {
    try {
      const gameId = req.params.id;
      const { playerAddress } = req.body;
      
      if (!playerAddress) {
        return res.status(400).json({ message: "Player address is required" });
      }

      const games = await readDeployedGames();
      const gameIndex = games.findIndex(g => g.id === gameId);
      
      if (gameIndex === -1) {
        return res.status(404).json({ message: "Game not found" });
      }

      // Initialize players array if it doesn't exist
      if (!games[gameIndex].players) {
        games[gameIndex].players = [];
      }

      // Add player if not already in the list
      if (!games[gameIndex].players!.includes(playerAddress)) {
        games[gameIndex].players!.push(playerAddress);
        await writeDeployedGames(games);
        console.log(`Added player ${playerAddress} to game ${gameId}`);
      }

      res.json({ success: true, players: games[gameIndex].players });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/deployed-games/:id", async (req, res) => {
    try {
      const gameId = req.params.id;
      const games = await readDeployedGames();
      
      const filteredGames = games.filter(g => g.id !== gameId);
      
      if (filteredGames.length === games.length) {
        return res.status(404).json({ message: "Game not found" });
      }

      await writeDeployedGames(filteredGames);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all games
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Get brand games
  app.get("/api/brand-games", async (req, res) => {
    try {
      const games = await storage.getBrandGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand games" });
    }
  });

  // Get sports games
  app.get("/api/sports-games", async (req, res) => {
    try {
      const games = await storage.getSportsGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sports games" });
    }
  });

  // Get specific game
  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Create new game
  app.post("/api/games", async (req, res) => {
    try {
      const validatedData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(validatedData);
      res.status(201).json(game);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid game data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Join game (increment current players)
  app.post("/api/games/:id/join", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }

      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.currentPlayers >= game.maxPlayers) {
        return res.status(400).json({ message: "Game is full" });
      }

      if (new Date(game.lockTime) <= new Date()) {
        return res.status(400).json({ message: "Game is locked" });
      }

      const updatedGame = await storage.updateGame(id, {
        currentPlayers: game.currentPlayers + 1,
        prizePool: game.prizePool + game.entryFee
      });

      res.json(updatedGame);
    } catch (error) {
      res.status(500).json({ message: "Failed to join game" });
    }
  });

  // Get platform stats
  app.get("/api/stats", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      const activeGames = games.filter(game => 
        game.status === 'live' || game.status === 'filling' || game.status === 'starting'
      ).length;
      
      const totalPrizePool = games.reduce((sum, game) => sum + game.prizePool, 0);
      const playersOnline = games.reduce((sum, game) => sum + game.currentPlayers, 0);

      res.json({
        activeGames,
        totalPrizePool: Math.floor(totalPrizePool / 100), // Convert from cents to dollars
        playersOnline
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Smart contract interaction endpoints
  
  // Flow blockchain endpoints
  app.post("/api/flow/create-game", async (req, res) => {
    try {
      const flowService = new FlowGameService(CONTRACT_ADDRESSES.flow.guessTheDice);
      const gameId = await flowService.createGame();
      res.json({ gameId, blockchain: "flow" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create Flow game" });
    }
  });

  app.post("/api/flow/join-game", async (req, res) => {
    try {
      const { gameId, playerAddress, guess } = req.body;
      
      if (!gameId || !playerAddress || !guess) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const flowService = new FlowGameService(CONTRACT_ADDRESSES.flow.guessTheDice);
      const success = await flowService.joinGame(gameId, playerAddress, guess);
      
      if (success) {
        res.json({ success: true, message: "Successfully joined Flow game" });
      } else {
        res.status(400).json({ message: "Failed to join Flow game" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to join Flow game" });
    }
  });

  app.get("/api/flow/game-state/:gameId", async (req, res) => {
    try {
      const { gameId } = req.params;
      const flowService = new FlowGameService(CONTRACT_ADDRESSES.flow.guessTheDice);
      const gameState = await flowService.getGameState(gameId);
      
      if (gameState) {
        res.json(gameState);
      } else {
        res.status(404).json({ message: "Flow game not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Flow game state" });
    }
  });

  app.post("/api/flow/commit-random", async (req, res) => {
    try {
      const { gameId, commitHash } = req.body;
      
      if (!gameId || !commitHash) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const flowService = new FlowGameService(CONTRACT_ADDRESSES.flow.guessTheDice);
      const success = await flowService.commitRandom(gameId, commitHash);
      
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to commit random for Flow game" });
    }
  });

  app.post("/api/flow/reveal-and-close", async (req, res) => {
    try {
      const { gameId, secret } = req.body;
      
      if (!gameId || !secret) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const flowService = new FlowGameService(CONTRACT_ADDRESSES.flow.guessTheDice);
      const success = await flowService.revealAndClose(gameId, secret);
      
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to reveal and close Flow game" });
    }
  });

  // Ethereum blockchain endpoints
  app.post("/api/ethereum/set-number", async (req, res) => {
    try {
      const { number } = req.body;
      
      if (typeof number !== 'number') {
        return res.status(400).json({ message: "Invalid number" });
      }

      const ethService = new EthereumGameService(
        CONTRACT_ADDRESSES.ethereum.game,
        CONTRACT_ADDRESSES.ethereum.proxy
      );
      const success = await ethService.setNumber(number);
      
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to set number on Ethereum contract" });
    }
  });

  app.post("/api/ethereum/increment", async (req, res) => {
    try {
      const ethService = new EthereumGameService(
        CONTRACT_ADDRESSES.ethereum.game,
        CONTRACT_ADDRESSES.ethereum.proxy
      );
      const success = await ethService.increment();
      
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment Ethereum contract" });
    }
  });

  app.get("/api/ethereum/game-state", async (req, res) => {
    try {
      const ethService = new EthereumGameService(
        CONTRACT_ADDRESSES.ethereum.game,
        CONTRACT_ADDRESSES.ethereum.proxy
      );
      const gameState = await ethService.getGameState();
      
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Ethereum game state" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
