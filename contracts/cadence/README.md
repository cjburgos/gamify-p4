## 👋 Welcome Flow Developer!

This project is a starting point for you to develop smart contracts on the Flow Blockchain. It comes with example contracts, scripts, transactions, and tests to help you get started.

## 🔨 Getting Started

Here are some essential resources to help you hit the ground running:

- **[Flow Documentation](https://developers.flow.com/)** - The official Flow Documentation is a great starting point to start learning about about [building](https://developers.flow.com/build/flow) on Flow.
- **[Cadence Documentation](https://cadence-lang.org/docs/language)** - Cadence is the native language for the Flow Blockchain. It is a resource-oriented programming language that is designed for developing smart contracts.  The documentation is a great place to start learning about the language.
- **[Visual Studio Code](https://code.visualstudio.com/)** and the **[Cadence Extension](https://marketplace.visualstudio.com/items?itemName=onflow.cadence)** - It is recommended to use the Visual Studio Code IDE with the Cadence extension installed.  This will provide syntax highlighting, code completion, and other features to support Cadence development.
- **[Flow Clients](https://developers.flow.com/tools/clients)** - There are clients available in multiple languages to interact with the Flow Blockchain.  You can use these clients to interact with your smart contracts, run transactions, and query data from the network.
- **[Block Explorers](https://developers.flow.com/ecosystem/block-explorers)** - Block explorers are tools that allow you to explore on-chain data.  You can use them to view transactions, accounts, events, and other information.  [Flowser](https://flowser.dev/) is a powerful block explorer for local development on the Flow Emulator.

## 📦 Project Structure

Your project has been set up with the following structure:

- `flow.json` - This is the configuration file for your project (analogous to a `package.json` file for NPM).  It has been initialized with a basic configuration to get started.
- `/cadence` - This is where your Cadence smart contracts code lives

Inside the `cadence` folder you will find:
- `/contracts` - This folder contains your Cadence contracts (these are deployed to the network and contain the business logic for your application)
  - `Counter.cdc`
- `/scripts` - This folder contains your Cadence scripts (read-only operations)
  - `GetCounter.cdc`
- `/transactions` - This folder contains your Cadence transactions (state-changing operations)
  - `IncrementCounter.cdc`
- `/tests` - This folder contains your Cadence tests (integration tests for your contracts, scripts, and transactions to verify they behave as expected)
  - `Counter_test.cdc`

## Running the Existing Project

### Executing the `GetCounter` Script

To run the `GetCounter` script, use the following command:

```shell
flow scripts execute cadence/scripts/GetCounter.cdc
```

### Sending the `IncrementCounter` Transaction

To run the `IncrementCounter` transaction, use the following command:

```shell
flow transactions send cadence/transactions/IncrementCounter.cdc
```

To learn more about using the CLI, check out the [Flow CLI Documentation](https://developers.flow.com/tools/flow-cli).

## 👨‍💻 Start Developing

### Creating a New Contract

To add a new contract to your project, run the following command:

```shell
flow generate contract
```

This command will create a new contract file and add it to the `flow.json` configuration file.

### Creating a New Script

To add a new script to your project, run the following command:

```shell
flow generate script
```

This command will create a new script file.  Scripts are used to read data from the blockchain and do not modify state (i.e. get the current balance of an account, get a user's NFTs, etc).

You can import any of your own contracts or installed dependencies in your script file using the `import` keyword.  For example:

```cadence
import "Counter"
```

### Creating a New Transaction

To add a new transaction to your project you can use the following command:

```shell
flow generate transaction
```

This command will create a new transaction file.  Transactions are used to modify the state of the blockchain (i.e purchase an NFT, transfer tokens, etc).

You can import any dependencies as you would in a script file.

### Creating a New Test

To add a new test to your project you can use the following command:

```shell
flow generate test
```

This command will create a new test file.  Tests are used to verify that your contracts, scripts, and transactions are working as expected.

### Installing External Dependencies

If you want to use external contract dependencies (such as NonFungibleToken, FlowToken, FungibleToken, etc.) you can install them using [Flow CLI Dependency Manager](https://developers.flow.com/tools/flow-cli/dependency-manager).

For example, to install the NonFungibleToken contract you can use the following command:

```shell
flow deps add mainnet://1d7e57aa55817448.NonFungibleToken
```

Contracts can be found using [ContractBrowser](https://contractbrowser.com/), but be sure to verify the authenticity before using third-party contracts in your project.

## 🧪 Testing

To verify that your project is working as expected you can run the tests using the following command:

```shell
flow test
```

This command will run all tests with the `_test.cdc` suffix (these can be found in the `cadence/tests` folder). You can add more tests here using the `flow generate test` command (or by creating them manually).

To learn more about testing in Cadence, check out the [Cadence Test Framework Documentation](https://cadence-lang.org/docs/testing-framework).

## 🚀 Deploying Your Project

To deploy your project to the Flow network, you must first have a Flow account and have configured your deployment targets in the `flow.json` configuration file.

You can create a new Flow account using the following command:

```shell
flow accounts create
```

Learn more about setting up deployment targets in the [Flow CLI documentation](https://developers.flow.com/tools/flow-cli/deployment/project-contracts).

### Deploying to the Flow Emulator

To deploy your project to the Flow Emulator, start the emulator using the following command:

```shell
flow emulator --start
```

To deploy your project, run the following command:

```shell
flow project deploy --network=emulator
```

This command will start the Flow Emulator and deploy your project to it. You can now interact with your project using the Flow CLI or alternate [client](https://developers.flow.com/tools/clients).

### Deploying to Flow Testnet

To deploy your project to Flow Testnet you can use the following command:

```shell
flow project deploy --network=testnet
```

This command will deploy your project to Flow Testnet. You can now interact with your project on this network using the Flow CLI or any other Flow client.

### Deploying to Flow Mainnet

To deploy your project to Flow Mainnet you can use the following command:

```shell
flow project deploy --network=mainnet
```

This command will deploy your project to Flow Mainnet. You can now interact with your project using the Flow CLI or alternate [client](https://developers.flow.com/tools/clients).

## 📚 Other Resources

- [Cadence Design Patterns](https://cadence-lang.org/docs/design-patterns)
- [Cadence Anti-Patterns](https://cadence-lang.org/docs/anti-patterns)
- [Flow Core Contracts](https://developers.flow.com/build/core-contracts)

## 🤝 Community
- [Flow Community Forum](https://forum.flow.com/)
- [Flow Discord](https://discord.gg/flow)
- [Flow Twitter](https://x.com/flow_blockchain)

# MiniGame Contract Documentation

## Overview

MiniGame is a generalized framework for creating fair, on-chain games that use commit-reveal randomness to ensure transparency and prevent manipulation. The contract implements a three-phase game flow that guarantees fair play through cryptographic verification.

## Architecture

The contract uses a layered architecture with the following components:

### Core Components

1. **MiniGame Contract** - Main contract that manages game instances
2. **GameInstance Interface** - Defines the contract for any commit-reveal game
3. **BaseGameInstance** - Provides common commit-reveal functionality
4. **Player Resource** - Represents individual players and their game inputs
5. **Receipt Resource** - Stores player inputs and request metadata

### Key Features

- **Commit-Reveal Scheme**: Prevents admin manipulation by requiring commitment before player decisions
- **Verifiable Randomness**: Uses Flow's RandomBeaconHistory and Xorshift128plus PRG
- **Resource-Based Management**: Secure player and game state management
- **Extensible Framework**: Easy to extend for different game types

## Game Flow

```
1. createGame() → Creates a new game instance
2. join(player) → Players join the game (while closed)
3. startRound(commitHash) → Admin opens game and commits to randomness
4. Players submit inputs via game-specific methods
5. revealRound(secret) → Admin reveals secret and generates outcome
6. closeRound() → Evaluate players and eliminate losers
7. Repeat steps 3-6 until winner(s) remain
```

## Contract Structure

### MiniGame Contract

**Purpose**: Main contract that manages game instances and provides factory functions.

**Key Functions**:
- `createGame()`: Creates a new game instance
- `getGameRef(gameId)`: Returns a reference to a specific game

**State Variables**:
- `entryFee`: Fee required to join games
- `admin`: Contract administrator address
- `nextGameId`: Auto-incrementing game ID
- `gameInstances`: Collection of all game instances

### GameInstance Interface

**Purpose**: Defines the contract that any commit-reveal game must implement.

**Required Methods**:
- `commitRound(commitHash)`: Commit phase
- `revealRound(secret)`: Reveal phase
- `closeRound()`: Evaluation phase
- `isRoundReady()`: Check if round can be closed

### BaseGameInstance Resource

**Purpose**: Provides common commit-reveal functionality that can be extended.

**Key Features**:
- Manages player lifecycle
- Handles commit-reveal mechanics
- Provides abstract methods for game-specific logic
- Manages round progression

**Abstract Methods**:
- `generateOutcome(beacon, secret)`: Game-specific randomness generation
- `evaluatePlayer(player)`: Game-specific player evaluation

### Player Resource

**Purpose**: Represents individual players and their game inputs.

**Properties**:
- `address`: Player's blockchain address
- `inputs`: Dictionary mapping round numbers to player inputs

**Methods**:
- `setInput(round, input)`: Set player input for a specific round
- `getInputForRound(round)`: Retrieve player input for a round
- `getAddress()`: Get player's address

### Receipt Resource

**Purpose**: Stores player inputs and request metadata for verification.

**Properties**:
- `playerInput`: The player's input value
- `requestBlock`: Block height when request was made
- `fulfilled`: Whether the request has been processed

## Security Features

### Commit-Reveal Protection
- Admin must commit to a secret hash before players make decisions
- Secret is revealed after all player inputs are collected
- Cryptographic verification ensures commit-reveal integrity

### Timing Constraints
- Reveal can only happen after a minimum block delay
- Prevents immediate manipulation of randomness

### Access Control
- Admin-only critical operations (commit, reveal, close)
- Prevents unauthorized game state changes

### Resource Safety
- Players can only join once per game
- Proper resource cleanup on player elimination
- Memory-safe resource management

## Randomness Guarantees

### Multi-Layer Randomness
1. **Blockchain Beacon**: Flow's RandomBeaconHistory provides verifiable randomness
2. **Admin Secret**: Additional entropy from admin's secret
3. **PRG**: Xorshift128plus generates deterministic outcomes

### Verification Process
1. Admin commits to hash of secret
2. Players submit inputs
3. Admin reveals secret
4. Contract verifies hash(secret) == commitHash
5. Randomness generated from beacon + secret
6. Outcome deterministically computed

## Usage Examples

### Basic Game Creation

```cadence
// Create a new game
let gameId = miniGame.createGame()
let gameRef = miniGame.getGameRef(gameId: gameId)

// Players join
gameRef.join(player: 0x123)
gameRef.join(player: 0x456)
```

### Round Management

```cadence
// Admin starts round with commit
let secret = [1, 2, 3, ...] // 32 bytes
let commitHash = Crypto.hash(secret, algorithm: HashAlgorithm.SHA3_256)
gameRef.startRound(roundCommitHash: commitHash)

// Players submit inputs (game-specific)
gameRef.commitDiceGuess(player: 0x123, guessValue: 3)

// Admin reveals and closes
gameRef.revealRound(secret: secret)
gameRef.closeRound()
```

### Game State Queries

```cadence
// Check if round is ready to close
let ready = gameRef.isRoundReady()

// Get player input for current round
let playerInput = gameRef.players[0x123]?.getInputForRound(round: 1)
```

## Extending the Framework

### Creating a New Game Type

1. **Extend BaseGameInstance**:
```cadence
access(all) resource MyGameInstance: GameInstance {
    // Game-specific properties
    access(all) var gameSpecificData: String
    
    // Override abstract methods
    access(all) fun generateOutcome(beacon: [UInt8], secret: [UInt8]): AnyStruct {
        // Game-specific randomness generation
        return MyGameOutcome(...)
    }
    
    access(all) fun evaluatePlayer(player: Address): Bool {
        // Game-specific evaluation logic
        return playerWins
    }
}
```

2. **Add Game-Specific Methods**:
```cadence
access(all) fun submitGameInput(player: Address, input: MyGameInput) {
    // Validate and store player input
    self.players[player]?.setInput(round: self.roundNumber, input: input)
}
```

3. **Define Game-Specific Structs**:
```cadence
access(all) struct MyGameInput {
    access(all) let value: UInt8
    access(all) let timestamp: UInt64
}

access(all) struct MyGameOutcome {
    access(all) let result: UInt8
    access(all) let metadata: String
}
```

## Events

The contract emits events for important state changes:

- `GameCreated(id)`: New game created
- `RoundCommitted(gameId, commitBlock)`: Round committed
- `RoundRevealed(gameId, rolled, beacon, secret)`: Round revealed
- `RoundClosed(gameId, rolled, survivors)`: Round closed
- `GameEnded(gameId, winner)`: Game ended

## Dependencies

- **Xorshift128plus**: Pseudo-random number generator for deterministic outcomes
- **RandomBeaconHistory**: Flow's verifiable random function service
- **Crypto**: Cryptographic hash functions for commit-reveal verification

## Best Practices

### For Game Developers
1. Always validate player inputs in game-specific methods
2. Implement proper error handling for edge cases
3. Test thoroughly with different player counts
4. Consider gas costs for complex evaluation logic

### For Administrators
1. Use cryptographically secure random secrets
2. Maintain proper timing between commit and reveal
3. Monitor game state for potential issues
4. Implement proper prize distribution logic

### For Players
1. Submit inputs before the reveal phase
2. Verify game state before joining
3. Understand the game rules and evaluation criteria

## Testing

The framework includes comprehensive testing capabilities:

- Unit tests for individual components
- Integration tests for complete game flows
- Stress tests with multiple players
- Security tests for commit-reveal integrity

## Deployment

1. Deploy dependencies (Xorshift128plus, RandomBeaconHistory, Crypto)
2. Deploy MiniGame contract
3. Initialize with desired entry fee
4. Create first game instance
5. Begin player registration

## Future Enhancements

- **Prize Distribution**: Automated prize distribution mechanisms
- **Tournament Support**: Multi-game tournament structures
- **Advanced Randomness**: Additional randomness sources
- **Cross-Chain Integration**: Interoperability with other blockchains
- **Governance**: Decentralized governance for game parameters
