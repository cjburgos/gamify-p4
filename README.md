🎮 PlayOnchain

A gasless, smart contract-powered game arena where players compete in simple elimination-style games for stablecoin prizes. Powered by Flow, built for mass adoption.

⏱️ Concept Overview

Onchain Game Rooms is a protocol for hosting smart contract–driven games inside recurring, gasless, stablecoin-based arenas. A user becomes a Gamemaster by deploying a custom Game Smart Contract, selecting rules, prizes, and game timing. Players join Waitrooms with their wallet and stablecoins, and when the game begins, compete in interactive, rule-based games coded directly into the chain. Prizes are instantly paid out to winners; POAPs and NFTs are issued automatically.

The system is modular: anyone can spin up their own Arena, integrate simple games or oracle-driven outcomes, and onboard users into trustless, onchain competition—no tokens, no gas.

🎯 Hackathon Goal

Demonstrate a fully functional MVP of the Onchain Game Rooms platform featuring:

A complete working implementation of the "Guess the Dice Roll" game, including smart contract execution, gasless entry via orchestration contracts, and stablecoin-based prize payouts.

A mock UI demo for an advanced game concept: "NFL – Pick Outcome of Next Possession", showcasing how oracle-driven prediction games could function (e.g., outcomes like Touchdown, Field Goal, or Turnover).

This MVP highlights how rule-based, trustless games can be played inside recurring Arenas with configurable game logic and onchain interactions.

🧱 Application Goal

Build a scalable, modular, onchain game platform where anyone can:

Deploy their own Game Arena with recurring matches and customizable rule logic.

Act as a Gamemaster, creating games powered by smart contracts that live onchain.

Let Players enter through a Waitroom, then participate in games using only stablecoins—no native tokens or gas fees required.

Use composable Orchestration Smart Contracts to manage:

Player Deposit Vaults

Gas Vaults for sponsoring transaction fees

Distribution Modules to payout winners

Game Randomizers or future oracle feeds (e.g. Chainlink)

Support for a wide range of game logic and verticals: corporate team building arenas, social competitions, trivia lobbies, or sports prediction leagues.



Onchain Game Rooms is a platform where anyone can become a Gamemaster—a host of recurring, onchain multiplayer games. Players enter rooms by paying a small stablecoin fee, and compete in randomized elimination-style games like "Guess the Dice" or "Pick the Card." The last person standing wins the pot (minus a fee to the Gamemaster). A POAP is issued to all players, and a winner’s NFT + prize is distributed onchain.

Games are gasless to players—Gamemasters cover all execution costs.

Designed to run on Flow for wallet UX + throughput, but extensible to EVM.

Core contracts written in Cadence for player gating, random selection, and fair reward logic.

Think Survivor meets Jackbox, with POAPs and stablecoin stakes.

🧠 Key Concepts

Gamemaster: A host who deploys game rooms, funds gas vaults, and collects fees.

Room: A waiting area where players can join for a fee until it locks. Games start at pre-defined intervals (e.g., every 8 hours).

Games: Predefined smart contract games (e.g., dice roll, card pick, word match). Future: AI trivia host, custom logic.

Last Player Standing: Default win condition. Gamemasters can configure alternatives.

Rewards: Gasless NFT to winner + POAP to all entrants. Stablecoin prize paid out instantly to winner.

🗂️ Repo Structure

onchain-game-rooms/
├─ contracts/            # Cadence contracts for rooms, rewards, and games
├─ games/                # Templates for basic games (dice, card, word)
├─ frontend/             # Next.js or Unity-based client
├─ sdk/                  # TypeScript helpers for creating & joining rooms
└─ README.md

🛠️ Features

Feature

Description

Game Room Engine

Smart contract that manages entry, locking, payouts

Custom Frequency

Gamemasters schedule games (e.g., every 8h)

Game Randomizer

Game picked randomly from Gamemaster’s list

On-Chain Payment

Users pay in stablecoins, winner gets prize

POAP & Winner NFT

Issued post-game to players and winner

Gasless UX

SponsorVault covers gas; users need only stablecoins

⚡ Example Flow

Gamemaster deploys a Game Room with config:

Entry fee: 1 USDC

Game frequency: every 8 hours

Game list: [Guess the Dice, Pick the Card]

Win condition: last standing

Users enter waiting room before start (wallet required).

Room locks. Game is randomly selected. Players play elimination rounds.

Last player remaining wins: prize sent onchain, winner NFT minted.

All other players receive POAP.

📦 Included Games (MVP)

Guess the Dice Roll: Smart contract rolls a die. Guess wrong? Eliminated.

Pick the Card: Players pick face-down cards; wrong suit? Eliminated.

Additional games can be added by developers or contributed at the hackathon.

💵 Payment System

Stablecoins only: All game entry and prizes use onchain USDC/USDT.

Gasless: Players never pay gas. Flow’s SponsorVault covers it.

Instant Payouts: Prizes sent automatically at game conclusion.

🔐 Wallet & Identity

Wallet login required.

Player address recorded onchain.

Leaderboard and POAPs tied to address.

🏆 Bounty Alignment

Sponsor

Why it fits

Flow

Gasless UX, Cadence-based game logic, NFT issuance

Chainlink

Game randomizer can use Chainlink VRF for provable fairness

ZKsync/Base

Future EVM compatibility, stablecoin gasless flows

POAP

Issuance to all players per room per game

AI Agent sponsors

Extend to AI-hosted games or trivia masters

🚧 Roadmap

v0.1 (Hackathon): Contracts for game room, dice game, and POAP/NFT rewards

v0.5: Custom Gamemaster dashboards, new games, randomizer integration

v1.0: AI game host, public leaderboards, RWA prize support

📜 License

MIT © 2025 BlockMambas - Hackathon Contributors

💬 Want to Build a Game?

Open /games/template.ts or contracts/Games/Template.cdc to get started. Join our dev Telegram in docs/discord.md. Let’s build the onchain arcade.

