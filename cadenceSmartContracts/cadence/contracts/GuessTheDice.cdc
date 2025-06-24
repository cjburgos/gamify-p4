import RandomConsumer from 0x0dd7dc583201e8b1
import Treasury from 0x8331a619d6a1b5f4

access(all) contract GuessTheDiceV4 {

    access(all) let entryFee: UFix64
    access(all) let admin: Address

    access(self) var nextGameId: UInt64
    access(self) var gameInstances: @{UInt64: GameInstance}

    access(all) event GameCreated(id: UInt64)
    access(all) event PlayerJoined(gameId: UInt64, player: Address)
    access(all) event RoundClosed(gameId: UInt64, rolled: UInt8, survivors: [Address])
    access(all) event GameEnded(gameId: UInt64, winner: Address?)
    access(all) event DiceGuessProvided(guessedDiceValue: UInt8)
    access(all) event DiceRolled(rolled: UInt8, receiptID: String)

    /// The canonical path for common Receipt storage
    /// Note: production systems would consider handling path collisions
    access(all) let ReceiptStoragePath: StoragePath

    init(entryFee: UFix64) {
        self.entryFee = entryFee
        self.admin = self.account.address
        self.nextGameId = 1
        self.gameInstances <- {}

        // Set the ReceiptStoragePath to a unique path for this contract - appending the address to the identifier
        // prevents storage collisions with other objects in user's storage
        self.ReceiptStoragePath = StoragePath(identifier: "DiceTossReceipt_".concat(self.account.address.toString()))!
    }

    /// The Receipt resource is used to store the player's dice roll guess and the associated randomness request. By listing the
    /// RandomConsumer.RequestWrapper conformance, this resource inherits all the default implementations of the
    /// interface. This is why the Receipt resource has access to the getRequestBlock() and popRequest() functions
    /// without explicitly defining them.
    ///
    access(all) resource Receipt : RandomConsumer.RequestWrapper {
        /// The amount bet by the user
        access(all) let guessedDiceValue: UInt8
        /// The associated randomness request which contains the block height at which the request was made
        /// and whether the request has been fulfilled.
        access(all) var request: @RandomConsumer.Request?

        init(guessedDiceValue: UInt8, request: @RandomConsumer.Request) {
            self.guessedDiceValue = guessedDiceValue
            self.request <- request
        }
    }

    access(all) fun createGame(): UInt64 {
        let gameId = self.nextGameId
        let newGame <- create GameInstance(id: gameId, admin: self.admin)
        self.gameInstances[gameId] <-! newGame
        self.nextGameId = gameId + 1
        Treasury.addGame(gameId: self.nextGameId)
        emit GameCreated(id: gameId)
        return gameId
    }

    access(all) fun getGameRef(gameId: UInt64): &GameInstance {
        return (&self.gameInstances[gameId])!
    }

    access(all) resource GameInstance {
        access(all) let id: UInt64
        access(all) let admin: Address
        access(all) var isOpen: Bool
        access(self) var players: @{Address: Player}
        access(all) var activePlayers: [Address]
        access(all) var roundNumber: UInt32
        access(all) var lastRoll: UInt8?
        access(all) var commitBlockHeight: UInt64?
        access(all) var commitSecret: [UInt8]?
        access(all) var GameStateData: @{Address: GameStateDataEntry}
        /// The RandomConsumer.Consumer resource used to request & fulfill randomness
        access(self) var consumer: @RandomConsumer.Consumer

        init(id: UInt64, admin: Address) {
            self.id = id
            self.admin = admin
            self.isOpen = true
            self.players <- {}
            self.activePlayers = []
            self.lastRoll = nil
            self.roundNumber = 1
            self.commitBlockHeight = nil
            self.commitSecret = nil
            self.GameStateData <- {}
            // Create a RandomConsumer.Consumer resource
            self.consumer <-RandomConsumer.createConsumer()

        }

        access(all) fun join(player: Address, bet: UFix64) {
            pre {
                self.isOpen: "Game not accepting new players"
                self.players[player] == nil: "Player already joined"
            }

            let newPlayer <- create Player(address: player)
            let newPlayerState <- create GameStateDataEntry(
                roundNumber: self.roundNumber,
                bet: bet,
                guessValue: 0 // Initial guess value can be set to 0 or any default value
            )
            self.players[player] <-! newPlayer
            self.GameStateData[player] <-! newPlayerState
            self.activePlayers.append(player)
            Treasury.receiveBet(self.id, UInt256(bet))
            emit PlayerJoined(gameId: self.id, player: player)
        }

        /// Returns a random number between 0 and 1 using the RandomConsumer.Consumer resource contained in the contract.
        /// For the purposes of this contract, a simple modulo operation could have been used though this is not the case
        /// for all ranges. Using the Consumer.fulfillRandomInRange function ensures that we can get a random number
        /// within any range without a risk of bias.
        ///
        access(self) fun randomDiceRoll(request: @RandomConsumer.Request): UInt8 {
            return UInt8(self.consumer.fulfillRandomInRange(request: <-request, min: 1, max: 6))
        }


        access(all) fun rollTheDice(commitHash: [UInt8]) {
            pre {
                self.isOpen: "Game closed"
                self.activePlayers.length > 0: "No players"
                commitHash.length == 32: "Invalid commit hash length"
            }

            let request <- self.consumer.requestRandomness()
            let receipt <- create Receipt(guessedDiceValue: 0, request: <-request)

            // Store the commit block height and secret for later use
            self.commitBlockHeight = receipt.getRequestBlock()!
            self.commitSecret = commitHash
            self.lastRoll = self.randomDiceRoll(request: <-receipt.popRequest()!)
            destroy receipt
        }


        access(all) fun commitDiceGuess(player: Address, guessValue: UInt8) {
            pre {
                self.isOpen: "Game closed"
                self.activePlayers.contains(player): "Player not in game"
                guessValue >= 1 && guessValue <= 6: "Guess must be 1-6"
            }
            let playerRef: &Player = (&self.players[player])!
            self.GameStateData[player]?.updateGuessValue(newGuessValue: guessValue)

            emit DiceGuessProvided(guessedDiceValue: guessValue)
        }

        access(all) fun CloseRound() {
            pre {
                self.isOpen: "Game is closed"
                self.activePlayers.length > 0: "No active players"
            }

            self.rollTheDice(commitHash: self.commitSecret!)

            var survivors: [Address] = []
            let keys = self.GameStateData.keys
            var newPlayers: @{Address: Player} <- {}

            for key in keys {
                let player <- self.players.remove(key: key)!
                let playerState <- self.GameStateData.remove(key: key)!
                if playerState.guessValue == self.lastRoll! {
                    survivors.append(player.address)
                    newPlayers[player.address] <-! player
                } else {
                    destroy player
                }
                destroy playerState
            }

            self.activePlayers = survivors
            self.roundNumber = self.roundNumber + 1

            emit RoundClosed(gameId: self.id, rolled: self.lastRoll!, survivors: survivors)

            if survivors.length <= 1 {
                self.isOpen = false
                let winner: Address? = survivors.length == 1 ? survivors[0] : nil
                emit GameEnded(gameId: self.id, winner: winner)
                // Prize distribution logic could go here
            }
            destroy newPlayers
        }

        access(all) fun isRoundReady(): Bool {
            return self.isOpen && self.activePlayers.length > 0
        }
    }

    access(all) resource Player {
        access(all) let address: Address
        access(all) var guess: UInt8
        access(all) var roundGuesses: {UInt32: UInt8}

        init(address: Address) {
            self.address = address
            self.guess = 0
            self.roundGuesses = {}
        }

        access(all) fun recordGuess(round: UInt32, guess: UInt8) {
            pre {
            guess >= 1 && guess <= 6: "Guess must be between 1 and 6"
            }
            self.roundGuesses[round] = guess
        }

        access(all) fun getGuessForRound(round: UInt32): UInt8? {
            return self.roundGuesses[round]
        }

        access(all) fun getAddress(): Address {
            return self.address
        }
    }

    access(all) resource GameStateDataEntry {
        access(all) let roundNumber: UInt32
        access(all) let bet: UFix64
        access(all) var guessValue: UInt8

        init(roundNumber: UInt32, bet: UFix64, guessValue: UInt8) {
            self.roundNumber = roundNumber
            self.bet = bet
            self.guessValue = guessValue
        }

        access(all) fun updateGuessValue(newGuessValue: UInt8) {
            pre {
                newGuessValue >= 1 && newGuessValue <= 6: "Guess must be between 1 and 6"
            }
            self.guessValue = newGuessValue
        }
    }
}
