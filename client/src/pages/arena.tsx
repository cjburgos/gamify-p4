import { useState, useEffect } from "react";
import { useFlow } from "../contexts/MinimalFlowContext";
import { ConnectWallet } from "../components/wallet/ConnectWallet";
import { WalletInfo } from "../components/wallet/WalletInfo";

interface DeployedGame {
  id: string;
  gameType: string;
  gameMaster: string;
  entryCost: number;
  transactionId: string;
  deployedAt: string;
  isActive: boolean;
  players?: string[];
}

export default function Arena() {
  const { user, joinGame, isLoading, getActivePlayers } = useFlow();
  const isConnected = user?.loggedIn || false;
  const [deployedGames, setDeployedGames] = useState<DeployedGame[]>([]);
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);

  useEffect(() => {
    // Load deployed games from API
    const loadGames = async () => {
      try {
        const response = await fetch('/api/deployed-games');
        if (response.ok) {
          const games = await response.json();
          console.log('Loaded games from API:', games);
          setDeployedGames(games);
        } else {
          console.error('Failed to load games from API');
          setDeployedGames([]);
        }
      } catch (error) {
        console.error('Error loading games from API:', error);
        setDeployedGames([]);
      }
    };

    // Initial load
    loadGames();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(loadGames, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
                </div>

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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}