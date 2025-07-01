import MiniGame from 0xf8d6e0586b0a20c7

transaction(gameId: UInt64) {
    prepare(signer: &Account) {
        // Join the game as a player
        let playerAddress = signer.address
        
        // Join the game using the MiniGame contract
        MiniGame.joinGame(gameId: gameId, player: playerAddress)
        log("Player ".concat(playerAddress.toString()).concat(" joined game ").concat(gameId.toString()))
    }
}