import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletInfo } from "@/components/wallet/WalletInfo";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";

export default function SmartContracts() {
  const [flowGameId, setFlowGameId] = useState("");
  const [ethNumber, setEthNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useWallet();
  const { toast } = useToast();

  const createFlowGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/flow/create-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFlowGameId(data.gameId);
        toast({
          title: "Success",
          description: `Flow game created with ID: ${data.gameId}`,
        });
      } else {
        throw new Error("Failed to create game");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Flow game",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setEthereumNumber = async () => {
    if (!ethNumber || isNaN(Number(ethNumber))) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ethereum/set-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: Number(ethNumber) }),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Number set to ${ethNumber} on Ethereum contract`,
        });
      } else {
        throw new Error("Failed to set number");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set number on Ethereum contract",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const incrementEthereum = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ethereum/increment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Number incremented on Ethereum contract",
        });
      } else {
        throw new Error("Failed to increment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to increment Ethereum contract",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-secondary/95 backdrop-blur-sm border-b border-electric-purple/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">⛓️</div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Smart Contract Dashboard
              </h1>
              <p className="text-sm text-gray-400">Interact with Flow & Ethereum Contracts</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-300 hover:text-cyber-blue transition-colors">Browse Games</a>
            <a href="/smart-contracts" className="text-electric-purple font-semibold">Smart Contracts</a>
            <a href="/marketplace" className="text-gray-300 hover:text-cyber-blue transition-colors">Game Templates</a>
          </nav>

          <div className="flex items-center gap-3">
            {isConnected ? (
              <WalletInfo />
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Blockchain Integration
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Interact directly with Flow and Ethereum smart contracts
            </p>
          </div>

          <Tabs defaultValue="flow" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-dark-secondary/50 backdrop-blur-sm border border-gray-700/50 mb-8">
              <TabsTrigger 
                value="flow" 
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500/30"
              >
                Flow Blockchain
              </TabsTrigger>
              <TabsTrigger 
                value="ethereum" 
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30"
              >
                Ethereum
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flow" className="space-y-6">
              <Card className="bg-dark-secondary/50 border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <span className="text-2xl">🎲</span>
                        Flow Dice Game Contract
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        GuessTheDice contract on Flow blockchain
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Flow
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">Contract Address</Label>
                        <p className="text-sm font-mono text-gray-300 bg-dark-tertiary p-2 rounded">
                          0x0dd7dc583201e8b1
                        </p>
                      </div>
                      <div>
                        <Label className="text-white">Contract Name</Label>
                        <p className="text-sm text-gray-300">GuessTheDice</p>
                      </div>
                      <div>
                        <Label className="text-white">Entry Fee</Label>
                        <p className="text-sm text-gray-300">1.0 FLOW</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Button
                        onClick={createFlowGame}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        {isLoading ? "Creating..." : "Create New Game"}
                      </Button>
                      {flowGameId && (
                        <div>
                          <Label className="text-white">Created Game ID</Label>
                          <p className="text-sm font-mono text-green-400 bg-dark-tertiary p-2 rounded">
                            {flowGameId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Game Rules</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Players join by paying the entry fee and making a guess (1-6)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Game uses Flow's RandomBeaconHistory for verifiable randomness
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Players with correct guesses survive to the next round
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Last survivors split the prize pool
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ethereum" className="space-y-6">
              <Card className="bg-dark-secondary/50 border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <span className="text-2xl">🔢</span>
                        Ethereum Game Contract
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Simple number game with proxy pattern
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Ethereum
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">Implementation Contract</Label>
                        <p className="text-sm font-mono text-gray-300 bg-dark-tertiary p-2 rounded">
                          0x1234...7890
                        </p>
                      </div>
                      <div>
                        <Label className="text-white">Proxy Contract</Label>
                        <p className="text-sm font-mono text-gray-300 bg-dark-tertiary p-2 rounded">
                          0x0987...4321
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Enter number"
                          value={ethNumber}
                          onChange={(e) => setEthNumber(e.target.value)}
                          className="bg-dark-tertiary border-gray-600 text-white"
                        />
                        <Button
                          onClick={setEthereumNumber}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          Set
                        </Button>
                      </div>
                      <Button
                        onClick={incrementEthereum}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        {isLoading ? "Processing..." : "Increment Number"}
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Contract Features</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        Upgradeable proxy pattern for contract flexibility
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        Simple number storage and manipulation
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        Foundation for more complex game logic
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        Can be extended with additional game features
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}