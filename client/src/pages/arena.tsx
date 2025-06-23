import { useState, useEffect } from "react";
import { useFlow } from "../contexts/MinimalFlowContext";
import { ConnectWallet } from "../components/wallet/ConnectWallet";
import { WalletInfo } from "../components/wallet/WalletInfo";
import { WalletGuard } from '@/components/wallet/WalletGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameCountdownTimer } from '@/components/GameCountdownTimer';
import { DiceGuessModal } from '@/components/DiceGuessModal';
import { GameResultModal } from '@/components/GameResultModal';

interface DeployedGame {
  id: string;
  gameType: string;
  gameMaster: string;
  entryCost: number;
  transactionId: string;
  deployedAt: string;
  isActive: boolean;
  players?: string[];
  gameStartTime?: string;
  status?: 'waiting' | 'started' | 'finished';
}

export default function Arena() {
  const { user, joinGame, isLoading, getActivePlayers } = useFlow();
  const isConnected = user?.loggedIn || false;
  const [deployedGames, setDeployedGames] = useState<DeployedGame[]>([]);
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [gameResult, setGameResult] = useState<{
    survived: boolean;
    diceRoll: number;
    playerGuess: number;
  } | null>(null);
  const [eliminatedGames, setEliminatedGames] = useState<Set<string>>(new Set());
  const [joinedGames, setJoinedGames] = useState<Set<string>>(new Set());
  const [startedGames, setStartedGames] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/deployed-games');
        if (response.ok) {
          const games = await response.json();
          console.log('Loaded games from API:', games);
          setDeployedGames(games);
        }
      } catch (error) {
        console.error('Failed to fetch deployed games:', error);
      }
    };

    // Initial fetch
    fetchGames();
    
    // Fetch games every 5 seconds
    const gamesInterval = setInterval(fetchGames, 5000);
    
    return () => clearInterval(gamesInterval);
  }, []);

  // Separate effect for active players synchronization every 2 seconds
  useEffect(() => {
    const syncActivePlayers = async () => {
      if (!getActivePlayers || deployedGames.length === 0) {
        return;
      }

      console.log('=== Starting active players sync ===');
      
      const updatedGames = await Promise.all(deployedGames.map(async (game: DeployedGame) => {
        try {
          console.log(`Checking active players for game ${game.id}...`);
          console.log(`Current stored players:`, game.players);
          
          const activePlayers = await getActivePlayers(game.id);
          console.log(`Contract returned for game ${game.id}:`, activePlayers);
          
          // Check if we need to sync
          const needsSync = !game.players || 
                           game.players.length !== activePlayers.length || 
                           (activePlayers.length > 0 && !activePlayers.every(player => game.players?.includes(player))) ||
                           (game.players.length > 0 && !game.players.every(player => activePlayers.includes(player)));
          
          if (needsSync) {
            console.log(`Syncing backend for game ${game.id} with contract players:`, activePlayers);
            
            try {
              const response = await fetch(`/api/deployed-games/${game.id}/players`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ players: activePlayers }),
              });
              
              if (response.ok) {
                console.log(`Successfully updated backend for game ${game.id}`);
                return { ...game, players: activePlayers };
              } else {
                console.error(`Failed to update backend for game ${game.id}:`, response.status);
              }
            } catch (updateError) {
              console.error(`Error updating backend for game ${game.id}:`, updateError);
            }
          }
          
          return game;
        } catch (error) {
          console.warn(`Failed to get active players for game ${game.id}:`, error);
          return game;
        }
      }));
      
      // Update state if any games were modified
      const hasChanges = updatedGames.some((game, index) => 
        game.players?.length !== deployedGames[index]?.players?.length ||
        (game.players && deployedGames[index]?.players && 
         !game.players.every(player => deployedGames[index]?.players?.includes(player)))
      );
      
      if (hasChanges) {
        console.log('Player data changed, updating UI');
        setDeployedGames(updatedGames);
      }
    };

    // Start syncing active players every 2 seconds
    const playersInterval = setInterval(syncActivePlayers, 2000);
    
    return () => clearInterval(playersInterval);
  }, [getActivePlayers, deployedGames]);

  const handleGameStart = (gameId: string) => {
    console.log(`Game ${gameId} has started!`);
    setStartedGames(prev => new Set([...prev, gameId]));
  };

  const handleEnterGame = (gameId: string) => {
    console.log(`User entering game ${gameId}`);
    setActiveGameId(gameId);
    setShowGuessModal(true);
  };

  const handleGuessResult = (survived: boolean, diceRoll: number, playerGuess: number) => {
    setShowGuessModal(false);
    setGameResult({ survived, diceRoll, playerGuess });
    setShowResultModal(true);
    
    // If eliminated, add to eliminated games set
    if (!survived && activeGameId) {
      setEliminatedGames(prev => new Set([...prev, activeGameId]));
    }
  };

  const handleResultClose = () => {
    setShowResultModal(false);
    setGameResult(null);
    setActiveGameId(null);
  };

  const isUserEliminated = (gameId: string) => {
    return eliminatedGames.has(gameId);
  };

  const isGameOver = (deployedAt: string) => {
    const deployTime = new Date(deployedAt).getTime();
    const activationSeconds = parseInt(import.meta.env.VITE_GAME_ACTIVATION_TIME_SECONDS || '90');
    const gameStartTime = deployTime + (activationSeconds * 1000);
    const now = Date.now();
    return now >= gameStartTime;
  };

  const hasUserJoined = (game: DeployedGame) => {
    const userAddress = user?.addr;
    return userAddress && game.players?.includes(userAddress);
  };

  const isUserJoined = (gameId: string) => {
    return joinedGames.has(gameId);
  };

  const hasGameStarted = (gameId: string) => {
    return startedGames.has(gameId);
  };

  const getButtonState = (game: DeployedGame) => {
    if (isUserEliminated(game.id)) return 'eliminated';
    if (isGameOver(game.deployedAt)) return 'gameOver';
    if (hasUserJoined(game) || isUserJoined(game.id)) {
      if (hasGameStarted(game.id)) return 'enterGame';
      return 'waitingToStart';
    }
    return 'joinGame';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleJoinGame = async (game: DeployedGame) => {
    if (!user?.loggedIn) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setJoiningGameId(game.id);
      
      // Generate a random guess between 1 and 6 for dice game
      const guess = Math.floor(Math.random() * 6) + 1;
      
      const success = await joinGame(game.id, guess);
      if (success) {
        alert(`Successfully joined game ${game.id} with guess ${guess}!`);
        // Force a refresh of the games list
        setTimeout(async () => {
          const response = await fetch('/api/deployed-games');
          if (response.ok) {
            const games = await response.json();
            setDeployedGames(games);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to join game:', error);
      alert(`Failed to join game: ${error.message || 'Unknown error'}`);
    } finally {
      setJoiningGameId(null);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #4c1d95 0%, #1e3a8a 50%, #312e81 100%)",
      color: "white",
      fontFamily: "monospace"
    }}>
      {/* Header */}
      <header style={{
        borderBottom: "4px solid #fbbf24",
        background: "linear-gradient(90deg, #6b21a8 0%, #1e40af 100%)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            fontSize: "24px"
          }}>🎮</div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>PlayOnchain</h1>
        </div>

        <nav style={{ display: "flex", gap: "32px" }}>
          <a href="/arena" style={{
            color: "#fbbf24",
            textDecoration: "none",
            fontFamily: "monospace",
            fontSize: "16px",
            padding: "8px 0",
            fontWeight: "bold"
          }}>Arena</a>
          <a href="/" style={{
            color: "white",
            textDecoration: "none",
            fontFamily: "monospace",
            fontSize: "16px",
            padding: "8px 0"
          }}>Marketplace</a>
          <a href="/profile" style={{
            color: "white",
            textDecoration: "none",
            fontFamily: "monospace",
            fontSize: "16px",
            padding: "8px 0"
          }}>Profile</a>
          <a href="/gamemaster" style={{
            color: "white",
            textDecoration: "none",
            fontFamily: "monospace",
            fontSize: "16px",
            padding: "8px 0"
          }}>GameMaster</a>
        </nav>

        {/* Wallet */}
        <div>
          {isConnected ? <WalletInfo /> : <ConnectWallet />}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "48px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "36px", color: "#fbbf24", marginBottom: "16px" }}>
            Game Arena
          </h1>
          <p style={{ 
            fontSize: "18px", 
            color: "#cbd5e1", 
            maxWidth: "600px", 
            margin: "0 auto", 
            lineHeight: "1.6" 
          }}>
            Active games deployed on Flow blockchain. Join elimination-style competitions and compete for prizes.
          </p>
        </div>

        {deployedGames.length === 0 ? (
          <div style={{
            background: "linear-gradient(135deg, rgba(107, 33, 168, 0.6) 0%, rgba(30, 64, 175, 0.6) 100%)",
            borderRadius: "12px",
            border: "3px solid #fbbf24",
            padding: "48px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
            <h2 style={{ fontSize: "24px", color: "#fbbf24", marginBottom: "16px" }}>
              No Active Games
            </h2>
            <p style={{ fontSize: "16px", color: "#cbd5e1", marginBottom: "24px" }}>
              Deploy your first game from the Marketplace to see it here.
            </p>
            <a 
              href="/"
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)",
                color: "#581c87",
                fontWeight: "bold",
                border: "2px solid white",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "16px",
                textDecoration: "none",
                fontFamily: "monospace"
              }}
            >
              Browse Marketplace
            </a>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "32px"
          }}>
            {deployedGames.map((game) => (
              <div
                key={game.id}
                style={{
                  background: "linear-gradient(135deg, rgba(107, 33, 168, 0.8) 0%, rgba(30, 64, 175, 0.8) 100%)",
                  borderRadius: "12px",
                  border: "3px solid rgba(251, 191, 36, 0.6)",
                  padding: "24px",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ fontSize: "48px", textAlign: "center", marginBottom: "12px" }}>
                  {game.gameType === "Elimination" ? "🎲" : 
                   game.gameType === "Prediction" ? "🏈" : 
                   game.gameType === "Card" ? "🃏" : "🪙"}
                </div>
                
                <h3 style={{ fontSize: "20px", color: "white", marginBottom: "16px", textAlign: "center" }}>
                  {game.gameType} Game
                </h3>
                
                <GameCountdownTimer 
                  deployedAt={game.deployedAt}
                  onGameStart={() => handleGameStart(game.id)}
                  className="mb-4"
                />
                
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ color: "#94a3b8" }}>Game ID:</span>
                    <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "12px" }}>
                      {game.id.slice(0, 12)}...
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ color: "#94a3b8" }}>Game Master:</span>
                    <span style={{ color: "white" }}>{formatAddress(game.gameMaster)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ color: "#94a3b8" }}>Entry Fee:</span>
                    <span style={{ color: "#4ade80", fontWeight: "bold" }}>${game.entryCost}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ color: "#94a3b8" }}>Deployed:</span>
                    <span style={{ color: "white" }}>{formatDate(game.deployedAt)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ color: "#94a3b8" }}>Status:</span>
                    <span style={{ color: game.isActive ? "#4ade80" : "#ef4444" }}>
                      {game.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Pool Size */}
                  <div style={{
                    marginBottom: "8px",
                    padding: "8px 10px",
                    background: "rgba(147, 51, 234, 0.2)",
                    borderRadius: "6px",
                    border: "1px solid rgba(147, 51, 234, 0.5)"
                  }}>
                    <span style={{
                      color: "#c084fc",
                      fontSize: "13px",
                      fontWeight: "bold",
                      fontFamily: "monospace"
                    }}>
                      Pool Size: {((game.players?.length || 0) * game.entryCost).toFixed(2)} FLOW
                    </span>
                    <span style={{
                      color: "#e2e8f0",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      marginLeft: "8px"
                    }}>
                      ({game.players?.length || 0} players)
                    </span>
                  </div>

                  {/* Players section */}
                  {game.players && game.players.length > 0 && (
                    <div style={{
                      marginBottom: "12px",
                      padding: "10px",
                      background: "rgba(34, 197, 94, 0.15)",
                      borderRadius: "6px",
                      border: "1px solid rgba(34, 197, 94, 0.4)"
                    }}>
                      <div style={{
                        fontSize: "12px",
                        color: "#4ade80",
                        fontWeight: "bold",
                        marginBottom: "6px",
                        fontFamily: "monospace"
                      }}>
                        Players Joined ({game.players.length}):
                      </div>
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px"
                      }}>
                        {game.players.map((player, index) => (
                          <span
                            key={index}
                            style={{
                              fontSize: "10px",
                              color: "#ffffff",
                              background: "rgba(34, 197, 94, 0.6)",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontFamily: "monospace",
                              border: "1px solid rgba(34, 197, 94, 0.8)",
                              fontWeight: "500"
                            }}
                          >
                            {formatAddress(player)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {(() => {
                  const buttonState = getButtonState(game);
                  
                  switch (buttonState) {
                    case 'eliminated':
                      return (
                        <button
                          disabled
                          style={{
                            width: "100%",
                            background: "#dc2626",
                            color: "white",
                            border: "2px solid white",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "not-allowed",
                            opacity: 0.7,
                            fontFamily: "monospace"
                          }}
                        >
                          Eliminated
                        </button>
                      );
                    case 'gameOver':
                      return (
                        <button
                          disabled
                          style={{
                            width: "100%",
                            background: "#6b7280",
                            color: "white",
                            border: "2px solid white",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "not-allowed",
                            opacity: 0.7,
                            fontFamily: "monospace"
                          }}
                        >
                          Game Over
                        </button>
                      );
                    case 'waitingToStart':
                      return (
                        <button
                          disabled
                          style={{
                            width: "100%",
                            background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                            color: "white",
                            border: "2px solid white",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "not-allowed",
                            fontFamily: "monospace"
                          }}
                        >
                          Waiting to Start
                        </button>
                      );
                    case 'enterGame':
                      return (
                        <button
                          onClick={() => handleEnterGame(game.id)}
                          style={{
                            width: "100%",
                            background: "linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)",
                            color: "white",
                            border: "2px solid white",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontFamily: "monospace"
                          }}
                        >
                          Enter Game
                        </button>
                      );
                    default: // joinGame
                      return (
                        <button 
                          onClick={() => handleJoinGame(game)}
                          disabled={!game.isActive || !user?.loggedIn || joiningGameId === game.id}
                          style={{
                            width: "100%",
                            background: (!game.isActive || !user?.loggedIn || joiningGameId === game.id) ? "#666" : "linear-gradient(90deg, #4ade80 0%, #22c55e 100%)",
                            color: (!game.isActive || !user?.loggedIn || joiningGameId === game.id) ? "#fff" : "#065f46",
                            fontWeight: "bold",
                            border: "2px solid white",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            cursor: (!game.isActive || !user?.loggedIn || joiningGameId === game.id) ? "not-allowed" : "pointer",
                            fontFamily: "monospace",
                            opacity: (!game.isActive || !user?.loggedIn || joiningGameId === game.id) ? 0.6 : 1
                          }}
                        >
                          {joiningGameId === game.id ? "Joining..." : 
                           !user?.loggedIn ? "Connect Wallet" :
                           !game.isActive ? "Game Ended" : "Join Game"}
                        </button>
                      );
                  }
                })()}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}