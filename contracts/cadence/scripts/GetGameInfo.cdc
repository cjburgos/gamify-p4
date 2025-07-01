import MiniGame from 0xf8d6e0586b0a20c7

access(all) fun main(gameId: UInt64): {String: AnyStruct} {
    let gameRef = MiniGame.getGameRef(gameId: gameId)
    
    return {
        "id": gameRef.id,
        "admin": gameRef.admin,
        "isOpen": gameRef.isOpen,
        "activePlayers": gameRef.activePlayers,
        "roundNumber": gameRef.roundNumber,
        "revealedOutcome": gameRef.revealedOutcome,
        "beacon": gameRef.beacon
    }
} 