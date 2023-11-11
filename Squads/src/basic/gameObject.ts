import { Game } from "../main/game";
import { Container } from "@pixi/display";
import { Body, Composite } from "matter-js";
import { Layer } from "./types";
import { Component } from "./component";

export class GameObject implements Component {
    game: Game;

    body: Body;

    container: Container = new Container();

    constructor(game: Game, body: Body, layer: Layer = "main") {
        this.game = game;
        
        this.body = body;

        Composite.add(this.game.engine.world, this.body);
    }

    update(delta: number) {
        // const { x, y, scale } = this.game.camera.worldMap({ x: this.body.position.x, y: this.body.position.y });
        // this.container.position.set(x, y);

        // this.container.scale.set(scale);

        // this.container.rotation = this.body.angle;
    }
}

export class BackgroundWorldObject extends GameObject {
    constructor(game: Game, body: Body) {
        super(game, body, "background");
    }
}

export class UIWorldObject extends GameObject {
    constructor(game: Game, body: Body) {
        super(game, body, "ui");
    }
}