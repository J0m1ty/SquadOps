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

    trackBodyRotation: boolean = true;
    blipColor: Color = new Color(0x000000);

    get position() {
        return this.body.position;
    }

    constructor(game: Game, body: Body, layer: Layer = "main") {
        this.game = game;
        
        this.body = body;

        Composite.add(this.game.engine.world, this.body);

        this.game.layers[layer].addChild(this.container);
    }

    update(delta: number) {
        const { x, y } = this.game.camera.in(new Point( this.position.x, this.position.y ));
        this.container.position.set(x, y);

        this.container.scale.set(this.game.camera.scale);

        if (this.trackBodyRotation) {
            this.container.rotation = this.body.angle;
        }

        this.game.worldMap.register(this.position.x, this.position.y, this.blipColor);
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