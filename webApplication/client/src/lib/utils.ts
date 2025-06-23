import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function formatUSDC(cents: number): string {
  if (cents === 0) return "FREE";
  return `${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 1)} USDC`;
}

export function formatBrandPrize(cents: number): string {
  if (cents === 0) return "FREE ENTRY";
  const dollars = cents / 100;
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}K Prize`;
  }
  return `$${dollars.toFixed(0)} Prize`;
}

export function getStatusColor(status: string): string {
  const colors = {
    live: "text-electric-purple bg-electric-purple/20 border-electric-purple/30",
    filling: "text-cyber-blue bg-cyber-blue/20 border-cyber-blue/30",
    starting: "text-gold-accent bg-gold-accent/20 border-gold-accent/30",
    waiting: "text-neon-green bg-neon-green/20 border-neon-green/30",
    hot: "text-gold-accent bg-gold-accent/20 border-gold-accent/30",
    locked: "text-gray-400 bg-gray-400/20 border-gray-400/30"
  };
  
  return colors[status as keyof typeof colors] || colors.waiting;
}

export function getHostAvatarGradient(avatarType: string): string {
  const gradients = {
    "electric-purple-cyber-blue": "from-electric-purple to-cyber-blue",
    "cyber-blue-neon-green": "from-cyber-blue to-neon-green",
    "neon-green-gold-accent": "from-neon-green to-gold-accent",
    "electric-purple-gold-accent": "from-electric-purple to-gold-accent",
    "cyber-blue-electric-purple": "from-cyber-blue to-electric-purple",
    "gold-accent-neon-green": "from-gold-accent to-neon-green"
  };
  
  return gradients[avatarType as keyof typeof gradients] || "from-electric-purple to-cyber-blue";
}

export function getProgressColor(status: string): string {
  const colors = {
    live: "from-electric-purple to-cyber-blue",
    filling: "from-cyber-blue to-neon-green",
    starting: "from-neon-green to-gold-accent",
    waiting: "from-cyber-blue to-electric-purple",
    hot: "from-gold-accent to-neon-green",
    locked: "from-gray-400 to-gray-500"
  };
  
  return colors[status as keyof typeof colors] || colors.waiting;
}
