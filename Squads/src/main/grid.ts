import { Container, Graphics } from "pixi.js";
import { Game } from "./game";
import { Component } from "../basic/component";

export class Grid implements Component {
    game: Game;

    grid: Graphics[] = [];

    gap: number = 200;

    container: Container = new Container();

    constructor(game: Game) {
        this.game = game;

        this.game.layers.background.addChild(this.container);

        this.generate();
    }

    generate() {
        this.grid.forEach(line => line.destroy());
        this.grid = [];

        const gap = this.gap;


    }

    update(delta: number) {
        this.generate();
    }

    resize() {
        this.generate();
    }
}