// Game.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Game {
    // Storage layout must match proxy
    address public implementation;  // same first slot as proxy
    uint256 public number;         // same second slot as proxy

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    // Add any other game logic here
}