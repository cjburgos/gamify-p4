import GuessTheDiceV2 from 0x0dd7dc583201e8b1

transaction {

    prepare(signer: &Account) {
        // Optional: You could store the game ID or admin reference here
        let gameId = GuessTheDiceV2.createGame()
        log("New game created with ID: ".concat(gameId.toString()))
    }
}