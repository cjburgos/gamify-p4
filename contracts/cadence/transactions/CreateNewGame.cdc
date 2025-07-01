import MiniGame from 0xf8d6e0586b0a20c7

transaction {
    prepare(signer: &Account) {
        let gameId = MiniGame.createGame()
        log("New game created with ID: ".concat(gameId.toString()))
    }
}