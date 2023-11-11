import { Color, Container, Graphics } from "pixi.js";
import { Game } from "./game";
import { map } from "../util/math";
import { Component } from "../basic/component";
import { InteractionMode } from "../basic/types";

type Blip = {
    x: number,
    y: number,
    color: Color
}

export class WorldMap implements Component {
    game: Game;

    container: Container = new Container();
    background: Graphics = new Graphics();
    field: Container = new Container();
    blips: Blip[] = [];

    interactionMode: InteractionMode = "toggle";
    visible: boolean = false;
    range: number = 1000;
    margin: number = 100;

    constructor(game: Game) {
        this.game = game;
        
        this.container.addChild(this.background);
        this.container.addChild(this.field);

        this.game.layers.ui.addChild(this.container);

        this.generate();

        this.visibility(false);
    }

    visibility = (set: boolean) => {
        this.visible = set;

        this.container.visible = set;
    }

    register = (x: number, y: number, color: Color) => {
        this.blips.push({ x, y, color });
    }

    output = (m: number = this.margin) => {
        const s = Math.min(this.game.width, this.game.height);
        return {
            x: Math.max((this.game.width - s) / 2, 0) + m,
            y: Math.max((this.game.height - s) / 2, 0) + m,
            s: s - m * 2
        }
    }

    in = (x: number, y: number, r: number = this.range) => {
        const { x: mx, y: my, s } = this.output();
        
        const dx = map(x, - r / 2, r / 2, mx, mx + s);
        const dy = map(y, - r / 2, r / 2, my, my + s);
        
        return { x: dx, y: dy };
    }

    private generate() {
        const { x, y, s } = this.output();

        this.background.clear();
        this.background.beginFill(0x0b6f87);
        this.background.drawRoundedRect(x, y, s, s, 20);
        this.background.endFill();
        
        this.field.position.set(x, y);
    }

    update(delta: number) {
        if (!this.visible) return;
        
        this.field.removeChildren();

        for (let blip of this.blips) {
            const graphic = new Graphics();

            graphic.beginFill(blip.color);
            graphic.drawCircle(0, 0, 1);
            graphic.endFill();

            const { x: px, y: py } = this.in(blip.x, blip.y, 1000);
            graphic.position.set(px, py);

            this.field.addChild(graphic);
        }
    }

    resize() {
        this.generate();
    }

    reset() {
        this.blips = [];
    }
}