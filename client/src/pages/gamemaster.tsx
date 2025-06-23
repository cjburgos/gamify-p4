import { useWallet } from "@/contexts/WalletContext";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletInfo } from "@/components/wallet/WalletInfo";

export default function GameMaster() {
  const { isConnected, address } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Retro Header */}
      <header className="border-b-4 border-yellow-400 bg-gradient-to-r from-purple-800 to-blue-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
              <div className="text-purple-900 text-2xl font-bold">🎮</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white pixel-font">
                PlayOnchain
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/arena" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">Arena</a>
            <a href="/" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">Marketplace</a>
            <a href="/profile" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">Profile</a>
            <a href="/gamemaster" className="text-yellow-400 font-bold pixel-font text-lg hover:text-yellow-300 transition-colors">GameMaster</a>
          </nav>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <WalletInfo />
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </header>

      {/* GameMaster Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-yellow-400 pixel-font mb-8 text-center">GameMaster Dashboard</h2>

          {isConnected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Deployment Stats */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  🚀 Deployments
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Active Arenas:</span>
                    <span className="text-yellow-400 pixel-font font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Total Deployed:</span>
                    <span className="text-white pixel-font">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Games Hosted:</span>
                    <span className="text-white pixel-font">0</span>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  💎 Earnings
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Fees Collected:</span>
                    <span className="text-green-400 pixel-font font-bold">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Total Revenue:</span>
                    <span className="text-white pixel-font">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Best Day:</span>
                    <span className="text-white pixel-font">$0.00</span>
                  </div>
                </div>
              </div>

              {/* Quick Deploy */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  ⚡ Quick Deploy
                </h3>
                <p className="text-blue-200 pixel-font mb-4">Deploy a new game arena instantly</p>
                <a 
                  href="/" 
                  className="block w-full text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold pixel-font px-6 py-3 rounded-lg border-2 border-white hover:scale-105 transform transition-all duration-200 shadow-lg"
                >
                  Browse Templates
                </a>
              </div>

              {/* My Arenas */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  🏟️ My Arenas
                </h3>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎪</div>
                  <p className="text-blue-200 pixel-font">No arenas deployed</p>
                  <p className="text-sm text-blue-300 pixel-font mt-2">Deploy your first game to get started!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="max-w-md mx-auto bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-8 backdrop-blur-sm">
                <div className="text-6xl mb-6">👑</div>
                <h3 className="text-2xl font-bold text-white pixel-font mb-4">Become a GameMaster</h3>
                <p className="text-blue-200 pixel-font mb-6">
                  Connect your wallet to start deploying and managing game arenas
                </p>
                <ConnectWallet />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}