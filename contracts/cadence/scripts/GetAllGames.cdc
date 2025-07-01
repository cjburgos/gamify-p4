import MiniGame from 0xf8d6e0586b0a20c7

access(all) fun main(): [UInt64] {
    // Return all game IDs that have been created
    var gameIds: [UInt64] = []
    let nextId = MiniGame.nextGameId
    
    // Since we can't directly iterate over the gameInstances dictionary in a script,
    // we'll return a range of IDs that could exist
    var i: UInt64 = 1
    while i < nextId {
        gameIds.append(i)
        i = i + 1
    }
    
    return gameIds
} 