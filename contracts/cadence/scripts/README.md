# MiniGame Scripts

This directory contains Cadence scripts for interacting with the MiniGame contract.

## Scripts Overview

### GetActivePlayersForGame.cdc
Retrieves the list of active players for a specific game.

**Parameters:**
- `gameId: UInt64` - The ID of the game

**Returns:**
- `[Address]` - Array of active player addresses

**Usage:**
```bash
flow scripts execute scripts/GetActivePlayersForGame.cdc --args-json '[
  {"type": "UInt64", "value": "1"}
]'
```

### GetLastRollDice.cdc
Retrieves the last dice roll result for a specific game.

**Parameters:**
- `gameId: UInt64` - The ID of the game

**Returns:**
- `UInt8` - The dice roll result (1-6) or 0 if not revealed

**Usage:**
```bash
flow scripts execute scripts/GetLastRollDice.cdc --args-json '[
  {"type": "UInt64", "value": "1"}
]'
```

### GetCounter.cdc
Retrieves the next game ID, which indicates how many games have been created.

**Parameters:**
- None

**Returns:**
- `UInt64` - The next game ID

**Usage:**
```bash
flow scripts execute scripts/GetCounter.cdc
```

### GetGameInfo.cdc
Retrieves comprehensive information about a specific game.

**Parameters:**
- `gameId: UInt64` - The ID of the game

**Returns:**
- `{String: AnyStruct}` - Game information including:
  - `id`: Game ID
  - `admin`: Admin address
  - `isOpen`: Whether game is accepting players
  - `activePlayers`: Array of active player addresses
  - `roundNumber`: Current round number
  - `revealedOutcome`: Revealed random outcome
  - `beacon`: Random beacon data

**Usage:**
```bash
flow scripts execute scripts/GetGameInfo.cdc --args-json '[
  {"type": "UInt64", "value": "1"}
]'
```

### GetPlayerInput.cdc
Retrieves a player's input for a specific round.

**Parameters:**
- `gameId: UInt64` - The ID of the game
- `playerAddress: Address` - The player's address
- `round: UInt32` - The round number

**Returns:**
- `AnyStruct?` - The player's input for the round or nil if not found

**Usage:**
```bash
flow scripts execute scripts/GetPlayerInput.cdc --args-json '[
  {"type": "UInt64", "value": "1"},
  {"type": "Address", "value": "0xf8d6e0586b0a20c7"},
  {"type": "UInt32", "value": "1"}
]'
```

### GetAllGames.cdc
Retrieves all game IDs that have been created.

**Parameters:**
- None

**Returns:**
- `[UInt64]` - Array of all game IDs

**Usage:**
```bash
flow scripts execute scripts/GetAllGames.cdc
```

## Contract Structure

The scripts work with the MiniGame contract which has the following key components:

- **MiniGame Contract**: Main contract that manages game instances
- **GameInstance Interface**: Defines the contract for any commit-reveal game
- **BaseGameInstance**: Provides common commit-reveal functionality
- **Player Resource**: Represents individual players and their game inputs

## Game Flow

1. **Create Game**: `MiniGame.createGame()` creates a new game instance
2. **Join Game**: Players join via `MiniGame.joinGame(gameId, playerAddress)`
3. **Start Round**: Admin starts round with `MiniGame.startRoundForGame(gameId, commitHash)`
4. **Player Inputs**: Players submit inputs via game-specific methods
5. **Reveal Round**: Admin reveals with `MiniGame.revealRoundForGame(gameId, secret)`
6. **Close Round**: Admin closes with `MiniGame.closeRoundForGame(gameId)`

## Network Configuration

The scripts are configured to work with the emulator network by default. For other networks, update the import addresses in the scripts:

- **Emulator**: `0xf8d6e0586b0a20c7`
- **Testnet**: `0x9a0766d93b6608b7`
- **Mainnet**: Use the deployed contract address

## Error Handling

The scripts include basic error handling:
- Return empty arrays when games don't exist
- Return 0 for dice rolls when not revealed
- Return nil for player inputs when not found

## Testing

To test the scripts, ensure the MiniGame contract is deployed and games are created:

```bash
# Deploy contracts
flow project deploy --network emulator

# Create a game
flow transactions send transactions/CreateNewGame.cdc

# Run scripts to verify functionality
flow scripts execute scripts/GetCounter.cdc
``` 