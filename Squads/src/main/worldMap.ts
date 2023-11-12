import { Color, Container, Graphics, Point } from "pixi.js";
import { Game } from "./game";
import { map } from "../util/math";
import { Component, StaticComponent } from "../basic/component";
import { InteractionMode } from "../basic/types";
import { GameObject } from "../basic/gameObject";

type Blip = {
    x: number,
    y: number,
    graphic: Graphics
}

export class WorldMap implements Component {
    game: Game;

    container: Container = new Container();
    background: Graphics = new Graphics();
    horizontal: Graphics = new Graphics();
    vertical: Graphics = new Graphics();
    field: Container = new Container();
    player: Graphics = new Graphics();
    viewport: Graphics = new Graphics();

    blips: Blip[] = [];

    interactionMode: InteractionMode = "toggle";
    visible: boolean = false;
    range: number = 10000;
    margin: number = 0.1;

    constructor(game: Game) {
        this.game = game;

        this.container.addChild(this.background);

        this.horizontal.lineStyle(2, 0xffffff);
        this.horizontal.moveTo(0, -10).lineTo(0, 10);
        this.container.addChild(this.horizontal);

        this.vertical.lineStyle(2, 0xffffff);
        this.vertical.moveTo(-10, 0).lineTo(10, 0);
        this.container.addChild(this.vertical);
        
        this.container.addChild(this.field);
        this.container.addChild(this.player);
        this.container.addChild(this.viewport);

        this.game.layers.ui.addChild(this.container);

        this.generate();

        this.visibility(false);
    }

    visibility = (set: boolean) => {
        this.visible = set;

        this.container.visible = set;
    }

    register = (blip: Blip) => {
        this.blips.push(blip);
    }

    output = (m: number = this.margin) => {
        const margin = Math.min(this.game.width, this.game.height) * m;
        const s = Math.min(this.game.width, this.game.height);
        return {
            x: Math.max((this.game.width - s) / 2, 0) + margin,
            y: Math.max((this.game.height - s) / 2, 0) + margin,
            size: s - margin * 2
        }
    }

    in = (point: { x: number, y: number }, r: number = this.range) => {
        const { x: mx, y: my, size } = this.output();
        
        const dx = map(point.x, - r / 2, r / 2, mx, mx + size);
        const dy = map(point.y, - r / 2, r / 2, my, my + size);
        
        return { x: dx, y: dy, scale: size / r };
    }

    private generate() {
        const { x, y, size } = this.output();
        const scale = size / this.range;

        this.background.clear();
        this.background.beginFill(0x0b6f87);
        this.background.drawRoundedRect(x, y, size, size, 20);
        this.background.endFill();

        this.field.removeChildren();

        for (let blip of this.blips) {
            let { x, y } = this.in(blip);
            blip.graphic.position.set(x, y);
            blip.graphic.scale.set(scale);

            this.field.addChild(blip.graphic);
        }

        this.player.clear();
        this.player.beginFill(0xd5a98a);
        this.player.drawCircle(0, 0, this.game.playerManager.agent.size * scale);
        this.player.endFill();
    }

    update(delta: number) {
        if (!this.visible) return;

        let { x, y } = this.in(this.game.playerManager.agent.position);
        this.player.position.set(x, y);

        this.viewport.clear();
        this.viewport.lineStyle(2, 0xffffff);
        let { x: tlx, y: tly } = this.in(this.game.camera.out(new Point( 0, 0 )));
        let { x: brx, y: bry } = this.in(this.game.camera.out(new Point(this.game.width, this.game.height )));

        this.viewport.drawRect(tlx, tly, brx - tlx, bry - tly);
    }

    resize() {
        this.generate();
    }
}