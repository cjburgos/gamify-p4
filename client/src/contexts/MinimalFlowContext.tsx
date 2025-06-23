import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as fcl from "@onflow/fcl";

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
    if (!user?.loggedIn) {
      throw new Error("User must be authenticated to deploy games");
    }

    const transaction = `
      import GuessTheDiceV2 from 0x0dd7dc583201e8b1

      transaction {
          prepare(signer: &Account) {
              // Optional: You could store the game ID or admin reference here
              let gameId = GuessTheDiceV2.createGame()
              log("New game created with ID: ".concat(gameId.toString()))
          }
      }
    `;

    try {
      const transactionId = await fcl.mutate({
        cadence: transaction,
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 1000,
      });

      console.log("Transaction submitted:", transactionId);

      // Wait for transaction to be finalized
      const result = await fcl.tx(transactionId).onceFinalized();
      console.log("Transaction finalized:", result);

      // Extract game ID from transaction events or logs
      // For now, we'll generate a mock game ID until we can parse the actual events
      const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store deployed game locally
      const deployedGame = {
        id: gameId,
        gameType,
        gameMaster: user.addr,
        entryCost,
        transactionId,
        deployedAt: new Date().toISOString(),
        isActive: true,
      };

      const existingGames = JSON.parse(
        localStorage.getItem("deployed_games") || "[]",
      );
      existingGames.push(deployedGame);
      localStorage.setItem("deployed_games", JSON.stringify(existingGames));

      return gameId;
    } catch (error) {
      console.error("Failed to deploy game:", error);
      throw error;
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
