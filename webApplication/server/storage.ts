import { games, users, type User, type InsertUser, type Game, type InsertGame } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getBrandGames(): Promise<Game[]>;
  getSportsGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private brandGames: Map<number, Game>;
  private sportsGames: Map<number, Game>;
  private currentUserId: number;
  private currentGameId: number;
  private currentBrandGameId: number;
  private currentSportsGameId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.brandGames = new Map();
    this.sportsGames = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentBrandGameId = 1000; // Start brand games at 1000
    this.currentSportsGameId = 2000; // Start sports games at 2000
    
    // Initialize with sample games
    this.initializeGames();
    this.initializeBrandGames();
    this.initializeSportsGames();
  }

  private initializeGames() {
    const sampleGames: Omit<Game, 'id'>[] = [
      {
        title: "Guess the Dice",
        description: "Roll the dice and guess the outcome to win!",
        gameType: "dice",
        host: "DiceMaster_420",
        hostAvatar: "electric-purple-cyber-blue",
        entryFee: 100, // 1 USDC
        prizePool: 4700, // $47 USDC
        maxPlayers: 20,
        currentPlayers: 12,
        lockTime: new Date(Date.now() + 2 * 60 * 1000 + 34 * 1000), // 2m 34s from now
        status: "live",
        gameIcon: "🎲",
        rules: [
          "Each player pays the entry fee to join the game",
          "Guess the sum of two dice rolls (2-12)",
          "Closest guess wins the entire prize pool",
          "Results verified on-chain, no house edge"
        ],
        hostGamesHosted: 127,
        hostRating: 48, // 4.8
      },
      {
        title: "Pick the Card",
        description: "Choose the right card from the deck to claim victory!",
        gameType: "card",
        host: "CardShark_99",
        hostAvatar: "cyber-blue-neon-green",
        entryFee: 200, // 2 USDC
        prizePool: 7800, // $78 USDC
        maxPlayers: 15,
        currentPlayers: 8,
        lockTime: new Date(Date.now() + 7 * 60 * 1000 + 12 * 1000), // 7m 12s from now
        status: "filling",
        gameIcon: "🃏",
        rules: [
          "Survivor pool: avoid elimination cards",
          "Draw bad cards and you're out of the game",
          "Each round eliminates more players",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 89,
        hostRating: 46, // 4.6
      },
      {
        title: "Crypto Roulette",
        description: "Spin the wheel and bet on your lucky number!",
        gameType: "roulette",
        host: "RouletteKing",
        hostAvatar: "neon-green-gold-accent",
        entryFee: 500, // 5 USDC
        prizePool: 12500, // $125 USDC
        maxPlayers: 25,
        currentPlayers: 15,
        lockTime: new Date(Date.now() + 15 * 60 * 1000 + 28 * 1000), // 15m 28s from now
        status: "starting",
        gameIcon: "🎰",
        rules: [
          "Survivor pool: avoid elimination numbers",
          "Pick losing numbers and get eliminated",
          "Multiple rounds thin out the player pool",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 203,
        hostRating: 49, // 4.9
      },
      {
        title: "Number Wizard",
        description: "Use your intuition to pick the winning number!",
        gameType: "number",
        host: "NumberWizard",
        hostAvatar: "electric-purple-gold-accent",
        entryFee: 50, // 0.5 USDC
        prizePool: 2300, // $23 USDC
        maxPlayers: 30,
        currentPlayers: 18,
        lockTime: new Date(Date.now() + 45 * 1000), // 45s from now
        status: "live",
        gameIcon: "🔢",
        rules: [
          "Survivor pool: pick numbers to stay alive",
          "Wrong numbers eliminate you from the game",
          "Last survivors standing split the prize",
          "Progressive elimination until winners remain"
        ],
        hostGamesHosted: 156,
        hostRating: 47, // 4.7
      },
      {
        title: "Coin Flip Battle",
        description: "Heads or tails? Make your choice and win big!",
        gameType: "coinflip",
        host: "CoinMaster",
        hostAvatar: "cyber-blue-electric-purple",
        entryFee: 300, // 3 USDC
        prizePool: 9200, // $92 USDC
        maxPlayers: 16,
        currentPlayers: 6,
        lockTime: new Date(Date.now() + 23 * 60 * 1000 + 47 * 1000), // 23m 47s from now
        status: "waiting",
        gameIcon: "🪙",
        rules: [
          "Choose heads or tails before the flip",
          "Coin flip uses cryptographic randomness",
          "Correct guessers split the prize pool",
          "Fast-paced rounds every few minutes"
        ],
        hostGamesHosted: 78,
        hostRating: 45, // 4.5
      },
      {
        title: "Lucky Seven",
        description: "Will seven be your lucky number today?",
        gameType: "lucky",
        host: "Lucky_Leprechaun",
        hostAvatar: "gold-accent-neon-green",
        entryFee: 700, // 7 USDC
        prizePool: 18900, // $189 USDC
        maxPlayers: 25,
        currentPlayers: 20,
        lockTime: new Date(Date.now() + 31 * 60 * 1000 + 15 * 1000), // 31m 15s from now
        status: "hot",
        gameIcon: "🍀",
        rules: [
          "Predict if the next random number contains a 7",
          "Higher stakes, higher rewards",
          "Multiple 7s multiply your winnings",
          "Bonus rounds for consecutive wins"
        ],
        hostGamesHosted: 312,
        hostRating: 50, // 5.0
      },
      {
        title: "Rock Paper Scissors",
        description: "Classic game meets crypto - predict the winning move!",
        gameType: "rps",
        host: "GameMaster_Pro",
        hostAvatar: "cyber-blue-gold-accent",
        entryFee: 150, // 1.5 USDC
        prizePool: 4200, // $42 USDC
        maxPlayers: 28,
        currentPlayers: 19,
        lockTime: new Date(Date.now() + 6 * 60 * 1000 + 33 * 1000), // 6m 33s from now
        status: "filling",
        gameIcon: "✂️",
        rules: [
          "Survivor pool: make choices that keep you alive",
          "Wrong moves eliminate you from the game",
          "Each round removes more players",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 89,
        hostRating: 46, // 4.6
      },
      {
        title: "Color Wheel Spin",
        description: "Spin the rainbow wheel and bet on your color!",
        gameType: "wheel",
        host: "Rainbow_Spinner",
        hostAvatar: "neon-green-electric-purple",
        entryFee: 75, // 0.75 USDC
        prizePool: 2850, // $28.50 USDC
        maxPlayers: 38,
        currentPlayers: 31,
        lockTime: new Date(Date.now() + 11 * 60 * 1000 + 8 * 1000), // 11m 8s from now
        status: "starting",
        gameIcon: "🌈",
        rules: [
          "Pick a color: Red, Blue, Green, Yellow, Purple",
          "Wheel spins with verified randomness",
          "Winning color players split the prize",
          "Different colors have different odds"
        ],
        hostGamesHosted: 156,
        hostRating: 48, // 4.8
      }
    ];

    sampleGames.forEach(game => {
      const id = this.currentGameId++;
      this.games.set(id, { ...game, id });
    });
  }

  private initializeBrandGames() {
    const brandGames: Omit<Game, 'id'>[] = [
      {
        title: "Wheel of Fortune",
        description: "Spin the wheel and solve the puzzle to win brand prizes!",
        gameType: "wheel",
        host: "Nike_Official",
        hostAvatar: "electric-purple-gold-accent",
        entryFee: 0, // Free to play
        prizePool: 50000, // $500 Nike gift card
        maxPlayers: 24,
        currentPlayers: 18,
        lockTime: new Date(Date.now() + 5 * 60 * 1000 + 23 * 1000), // 5m 23s from now
        status: "live",
        gameIcon: "🎡",
        rules: [
          "Spin the wheel to reveal letters in the phrase",
          "First to solve wins the Nike gift card",
          "No purchase necessary, free entry",
          "Brand sponsored prize distribution"
        ],
        hostGamesHosted: 45,
        hostRating: 49, // 4.9
      },
      {
        title: "Jeopardy Champions",
        description: "Answer questions across categories to win tech prizes!",
        gameType: "trivia",
        host: "Apple_Store",
        hostAvatar: "cyber-blue-neon-green",
        entryFee: 0, // Free to play
        prizePool: 100000, // $1000 Apple Store credit
        maxPlayers: 16,
        currentPlayers: 12,
        lockTime: new Date(Date.now() + 12 * 60 * 1000 + 47 * 1000), // 12m 47s from now
        status: "filling",
        gameIcon: "🧠",
        rules: [
          "Answer trivia questions in various categories",
          "Daily Double opportunities for bonus points",
          "Highest score wins Apple Store credit",
          "Questions verified by Apple education team"
        ],
        hostGamesHosted: 67,
        hostRating: 50, // 5.0
      },
      {
        title: "Deal or No Deal",
        description: "Choose briefcases and negotiate with the banker for amazing prizes!",
        gameType: "mystery",
        host: "Amazon_Giveaways",
        hostAvatar: "gold-accent-neon-green",
        entryFee: 0, // Free to play
        prizePool: 200000, // $2000 Amazon credit
        maxPlayers: 26,
        currentPlayers: 20,
        lockTime: new Date(Date.now() + 8 * 60 * 1000 + 15 * 1000), // 8m 15s from now
        status: "starting",
        gameIcon: "💼",
        rules: [
          "Select briefcases containing hidden prizes",
          "Banker offers deals throughout the game",
          "Accept the deal or risk it for the briefcase",
          "Amazon sponsored with verified prizes"
        ],
        hostGamesHosted: 23,
        hostRating: 48, // 4.8
      },
      {
        title: "Price is Right Showcase",
        description: "Guess the prices of luxury items to win them!",
        gameType: "wheel",
        host: "Tesla_Official",
        hostAvatar: "electric-purple-cyber-blue",
        entryFee: 0, // Free to play
        prizePool: 500000, // $5000 Tesla accessories
        maxPlayers: 30,
        currentPlayers: 25,
        lockTime: new Date(Date.now() + 18 * 60 * 1000 + 32 * 1000), // 18m 32s from now
        status: "hot",
        gameIcon: "🚗",
        rules: [
          "Guess prices of Tesla merchandise and accessories",
          "Closest without going over wins the showcase",
          "Spin the wheel for bonus multipliers",
          "Official Tesla partnership with real prizes"
        ],
        hostGamesHosted: 12,
        hostRating: 50, // 5.0
      },
      {
        title: "McDonald's Menu Challenge",
        description: "Test your knowledge of McDonald's menu for free meals!",
        gameType: "trivia",
        host: "McDonalds_Global",
        hostAvatar: "gold-accent-neon-green",
        entryFee: 0, // Free to play
        prizePool: 15000, // $150 gift cards
        maxPlayers: 100,
        currentPlayers: 78,
        lockTime: new Date(Date.now() + 14 * 60 * 1000 + 22 * 1000), // 14m 22s from now
        status: "filling",
        gameIcon: "🍟",
        rules: [
          "Answer trivia about McDonald's menu items",
          "Fastest correct answers win gift cards",
          "Multiple prize tiers for different scores",
          "Corporate training style engagement"
        ],
        hostGamesHosted: 134,
        hostRating: 47, // 4.7
      },
      {
        title: "Starbucks Barista Training",
        description: "Learn coffee knowledge and win Starbucks rewards!",
        gameType: "trivia",
        host: "Starbucks_Academy",
        hostAvatar: "neon-green-cyber-blue",
        entryFee: 0, // Free to play
        prizePool: 30000, // $300 rewards points
        maxPlayers: 50,
        currentPlayers: 44,
        lockTime: new Date(Date.now() + 22 * 60 * 1000 + 55 * 1000), // 22m 55s from now
        status: "starting",
        gameIcon: "☕",
        rules: [
          "Corporate training quiz on coffee preparation",
          "Learn drink recipes and coffee origins",
          "Points awarded for employee development",
          "Real Starbucks partner training content"
        ],
        hostGamesHosted: 67,
        hostRating: 49, // 4.9
      },
      {
        title: "Netflix Binge Challenge",
        description: "Guess the Netflix show from clues and win subscriptions!",
        gameType: "mystery",
        host: "Netflix_Originals",
        hostAvatar: "electric-purple-gold-accent",
        entryFee: 0, // Free to play
        prizePool: 24000, // $240 Netflix credits
        maxPlayers: 60,
        currentPlayers: 52,
        lockTime: new Date(Date.now() + 9 * 60 * 1000 + 17 * 1000), // 9m 17s from now
        status: "live",
        gameIcon: "📺",
        rules: [
          "Identify Netflix shows from cryptic clues",
          "Brand marketing through entertainment trivia",
          "Multiple difficulty levels with different rewards",
          "Promotes Netflix content discovery"
        ],
        hostGamesHosted: 89,
        hostRating: 48, // 4.8
      },
      {
        title: "Adobe Creative Skills Test",
        description: "Demonstrate design knowledge for Adobe software prizes!",
        gameType: "trivia",
        host: "Adobe_Creative",
        hostAvatar: "cyber-blue-electric-purple",
        entryFee: 0, // Free to play
        prizePool: 120000, // $1200 Creative Suite
        maxPlayers: 25,
        currentPlayers: 19,
        lockTime: new Date(Date.now() + 28 * 60 * 1000 + 41 * 1000), // 28m 41s from now
        status: "waiting",
        gameIcon: "🎨",
        rules: [
          "Corporate training assessment format",
          "Test knowledge of Photoshop, Illustrator, etc.",
          "Professional development rewards",
          "Skill validation with real software prizes"
        ],
        hostGamesHosted: 34,
        hostRating: 50, // 5.0
      }
    ];

    brandGames.forEach(game => {
      const id = this.currentBrandGameId++;
      this.brandGames.set(id, { ...game, id });
    });
  }

  private initializeSportsGames() {
    const sportsGames: Omit<Game, 'id'>[] = [
      {
        title: "NFL Next Possession",
        description: "Survivor pool: stay alive by correctly calling NFL possessions!",
        gameType: "football",
        host: "ESPN_Sports",
        hostAvatar: "cyber-blue-electric-purple",
        entryFee: 250, // 2.5 USDC
        prizePool: 8750, // $87.50 USDC
        maxPlayers: 35,
        currentPlayers: 28,
        lockTime: new Date(Date.now() + 3 * 60 * 1000 + 45 * 1000), // 3m 45s from now
        status: "live",
        gameIcon: "🏈",
        rules: [
          "Survivor pool: avoid wrong possession calls",
          "Bad predictions eliminate you from the pool",
          "Multiple elimination rounds per game",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 234,
        hostRating: 49, // 4.9
      },
      {
        title: "World Cup 2026 Winner",
        description: "Survivor pool: avoid eliminated teams throughout the tournament!",
        gameType: "soccer",
        host: "FIFA_Official",
        hostAvatar: "neon-green-gold-accent",
        entryFee: 500, // 5 USDC
        prizePool: 25000, // $250 USDC
        maxPlayers: 50,
        currentPlayers: 42,
        lockTime: new Date(Date.now() + 25 * 60 * 1000 + 12 * 1000), // 25m 12s from now
        status: "filling",
        gameIcon: "⚽",
        rules: [
          "Survivor pool: avoid eliminated teams",
          "Pick losing teams and get knocked out",
          "Tournament progression thins the field",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 89,
        hostRating: 50, // 5.0
      },
      {
        title: "NBA Next Shot",
        description: "Survivor pool: stay alive by calling NBA shots correctly!",
        gameType: "basketball",
        host: "NBA_Live",
        hostAvatar: "electric-purple-cyber-blue",
        entryFee: 100, // 1 USDC
        prizePool: 3200, // $32 USDC
        maxPlayers: 32,
        currentPlayers: 26,
        lockTime: new Date(Date.now() + 1 * 60 * 1000 + 23 * 1000), // 1m 23s from now
        status: "live",
        gameIcon: "🏀",
        rules: [
          "Survivor pool: stay alive by avoiding elimination",
          "Wrong predictions knock you out of the pool",
          "Multiple rounds during live NBA games",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 456,
        hostRating: 48, // 4.8
      },
      {
        title: "Champions League Final",
        description: "Survivor pool: avoid eliminated teams throughout the tournament!",
        gameType: "soccer",
        host: "UEFA_Official",
        hostAvatar: "gold-accent-cyber-blue",
        entryFee: 1000, // 10 USDC
        prizePool: 45000, // $450 USDC
        maxPlayers: 45,
        currentPlayers: 38,
        lockTime: new Date(Date.now() + 42 * 60 * 1000 + 18 * 1000), // 42m 18s from now
        status: "starting",
        gameIcon: "🏆",
        rules: [
          "Survivor pool: avoid eliminated teams",
          "Pick losing teams and get knocked out",
          "Tournament progression thins the field",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 67,
        hostRating: 49, // 4.9
      },
      {
        title: "Super Bowl Coin Toss",
        description: "Survivor pool: stay alive through multiple coin toss rounds!",
        gameType: "football",
        host: "NFL_Official",
        hostAvatar: "electric-purple-gold-accent",
        entryFee: 50, // 0.5 USDC
        prizePool: 1850, // $18.50 USDC
        maxPlayers: 37,
        currentPlayers: 31,
        lockTime: new Date(Date.now() + 8 * 60 * 1000 + 55 * 1000), // 8m 55s from now
        status: "hot",
        gameIcon: "🪙",
        rules: [
          "Survivor pool: stay alive through coin tosses",
          "Wrong calls eliminate you from the pool",
          "Multiple coin flips throughout the game",
          "Last survivors standing split the prize"
        ],
        hostGamesHosted: 178,
        hostRating: 47, // 4.7
      },
      {
        title: "Taylor Swift Concert Song",
        description: "Predict which song Taylor Swift will perform next live!",
        gameType: "concert",
        host: "LiveNation_Events",
        hostAvatar: "electric-purple-neon-green",
        entryFee: 300, // 3 USDC
        prizePool: 12600, // $126 USDC
        maxPlayers: 42,
        currentPlayers: 38,
        lockTime: new Date(Date.now() + 4 * 60 * 1000 + 12 * 1000), // 4m 12s from now
        status: "live",
        gameIcon: "🎤",
        rules: [
          "Live concert engagement during actual performance",
          "Predict next song from her discography",
          "Real-time betting during Eras Tour",
          "Concert attendees get bonus multipliers"
        ],
        hostGamesHosted: 67,
        hostRating: 49, // 4.9
      },
      {
        title: "Cirque du Soleil Act",
        description: "Guess which stunning act performs next under the big top!",
        gameType: "circus",
        host: "Cirque_Official",
        hostAvatar: "gold-accent-cyber-blue",
        entryFee: 200, // 2 USDC
        prizePool: 7400, // $74 USDC
        maxPlayers: 37,
        currentPlayers: 29,
        lockTime: new Date(Date.now() + 7 * 60 * 1000 + 28 * 1000), // 7m 28s from now
        status: "filling",
        gameIcon: "🎪",
        rules: [
          "Predict the next circus performance act",
          "Live engagement during Cirque du Soleil shows",
          "Options include acrobatics, magic, clowns, animals",
          "Theatrical entertainment betting experience"
        ],
        hostGamesHosted: 45,
        hostRating: 50, // 5.0
      },
      {
        title: "Grammy Awards Winner",
        description: "Live betting during the Grammy Awards ceremony!",
        gameType: "awards",
        host: "Recording_Academy",
        hostAvatar: "gold-accent-electric-purple",
        entryFee: 400, // 4 USDC
        prizePool: 16800, // $168 USDC
        maxPlayers: 42,
        currentPlayers: 35,
        lockTime: new Date(Date.now() + 19 * 60 * 1000 + 44 * 1000), // 19m 44s from now
        status: "starting",
        gameIcon: "🏆",
        rules: [
          "Predict Grammy Award winners in real-time",
          "Multiple category betting throughout ceremony",
          "Live event engagement with music industry",
          "Official Recording Academy partnership"
        ],
        hostGamesHosted: 23,
        hostRating: 48, // 4.8
      },
      {
        title: "Broadway Opening Night",
        description: "Will tonight's Broadway premiere get a standing ovation?",
        gameType: "theater",
        host: "Broadway_League",
        hostAvatar: "cyber-blue-gold-accent",
        entryFee: 350, // 3.5 USDC
        prizePool: 9800, // $98 USDC
        maxPlayers: 28,
        currentPlayers: 22,
        lockTime: new Date(Date.now() + 33 * 60 * 1000 + 17 * 1000), // 33m 17s from now
        status: "waiting",
        gameIcon: "🎭",
        rules: [
          "Predict audience reaction to Broadway premiere",
          "Standing ovation duration betting",
          "Live theater engagement experience",
          "New York theater district partnerships"
        ],
        hostGamesHosted: 89,
        hostRating: 47, // 4.7
      }
    ];

    sportsGames.forEach(game => {
      const id = this.currentSportsGameId++;
      this.sportsGames.set(id, { ...game, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).sort((a, b) => {
      // Sort by status priority: live > filling > starting > waiting > hot
      const statusPriority = { live: 5, filling: 4, starting: 3, waiting: 2, hot: 1 };
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 0;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Then by lock time (soonest first)
      return new Date(a.lockTime).getTime() - new Date(b.lockTime).getTime();
    });
  }

  async getBrandGames(): Promise<Game[]> {
    return Array.from(this.brandGames.values()).sort((a, b) => {
      // Sort by status priority: live > filling > starting > waiting > hot
      const statusPriority = { live: 5, filling: 4, starting: 3, waiting: 2, hot: 1 };
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 0;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Then by lock time (soonest first)
      return new Date(a.lockTime).getTime() - new Date(b.lockTime).getTime();
    });
  }

  async getSportsGames(): Promise<Game[]> {
    return Array.from(this.sportsGames.values()).sort((a, b) => {
      // Sort by status priority: live > filling > starting > waiting > hot
      const statusPriority = { live: 5, filling: 4, starting: 3, waiting: 2, hot: 1 };
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 0;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Then by lock time (soonest first)
      return new Date(a.lockTime).getTime() - new Date(b.lockTime).getTime();
    });
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const game: Game = { 
      ...insertGame, 
      id,
      currentPlayers: insertGame.currentPlayers || 0,
      hostGamesHosted: insertGame.hostGamesHosted || 0,
      hostRating: insertGame.hostRating || 50
    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }
}

export const storage = new MemStorage();
