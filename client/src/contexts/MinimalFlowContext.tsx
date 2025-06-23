import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// Configure FCL
fcl.config({
  "app.detail.title": "OnchainGameRooms",
  "app.detail.icon": "https://placeholder.com/48x48",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "flow.network": "testnet",
});

interface FlowUser {
  addr?: string;
  loggedIn: boolean;
  cid?: string;
  expiresAt?: number;
  f_type: string;
  f_vsn: string;
  services: any[];
}

interface FlowContextType {
  user: FlowUser | null;
  isLoading: boolean;
  balance: string;
  network: "testnet" | "mainnet";
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchToMainnet: () => void;
  switchToTestnet: () => void;
  deployGame: (gameType: string, entryCost: number) => Promise<string | null>;
  joinGame: (gameId: string, guess: number) => Promise<boolean>;
  getActivePlayers: (gameId: string) => Promise<string[]>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState("0.0");
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe((currentUser: FlowUser) => {
      setUser(currentUser);
      if (currentUser?.addr && currentUser.loggedIn) {
        localStorage.setItem("flow_user_data", JSON.stringify(currentUser));
        localStorage.setItem("flow_wallet_address", currentUser.addr);
        fetchBalance(currentUser.addr);
      } else {
        setBalance("0.0");
      }
    });

    const initialUser = fcl.currentUser.snapshot();
    setUser(initialUser);

    if (initialUser?.addr && initialUser.loggedIn) {
      fetchBalance(initialUser.addr);
    }

