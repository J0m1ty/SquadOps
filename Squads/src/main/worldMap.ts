import { Color, Container, Graphics, Point } from "pixi.js";
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
    viewport: Graphics = new Graphics();
    blips: Blip[] = [];

    interactionMode: InteractionMode = "toggle";
    visible: boolean = false;
    range: number = 10000;
    margin: number = 100;
    defaultColor: Color = new Color();

    constructor(game: Game) {
        this.game = game;
        
        this.container.addChild(this.background);
        this.container.addChild(this.field);
        this.container.addChild(this.viewport);

        this.game.layers.ui.addChild(this.container);

        this.generate();

        this.visibility(false);
    }

    visibility = (set: boolean) => {
        this.visible = set;

        this.container.visible = set;
    }

    register = (x: number, y: number, color: Color = this.defaultColor) => {
        this.blips.push({ x, y, color });
    }

    output = (m: number = this.margin) => {
        const s = Math.min(this.game.width, this.game.height);
        return {
            x: Math.max((this.game.width - s) / 2, 0) + m,
            y: Math.max((this.game.height - s) / 2, 0) + m,
            size: s - m * 2
        }
    }

    in = (point: { x: number, y: number }, r: number = this.range) => {
        const { x: mx, y: my, size } = this.output();
        
        const dx = map(point.x, - r / 2, r / 2, mx, mx + size);
        const dy = map(point.y, - r / 2, r / 2, my, my + size);
        
        return { x: dx, y: dy };
    }

    private generate() {
        const { x, y, size } = this.output();

        this.background.clear();
        this.background.beginFill(0x0b6f87);
        this.background.drawRoundedRect(x, y, size, size, 20);
        this.background.endFill();
    }

    update(delta: number) {
        if (!this.visible) return;
        
        this.field.removeChildren();

        // add center lines
        const horizontal = new Graphics();
        horizontal.lineStyle(2, 0x04303a);
        horizontal.moveTo(this.game.width / 2, this.game.height / 2 - 10);
        horizontal.lineTo(this.game.width / 2, this.game.height / 2 + 10);
        this.field.addChild(horizontal);

        const vertical = new Graphics();
        vertical.lineStyle(2, 0x04303a);
        vertical.moveTo(this.game.width / 2 - 10, this.game.height / 2);
        vertical.lineTo(this.game.width / 2 + 10, this.game.height / 2);
        this.field.addChild(vertical);

        for (let blip of this.blips) {
            const graphic = new Graphics();

            graphic.beginFill(blip.color);
            graphic.drawCircle(0, 0, 3);
            graphic.endFill();

            let { x, y } = this.in(blip);
            graphic.position.set(x, y);

            this.field.addChild(graphic);
        }

        this.viewport.clear();
        this.viewport.lineStyle(2, 0xffffff);
        let { x: tlx, y: tly } = this.in(this.game.camera.out(new Point( 0, 0 )));
        let { x: brx, y: bry } = this.in(this.game.camera.out(new Point(this.game.width, this.game.height )));

        this.viewport.drawRect(tlx, tly, brx - tlx, bry - tly);
    }

    resize() {
        this.generate();
    }

    reset() {
        this.blips = [];
    }
}