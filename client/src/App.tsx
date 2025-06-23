import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// import { FlowProvider } from "./contexts/FlowContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        <div
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #4c1d95 0%, #1e3a8a 50%, #312e81 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
                fontFamily: "monospace",
              }}
            >
              Page Not Found
            </h1>
            <a
              href="/"
              style={{
                color: "#fbbf24",
                textDecoration: "underline",
                fontFamily: "monospace",
              }}
            >
              Return to Marketplace
            </a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FlowProvider
        config={{
          accessNodeUrl: "https://access-mainnet.onflow.org",
          flowNetwork: "mainnet",
          appDetailTitle: "My On Chain App",
          appDetailIcon: "https://example.com/icon.png",
          appDetailDescription: "A decentralized app on Flow",
          appDetailUrl: "https://myonchainapp.com",
        }}
        flowJson={flowJSON}
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </FlowProvider>
    </QueryClientProvider>
  );
}

export default App;
