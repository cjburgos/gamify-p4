// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {Script, console} from "forge-std/Script.sol";
import {GameProxy} from "../src/GameProxy.sol";
import {Game} from "../src/Game.sol";


contract GameProxyScript is Script {
    GameProxy public gameProxy;
    Game public game;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        game = new Game();
        gameProxy = new GameProxy(address(game));

        vm.stopBroadcast();
    }
}
