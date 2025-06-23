import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GameResultModalProps {
  isOpen: boolean;
  survived: boolean;
  diceRoll: number;
  playerGuess: number;
  onClose: () => void;
}

export function GameResultModal({ 
  isOpen, 
  survived, 
  diceRoll, 
  playerGuess, 
  onClose 
}: GameResultModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-purple-500">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-purple-400">
            🎲 Game Result
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="text-gray-300 text-lg">🎲 DICE ROLL RESULT</div>
            
            {diceRoll > 0 ? (
              <>
                <div className="space-y-3">
                  <div className="text-gray-300">The dice rolled:</div>
                  <div className="text-6xl font-bold text-yellow-400 animate-pulse bg-gray-800 rounded-lg p-4 border-2 border-yellow-400">
                    {diceRoll}
                  </div>
                  <div className="text-gray-300 text-lg">Your guess: <span className="text-white font-bold">{playerGuess}</span></div>
                </div>
                
                <div className={`text-3xl font-bold p-4 rounded-lg border-2 ${
                  survived 
                    ? 'text-green-400 bg-green-900/20 border-green-400' 
                    : 'text-red-400 bg-red-900/20 border-red-400'
                }`}>
                  {survived ? '🎉 YOU SURVIVED!' : '💀 ELIMINATED'}
                </div>
                
                {survived && (
                  <div className="text-green-300 text-sm">
                    Congratulations! You advance to the next round.
                  </div>
                )}
                
                {!survived && (
                  <div className="text-red-300 text-sm">
                    Better luck next time! The dice chose {diceRoll}.
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-red-400 text-3xl font-bold">⏰ TIME'S UP!</div>
                <div className="text-gray-400">
                  You didn't submit a guess in time and have been eliminated.
                </div>
              </>
            )}
          </div>
          
          <Button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}