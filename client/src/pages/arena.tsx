import { useState, useEffect } from 'react';
import { useFlow } from '../contexts/MinimalFlowContext';
import { GameCountdownTimer } from '../components/GameCountdownTimer';
import { DiceGuessModal } from '../components/DiceGuessModal';
import { GameResultModal } from '../components/GameResultModal';

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
  const { user, joinGame, getActivePlayers } = useFlow();
  const [deployedGames, setDeployedGames] = useState<DeployedGame[]>([]);
  const [joinedGames, setJoinedGames] = useState<Set<string>>(new Set());
  const [startedGames, setStartedGames] = useState<Set<string>>(new Set());
  const [eliminatedGames, setEliminatedGames] = useState<Set<string>>(new Set());
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  
  // Modal states
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<{
    survived: boolean;
    diceRoll: number;
    playerGuess: number;
  } | null>(null);

  // Fetch deployed games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Add cache-busting to prevent browser caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/deployed-games?t=${timestamp}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (response.ok) {
          const games = await response.json();
          console.log(`Fetched ${games.length} games at ${new Date().toLocaleTimeString()}`);
          setDeployedGames(games);
        } else {
          console.error('Failed to fetch games:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
    const interval = setInterval(fetchGames, 2000); // Poll every 2 seconds for more responsive updates
    return () => clearInterval(interval);
  }, []);

  const handleGameStart = (gameId: string) => {
    console.log(`Game ${gameId} has started!`);
    setStartedGames(prev => new Set([...prev, gameId]));
    
    const userAddress = user?.addr;
    const userJoinedLocally = joinedGames.has(gameId);
    
    console.log(`User address: ${userAddress}`);
    console.log(`User joined locally: ${userJoinedLocally}`);
    
    if (userAddress && userJoinedLocally) {
      console.log('User joined this game - starting round 1');
      // Initialize round counter
      setActiveGameRounds(prev => ({ ...prev, [gameId]: 1 }));
      
      setTimeout(() => {
        console.log('Starting Round 1 - showing dice modal');
        setShowDiceModal(prev => ({ ...prev, [gameId]: true }));
      }, 2000);
    } else {
      console.log('User did not join this game - no modal');
    }
  };

  const handleJoinGame = async (game: DeployedGame) => {
    if (!user?.loggedIn) {
      alert('Please connect your wallet first');
      return;
    }

    setJoiningGameId(game.id);
    
    try {
      console.log(`Player reserving spot in game ${game.id}...`);
      
      // ONLY mark as joined locally - NO blockchain transaction
      setJoinedGames(prev => new Set([...prev, game.id]));
      
      // Simulate join delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Successfully reserved spot in game ${game.id}!`);
      alert(`Successfully joined game ${game.id}! Wait for the game to start.`);
      
    } catch (error) {
      console.error('Failed to join game:', error);
      alert(`Failed to join game: ${error.message || 'Unknown error'}`);
    } finally {
      setJoiningGameId(null);
    }
  };

  const handleGuessResult = (survived: boolean, diceRoll: number, playerGuess: number) => {
    setShowGuessModal(false);
    setGameResult({ survived, diceRoll, playerGuess });
    setShowResultModal(true);
    
    if (!survived && activeGameId) {
      setEliminatedGames(prev => new Set([...prev, activeGameId]));
    }
  };

  const handleResultClose = () => {
    setShowResultModal(false);
    setGameResult(null);
    setActiveGameId(null);
  };

  const isGameOver = (deployedAt: string) => {
    const activationSeconds = parseInt(import.meta.env.VITE_GAME_ACTIVATION_TIME_SECONDS || '90');
    const gameStartTime = new Date(deployedAt).getTime() + (activationSeconds * 1000);
    return Date.now() > gameStartTime;
  };

  const isUserEliminated = (gameId: string) => {
    return eliminatedGames.has(gameId);
  };

  const hasGameStarted = (gameId: string) => {
    return startedGames.has(gameId);
  };

  const getButtonState = (game: DeployedGame) => {
    if (isUserEliminated(game.id)) return 'eliminated';
    if (isGameOver(game.deployedAt)) return 'gameOver';
    if (joinedGames.has(game.id)) {
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

  const renderButton = (game: DeployedGame) => {
    const buttonState = getButtonState(game);
    const isJoining = joiningGameId === game.id;

    switch (buttonState) {
      case 'joinGame':
        return (
          <button
            onClick={() => handleJoinGame(game)}
            disabled={isJoining}
            style={{
              background: "linear-gradient(45deg, #059669 0%, #10b981 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isJoining ? "not-allowed" : "pointer",
              opacity: isJoining ? 0.6 : 1,
              width: "100%"
            }}
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </button>
        );
      case 'waitingToStart':
        return (
          <button
            disabled
            style={{
              background: "linear-gradient(45deg, #f59e0b 0%, #fbbf24 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "not-allowed",
              width: "100%"
            }}
          >
            Waiting to Start
          </button>
        );
      case 'enterGame':
        return (
          <button
            onClick={() => {
              setActiveGameId(game.id);
              setShowGuessModal(true);
            }}
            style={{
              background: "linear-gradient(45deg, #7c3aed 0%, #a855f7 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Enter Game
          </button>
        );
      case 'eliminated':
        return (
          <button
            disabled
            style={{
              background: "linear-gradient(45deg, #dc2626 0%, #ef4444 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "not-allowed",
              width: "100%"
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
              background: "linear-gradient(45deg, #6b7280 0%, #9ca3af 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "not-allowed",
              width: "100%"
            }}
          >
            Game Over
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #4c1d95 0%, #1e3a8a 50%, #312e81 100%)",
      color: "white",
      fontFamily: "monospace"
    }}>
      <header style={{
        borderBottom: "4px solid #fbbf24",
        background: "linear-gradient(90deg, #6b21a8 0%, #1e40af 100%)",
        padding: "16px 24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fbbf24" }}>
            🎮 PlayOnchain
          </div>
          
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <a href="/arena" style={{ color: "#fbbf24", textDecoration: "none", fontSize: "18px", fontWeight: "500", borderBottom: "2px solid #fbbf24" }}>
              Arena
            </a>
            <a href="/" style={{ color: "#e5e7eb", textDecoration: "none", fontSize: "18px", fontWeight: "500" }}>
              Marketplace
            </a>
            <a href="/profile" style={{ color: "#e5e7eb", textDecoration: "none", fontSize: "18px", fontWeight: "500" }}>
              Profile
            </a>
            <a href="/gamemaster" style={{ color: "#e5e7eb", textDecoration: "none", fontSize: "18px", fontWeight: "500" }}>
              GameMaster
            </a>
          </nav>
          
          <div style={{ color: "#e5e7eb" }}>
            {user?.loggedIn ? `Connected: ${formatAddress(user.addr || '')}` : 'Not Connected'}
          </div>
        </div>
      </header>

      <main style={{ padding: "32px" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h1 style={{ fontSize: "48px", margin: "0 0 16px 0", color: "#fbbf24" }}>
            🏟️ Game Arena
          </h1>
          <p style={{ fontSize: "20px", color: "#e5e7eb", margin: 0 }}>
            Join live elimination games deployed by GameMasters
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "32px"
        }}>
          {deployedGames
            .sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime())
            .map((game) => (
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
                🎲
              </div>
              
              <h3 style={{ fontSize: "20px", color: "white", marginBottom: "16px", textAlign: "center" }}>
                {game.gameType} Game
              </h3>
              
              <GameCountdownTimer 
                deployedAt={game.deployedAt}
                onGameStart={() => {
                  console.log(`Timer expired for game ${game.id}, calling handleGameStart`);
                  handleGameStart(game.id);
                }}
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
                  <span style={{ color: isGameOver(game.deployedAt) ? "#ef4444" : game.isActive ? "#4ade80" : "#ef4444" }}>
                    {isGameOver(game.deployedAt) ? "Game Over" : game.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                  <span style={{ color: "#94a3b8" }}>Players:</span>
                  <span style={{ color: "#60a5fa", fontWeight: "bold" }}>
                    {(game.players?.length || 0) + (joinedGames.has(game.id) ? 1 : 0)} joined
                  </span>
                </div>
              </div>

              {renderButton(game)}
            </div>
          ))}
        </div>
      </main>

      {showGuessModal && activeGameId && (
        <DiceGuessModal
          isOpen={showGuessModal}
          gameId={activeGameId}
          onClose={() => setShowGuessModal(false)}
          onResult={handleGuessResult}
        />
      )}

      {showResultModal && gameResult && (
        <GameResultModal
          isOpen={showResultModal}
          survived={gameResult.survived}
          diceRoll={gameResult.diceRoll}
          playerGuess={gameResult.playerGuess}
          onClose={handleResultClose}
        />
      )}
    </div>
  );
}