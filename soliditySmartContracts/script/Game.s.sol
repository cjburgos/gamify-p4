// Game.s.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {Script, console} from "forge-std/Script.sol";
import {Game} from "../src/Game.sol";
import {GameProxy} from "../src/GameProxy.sol";

contract GameScript is Script {
    Game public implementation;
    GameProxy public proxy;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy implementation first
        implementation = new Game();
        console.log("Game Implementation deployed at:", address(implementation));
        
        // Deploy proxy with implementation address
        proxy = new GameProxy(address(implementation));
        console.log("Proxy deployed at:", address(proxy));

        vm.stopBroadcast();
    }
}