    return unsubscribe;
  }, []);

  const fetchBalance = async (address: string) => {
    try {
      const script = `
        import FlowToken from 0x7e60df042a9c0868
        import FungibleToken from 0x9a0766d93b6608b7

        pub fun main(address: Address): UFix64 {
          let account = getAccount(address)
          let vaultRef = account.getCapability(/public/flowTokenBalance)
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")

          return vaultRef.balance
        }
      `;

      const flowBalance = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(address, t.Address)],
      });

      setBalance(flowBalance?.toString() || "0.0");
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("1.5"); // Mock balance for demo
    }
  };

  const connect = async () => {
    setIsLoading(true);
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      await fcl.unauthenticate();
      setUser(null);
      setBalance("0.0");
      localStorage.removeItem("flow_user_data");
      localStorage.removeItem("flow_wallet_address");
    } catch (error) {
      console.error("Disconnect error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToMainnet = () => {
    fcl.config({
      "accessNode.api": "https://rest-mainnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
      "flow.network": "mainnet",
    });
    setNetwork("mainnet");
    if (user?.addr && user.loggedIn) {
      fetchBalance(user.addr);
    }
  };

  const switchToTestnet = () => {
    fcl.config({
      "accessNode.api": "https://rest-testnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
      "flow.network": "testnet",
    });
    setNetwork("testnet");
    if (user?.addr && user.loggedIn) {
      fetchBalance(user.addr);
    }
  };

  const deployGame = async (
    gameType: string,
    entryCost: number,
  ): Promise<string | null> => {
    if (!user?.loggedIn || !user.addr) {
      throw new Error("User must be authenticated to deploy games");
    }

    setIsLoading(true);

    const transaction = `
      import GuessTheDiceV3 from 0x0dd7dc583201e8b1
      
      transaction {
          prepare(signer: &Account) {
              let gameId = GuessTheDiceV3.createGame()
              log("New game created with ID: ".concat(gameId.toString()))
          }
      }
    `;

    try {
      console.log("Submitting transaction to Flow testnet...");

      const transactionId = await fcl.mutate({
        cadence: transaction,
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 1000,
      });

      console.log("Transaction submitted with ID:", transactionId);

      // Wait for transaction to be sealed
      const result = await fcl.tx(transactionId).onceSealed();
      console.log("Transaction sealed:", result);
      console.log("Transaction status:", result.status);
      if (result.status === 5) {
        console.log("Transaction failed:", result.errorMessage);
        throw new Error(result.errorMessage || "Transaction failed");
      }

      // Extract game ID from the GameCreated event
      let gameId = null;

      if (result.events && result.events.length > 0) {
        console.log("Transaction events:", result.events);

        // Look for the GameCreated event specifically
        for (const event of result.events) {
          console.log("Event type:", event.type);
          console.log("Event data:", event.data);

          // Check if this is the GameCreated event from GuessTheDiceV2
          if (
            event.type &&
            (event.type.includes("GameCreated") ||
              event.type.includes(
                "A.0dd7dc583201e8b1.GuessTheDiceV2.GameCreated",
              ))
          ) {
            // Extract game ID from event data
            if (event.data) {
              // The event data might have different field names
              if (event.data.gameId) {
                gameId = event.data.gameId.toString();
              } else if (event.data.id) {
                gameId = event.data.id.toString();
              } else if (event.data.gameNumber) {
                gameId = event.data.gameNumber.toString();
              } else {
                // If the data is an array or different structure
                console.log("GameCreated event data structure:", event.data);
                const dataValues = Object.values(event.data);
                if (dataValues.length > 0) {
                  gameId = dataValues[0].toString();
                }
              }

              if (gameId) {
                console.log("Found game ID in GameCreated event:", gameId);
                break;
              }
            }
          }
        }
      }

      // Also check transaction logs as fallback
      if (!gameId && result.logs && result.logs.length > 0) {
        console.log("Transaction logs:", result.logs);

        for (const log of result.logs) {
          if (
            typeof log === "string" &&
            log.includes("New game created with ID:")
          ) {
            const match = log.match(/New game created with ID:\s*(\d+)/);
            if (match) {
              gameId = match[1];
              console.log("Found game ID in transaction log:", gameId);
              break;
            }
          }
        }
      }

      // If we still don't have a game ID, something went wrong
      if (!gameId) {
        console.error(
          "Could not extract game ID from GameCreated event or logs",
        );
        console.log(
          "Full transaction result:",
          JSON.stringify(result, null, 2),
        );
        throw new Error(
          "Game deployment successful but could not retrieve game ID",
        );
      }

      // Store deployed game via API
      const deployedGame = {
        id: gameId,
        gameType,
        gameMaster: user.addr,
        entryCost,
        transactionId,
        deployedAt: new Date().toISOString(),
        isActive: true,
        blockHeight: result.blockId,
      };

      // Save to backend instead of localStorage
      try {
        console.log("Saving game to backend:", deployedGame);

        const response = await fetch("/api/deployed-games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deployedGame),
        });

        console.log("Backend response status:", response.status);
        const responseText = await response.text();
        console.log("Backend response:", responseText);

        if (!response.ok) {
          console.error("Failed to save game to backend:", responseText);
          throw new Error(`Backend save failed: ${responseText}`);
        } else {
          console.log("Game saved to backend successfully");
        }
      } catch (error) {
        console.error("Error saving game to backend:", error);
        // Don't throw here - the game was still deployed successfully
      }

      return gameId;
    } catch (error) {
      console.error("Failed to deploy game:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (gameId: string): Promise<boolean> => {
    if (!user?.loggedIn || !user.addr) {
      throw new Error("User must be authenticated to join games");
    }

    setIsLoading(true);

    const transaction = `
      import GuessTheDiceV3 from 0x0dd7dc583201e8b1

      transaction(gameId: UInt64) {
        prepare(signer: &Account) {
            // Join the game as a player
            let playerAddress = signer.address
            let gameRef = GuessTheDiceV3.getGameRef(gameId: gameId)
            
            // Join the game with the player's guess
            gameRef.join(player: playerAddress)
            log("Player ".concat(playerAddress.toString()).concat(" joined game ").concat(gameId.toString()))
        }
    }
    `;

    try {
      console.log(`Joining game ${gameId}`);

      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: (arg, type) => [arg(parseInt(gameId), type.UInt64)],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 1000,
      });

      console.log("Join game transaction submitted:", transactionId);

      // Wait for transaction to be sealed
      const result = await fcl.tx(transactionId).onceSealed();
      console.log("Join game transaction sealed:", result);

      if (result.status === 5) {
        console.log("Join game transaction failed:", result.errorMessage);
        throw new Error(result.errorMessage || "Failed to join game");
      }

      // After successful transaction, read the updated activePlayers from contract
      try {
        console.log(
          `Join transaction successful, now reading contract for game ${gameId}...`,
        );
        const activePlayers = await getActivePlayers(gameId);
        console.log("Active players from contract after join:", activePlayers);

        if (activePlayers && activePlayers.length >= 0) {
          // Update backend with the complete player list
          console.log(
            `Updating backend with ${activePlayers.length} players for game ${gameId}`,
          );
          const response = await fetch(
            `/api/deployed-games/${gameId}/players`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ players: activePlayers }),
            },
          );

          if (response.ok) {
            console.log(
              "Successfully updated backend with active players:",
              activePlayers,
            );
          } else {
            console.error(
              "Failed to update backend:",
              response.status,
              await response.text(),
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to read active players from contract after join:",
          error,
        );
      }

      console.log("Successfully joined game!");
      return true;
    } catch (error) {
      console.error("Failed to join game:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get active players from contract
  const getActivePlayers = async (gameId: string): Promise<string[]> => {
    const script = `
      import GuessTheDiceV3 from 0x0dd7dc583201e8b1
      
      access(all) fun main(gameId: UInt64): [Address] {
          let gameRef = GuessTheDiceV3.getGameRef(gameId: gameId)
          if gameRef != nil {
              return *gameRef!.activePlayers
          } else {
              return []
          }
      }
    `;

    try {
      console.log(
        `Reading active players for game ${gameId} using GuessTheDiceV3...`,
      );

      const result = await fcl.query({
        cadence: script,
        args: (arg, types) => [arg(gameId, t.UInt64)],
      });

      console.log(`Contract result for game ${gameId}:`, result);
      console.log(
        `Result type:`,
        typeof result,
        `Array:`,
        Array.isArray(result),
      );

      // Process the result into string addresses
      let players: string[] = [];
      if (Array.isArray(result)) {
        players = result.map((addr: any) => {
          if (typeof addr === "string") {
            return addr;
          } else if (addr && typeof addr === "object" && addr.toString) {
            return addr.toString();
          } else {
            console.warn("Unexpected address format:", addr);
            return String(addr);
          }
        });
      }

      console.log(`Active players for game ${gameId}:`, players);
      return players;
    } catch (error) {
      console.error(`Failed to read active players for game ${gameId}:`, error);
      return [];
    }
  };

  const value: FlowContextType = {
    user,
    isLoading,
    balance,
    network,
    connect,
    disconnect,
    switchToMainnet,
    switchToTestnet,
    deployGame,
    joinGame,
    getActivePlayers,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
}
