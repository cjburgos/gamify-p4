import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CountdownTimer } from "@/components/countdown-timer";
import { formatUSDC } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Game } from "@shared/schema";

interface BlockchainGameCardProps {
  game: Game;
  onJoin?: (gameId: number, playerAddress: string, guess?: number) => void;
}

export function BlockchainGameCard({ game, onJoin }: BlockchainGameCardProps) {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [playerAddress, setPlayerAddress] = useState("");
  const [guess, setGuess] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const handleJoinGame = async () => {
    if (!playerAddress) {
      toast({
        title: "Error",
        description: "Please enter your wallet address",
        variant: "destructive",
      });
      return;
    }

    if (game.gameType === "dice" && (!guess || isNaN(Number(guess)))) {
      toast({
        title: "Error",
        description: "Please enter a valid guess (1-6)",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      if (game.blockchainType === "flow") {
        const response = await fetch("/api/flow/join-game", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: game.gameContractId,
            playerAddress,
            guess: Number(guess),
          }),
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Successfully joined the Flow game!",
          });
          onJoin?.(game.id, playerAddress, Number(guess));
          setIsJoinDialogOpen(false);
        } else {
          throw new Error("Failed to join game");
        }
      } else {
        // Handle other blockchain types
        onJoin?.(game.id, playerAddress);
        setIsJoinDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const getBlockchainBadge = () => {
    if (game.blockchainType === "flow") {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Flow Blockchain
        </Badge>
      );
    } else if (game.blockchainType === "ethereum") {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          Ethereum
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="bg-dark-secondary/50 border-gray-700/50 hover:border-electric-purple/30 transition-all duration-300 hover:shadow-lg hover:shadow-electric-purple/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{game.gameIcon}</div>
            <div>
              <CardTitle className="text-white text-lg font-bold">{game.title}</CardTitle>
              <CardDescription className="text-gray-400">{game.description}</CardDescription>
            </div>
          </div>
          {getBlockchainBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Prize Pool</p>
            <p className="text-xl font-bold text-neon-green">{formatUSDC(game.prizePool)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Entry Fee</p>
            <p className="text-lg font-semibold text-white">{formatUSDC(game.entryFee)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Players</p>
            <p className="text-lg font-semibold text-white">
              {game.currentPlayers}/{game.maxPlayers}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Time Left</p>
            <CountdownTimer endTime={game.lockTime} className="text-lg font-semibold text-electric-purple" />
          </div>
        </div>

        {game.contractAddress && (
          <div>
            <p className="text-sm text-gray-400">Contract</p>
            <p className="text-xs font-mono text-gray-300 truncate">{game.contractAddress}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-gradient-to-r from-electric-purple to-cyber-blue hover:from-cyber-blue hover:to-neon-green font-bold transition-all duration-300"
              disabled={game.status === "locked" || game.currentPlayers >= game.maxPlayers}
            >
              {game.status === "locked" ? "Game Locked" : 
               game.currentPlayers >= game.maxPlayers ? "Game Full" : 
               `Join Game (${formatUSDC(game.entryFee)})`}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-dark-secondary border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Join {game.title}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter your wallet address to join this blockchain game.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="playerAddress" className="text-white">
                  Wallet Address
                </Label>
                <Input
                  id="playerAddress"
                  placeholder="0x..."
                  value={playerAddress}
                  onChange={(e) => setPlayerAddress(e.target.value)}
                  className="bg-dark-tertiary border-gray-600 text-white"
                />
              </div>
              {game.gameType === "dice" && (
                <div>
                  <Label htmlFor="guess" className="text-white">
                    Your Guess (1-6)
                  </Label>
                  <Input
                    id="guess"
                    type="number"
                    min="1"
                    max="6"
                    placeholder="Enter your dice guess"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="bg-dark-tertiary border-gray-600 text-white"
                  />
                </div>
              )}
              <Button
                onClick={handleJoinGame}
                disabled={isJoining}
                className="w-full bg-gradient-to-r from-electric-purple to-cyber-blue hover:from-cyber-blue hover:to-neon-green"
              >
                {isJoining ? "Joining..." : `Join Game (${formatUSDC(game.entryFee)})`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}