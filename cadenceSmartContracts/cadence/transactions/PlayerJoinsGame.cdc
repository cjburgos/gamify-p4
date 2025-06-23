import GuessTheDiceV2 from 0x0dd7dc583201e8b1

transaction {

    prepare(signer: &Account) {
        // Join the game as a player
        let playerAddress = signer.address
        let guess = 3 // Example guess, can be any valid integer
        let gameId: UInt64 = 1 // Assuming the game ID is known or passed in
        let gameRef = GuessTheDiceV2.getGameRef(gameId: gameId)
        
        // Join the game with the player's guess
        gameRef.join(player: playerAddress, guess: guess)
        log("Player ".concat(playerAddress.toString()).concat(" joined game ").concat(gameId).concat(" with guess ").concat(guess.toString()))
    }
}