import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./countdown-timer";
import { cn, formatUSDC, formatUSD, formatBrandPrize, getStatusColor, getHostAvatarGradient, getProgressColor } from "@/lib/utils";
import type { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  const fillPercentage = (game.currentPlayers / game.maxPlayers) * 100;
  const isBrandGame = game.entryFee === 0; // Brand games are free
  
  return (
    <Card 
      className="game-card bg-gradient-to-br from-dark-secondary to-dark-tertiary border-electric-purple/20 hover:border-electric-purple/50 cursor-pointer group p-6"
      onClick={() => onClick(game)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{game.gameIcon}</div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-electric-purple transition-colors">
              {game.title}
            </h3>
            <p className="text-sm text-gray-400 flex items-center">
              <span className={cn(
                "w-6 h-6 bg-gradient-to-r rounded-full mr-2",
                getHostAvatarGradient(game.hostAvatar)
              )}></span>
              <span>{game.host}</span>
            </p>
          </div>
        </div>
        <Badge className={cn("text-xs font-bold", getStatusColor(game.status))}>
          {game.status.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Entry Fee</span>
          <span className="text-gold-accent font-bold">{formatUSDC(game.entryFee)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">{isBrandGame ? "Prize Value" : "Prize Pool"}</span>
          <span className="text-neon-green font-bold">
            {isBrandGame ? formatBrandPrize(game.prizePool) : `${formatUSD(game.prizePool)} USDC`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Players</span>
          <span className="text-cyber-blue font-bold">{game.currentPlayers}/{game.maxPlayers}</span>
        </div>
      </div>

      <div className="border-t border-gray-700/50 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Locks in:</span>
          <CountdownTimer 
            endTime={game.lockTime} 
            className={cn(
              game.status === 'live' ? 'text-electric-purple' :
              game.status === 'filling' ? 'text-cyber-blue' :
              game.status === 'starting' ? 'text-gold-accent' :
              'text-neon-green'
            )}
          />
        </div>
        <div className="w-full bg-dark-primary rounded-full h-2 mt-2">
          <div 
            className={cn("h-2 rounded-full bg-gradient-to-r", getProgressColor(game.status))}
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
}
