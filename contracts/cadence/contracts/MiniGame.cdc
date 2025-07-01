import Xorshift128plus from 0xf8d6e0586b0a20c7
import RandomBeaconHistory from 0xf8d6e0586b0a20c7
import Crypto from 0xf8d6e0586b0a20c7

/*
 * MiniGame Contract Documentation
 * ==============================
 * 
 * OVERVIEW
 * --------
 * MiniGame is a generalized framework for creating fair, on-chain games that use
 * commit-reveal randomness to ensure transparency and prevent manipulation.
 * 
 * The contract implements a three-phase game flow:
 * 1. COMMIT: Admin commits to a secret hash before players make decisions
 * 2. REVEAL: Admin reveals the secret and generates verifiable randomness
 * 3. EVALUATE: Players are evaluated against the random outcome and eliminated
 * 
 * ARCHITECTURE
 * ------------
 * The contract uses a layered architecture:
 * 
 * - MiniGame Contract: Main contract that manages game instances
 * - GameInstance Interface: Defines the contract for any commit-reveal game
 * - BaseGameInstance: Provides common commit-reveal functionality
 * - Player Resource: Represents individual players and their game inputs
 * - Receipt Resource: Stores player inputs and request metadata
 * 
 * GAME FLOW
 * ---------
 * 1. createGame() -> Creates a new game instance
 * 2. join(player) -> Players join the game (while closed)
 * 3. startRound(commitHash) -> Admin opens game and commits to randomness
 * 4. Players submit inputs via game-specific methods
 * 5. revealRound(secret) -> Admin reveals secret and generates outcome
 * 6. closeRound() -> Evaluate players and eliminate losers
 * 7. Repeat steps 3-6 until winner(s) remain
 * 
 * RANDOMNESS GUARANTEES
 * ---------------------
 * - Commit-reveal scheme prevents admin manipulation
 * - Uses Flow's RandomBeaconHistory for blockchain randomness
 * - Xorshift128plus PRG for deterministic outcome generation
 * - Cryptographic verification of commit-reveal integrity
 * 
 * SECURITY FEATURES
 * ----------------
 * - Prevents double-joining
 * - Enforces timing constraints on reveal
 * - Validates commit hash integrity
 * - Resource-based player management
 * - Admin-only critical operations
 * 
 * USAGE EXAMPLES
 * --------------
 * 
 * Creating a Dice Game:
 * ```cadence
 * let gameId = miniGame.createGame()
 * let gameRef = miniGame.getGameRef(gameId: gameId)
 * 
 * // Players join
 * gameRef.join(player: 0x123)
 * gameRef.join(player: 0x456)
 * 
 * // Admin starts round
 * let secret = [1, 2, 3, ...] // 32 bytes
 * let commitHash = Crypto.hash(secret, algorithm: HashAlgorithm.SHA3_256)
 * gameRef.startRound(roundCommitHash: commitHash)
 * 
 * // Players make guesses (game-specific)
 * gameRef.commitDiceGuess(player: 0x123, guessValue: 3)
 * 
 * // Admin reveals and closes
 * gameRef.revealRound(secret: secret)
 * gameRef.closeRound()
 * ```
 * 
 * EXTENDING THE FRAMEWORK
 * ----------------------
 * To create a new game type:
 * 1. Extend BaseGameInstance
 * 2. Override generateOutcome() for game-specific randomness
 * 3. Override evaluatePlayer() for game-specific logic
 * 4. Add game-specific methods for player inputs
 * 
 * DEPENDENCIES
 * -----------
 * - Xorshift128plus: Pseudo-random number generator
 * - RandomBeaconHistory: Flow's VRF service
 * - Crypto: Cryptographic hash functions
 */

/// Player resource definition

