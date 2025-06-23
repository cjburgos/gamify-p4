import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import { WalletProvider } from './contexts/WalletContext';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Arena from "@/pages/arena";
import Profile from "@/pages/profile";
import GameMaster from "@/pages/gamemaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/arena" component={Arena} />
      <Route path="/profile" component={Profile} />
      <Route path="/gamemaster" component={GameMaster} />
      <Route>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 pixel-font">Page Not Found</h1>
            <a href="/" className="text-yellow-400 hover:underline pixel-font">Return to Marketplace</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
