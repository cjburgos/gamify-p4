import MiniGame from 0xf8d6e0586b0a20c7

transaction(gameId: UInt64) {
    prepare(signer: &Account) {
        // Close the round and evaluate players
        MiniGame.closeRoundForGame(gameId: gameId)
        log("Closed round for game ".concat(gameId.toString()))
    }
} 