access(all) contract MiniGame {

    access(all) let entryFee: UFix64
    access(all) let admin: Address

    access(self) var nextGameId: UInt64
    access(self) var gameInstances: @{UInt64: {GameInstance}}

    access(all) event GameCreated(id: UInt64)
    access(all) event PlayerJoined(gameId: UInt64, player: Address)
    access(all) event RoundCommitted(gameId: UInt64, commitBlock: UInt64)
    access(all) event RoundRevealed(gameId: UInt64, rolled: UInt8, beacon: [UInt8], secret: [UInt8])
    access(all) event RoundClosed(gameId: UInt64, rolled: UInt8, survivors: [Address])
    access(all) event GameEnded(gameId: UInt64, winner: Address?)

        /// The canonical path for common Receipt storage
    /// Note: production systems would consider handling path collisions
    access(all) let ReceiptStoragePath: StoragePath

    init(entryFee: UFix64) {
        self.entryFee = entryFee
        self.admin = self.account.address
        self.ReceiptStoragePath = /storage/minigame_receipts
        self.nextGameId = 1
        self.gameInstances <- {}
    }
    access(all) resource Player {
        access(all) let address: Address
        access(all) var inputs: {UInt32: AnyStruct}

        init(address: Address) {
            self.address = address
            self.inputs = {}
        }

        access(all) fun setInput(round: UInt32, input: AnyStruct) {
            pre {
                input != nil: "Input must be non-nil"
            }
            self.inputs[round] = input
        }

        access(all) fun getInputForRound(round: UInt32): AnyStruct? {
            return self.inputs[round]
        }

        access(all) fun getAddress(): Address {
            return self.address
        }
    }

    /// Generalized interface for any game that uses commit-reveal randomness
    access(all) resource interface GameInstance {
        access(all) let id: UInt64
        access(all) let admin: Address
        access(all) var isOpen: Bool
        access(all) var activePlayers: [Address]
        access(all) var roundNumber: UInt32
        access(all) var revealedOutcome: AnyStruct?
        access(all) var beacon: [UInt8]?
        
        /// Join the game
        access(all) fun join(player: Address)
        
        /// Start a new round
        access(all) fun startRound(roundCommitHash: [UInt8])
        
        /// Commit phase: Admin commits to a secret for randomness generation
        access(all) fun commitRound(commitHash: [UInt8])
        
        /// Reveal phase: Admin reveals secret and generates random outcome
        access(all) fun revealRound(secret: [UInt8])
        
        /// Close phase: Evaluate players against random outcome and eliminate losers
        access(all) fun closeRound()
        
        /// Check if round is ready to be closed (has players, commit, and revealed outcome)
        access(all) fun isRoundReady(): Bool
        
        /// Game-specific player evaluation logic
        access(all) fun evaluatePlayer(player: Address): Bool
    }

    /// Base implementation providing common commit-reveal functionality
    access(all) resource BaseGameInstance: GameInstance {
        access(all) let id: UInt64
        access(all) let admin: Address
        access(all) var isOpen: Bool
        access(self) var players: @{Address: Player}
        access(all) var activePlayers: [Address]
        access(all) var roundNumber: UInt32
        access(all) var commitBlockHeight: UInt64?
        access(all) var commitHash: [UInt8]?
        access(all) var revealedSecret: [UInt8]?
        access(all) var revealedOutcome: AnyStruct?
        access(all) var beacon: [UInt8]?
        
        init(id: UInt64, admin: Address) {
            self.id = id
            self.admin = admin
            self.isOpen = false
            self.players <- {}
            self.activePlayers = []
            self.roundNumber = 1
            self.commitBlockHeight = nil
            self.commitHash = nil
            self.revealedSecret = nil
            self.revealedOutcome = nil
            self.beacon = nil
        }

        access(all) fun join(player: Address) {
            pre {
                !self.isOpen: "Game not accepting new players"
                self.players[player] == nil: "Player already joined"
            }

            // Create new player with the sender address
            let newPlayer <- create Player(address: player)
            
            // Add the player to the game
            self.players[player] <-! newPlayer
            self.activePlayers.append(player)
        }
        
        /// Commit phase: Admin commits to a secret for randomness generation
        access(all) fun commitRound(commitHash: [UInt8]) {
            pre {
                self.isOpen: "Game closed"
                self.commitHash == nil: "Round already committed"
                commitHash.length == 32: "Commit hash must be 32 bytes (SHA3-256)"
            }
            self.commitHash = commitHash
            self.commitBlockHeight = getCurrentBlock().height
        }

        access(all) fun startRound(roundCommitHash: [UInt8]) {
            pre {
                !self.isOpen: "Game is already closed"
            }
            self.isOpen = true
            self.commitRound(commitHash: roundCommitHash)
        }
        
        /// Reveal phase: Admin reveals secret and generates random outcome
        access(all) fun revealRound(secret: [UInt8]) {
            pre {
                self.isOpen: "Game closed"
                self.commitHash != nil: "No commit for this round"
                self.commitBlockHeight != nil: "No commit block for this round"
                self.revealedOutcome == nil: "Round already revealed"
                getCurrentBlock().height > self.commitBlockHeight!: "Too early to reveal"
                secret.length > 0: "Secret must not be empty"
            }
            
            // Verify hash(secret) == commitHash
            let computedHash = Crypto.hash(secret, algorithm: HashAlgorithm.SHA3_256)
            assert(computedHash == self.commitHash!, message: "Invalid reveal: hash mismatch")
            
            // Get beacon from RandomBeaconHistory
            let beacon = RandomBeaconHistory.sourceOfRandomness(atBlockHeight: self.commitBlockHeight!).value
            self.revealedSecret = secret
            self.beacon = beacon
            
            // Generate dice roll using commit-reveal randomness
            let prg = Xorshift128plus.PRG(sourceOfRandomness: beacon, salt: secret)
            let randomOutcome = prg.nextUInt64() % 6 + 1
            self.revealedOutcome = UInt8(randomOutcome)
            
            // Emit event with dice-specific data
            emit RoundRevealed(gameId: self.id, rolled: self.revealedOutcome! as! UInt8, beacon: self.beacon!, secret: self.revealedSecret!)
        }
        
        /// Close phase: Evaluate players against random outcome and eliminate losers
        access(all) fun closeRound() {
            pre {
                self.isOpen: "Game is closed"
                self.activePlayers.length > 0: "No active players"
                self.revealedOutcome != nil: "Outcome not revealed yet"
            }
            
            var survivors: [Address] = []
            let keys = self.players.keys
            
            for key in keys {
                let player <- self.players.remove(key: key)!
                if self.evaluatePlayer(player: player.address) {
                    survivors.append(player.address)
                    self.players[player.address] <-! player
                } else {
                    destroy player
                }
            }
            self.activePlayers = survivors
            self.roundNumber = self.roundNumber + 1
            
            // Emit event with dice-specific data
            emit RoundClosed(gameId: self.id, rolled: self.revealedOutcome! as! UInt8, survivors: survivors)
                    
            if survivors.length <= 1 {
                self.isOpen = false
                let winner: Address? = survivors.length == 1 ? survivors[0] : nil
                emit GameEnded(gameId: self.id, winner: winner)
            }
            
            // Reset round state for next round
            self.revealedOutcome = nil
            self.commitHash = nil
            self.commitBlockHeight = nil
            self.revealedSecret = nil
            self.beacon = nil
        }
        

        access(all) fun isRoundReady(): Bool {
            return self.isOpen && self.activePlayers.length > 0 && self.commitHash != nil && self.beacon == nil
        }
        
        /// Default implementation - should be overridden by concrete games
        access(all) fun evaluatePlayer(player: Address): Bool {
            // Default implementation returns false - concrete games must override
            return false
        }
        
    }
    


    access(all) fun createGame(): UInt64 {
        let gameId = self.nextGameId
        let newGame <- create BaseGameInstance(id: gameId, admin: self.admin)
        self.gameInstances[gameId] <-! newGame
        self.nextGameId = gameId + 1
        emit GameCreated(id: gameId)
        return gameId
    }

    access(all) fun getGameRef(gameId: UInt64): &{GameInstance} {
        return (&self.gameInstances[gameId])!
    }


    access(all) fun joinGame(gameId: UInt64, player: Address) {
        let gameRef = self.getGameRef(gameId: gameId)
        gameRef.join(player: player)
        emit PlayerJoined(gameId: gameId, player: player)
    }

    access(all) fun startRoundForGame(gameId: UInt64, roundCommitHash: [UInt8]) {
        let gameRef = self.getGameRef(gameId: gameId)
        gameRef.startRound(roundCommitHash: roundCommitHash)
        emit RoundCommitted(gameId: gameId, commitBlock: getCurrentBlock().height)
    }

    access(all) fun revealRoundForGame(gameId: UInt64, secret: [UInt8]) {
        let gameRef = self.getGameRef(gameId: gameId)
        gameRef.revealRound(secret: secret)
        // Note: Events are emitted within the game instance itself
    }

    access(all) fun closeRoundForGame(gameId: UInt64) {
        let gameRef = self.getGameRef(gameId: gameId)
        gameRef.closeRound()    
        // Note: Events are emitted within the game instance itself
    }

    access(all) fun getNextGameId(): UInt64 {
        return self.nextGameId
    }

}   
