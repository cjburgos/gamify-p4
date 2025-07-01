# MiniGame Transactions

This directory contains Cadence transactions for interacting with the MiniGame contract.

## Transactions Overview

### CreateNewGame.cdc
Creates a new game instance.

**Parameters:**
- None

**Returns:**
- Game ID (logged)

**Usage:**
```bash
flow transactions send transactions/CreateNewGame.cdc
```

### PlayerJoinsGame.cdc
Allows a player to join an existing game.

**Parameters:**
- `gameId: UInt64` - The ID of the game to join

**Usage:**
```bash
flow transactions send transactions/PlayerJoinsGame.cdc --args-json '[
  {"type": "UInt64", "value": "1"}
]'
```

### StartGameRound.cdc
Starts a new round in a game with commit-reveal randomness.

**Parameters:**
- `gameId: UInt64` - The ID of the game
- `secret: [UInt8]` - The secret used for randomness generation

**Usage:**
```bash
flow transactions send transactions/StartGameRound.cdc --args-json '[
  {"type": "UInt64", "value": "1"},
  {"type": "Array", "value": [{"type": "UInt8", "value": "1"}, {"type": "UInt8", "value": "2"}]}
]'
```

### RevealGameRound.cdc
Reveals the secret and generates random outcome for a round.

**Parameters:**
- `gameId: UInt64` - The ID of the game
- `secret: [UInt8]` - The secret to reveal (must match commit hash)

**Usage:**
```bash
flow transactions send transactions/RevealGameRound.cdc --args-json '[
  {"type": "UInt64", "value": "1"},
  {"type": "Array", "value": [{"type": "UInt8", "value": "1"}, {"type": "UInt8", "value": "2"}]}
]'
```

### CloseGameRound.cdc
Closes a round and evaluates players against the random outcome.

**Parameters:**
- `gameId: UInt64` - The ID of the game

**Usage:**
```bash
flow transactions send transactions/CloseGameRound.cdc --args-json '[
  {"type": "UInt64", "value": "1"}
]'
```

## Game Flow Example

Here's a complete example of how to run a game:

```bash
# 1. Create a new game
flow transactions send transactions/CreateNewGame.cdc

# 2. Players join the game (run for each player)
flow transactions send transactions/PlayerJoinsGame.cdc --args-json '[
  {"type": "UInt64", "value": "1"}
]'

# 3. Admin starts a round with a secret
flow transactions send transactions/StartGameRound.cdc --args-json '[
  {"type": "UInt64", "value": "1"},
  {"type": "Array", "value": [{"type": "UInt8", "value": "42"}]}
]'

# 4. Players submit their inputs (game-specific)
# Note: This requires a concrete game implementation

# 5. Admin reveals the secret
flow transactions send transactions/RevealGameRound.cdc --args-json '[
  {"type": "UInt64", "value": "1"},
  {"type": "Array", "value": [{"type": "UInt8", "value": "42"}]}
]'

# 6. Admin closes the round
flow transactions send transactions/CloseGameRound.cdc --args-json '[
  {"type": "UInt64", "value": "1"}
]'
```

## Commit-Reveal Randomness

The MiniGame contract uses a commit-reveal scheme for fair randomness:

1. **Commit Phase**: Admin commits to a secret hash before players make decisions
2. **Reveal Phase**: Admin reveals the secret and generates verifiable randomness
3. **Evaluation Phase**: Players are evaluated against the random outcome

This prevents the admin from manipulating the randomness after seeing player inputs.

## Security Considerations

- Only the admin can start, reveal, and close rounds
- The commit hash must match the revealed secret
- Players cannot join after a round has started
- The randomness is verifiable using Flow's RandomBeaconHistory

## Network Configuration

The transactions are configured to work with the emulator network by default. For other networks, update the import addresses:

- **Emulator**: `0xf8d6e0586b0a20c7`
- **Testnet**: `0x9a0766d93b6608b7`
- **Mainnet**: Use the deployed contract address

## Error Handling

The transactions include basic error handling:
- Preconditions check game state
- Validates input parameters
- Ensures proper authorization

## Testing

To test the transactions:

```bash
# Start emulator
flow emulator start --config-path cadence/flow.json

# Deploy contracts
flow project deploy --network emulator --config-path cadence/flow.json

# Run transactions
flow transactions send transactions/CreateNewGame.cdc
```

## Legacy Transactions

The following transactions are from the old contract structure and may need updates:

- `CommitGuess.cdc` - Needs concrete dice game implementation
- `PlayGuessTheDice.cdc` - Needs concrete dice game implementation

These transactions reference game-specific methods that don't exist in the current MiniGame contract. 