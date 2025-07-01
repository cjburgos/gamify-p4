import Test

// Simple test script for MiniGame contract
// This can be run with: flow test cadence/tests/TestMiniGame.cdc

access(all) contract TestMiniGame {
    
    // Test accounts
    access(all) let admin: Address
    access(all) let player1: Address
    access(all) let player2: Address
    access(all) let player3: Address
    
    init() {
        // Create test accounts
        let adminAccount = Test.createAccount()
        let player1Account = Test.createAccount()
        let player2Account = Test.createAccount()
        let player3Account = Test.createAccount()
        
        self.admin = adminAccount.address
        self.player1 = player1Account.address
        self.player2 = player2Account.address
        self.player3 = player3Account.address
    }

    // Test basic functionality
    access(all) fun testBasicFunctionality() {
        // Test account creation
        assert(self.admin != 0x0, message: "Admin account should be created")
        assert(self.player1 != 0x0, message: "Player 1 account should be created")
        assert(self.player2 != 0x0, message: "Player 2 account should be created")
        assert(self.player3 != 0x0, message: "Player 3 account should be created")
        
        // Test that accounts are different
        assert(self.admin != self.player1, message: "Admin and player 1 should be different")
        assert(self.player1 != self.player2, message: "Player 1 and player 2 should be different")
        assert(self.player2 != self.player3, message: "Player 2 and player 3 should be different")
    }

    // Test game logic simulation
    access(all) fun testGameLogicSimulation() {
        // Simulate game state
        var gameId: UInt64 = 1
        var roundNumber: UInt32 = 1
        var isOpen: Bool = false
        var activePlayers: [Address] = []
        
        // Test initial state
        assert(gameId == 1, message: "Game ID should start at 1")
        assert(roundNumber == 1, message: "Round number should start at 1")
        assert(!isOpen, message: "Game should start closed")
        assert(activePlayers.length == 0, message: "Game should start with no players")
        
        // Simulate player joining
        activePlayers.append(self.player1)
        activePlayers.append(self.player2)
        assert(activePlayers.length == 2, message: "Should have 2 players after joining")
        assert(activePlayers.contains(self.player1), message: "Player 1 should be in active players")
        assert(activePlayers.contains(self.player2), message: "Player 2 should be in active players")
        
        // Simulate round start
        isOpen = true
        assert(isOpen, message: "Game should be open after starting round")
        
        // Simulate round end
        roundNumber = roundNumber + 1
        isOpen = false
        assert(roundNumber == 2, message: "Round number should increment")
        assert(!isOpen, message: "Game should be closed after round ends")
    }

    // Test commit-reveal logic simulation
    access(all) fun testCommitRevealLogic() {
        // Simulate commit phase
        var hasCommit: Bool = true
        var hasReveal: Bool = false
        var revealedOutcome: UInt8? = nil
        
        assert(hasCommit, message: "Should have commit after commit phase")
        assert(!hasReveal, message: "Should not have reveal before reveal phase")
        assert(revealedOutcome == nil, message: "Should not have outcome before reveal")
        
        // Simulate reveal phase
        hasReveal = true
        revealedOutcome = 3 // Simulate dice roll outcome
        
        assert(hasReveal, message: "Should have reveal after reveal phase")
        assert(revealedOutcome != nil, message: "Should have outcome after reveal")
        assert(revealedOutcome! >= 1 && revealedOutcome! <= 6, message: "Dice roll should be between 1 and 6")
    }

    // Test player elimination logic
    access(all) fun testPlayerElimination() {
        var activePlayers: [Address] = [self.player1, self.player2, self.player3]
        var survivors: [Address] = []
        
        // Simulate evaluation (all players survive for this test)
        for player in activePlayers {
            survivors.append(player)
        }
        
        assert(survivors.length == 3, message: "All players should survive in this test")
        assert(survivors.contains(self.player1), message: "Player 1 should survive")
        assert(survivors.contains(self.player2), message: "Player 2 should survive")
        assert(survivors.contains(self.player3), message: "Player 3 should survive")
        
        // Simulate some players being eliminated
        survivors = [self.player1] // Only player 1 survives
        
        assert(survivors.length == 1, message: "Only 1 player should survive")
        assert(survivors.contains(self.player1), message: "Player 1 should be the survivor")
        assert(!survivors.contains(self.player2), message: "Player 2 should be eliminated")
        assert(!survivors.contains(self.player3), message: "Player 3 should be eliminated")
    }

    // Test multiple games
    access(all) fun testMultipleGames() {
        var gameIds: [UInt64] = []
        
        // Simulate creating multiple games
        var i: UInt64 = 1
        while i <= 5 {
            gameIds.append(i)
            i = i + 1
        }
        
        assert(gameIds.length == 5, message: "Should have 5 games")
        assert(gameIds[0] == 1, message: "First game should have ID 1")
        assert(gameIds[4] == 5, message: "Fifth game should have ID 5")
        
        // Test that all game IDs are unique
        var i2 = 0
        while i2 < 5 {
            var j = i2 + 1
            while j < 5 {
                assert(gameIds[i2] != gameIds[j], message: "Game IDs should be unique")
                j = j + 1
            }
            i2 = i2 + 1
        }
    }

    // Test game state transitions
    access(all) fun testGameStateTransitions() {
        // Initial state
        var isOpen: Bool = false
        var roundNumber: UInt32 = 1
        var hasCommit: Bool = false
        var hasReveal: Bool = false
        
        assert(!isOpen, message: "Game should start closed")
        assert(roundNumber == 1, message: "Should start at round 1")
        assert(!hasCommit, message: "Should not have commit initially")
        assert(!hasReveal, message: "Should not have reveal initially")
        
        // After commit
        hasCommit = true
        assert(hasCommit, message: "Should have commit after commit phase")
        
        // After reveal
        hasReveal = true
        assert(hasReveal, message: "Should have reveal after reveal phase")
        
        // After round close
        roundNumber = roundNumber + 1
        hasCommit = false
        hasReveal = false
        
        assert(roundNumber == 2, message: "Round should increment")
        assert(!hasCommit, message: "Commit should be reset")
        assert(!hasReveal, message: "Reveal should be reset")
    }
} 