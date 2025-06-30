access(all) contract Treasury {
    // Struct for storing game state
    access(all) struct GameState {
        access(all) let winners: [Address]
        access(all) let completed: Bool 
        access(all) let value: UInt256
        access(all) let mathContract: Address?

        init(winners: [Address], completed: Bool, value: UInt256, mathContract: Address?) {
            self.winners = winners
            self.completed = completed
            self.value = value
            self.mathContract = mathContract
        }
    }

    // Dictionary to store game states
    access(self) let gameStates: {UInt64: GameState}


    // Event emitted when game state is updated
    access(all) event GameStateUpdated(gameId: UInt64, winners: [Address], completed: Bool, value: UInt256, mathContract: Address?)

    // Initialize the contract
    init() {
        self.gameStates = {}
    }

    // Add a new game address mapping
    access(all) fun addGame(gameId: UInt64) {
        pre {
            !self.gameStates.containsKey(gameId): "Game ID already exists"
        }

        // Create a new GameState with empty winners array, completed set to false, and value set to 0
        let emptyWinners: [Address] = []
        let isCompleted: Bool = false
        let zeroValue: UInt256 = 0
        let noMathContract: Address? = nil

        let state = GameState(winners: emptyWinners, completed: isCompleted, value: zeroValue, mathContract: noMathContract)
        self.gameStates[gameId] = state

        emit GameStateUpdated(gameId: gameId, winners: emptyWinners, completed: isCompleted, value: zeroValue, mathContract: noMathContract)
    }

    access(all) fun updateGameState(gameId: UInt64, winners: [Address], completed: Bool, value: UInt256, mathContract: Address?) {
        let state = GameState(winners: winners, completed: completed, value: value, mathContract: mathContract)
        self.gameStates[gameId] = state
        emit GameStateUpdated(gameId: gameId, winners: winners, completed: completed, value: value, mathContract: mathContract)
    }

    access(all) fun getGameState(gameId: UInt64): GameState? {
        return self.gameStates[gameId]
    }

    access(all) fun collectWinnings(gameId: UInt64) {
        pre {
            self.gameStates.containsKey(gameId): "Game state does not exist for the given game ID"
        }

        let gameState = self.gameStates[gameId]!

        // Check if the game is completed
        if !gameState.completed {
            panic("Game is not completed yet")
        }

        // Check if there are winners
        if gameState.winners.length == 0 {
            panic("No winners to distribute to")
        }

        // Check if there is a math contract
        if let mathContractAddress = gameState.mathContract {
            // Call the calculate function on the math contract
            // Note: This is a placeholder for the actual implementation
            // In a real implementation, you would need to import the math contract interface
            // and call the calculate function with the appropriate parameters

            // Example of how this might be implemented:
            // let mathContract = getAccount(mathContractAddress).getCapability<&{MathContract.Calculator}>(/public/Calculator).borrow()
            // ?? panic("Could not borrow Calculator capability")
            // mathContract.calculate(gameState.value)

            // For now, we'll just emit an event to indicate that the calculation would be performed
            emit GameStateUpdated(
                gameId: gameId,
                winners: gameState.winners,
                completed: gameState.completed,
                value: gameState.value,
                mathContract: gameState.mathContract
            )
        } else {
            // Distribute the value equally among winners
            let winnerCount = gameState.winners.length
            let valuePerWinner = gameState.value / UInt256(winnerCount)

            // In a real implementation, you would transfer the value to each winner
            // For now, we'll just emit an event to indicate that the distribution would be performed
            emit GameStateUpdated(
                gameId: gameId,
                winners: gameState.winners,
                completed: gameState.completed,
                value: gameState.value,
                mathContract: gameState.mathContract
            )
        }
    }
}
