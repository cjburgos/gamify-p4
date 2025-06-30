import GuessTheDiceV3 from 0x0dd7dc583201e8b1

access(all) fun main(gameId: UInt64): [Address] {
    let gameRef = GuessTheDiceV3.getGameRef(gameId: gameId)
    if gameRef != nil {
        return *gameRef!.activePlayers
    } else {
        return []
    }
}