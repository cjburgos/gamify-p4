import GuessTheDiceV3 from 0x0dd7dc583201e8b1

transaction(gameId: UInt64, round: UInt32, guess: UInt8) {
    prepare(signer: &Account) {
        let playerAddress = signer.address
        let gameRef = GuessTheDiceV3.getGameRef(gameId: gameId)

        gameRef.commitDiceGuess(player: playerAddress, guessValue: guess)
    }
}