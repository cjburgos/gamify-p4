import GuessTheDiceV3 from 0x0dd7dc583201e8b1

access(all) fun main(gameId: UInt64): UInt8 {
    let gameRef = GuessTheDiceV3.getGameRef(gameId: gameId)
    if gameRef != nil {
        return gameRef!.lastRoll ?? 0
    } else {
        return 0
    }
}