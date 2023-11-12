import { Game } from "../main/game";
import { Container } from "@pixi/display";
import { Body, Composite } from "matter-js";
import { Layer } from "./types";
import { Component } from "./component";
import { Color, Graphics, Point } from "pixi.js";

export class GameObject implements Component {
    game: Game;

    body: Body;

    container: Container = new Container();

    trackBodyRotation: boolean = true;

    blip?: Graphics;

    get position() {
        return this.body.position;
    }

    constructor(game: Game, body: Body, options: { layer: Layer, cullable: boolean }) {
        this.game = game;
        
        this.body = body;

        Composite.add(this.game.engine.world, this.body);

        this.game.layers[options.layer].addChild(this.container);

        this.container.cullable = options.cullable;
    }

    update(delta: number) {
        const { x, y } = this.game.camera.in(new Point( this.position.x, this.position.y ));
        this.container.position.set(x, y);

        this.container.scale.set(this.game.camera.scale);

        if (this.trackBodyRotation) {
            this.container.rotation = this.body.angle;
        }
    }
}