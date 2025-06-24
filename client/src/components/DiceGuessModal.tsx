import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFlow } from '@/contexts/MinimalFlowContext';

interface DiceGuessModalProps {
  isOpen: boolean;
  gameId: string;
  onClose: () => void;
  onResult: (survived: boolean, diceRoll: number, playerGuess: number) => void;
  roundNumber?: number;
}

export function DiceGuessModal({ isOpen, gameId, onClose, onResult, roundNumber = 1 }: DiceGuessModalProps) {
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { joinGame } = useFlow();

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setGuess('');
      setTimeLeft(10);
      setIsSubmitting(false);
      setHasSubmitted(false);
      return;
    }

    // Start 10-second countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto eliminate
          if (!hasSubmitted) {
            handleAutoElimination();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, hasSubmitted]);

  const handleAutoElimination = async () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setIsSubmitting(true);
    
    console.log('Time expired - player eliminated');
    // Show elimination result without calling contract
    setTimeout(() => {
      onResult(false, 0, 0); // survived: false, no dice roll needed
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSubmitGuess = async () => {
    if (hasSubmitted || isSubmitting) return;
    
    const playerGuess = parseInt(guess);
    if (!playerGuess || playerGuess < 1 || playerGuess > 6) {
      alert('Please enter a valid guess between 1 and 6');
      return;
    }

    setHasSubmitted(true);
    setIsSubmitting(true);

    try {
      console.log(`Player submitted guess ${playerGuess} for game ${gameId}`);
      
      // Submit the actual guess to blockchain now
      if (joinGame) {
        const success = await joinGame(gameId, playerGuess);
        if (!success) {
          throw new Error('Failed to submit guess to blockchain');
        }
      }
      
      console.log(`Guess ${playerGuess} submitted to blockchain for game ${gameId}`);
      
      // Show "waiting for results" state
      setTimeout(async () => {
        try {
          // Get the shared dice roll from the server for this specific game
          const response = await fetch(`/api/games/${gameId}/dice-result`);
          let diceRoll: number;
          
          if (response.ok) {
            const result = await response.json();
            diceRoll = result.diceRoll;
            console.log(`Retrieved shared dice roll for game ${gameId}: ${diceRoll}`);
          } else if (response.status === 404) {
            // No dice roll exists yet - generate and store one for this game
            diceRoll = Math.floor(Math.random() * 6) + 1;
            console.log(`Generated new dice roll for game ${gameId}: ${diceRoll}`);
            
            // Store it on the server so other players get the same result
            const storeResponse = await fetch(`/api/games/${gameId}/dice-result`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ diceRoll })
            });
            
            if (storeResponse.ok) {
              const stored = await storeResponse.json();
              diceRoll = stored.diceRoll; // Use the stored value in case another player beat us
              console.log(`Confirmed dice roll for game ${gameId}: ${diceRoll}`);
            }
          } else {
            throw new Error(`Failed to get dice result: ${response.status}`);
          }
          
          const survived = playerGuess === diceRoll;
          console.log(`Game ${gameId} - Dice: ${diceRoll}, Guess: ${playerGuess}, Survived: ${survived}`);
          
          onResult(survived, diceRoll, playerGuess);
          setIsSubmitting(false);
        } catch (error) {
          console.error('Error getting dice result:', error);
          // Emergency fallback - still try to be consistent
          const diceRoll = Math.floor(Math.random() * 6) + 1;
          const survived = playerGuess === diceRoll;
          onResult(survived, diceRoll, playerGuess);
          setIsSubmitting(false);
        }
      }, 2000); // Wait 2 seconds to simulate dice roll delay
    } catch (error) {
      console.error('Error submitting guess:', error);
      setTimeout(() => {
        onResult(false, 0, playerGuess);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !hasSubmitted && !isSubmitting) {
      handleSubmitGuess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-purple-500">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-purple-400">
            🎲 Guess the Dice Roll!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <div className="text-xl font-mono text-yellow-400 bg-yellow-900/20 p-3 rounded-lg border border-yellow-400">
            ⏰ Time Left: {timeLeft}s
          </div>
          
          {!hasSubmitted ? (
            <>
              <div className="text-gray-300">
                Enter your guess (1-6):
              </div>
              
              <Input
                type="number"
                min="1"
                max="6"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-2xl font-bold bg-gray-800 border-purple-500 text-white"
                placeholder="?"
                autoFocus
                disabled={isSubmitting}
              />
              
              <Button
                onClick={handleSubmitGuess}
                disabled={!guess || isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Guess'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              {isSubmitting ? (
                <>
                  <div 
                    className="text-6xl mx-auto w-fit"
                    style={{ 
                      animation: "spin 0.3s linear infinite",
                      color: "#fbbf24"
                    }}
                  >
                    🎲
                  </div>
                  <div className="text-yellow-400 text-lg font-bold">Rolling dice...</div>
                  <style>{`
                    @keyframes spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </>
              ) : (
                <div className="text-green-400 text-lg font-bold">✅ Guess submitted!</div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}