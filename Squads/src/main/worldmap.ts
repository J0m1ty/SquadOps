import { Color, Container, Graphics, Point, Sprite, Texture } from "pixi.js";
import { Game } from "./game";
import { map } from "../util/math";
import { DynamicComponent, Component } from "../basic/component";
import { InteractionMode } from "../basic/types";
import { GameObject } from "../basic/gameObject";

type Blip = {
    x: number,
    y: number,
    graphic: Graphics
}

export class Worldmap implements DynamicComponent {
    game: Game;

    worldmapContainer: Container = new Container();
    worldmapMask: Graphics = new Graphics();
    worldmap: Sprite = new Sprite();
    player: Graphics = new Graphics();
    viewport: Graphics = new Graphics();

    blips: Blip[] = [];

    interactionMode: InteractionMode = "toggle";
    visible: boolean = false;
    range: number = 10000;
    margin: number = 0.1;

    constructor(game: Game) {
        this.game = game;
        
        this.worldmapContainer.addChild(this.worldmap);
        this.worldmapContainer.addChild(this.player);
        this.worldmapContainer.addChild(this.viewport);
        // this.worldmapContainer.mask = this.worldmapMask;
        this.worldmapContainer.addChild(this.worldmapMask);
        this.game.layers.ui.addChild(this.worldmapContainer);

        this.visibility(false);
    }

    visibility = (set: boolean) => {
        this.visible = set;

        this.worldmapContainer.visible = set;
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

    in = (point: { x: number, y: number }, m: number = this.margin, r: number = this.range) => {
        const { x: mx, y: my, size } = this.output(m);
        
        const dx = map(point.x, - r / 2, r / 2, mx, mx + size);
        const dy = map(point.y, - r / 2, r / 2, my, my + size);
        
        return { x: dx, y: dy, scale: size / r };
    }

    generateWorldmapTexture = () => {
        const { x, y, size } = this.output(0);
        const scale = size / this.range;

        const worldmap = new Graphics();

        worldmap.beginFill(0x0b6f87);
        worldmap.drawRect(x, y, size, size);
        worldmap.endFill();

        for (let blip of this.blips) {
            let { x, y } = this.in(blip, 0);
            blip.graphic.position.set(x, y);
            blip.graphic.scale.set(scale);

            worldmap.addChild(blip.graphic);
        }

        const mask = new Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(x, y, size, size);
        mask.endFill();
        worldmap.mask = mask;
        
        return this.game.app.renderer.generateTexture(worldmap, {
            resolution: Math.max(1, 1024 / Math.min(this.game.width, this.game.height))
        });
    }

    start() {
        console.log("hi")
        const texture = this.generateWorldmapTexture();
        this.game.gui.builder.worldmap.texture = texture.clone();
        this.game.gui.builder.minimap.texture = texture.clone();

        texture.destroy();
    }

    generate() {
        const { x, y, size } = this.output();
        const scale = size / this.range;
        
        this.worldmapMask.clear();
        this.worldmapMask.beginFill(0xffffff, 0.5);
        this.worldmapMask.drawRoundedRect(0, 0, size, size, 20);
        this.worldmapMask.endFill();

        this.worldmapMask.position.set(x, y);
        this.worldmapMask.width = this.worldmapMask.height = size;
        
        this.worldmap.position.set(x, y);
        const rect = this.worldmapMask.getBounds();
        this.worldmap.width = this.worldmap.height = Math.max(rect.width, rect.height); 
        
        this.player.clear();
        this.player.beginFill(0xd5a98a);
        this.player.drawCircle(0, 0, this.game.playerManager.agent.size * scale);
        this.player.endFill();
    }

    update(delta: number) {
        if (!this.visible) return;

        const { x, y } = this.in(this.game.playerManager.agent.position);
        this.player.position.set(x, y);

        this.viewport.clear();
        this.viewport.lineStyle(2, 0xffffff);
        const { x: tlx, y: tly } = this.in(this.game.camera.out(new Point( 0, 0 )));
        const { x: brx, y: bry } = this.in(this.game.camera.out(new Point(this.game.width, this.game.height )));
        this.viewport.drawRect(tlx, tly, brx - tlx, bry - tly);
    }

    resize() {
        this.generate();
    }
}