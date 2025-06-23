# Game Flow Test Instructions

## Expected Flow:
1. User clicks "Join Game" 
2. Alert shows: "Successfully joined game X! Wait for the game to start."
3. User address appears in Players list
4. Wait for 90-second countdown
5. When timer reaches 0: "GAME STARTING!" appears
6. 2 seconds later: Dice guess modal appears
7. User has 10 seconds to submit guess (1-6)
8. Modal shows "Rolling dice..." for 2 seconds
9. Result modal shows dice roll number and survival status

## Debug Steps:
1. Check console for "Timer expired for game X, calling handleGameStart"
2. Check console for "Game X has started!"
3. Check console for "User joined locally/blockchain" debug info
4. Check console for "Triggering guess modal now"

## Current Issues to Fix:
- Join flow may still be using old alert message
- Game start detection not working properly
- Modal not appearing when timer expires