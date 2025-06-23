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
          {diceRoll > 0 && (
            <div className="space-y-2">
              <div className="text-gray-300">The dice rolled:</div>
              <div className="text-4xl font-bold text-yellow-400">{diceRoll}</div>
              <div className="text-gray-300">Your guess: {playerGuess}</div>
            </div>
          )}
          
          <div className={`text-2xl font-bold ${
            survived ? 'text-green-400' : 'text-red-400'
          }`}>
            {survived ? '🎉 SURVIVED!' : '💀 ELIMINATED'}
          </div>
          
          {!survived && diceRoll === 0 && (
            <div className="text-gray-400 text-sm">
              Time expired - no guess submitted
            </div>
          )}
          
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