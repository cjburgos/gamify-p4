import { useWallet } from "@/contexts/WalletContext";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletInfo } from "@/components/wallet/WalletInfo";

export default function Arena() {
  const { isConnected } = useWallet();

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
            <a href="/arena" className="text-yellow-400 font-bold pixel-font text-lg hover:text-yellow-300 transition-colors">Arena</a>
            <a href="/" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">Marketplace</a>
            <a href="/profile" className="text-white pixel-font text-lg hover:text-yellow-400 transition-colors">Profile</a>
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

      {/* Arena Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-yellow-400 pixel-font mb-4">Your Arena</h2>
            <p className="text-xl text-blue-200 pixel-font">No active games right now</p>
          </div>

          <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-4 border-yellow-400 p-8 backdrop-blur-sm">
            <div className="text-6xl mb-6">🏟️</div>
            <h3 className="text-2xl font-bold text-white pixel-font mb-4">Arena is Empty</h3>
            <p className="text-blue-200 pixel-font mb-6">
              Join a game when GameMasters deploy new arenas, or become a GameMaster yourself!
            </p>
            <a 
              href="/" 
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold pixel-font px-8 py-3 rounded-lg border-2 border-white hover:scale-105 transform transition-all duration-200 shadow-lg"
            >
              Browse Marketplace
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}