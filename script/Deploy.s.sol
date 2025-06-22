// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {Script, console} from "forge-std/Script.sol";
import {Game} from "../src/Game.sol";
import {GameProxy} from "../src/GameProxy.sol";

contract DeployAll is Script {
    function run() public {
        vm.startBroadcast();

        // First deploy the implementation
        Game game = new Game();
        console.log("Game Implementation deployed at:", address(game));

        // Then deploy the proxy with implementation address
        GameProxy gameProxy = new GameProxy(address(game));
        console.log("GameProxy deployed at:", address(gameProxy));

        vm.stopBroadcast();
    }
}