import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GameCard } from "@/components/game-card";
import { GameModal } from "@/components/game-modal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Game } from "@shared/schema";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("prize");
  const [filterBy, setFilterBy] = useState("all");
  const [activeTab, setActiveTab] = useState("crypto");

  const { data: games = [], isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: brandGames = [], isLoading: brandGamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/brand-games"],
    enabled: activeTab === "brands",
  });

  const { data: sportsGames = [], isLoading: sportsGamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/sports-games"],
    enabled: activeTab === "sports",
  });

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const currentGames = activeTab === "crypto" ? games : activeTab === "brands" ? brandGames : sportsGames;
  const currentLoading = activeTab === "crypto" ? gamesLoading : activeTab === "brands" ? brandGamesLoading : sportsGamesLoading;

  const filteredAndSortedGames = currentGames
    .filter(game => {
      if (filterBy === "all") return true;
      if (filterBy === "dice") return game.gameType === "dice" || game.gameType === "number";
      if (filterBy === "card") return game.gameType === "card" || game.gameType === "coinflip";
      if (filterBy === "gameshow") return game.gameType === "wheel" || game.gameType === "trivia" || game.gameType === "mystery";
      if (filterBy === "sports") return game.gameType === "football" || game.gameType === "soccer" || game.gameType === "basketball";
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "prize":
          return b.prizePool - a.prizePool;
        case "fee":
          return a.entryFee - b.entryFee;
        case "time":
          return new Date(a.lockTime).getTime() - new Date(b.lockTime).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-secondary/95 backdrop-blur-sm border-b border-electric-purple/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-float">🎮</div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Onchain Game Rooms
              </h1>
              <p className="text-sm text-gray-400">The Onchain Playground</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-electric-purple font-semibold">Browse Games</a>
            <a href="/marketplace" className="text-gray-300 hover:text-cyber-blue transition-colors">Game Templates</a>
            <a href="#" className="text-gray-300 hover:text-cyber-blue transition-colors">Leaderboard</a>
            <a href="#" className="text-gray-300 hover:text-neon-green transition-colors">How It Works</a>
          </nav>

          <Button className="bg-gradient-to-r from-electric-purple to-cyber-blue hover:from-cyber-blue hover:to-neon-green font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-electric-purple/25">
            🏗️ Deploy Your Game
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            The Onchain Playground
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Join a Game, Be the Last Wallet Standing. Win Crypto. No Gas Needed.
          </p>
        </div>
      </section>

      {/* Game Tabs */}
      <main className="px-4 pb-12">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-dark-secondary/50 backdrop-blur-sm border border-gray-700/50 mb-8">
              <TabsTrigger 
                value="crypto" 
                className="data-[state=active]:bg-electric-purple/20 data-[state=active]:text-electric-purple data-[state=active]:border-electric-purple/30"
              >
                🎲 Random Outcome Games
              </TabsTrigger>
              <TabsTrigger 
                value="brands" 
                className="data-[state=active]:bg-gold-accent/20 data-[state=active]:text-gold-accent data-[state=active]:border-gold-accent/30"
              >
                🏆 Brand Giveaways
              </TabsTrigger>
              <TabsTrigger 
                value="sports" 
                className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue data-[state=active]:border-cyber-blue/30"
              >
                🏈 Live Sports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crypto" className="space-y-8">
              {/* Crypto Games Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-xl font-bold">🔥 Live Random Games</h3>
                  <div className="flex gap-2">
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        filterBy === "all" 
                          ? "bg-electric-purple/20 text-electric-purple border-electric-purple/30" 
                          : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                      }`}
                      onClick={() => setFilterBy("all")}
                    >
                      All Games
                    </Badge>
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        filterBy === "dice" 
                          ? "bg-electric-purple/20 text-electric-purple border-electric-purple/30" 
                          : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                      }`}
                      onClick={() => setFilterBy("dice")}
                    >
                      Dice Games
                    </Badge>
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        filterBy === "card" 
                          ? "bg-electric-purple/20 text-electric-purple border-electric-purple/30" 
                          : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                      }`}
                      onClick={() => setFilterBy("card")}
                    >
                      Card Games
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-dark-tertiary border-gray-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-tertiary border-gray-600">
                      <SelectItem value="prize">Sort by Prize Pool</SelectItem>
                      <SelectItem value="fee">Sort by Entry Fee</SelectItem>
                      <SelectItem value="time">Sort by Time Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Crypto Games Grid */}
              {currentLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-dark-secondary/50 rounded-2xl p-6 border border-gray-700/50 animate-pulse">
                      <div className="h-32 bg-gray-700/50 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedGames.map((game) => (
                    <GameCard key={game.id} game={game} onClick={handleGameClick} />
                  ))}
                </div>
              )}

              {!currentLoading && filteredAndSortedGames.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎲</div>
                  <h3 className="text-2xl font-bold mb-2">No crypto games found</h3>
                  <p className="text-gray-400">Try adjusting your filters or check back later.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="brands" className="space-y-8">
              {/* Brand Games Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-xl font-bold">📺 TV Game Show Style</h3>
                  <div className="flex gap-2">
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        filterBy === "all" 
                          ? "bg-gold-accent/20 text-gold-accent border-gold-accent/30" 
                          : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                      }`}
                      onClick={() => setFilterBy("all")}
                    >
                      All Shows
                    </Badge>
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        filterBy === "gameshow" 
                          ? "bg-gold-accent/20 text-gold-accent border-gold-accent/30" 
                          : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                      }`}
                      onClick={() => setFilterBy("gameshow")}
                    >
                      Game Shows
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-dark-tertiary border-gray-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-tertiary border-gray-600">
                      <SelectItem value="prize">Sort by Prize Value</SelectItem>
                      <SelectItem value="time">Sort by Time Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brand Games Grid */}
              {currentLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-dark-secondary/50 rounded-2xl p-6 border border-gray-700/50 animate-pulse">
                      <div className="h-32 bg-gray-700/50 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedGames.map((game) => (
                    <GameCard key={game.id} game={game} onClick={handleGameClick} />
                  ))}
                </div>
              )}

              {!currentLoading && filteredAndSortedGames.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold mb-2">No brand giveaways available</h3>
                  <p className="text-gray-400">Check back soon for exciting brand sponsored games!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sports" className="space-y-8">
              {/* Sports Games Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-xl font-bold">🏈 Live Sports Betting</h3>
                  <div className="flex gap-2">
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        filterBy === "all" 
                          ? "bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30" 
                          : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                      }`}
                      onClick={() => setFilterBy("all")}
                    >
                      All Sports
                    </Badge>
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        filterBy === "sports" 
                          ? "bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30" 
                          : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                      }`}
                      onClick={() => setFilterBy("sports")}
                    >
                      Live Events
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-dark-tertiary border-gray-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-tertiary border-gray-600">
                      <SelectItem value="prize">Sort by Prize Pool</SelectItem>
                      <SelectItem value="time">Sort by Event Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sports Games Grid */}
              {currentLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-dark-secondary/50 rounded-2xl p-6 border border-gray-700/50 animate-pulse">
                      <div className="h-32 bg-gray-700/50 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedGames.map((game) => (
                    <GameCard key={game.id} game={game} onClick={handleGameClick} />
                  ))}
                </div>
              )}

              {!currentLoading && filteredAndSortedGames.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏈</div>
                  <h3 className="text-2xl font-bold mb-2">No live sports events</h3>
                  <p className="text-gray-400">Check back during game time for live betting opportunities!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Game Modal */}
      <GameModal 
        game={selectedGame}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Footer */}
      <footer className="bg-dark-secondary/50 backdrop-blur-sm border-t border-gray-700/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-electric-purple">🎮 Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-electric-purple transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-electric-purple transition-colors">Supported Games</a></li>
                <li><a href="#" className="hover:text-electric-purple transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-cyber-blue">🏗️ Gamemasters</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyber-blue transition-colors">Deploy a Game</a></li>
                <li><a href="#" className="hover:text-cyber-blue transition-colors">Game Templates</a></li>
                <li><a href="#" className="hover:text-cyber-blue transition-colors">Revenue Share</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-neon-green">💰 Crypto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-neon-green transition-colors">Supported Tokens</a></li>
                <li><a href="#" className="hover:text-neon-green transition-colors">Gas-Free Gaming</a></li>
                <li><a href="#" className="hover:text-neon-green transition-colors">Smart Contracts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-gold-accent">🌟 Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gold-accent transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-gold-accent transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-gold-accent transition-colors">Leaderboard</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Onchain Game Rooms. Trustless gaming, powered by smart contracts. 🚀</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
