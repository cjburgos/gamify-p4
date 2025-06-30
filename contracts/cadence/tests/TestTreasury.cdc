import Test
import "Treasury"

access(all) contract TreasuryTest {
    access(all) fun setup() {
        // Setup code if needed
    }

    access(all) fun testAddGameAddress() {
        let treasury <- Treasury.createTreasury()
        let gameId: UInt64 = 1
        let address = 0x1

        treasury.addGameAddress(gameId: gameId, address: address)

        let retrievedAddress = treasury.getGameAddress(gameId: gameId)
        assert(retrievedAddress == address, message: "Address not stored correctly")
    }

    access(all) fun testSettingAndReadingVariables() {
        let treasury = Treasury()
        let gameId: UInt64 = 2
        let address = 0x2

        treasury.addGameAddress(gameId: gameId, address: address)

        let winners: [Address] = [0x3, 0x4]
        let completed: Bool = true
        let value: UInt256 = 100
        let mathContract: Address? = 0x5

        treasury.updateGameState(
            gameId: gameId,
            winners: winners,
            completed: completed,
            value: value,
            mathContract: mathContract
        )

        let state = treasury.getGameState(gameId: gameId)!
        assert(state.winners == winners, message: "Winners not stored correctly")
        assert(state.completed == completed, message: "Completed status not stored correctly")
        assert(state.value == value, message: "Value not stored correctly")
        assert(state.mathContract == mathContract, message: "Math contract not stored correctly")
    }

    access(all) fun testCollectWinnings() {
        let treasury = Treasury()
        let gameId: UInt64 = 3
        let address = 0x6

        treasury.addGameAddress(gameId: gameId, address: address)

        let winners: [Address] = [0x7, 0x8]
        treasury.updateGameState(
            gameId: gameId,
            winners: winners,
            completed: true,
            value: 1000,
            mathContract: nil
        )

        treasury.collectWinnings(gameId: gameId)
    }
}
