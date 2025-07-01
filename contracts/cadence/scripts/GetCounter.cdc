import MiniGame from 0xf8d6e0586b0a20c7

access(all) fun main(): UInt64 {
    // Return the next game ID (which indicates how many games have been created)
    return MiniGame.getNextGameId()
}
