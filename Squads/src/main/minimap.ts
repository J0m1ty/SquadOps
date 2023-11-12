import { Component } from "../basic/component";
import { Game } from "./game";

export class Minimap implements Component {
    game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    update(delta: number) {

    }
}