import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
