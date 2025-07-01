import MiniGame from 0xf8d6e0586b0a20c7

transaction(gameId: UInt64, secret: [UInt8]) {
    prepare(signer: &Account) {
        // Reveal the round with the secret
        MiniGame.revealRoundForGame(gameId: gameId, secret: secret)
        log("Revealed round for game ".concat(gameId.toString()))
    }
} 