import MiniGame from 0xf8d6e0586b0a20c7

access(all) fun main(gameId: UInt64): UInt8 {
    let gameRef = MiniGame.getGameRef(gameId: gameId)
    if gameRef.revealedOutcome != nil {
        return gameRef.revealedOutcome! as! UInt8
    } else {
        return 0
    }
}