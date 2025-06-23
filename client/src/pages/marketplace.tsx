
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletInfo } from "@/components/wallet/WalletInfo";
import { useWallet } from "@/contexts/WalletContext";

export default function Marketplace() {
  const [sortBy, setSortBy] = useState("popularity");
  const [filterBy, setFilterBy] = useState("all");
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-secondary/95 backdrop-blur-sm border-b border-electric-purple/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-purple to-cyber-blue rounded-lg flex items-center justify-center">
              <div className="text-white text-xl font-bold">🎮</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                The Onchain Playground
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Browse Games</a>
            <a href="/marketplace" className="text-white font-medium hover:text-electric-purple transition-colors">Game Templates</a>
            <a href="/smart-contracts" className="text-gray-300 hover:text-white transition-colors">Smart Contracts</a>
          </nav>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <WalletInfo />
            ) : (
              <ConnectWallet />
            )}
            <Button className="bg-gradient-to-r from-electric-purple to-blue-600 hover:from-blue-600 hover:to-electric-purple text-white font-medium px-6 py-2 rounded-lg transition-all duration-300">
              Deploy Your Game
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Game Template Marketplace
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Deploy Ready-Made Game Templates. No Coding Required.
          </p>
        </div>
      </section>

      {/* Templates Section */}
      <main className="px-4 pb-12">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="text-xl font-bold">🎯 Game Templates</h3>
              <div className="flex gap-2">
                <Badge
                  className={`cursor-pointer transition-colors ${
                    filterBy === "all" 
                      ? "bg-electric-purple/20 text-electric-purple border-electric-purple/30" 
                      : "bg-dark-tertiary/50 text-gray-400 border-gray-600/30 hover:bg-gray-600/30"
                  }`}
                  onClick={() => setFilterBy("all")}
                >
                  All Templates
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
                <Badge
                  className={`cursor-pointer transition-colors ${
                    filterBy === "gameshow" 
                      ? "bg-electric-purple/20 text-electric-purple border-electric-purple/30" 
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
                  <SelectItem value="popularity">Sort by Popularity</SelectItem>
                  <SelectItem value="newest">Sort by Newest</SelectItem>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Templates Grid - Placeholder for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder template cards */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-dark-secondary/50 border-gray-700/50 hover:border-electric-purple/30 transition-all duration-300 hover:shadow-lg hover:shadow-electric-purple/10">
                <CardHeader>
                  <div className="text-4xl mb-2">🎲</div>
                  <CardTitle className="text-white">Coming Soon</CardTitle>
                  <CardDescription className="text-gray-400">
                    Game templates will be available here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className="text-white">Easy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Deploy Time:</span>
                      <span className="text-white">5 mins</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-electric-purple to-cyber-blue hover:from-cyber-blue hover:to-neon-green">
                    Deploy Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold mb-2">Templates Coming Soon</h3>
            <p className="text-gray-400">Ready-to-deploy game templates will be available here soon!</p>
          </div>
        </div>
      </main>

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
