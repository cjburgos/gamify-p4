import GuessTheDiceV2 from 0x0dd7dc583201e8b1

transaction {

    prepare(signer: &Account) {

        // Join the game as a player
        let playerAddress = signer.address
        let guess: UInt8 = 3 // Example guess, can be any valid integer
        let gameRef = GuessTheDiceV2.getGameRef(gameId: 1)

        gameRef.commitDiceGuess(player: playerAddress, round: gameRef.roundNumber, guessValue: guess)
        log("Player ".concat(playerAddress.toString()).concat(" committed guess ").concat(guess.toString()).concat(" for game ").concat(gameRef.id.toString()))
    }
}