import RandomConsumer from 0x0dd7dc583201e8b1

access(all) contract GuessTheDiceV2 {

    access(all) let entryFee: UFix64
    access(all) let admin: Address

    access(self) var nextGameId: UInt64
    access(self) var gameInstances: @{UInt64: GameInstance}

    access(all) event GameCreated(id: UInt64)
    access(all) event PlayerJoined(gameId: UInt64, player: Address)
    access(all) event RoundClosed(gameId: UInt64, rolled: UInt8, survivors: [Address])
    access(all) event GameEnded(gameId: UInt64, winner: Address?)
    access(all) event DiceGuessProvided(guessedDiceValue: UInt8, commitBlock: UInt64, receiptID: String)
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
        /// The RandomConsumer.Consumer resource used to request & fulfill randomness
        access(self) var consumer: @RandomConsumer.Consumer

        init(id: UInt64, admin: Address) {
            self.id = id
            self.admin = admin
            self.isOpen = true
            self.players <- {}
            self.activePlayers = []
            self.roundNumber = 1
            self.lastRoll = nil
            self.commitBlockHeight = nil
            self.commitSecret = nil
            // Create a RandomConsumer.Consumer resource
            self.consumer <-RandomConsumer.createConsumer()

        }

        access(all) fun join(player: Address, guess: Int) {
            pre {
                self.isOpen: "Game not accepting new players"
                guess >= 1 && guess <= 6: "Guess must be 1-6"
            }

            let newPlayer <- create Player(address: player)
            self.players[player] <-! newPlayer
            self.activePlayers.append(player)

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

        access(all) fun commitDiceGuess(player: Address, round: UInt32, guessValue: UInt8): @Receipt {
            pre {
                self.isOpen: "Game closed"
                self.activePlayers.contains(player): "Player not in game"
                guessValue >= 1 && guessValue <= 6: "Guess must be 1-6"
            }
            let playerRef: &Player = (&self.players[player])!
            let request <- self.consumer.requestRandomness()
            let receipt <- create Receipt(
                guessedDiceValue: guessValue,
                request: <-request
            )

            emit DiceGuessProvided(guessedDiceValue: receipt.guessedDiceValue, commitBlock: receipt.getRequestBlock()!, receiptID: receipt.uuid.toString())

            playerRef.recordGuess(round: self.roundNumber, guess: guessValue)

            return <- receipt
        }

        access(all) fun revealDiceRoll(receipt: @Receipt) {
            pre {
                self.isOpen: "Game closed"
                self.activePlayers.length > 0: "No players"
                receipt.request != nil: "Invalid receipt"
                receipt.getRequestBlock()! <= getCurrentBlock().height:
                "GuessTheDice.revealDiceRoll: Cannot reveal the dice roll! The provided receipt was committed for block height ".concat(receipt.getRequestBlock()!.toString())
                .concat(" which is greater than the current block height of ")
                .concat(getCurrentBlock().height.toString())
                .concat(". The reveal can only happen after the committed block has passed.")
            }

            let extracted <- receipt.popRequest()
            let rolled = self.randomDiceRoll(request: <- extracted!)
                // continue with rolled
            // let rolled = self.randomDiceRoll(request: <- receipt.request!)
            emit DiceRolled(rolled: rolled, receiptID: receipt.uuid.toString())

            self.CloseRound(round: self.roundNumber, rolled: rolled)

            destroy receipt

        }

        access(all) fun CloseRound(round: UInt32, rolled: UInt8) {
            pre {
                rolled >= 1 && rolled <= 6: "Invalid dice roll"
            }

            self.lastRoll = rolled
            var survivors: [Address] = []
            let keys = self.players.keys
            var newPlayers: @{Address: Player} <- {}

            for key in keys {
                let player <- self.players.remove(key: key)!
                if player.getGuessForRound(round: round) == rolled {
                    survivors.append(player.address)
                    newPlayers[player.address] <-! player
                } else {
                    destroy player
                }
            }

            self.activePlayers = survivors
            self.roundNumber = self.roundNumber + 1

            emit RoundClosed(gameId: self.id, rolled: rolled, survivors: survivors)

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
}
