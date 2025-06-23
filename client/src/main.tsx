import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { FlowProvider } from "@onflow/kit";
import flowJSON from "../../cadenceSmartContracts/flow.json";

// Clear any cached content
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

function Root() {
  return (
    <FlowProvider
      config={{
        accessNodeUrl: "https://access.devnet.nodes.onflow.org:9000",
        flowNetwork: "testnet",
        appDetailTitle: "Onchain Game Rooms",
        appDetailIcon: "https://example.com/icon.png",
        appDetailDescription: "A decentralized app on Flow",
        appDetailUrl: "https://myonchainapp.com",
      }}
      flowJson={flowJSON}
    >
      <App />
    </FlowProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
