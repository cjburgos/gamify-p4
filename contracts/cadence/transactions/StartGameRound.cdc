import MiniGame from 0xf8d6e0586b0a20c7
import Crypto from 0xf8d6e0586b0a20c7

transaction(gameId: UInt64, secret: [UInt8]) {
    prepare(signer: &Account) {
        // Generate commit hash from secret
        let commitHash = Crypto.hash(secret, algorithm: HashAlgorithm.SHA3_256)
        
        // Start the round with the commit hash
        MiniGame.startRoundForGame(gameId: gameId, roundCommitHash: commitHash)
        log("Started round for game ".concat(gameId.toString()).concat(" with commit hash"))
    }
} 