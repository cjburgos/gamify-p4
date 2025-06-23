import { useState } from "react";
import { useFlow } from "@/contexts/FlowContext";
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
    description: "Guess the Dice Roll Survivor Pool - Last player standing wins",
    icon: "🎲"
  },
  {
    id: "nfl-pick",
    title: "NFL Possession Outcome", 
    gameType: "Prediction",
    maxPlayers: "1K",
    fee: "1% of prize pool",
    description: "Pick the Outcome of NFL Possession Survivor Pool",
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
  const { user } = useFlow();
  const isConnected = user?.loggedIn || false;
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [deployConfig, setDeployConfig] = useState({
    entryCost: "",
    period: "",
    maxEntries: "",
    numberOfGames: ""
  });

  const handleDeploy = () => {
    console.log("Deploying game:", selectedTemplate, deployConfig);
    alert(`Deploying ${selectedTemplate?.title} with ${deployConfig.entryCost} USDC entry cost`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4c1d95 0%, #1e3a8a 50%, #312e81 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '4px solid #fbbf24',
        background: 'linear-gradient(90deg, #6b21a8 0%, #1e40af 100%)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>🎮</span>
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              fontFamily: 'monospace',
              margin: 0
            }}>
              PlayOnchain
            </h1>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '32px' }}>
            <a href="/arena" style={{
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'monospace',
              fontSize: '16px',
              padding: '8px 0'
            }}>Arena</a>
            <a href="/" style={{
              color: '#fbbf24',
              textDecoration: 'none',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '8px 0'
            }}>Marketplace</a>
            <a href="/profile" style={{
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'monospace',
              fontSize: '16px',
              padding: '8px 0'
            }}>Profile</a>
            <a href="/gamemaster" style={{
              color: 'white',
              textDecoration: 'none',
              fontFamily: 'monospace',
              fontSize: '16px',
              padding: '8px 0'
            }}>GameMaster</a>
          </nav>

          {/* Wallet */}
          <div>
            {isConnected ? <WalletInfo /> : <ConnectWallet />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#fbbf24',
              fontFamily: 'monospace',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              Game Smart Contract Marketplace
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#cbd5e1',
              fontFamily: 'monospace',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Deploy elimination-style games where players compete for stablecoin prizes. Choose your template and become a GameMaster.
            </p>
          </div>

          {/* Game Templates Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '48px'
          }}>
            {gameTemplates.map((template) => (
              <div key={template.id} style={{
                background: 'linear-gradient(135deg, rgba(107, 33, 168, 0.8) 0%, rgba(30, 64, 175, 0.8) 100%)',
                borderRadius: '12px',
                border: '3px solid rgba(251, 191, 36, 0.6)',
                padding: '24px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = '#fbbf24';
                target.style.transform = 'translateY(-4px)';
                target.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.3)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = 'rgba(251, 191, 36, 0.6)';
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}>
                
                {/* Template Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{template.icon}</div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'monospace',
                    marginBottom: '8px'
                  }}>
                    {template.title}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#cbd5e1',
                    fontFamily: 'monospace',
                    lineHeight: '1.4'
                  }}>
                    {template.description}
                  </p>
                </div>

                {/* Template Details */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>Type:</span>
                    <span style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>{template.gameType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>Max Players:</span>
                    <span style={{ fontSize: '12px', color: '#fbbf24', fontFamily: 'monospace', fontWeight: 'bold' }}>{template.maxPlayers}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>Fee:</span>
                    <span style={{ fontSize: '12px', color: '#4ade80', fontFamily: 'monospace' }}>{template.fee}</span>
                  </div>
                </div>

                {/* Deploy Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setSelectedTemplate(template)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                        color: '#581c87',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        border: '2px solid white',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        const target = e.currentTarget as HTMLElement;
                        target.style.transform = 'scale(1.02)';
                        target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.currentTarget as HTMLElement;
                        target.style.transform = 'scale(1)';
                        target.style.boxShadow = 'none';
                      }}
                    >
                      Deploy Arena
                    </Button>
                  </DialogTrigger>

                  <DialogContent style={{
                    maxWidth: '400px',
                    background: 'linear-gradient(135deg, #6b21a8 0%, #1e40af 100%)',
                    border: '3px solid #fbbf24',
                    borderRadius: '12px',
                    color: 'white'
                  }}>
                    <DialogHeader>
                      <DialogTitle style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        color: '#fbbf24',
                        textAlign: 'center'
                      }}>
                        Deploy {selectedTemplate?.title}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <Label htmlFor="entryCost" style={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}>
                          Entry Cost (USDC)
                        </Label>
                        <Input 
                          id="entryCost"
                          value={deployConfig.entryCost}
                          onChange={(e) => setDeployConfig(prev => ({...prev, entryCost: e.target.value}))}
                          placeholder="1.00"
                          style={{
                            background: 'rgba(88, 28, 135, 0.5)',
                            border: '1px solid rgba(251, 191, 36, 0.5)',
                            color: 'white',
                            fontFamily: 'monospace',
                            borderRadius: '6px',
                            padding: '8px 12px'
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="period" style={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}>
                          Period (hours)
                        </Label>
                        <Input 
                          id="period"
                          value={deployConfig.period}
                          onChange={(e) => setDeployConfig(prev => ({...prev, period: e.target.value}))}
                          placeholder="8"
                          style={{
                            background: 'rgba(88, 28, 135, 0.5)',
                            border: '1px solid rgba(251, 191, 36, 0.5)',
                            color: 'white',
                            fontFamily: 'monospace',
                            borderRadius: '6px',
                            padding: '8px 12px'
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="maxEntries" style={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}>
                          Max Entries
                        </Label>
                        <Input 
                          id="maxEntries"
                          value={deployConfig.maxEntries}
                          onChange={(e) => setDeployConfig(prev => ({...prev, maxEntries: e.target.value}))}
                          placeholder="100"
                          style={{
                            background: 'rgba(88, 28, 135, 0.5)',
                            border: '1px solid rgba(251, 191, 36, 0.5)',
                            color: 'white',
                            fontFamily: 'monospace',
                            borderRadius: '6px',
                            padding: '8px 12px'
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="numberOfGames" style={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}>
                          Number of Games
                        </Label>
                        <Input 
                          id="numberOfGames"
                          value={deployConfig.numberOfGames}
                          onChange={(e) => setDeployConfig(prev => ({...prev, numberOfGames: e.target.value}))}
                          placeholder="10"
                          style={{
                            background: 'rgba(88, 28, 135, 0.5)',
                            border: '1px solid rgba(251, 191, 36, 0.5)',
                            color: 'white',
                            fontFamily: 'monospace',
                            borderRadius: '6px',
                            padding: '8px 12px'
                          }}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleDeploy}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(90deg, #4ade80 0%, #16a34a 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          border: '2px solid white',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
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
          <div style={{
            background: 'linear-gradient(135deg, rgba(107, 33, 168, 0.6) 0%, rgba(30, 64, 175, 0.6) 100%)',
            borderRadius: '12px',
            border: '3px solid #fbbf24',
            padding: '32px',
            backdropFilter: 'blur(8px)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#fbbf24',
              fontFamily: 'monospace',
              marginBottom: '24px'
            }}>
              How It Works
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px'
            }}>
              <div>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', marginBottom: '8px' }}>
                  Deploy
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', fontFamily: 'monospace', lineHeight: '1.4' }}>
                  Choose a game template and configure your arena settings
                </p>
              </div>
              <div>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', marginBottom: '8px' }}>
                  Players Join
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', fontFamily: 'monospace', lineHeight: '1.4' }}>
                  Players enter with stablecoins and compete in elimination rounds
                </p>
              </div>
              <div>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>💰</div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', marginBottom: '8px' }}>
                  Earn Fees
                </h4>
                <p style={{ fontSize: '12px', color: '#cbd5e1', fontFamily: 'monospace', lineHeight: '1.4' }}>
                  Collect 1% fees from every game while players win prizes
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}