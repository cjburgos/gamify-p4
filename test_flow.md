# Game Flow Test Instructions

## Expected Flow:
1. User clicks "Join Game" 
2. Alert shows: "Successfully joined game X! Wait for the game to start." (NO GUESS NUMBER)
3. User appears in local joined state (may not show in blockchain players until guess submitted)
4. Wait for 90-second countdown
5. When timer reaches 0: "GAME STARTING!" appears
6. 2 seconds later: Dice guess modal appears for ALL joined players
7. User manually inputs guess (1-6) and clicks Submit
8. Guess gets submitted to blockchain at this point
9. Modal shows "Rolling dice..." for 2 seconds
10. Result modal shows dice roll number and survival status

## Debug Steps:
1. Check console for "Timer expired for game X, calling handleGameStart"
2. Check console for "Game X has started!"
3. Check console for "User joined locally/blockchain" debug info
4. Check console for "Triggering guess modal now"

## Current Issues to Fix:
- Join flow may still be using old alert message
- Game start detection not working properly
- Modal not appearing when timer expires