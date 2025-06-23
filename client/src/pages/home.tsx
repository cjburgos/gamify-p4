import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletInfo } from "@/components/wallet/WalletInfo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GameTemplate {
  id: string;
  title: string;
  gameType: string;
  maxPlayers: string;
  fee: string;
  description: string;
  icon: string;
}

const gameTemplates: GameTemplate[] = [
  {
    id: "dice-roll",
    title: "Guess the Dice Roll",
    gameType: "Elimination",
    maxPlayers: "Unlimited",
    fee: "1% of prize pool",
    description: "Guess the Rice of the Dice Survivor Pool",
    icon: "🎲"
  },
  {
    id: "nfl-pick",
    title: "NFL Possession Outcome",
    gameType: "Prediction",
    maxPlayers: "1K",
    fee: "1% of prize pool", 
    description: "Pick the Outcome of the NFL Possession Survivor Pool",
    icon: "🏈"
  },
  {
    id: "card-pick",
    title: "Pick the Card",
    gameType: "Elimination",
    maxPlayers: "500",
    fee: "1% of prize pool",
    description: "Pick the Right Card Survivor Pool",
    icon: "🃏"
  },
  {
    id: "coin-flip",
    title: "Coin Flip Battle",
    gameType: "Elimination", 
    maxPlayers: "Unlimited",
    fee: "1% of prize pool",
    description: "Call Heads or Tails Survivor Pool",
    icon: "🪙"
  }
];

export default function Home() {
  const { isConnected } = useWallet();
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [deployConfig, setDeployConfig] = useState({
    entryCost: "",
    period: "",
    maxEntries: "", 
    numberOfGames: ""
  });

  const handleDeploy = () => {
    console.log("Deploying game:", selectedTemplate, deployConfig);
    // Here would be the actual deployment logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Retro Header */}
      <header className="border-b-4 border-yellow-400 bg-gradient-to-r from-purple-800 to-blue-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
              <div className="text-purple-900 text-2xl font-bold">🎮</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white pixel-font">
                PlayOnchain
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/arena" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">Arena</a>
            <a href="/" className="text-yellow-400 font-bold pixel-font text-lg hover:text-yellow-300 transition-colors">Marketplace</a>
            <a href="/profile" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">Profile</a>
            <a href="/gamemaster" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">GameMaster</a>
          </nav>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <WalletInfo />
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </header>

      {/* Marketplace Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-yellow-400 pixel-font mb-4">
            Game Smart Contract Marketplace
          </h2>
          <p className="text-xl text-blue-200 pixel-font max-w-3xl mx-auto">
            Deploy elimination-style games where players compete for stablecoin prizes. Choose your template and become a GameMaster.
          </p>
        </div>

        {/* Game Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {gameTemplates.map((template) => (
            <div 
              key={template.id}
              className="bg-gradient-to-br from-purple-800/70 to-blue-800/70 rounded-xl border-4 border-yellow-400/60 p-6 backdrop-blur-sm hover:border-yellow-400 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-yellow-400/25"
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{template.icon}</div>
                <h3 className="text-xl font-bold text-white pixel-font mb-2">{template.title}</h3>
                <p className="text-blue-200 pixel-font text-sm mb-4">{template.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-blue-300 pixel-font text-sm">Type:</span>
                  <span className="text-white pixel-font text-sm">{template.gameType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300 pixel-font text-sm">Max Players:</span>
                  <span className="text-yellow-400 pixel-font text-sm font-bold">{template.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300 pixel-font text-sm">Fee:</span>
                  <span className="text-green-400 pixel-font text-sm">{template.fee}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold pixel-font border-2 border-white hover:scale-105 transform transition-all duration-200 shadow-lg"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    Deploy Arena
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-md bg-gradient-to-br from-purple-800 to-blue-800 border-4 border-yellow-400 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold pixel-font text-yellow-400 text-center">
                      Deploy {selectedTemplate?.title}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="entryCost" className="text-blue-200 pixel-font">Entry Cost (USDC)</Label>
                      <Input 
                        id="entryCost"
                        value={deployConfig.entryCost}
                        onChange={(e) => setDeployConfig(prev => ({...prev, entryCost: e.target.value}))}
                        placeholder="1.00"
                        className="bg-purple-900/50 border-yellow-400/50 text-white pixel-font"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="period" className="text-blue-200 pixel-font">Period (hours)</Label>
                      <Input 
                        id="period"
                        value={deployConfig.period}
                        onChange={(e) => setDeployConfig(prev => ({...prev, period: e.target.value}))}
                        placeholder="8"
                        className="bg-purple-900/50 border-yellow-400/50 text-white pixel-font"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="maxEntries" className="text-blue-200 pixel-font">Max Entries</Label>
                      <Input 
                        id="maxEntries"
                        value={deployConfig.maxEntries}
                        onChange={(e) => setDeployConfig(prev => ({...prev, maxEntries: e.target.value}))}
                        placeholder="100"
                        className="bg-purple-900/50 border-yellow-400/50 text-white pixel-font"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="numberOfGames" className="text-blue-200 pixel-font">Number of Games</Label>
                      <Input 
                        id="numberOfGames"
                        value={deployConfig.numberOfGames}
                        onChange={(e) => setDeployConfig(prev => ({...prev, numberOfGames: e.target.value}))}
                        placeholder="10"
                        className="bg-purple-900/50 border-yellow-400/50 text-white pixel-font"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleDeploy}
                      className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold pixel-font border-2 border-white hover:scale-105 transform transition-all duration-200"
                    >
                      Deploy Smart Contract
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-8 backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-yellow-400 pixel-font mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h4 className="text-xl font-bold text-white pixel-font mb-2">Deploy</h4>
              <p className="text-blue-200 pixel-font text-sm">Choose a game template and configure your arena settings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">👥</div>
              <h4 className="text-xl font-bold text-white pixel-font mb-2">Players Join</h4>
              <p className="text-blue-200 pixel-font text-sm">Players enter with stablecoins and compete in elimination rounds</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h4 className="text-xl font-bold text-white pixel-font mb-2">Earn Fees</h4>
              <p className="text-blue-200 pixel-font text-sm">Collect 1% fees from every game while players win prizes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}