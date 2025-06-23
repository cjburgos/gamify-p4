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
}

export function DiceGuessModal({ isOpen, gameId, onClose, onResult }: DiceGuessModalProps) {
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
      console.log(`Submitting guess ${playerGuess} for game ${gameId}`);
      
      // For the game round, we simulate the guess submission since we already joined
      // In a real implementation, this would update the guess on the contract
      console.log(`Guess ${playerGuess} recorded for game ${gameId}`);
      
      // Show "waiting for results" state
      setTimeout(() => {
        // Simulate getting dice roll result from contract (same for all players)
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const survived = playerGuess === diceRoll;
        
        console.log(`Dice rolled: ${diceRoll}, Player guessed: ${playerGuess}, Survived: ${survived}`);
        
        onResult(survived, diceRoll, playerGuess);
        setIsSubmitting(false);
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
            <div className="space-y-3">
              <div className="text-yellow-400 text-lg font-bold">
                {isSubmitting ? '🎲 Rolling dice...' : '✅ Guess submitted!'}
              </div>
              {isSubmitting && (
                <div className="text-gray-300 text-sm">
                  Please wait while the dice is rolled...
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}