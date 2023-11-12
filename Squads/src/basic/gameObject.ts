import { Game } from "../main/game";
import { Container } from "@pixi/display";
import { Body, Composite } from "matter-js";
import { Layer } from "./types";
import { Component } from "./component";
import { Color, Point } from "pixi.js";

export class GameObject implements Component {
    game: Game;

    body: Body;

    container: Container = new Container();

    blipColor: Color = new Color(0x000000);

    constructor(game: Game, body: Body, layer: Layer = "main") {
        this.game = game;
        
        this.body = body;

        Composite.add(this.game.engine.world, this.body);

        this.game.layers[layer].addChild(this.container);
    }

    update(delta: number) {
        const { x, y, scale } = this.game.camera.in(new Point( this.body.position.x, this.body.position.y ));
        this.container.position.set(x, y);

        this.container.scale.set(scale);

        this.container.rotation = this.body.angle;

        this.game.worldMap.register(this.body.position.x, this.body.position.y, this.blipColor);
    }
}

export class BackgroundGameObject extends GameObject {
    constructor(game: Game, body: Body) {
        super(game, body, "background");
    }
}

export class UIGameObject extends GameObject {
    constructor(game: Game, body: Body) {
        super(game, body, "ui");
    }
}