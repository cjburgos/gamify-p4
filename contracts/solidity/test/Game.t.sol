// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Game.sol";
import "../src/GameProxy.sol";

contract GameTest is Test {
    Game public implementation;
    GameProxy public proxy;
    Game public wrappedProxy;

    function setUp() public {
        // Deploy implementation
        implementation = new Game();

        // Deploy proxy
        proxy = new GameProxy(address(implementation));

        // Wrap proxy in Game interface
        wrappedProxy = Game(address(proxy));
    }

    function testSetAndReadNumber() public {
        wrappedProxy.setNumber(42);
        assertEq(wrappedProxy.number(), 42);
    }

    function testIncrement() public {
        wrappedProxy.setNumber(41);
        wrappedProxy.increment();
        assertEq(wrappedProxy.number(), 42);
    }
}