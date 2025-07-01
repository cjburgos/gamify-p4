import MiniGame from 0xf8d6e0586b0a20c7

access(all) fun main(gameId: UInt64, playerAddress: Address, round: UInt32): AnyStruct? {
    let gameRef = MiniGame.getGameRef(gameId: gameId)
    
    // Get the player resource from the game
    let player = gameRef.players[playerAddress]
    if player != nil {
        return player!.getInputForRound(round: round)
    }
    
    return nil
} 