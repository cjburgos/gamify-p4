import { useWallet } from "@/contexts/WalletContext";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletInfo } from "@/components/wallet/WalletInfo";

export default function Profile() {
  const { isConnected, address, ticketBalance, ethBalance } = useWallet();

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
            <a href="/profile" className="text-yellow-400 font-bold pixel-font text-lg hover:text-yellow-300 transition-colors">Profile</a>
            <a href="/gamemaster" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">GameMaster</a>
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

      {/* Profile Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-yellow-400 pixel-font mb-8 text-center">Player Profile</h2>

          {isConnected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Wallet Info */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  💰 Wallet
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Address:</span>
                    <span className="text-white pixel-font font-mono text-sm">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Tickets:</span>
                    <span className="text-yellow-400 pixel-font font-bold">{ticketBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">ETH Balance:</span>
                    <span className="text-white pixel-font">{ethBalance}</span>
                  </div>
                </div>
              </div>

              {/* Game Stats */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  🏆 Game Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Games Played:</span>
                    <span className="text-white pixel-font">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Wins:</span>
                    <span className="text-green-400 pixel-font">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200 pixel-font">Overall P&L:</span>
                    <span className="text-white pixel-font">$0.00</span>
                  </div>
                </div>
              </div>

              {/* NFTs & POAPs */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  🎨 NFTs & POAPs
                </h3>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎖️</div>
                  <p className="text-blue-200 pixel-font">No rewards yet</p>
                  <p className="text-sm text-blue-300 pixel-font mt-2">Play games to earn POAPs and winner NFTs!</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white pixel-font mb-4 flex items-center">
                  📋 Recent Activity
                </h3>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-blue-200 pixel-font">No activity yet</p>
                  <p className="text-sm text-blue-300 pixel-font mt-2">Your game history will appear here</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="max-w-md mx-auto bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-8 backdrop-blur-sm">
                <div className="text-6xl mb-6">🔐</div>
                <h3 className="text-2xl font-bold text-white pixel-font mb-4">Connect Your Wallet</h3>
                <p className="text-blue-200 pixel-font mb-6">
                  Connect your wallet to view your profile and game stats
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