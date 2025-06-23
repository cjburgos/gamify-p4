import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./countdown-timer";
import { cn, formatUSDC, formatUSD, formatBrandPrize, getStatusColor, getHostAvatarGradient } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Game } from "@shared/schema";

interface GameModalProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameModal({ game, open, onOpenChange }: GameModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isConnected, ticketBalance } = useWallet();

  const joinGameMutation = useMutation({
    mutationFn: async (gameId: number) => {
      const response = await apiRequest("POST", `/api/games/${gameId}/join`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Joined Game!",
        description: "You've successfully joined the game. Good luck!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/brand-games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sports-games"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Join",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!game) return null;

  const isBrandGame = game.entryFee === 0;

  const handleJoinGame = () => {
    joinGameMutation.mutate(game.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${game.title} on Onchain Game Rooms`,
        text: `Check out this ${game.gameType} game with a ${formatUSD(game.prizePool)} USDC prize pool!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Game link has been copied to your clipboard.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-secondary border border-electric-purple/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{game.gameIcon}</div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">{game.title}</DialogTitle>
                <p className="text-gray-400">{game.description}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-dark-tertiary/50 rounded-xl p-4 text-center border border-electric-purple/20">
            <div className="text-2xl font-bold text-electric-purple">{formatUSDC(game.entryFee)}</div>
            <div className="text-sm text-gray-400">Entry Fee</div>
          </div>
          <div className="bg-dark-tertiary/50 rounded-xl p-4 text-center border border-neon-green/20">
            <div className="text-2xl font-bold text-neon-green">
              {isBrandGame ? formatBrandPrize(game.prizePool) : formatUSD(game.prizePool)}
            </div>
            <div className="text-sm text-gray-400">{isBrandGame ? "Prize Value" : "Prize Pool"}</div>
          </div>
          <div className="bg-dark-tertiary/50 rounded-xl p-4 text-center border border-cyber-blue/20">
            <div className="text-2xl font-bold text-cyber-blue">{game.currentPlayers}/{game.maxPlayers}</div>
            <div className="text-sm text-gray-400">Players</div>
          </div>
          <div className="bg-dark-tertiary/50 rounded-xl p-4 text-center border border-gold-accent/20">
            <CountdownTimer endTime={game.lockTime} className="text-2xl font-bold text-gold-accent" />
            <div className="text-sm text-gray-400">Time Left</div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-dark-tertiary/30 rounded-xl p-6 mb-6 border border-gray-700/30">
          <h3 className="text-lg font-bold mb-3 flex items-center">
            📋 Game Rules
          </h3>
          <ul className="space-y-2 text-gray-300">
            {game.rules.map((rule, index) => (
              <li key={index} className="flex items-start">
                <span className={cn(
                  "mr-2",
                  index % 4 === 0 ? "text-electric-purple" :
                  index % 4 === 1 ? "text-cyber-blue" :
                  index % 4 === 2 ? "text-neon-green" :
                  "text-gold-accent"
                )}>•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Host Info */}
        <div className="bg-dark-tertiary/30 rounded-xl p-6 mb-6 border border-gray-700/30">
          <h3 className="text-lg font-bold mb-3 flex items-center">
            👤 Gamemaster
          </h3>
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-12 h-12 bg-gradient-to-r rounded-full",
              getHostAvatarGradient(game.hostAvatar)
            )}></div>
            <div>
              <div className="font-bold text-white">{game.host}</div>
              <div className="text-sm text-gray-400">
                <span className="text-neon-green">{game.hostGamesHosted}</span> games hosted • 
                <span className="text-gold-accent">{(game.hostRating / 10).toFixed(1)}★</span> rating
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="flex-1 bg-gradient-to-r from-electric-purple to-cyber-blue hover:from-cyber-blue hover:to-neon-green font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-electric-purple/25"
            onClick={handleJoinGame}
            disabled={joinGameMutation.isPending || game.currentPlayers >= game.maxPlayers || new Date(game.lockTime) <= new Date()}
          >
            {joinGameMutation.isPending ? "Joining..." : 
             isBrandGame ? "🎮 Join for FREE" : `🎮 Join Game (${formatUSDC(game.entryFee)})`}
          </Button>
          <Button 
            variant="outline"
            className="border-gray-600 text-gray-300 hover:border-electric-purple hover:text-electric-purple"
            onClick={handleShare}
          >
            📤 Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
