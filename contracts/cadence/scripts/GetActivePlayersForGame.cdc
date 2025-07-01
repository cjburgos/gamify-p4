import MiniGame from 0xf8d6e0586b0a20c7

access(all) fun main(gameId: UInt64): [Address] {
    let gameRef = MiniGame.getGameRef(gameId: gameId)
    return *gameRef.activePlayers
}