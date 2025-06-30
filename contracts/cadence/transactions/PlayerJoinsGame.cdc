      import GuessTheDiceV5 from 0x0dd7dc583201e8b1

      transaction(gameId: UInt64) {
        prepare(signer: &Account) {
            // Join the game as a player
            let playerAddress = signer.address
            let gameRef = GuessTheDiceV5.getGameRef(gameId: gameId)
            
            // Join the game with the player's guess
            gameRef.join(player: playerAddress)
            log("Player ".concat(playerAddress.toString()).concat(" joined game ").concat(gameId.toString()))
        }
    }