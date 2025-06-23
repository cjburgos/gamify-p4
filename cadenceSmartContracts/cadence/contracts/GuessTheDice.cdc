import "RandomBeaconHistory"


access(all) contract GuessTheDice {

    access(all) let entryFee: UFix64
    access(all) let admin: Address

    access(self) var nextGameId: UInt64
    access(self) var gameInstances: @{UInt64: GameInstance}

    access(all) event GameCreated(id: UInt64)
    access(all) event PlayerJoined(gameId: UInt64, player: Address)
    access(all) event RoundClosed(gameId: UInt64, rolled: Int, survivors: [Address])
    access(all) event GameEnded(gameId: UInt64, winner: Address?)

    init(entryFee: UFix64) {
        self.entryFee = entryFee
        self.admin = self.account.address
        self.nextGameId = 1
        self.gameInstances <- {}
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
        access(all) var lastRoll: Int?
        access(all) var commitBlockHeight: UInt64?
        access(all) var commitSecret: [UInt8]?

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
        }

        access(all) fun join(player: Address, guess: Int) {
            pre {
                self.isOpen: "Game not accepting new players"
                guess >= 1 && guess <= 6: "Guess must be 1-6"
            }

            let newPlayer <- create Player(address: player, guess: guess, round: self.roundNumber)
            self.players[player] <-! newPlayer
            self.activePlayers.append(player)

            emit PlayerJoined(gameId: self.id, player: player)
        }

        access(all) fun commitRandom(commitHash: [UInt8]) {
            pre {
                self.isOpen: "Game closed"
                self.activePlayers.length > 0: "No players"
            }
            self.commitBlockHeight = getCurrentBlock().height
            self.commitSecret = commitHash
        }

        access(all) fun revealAndClose(secret: [UInt8]) {
            pre {
                self.commitBlockHeight != nil: "No commit"
                // ensure randomness is available
                getCurrentBlock().height > self.commitBlockHeight!
                
            }
            let beacon = RandomBeaconHistory.RandomSource(self.commitBlockHeight!)
            let stored = self.commitSecret!
            // validate reveal matches previous hash
            assert(secret == stored, message: "Invalid reveal")

            // retrieve randomness for commitBlock
            let combined = secret.concat(beacon)
            let roll = Int(combined[0] % 6) + 1
            self.rollDiceAndCloseRound(rolled: roll)
            self.commitBlockHeight = nil
            self.commitSecret = nil
        }

        access(all) fun rollDiceAndCloseRound(rolled: Int) {
            pre {
                rolled >= 1 && rolled <= 6: "Invalid dice roll"
            }

            self.lastRoll = rolled
            var survivors: [Address] = []
            let keys = self.players.keys
            var newPlayers: @{Address: Player} <- {}

            for key in keys {
                let player <- self.players.remove(key: key)!
                if player.guess == rolled {
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
        access(all) let guess: Int
        access(all) let round: UInt32

        init(address: Address, guess: Int, round: UInt32) {
            self.address = address
            self.guess = guess
            self.round = round
        }
    }
}
