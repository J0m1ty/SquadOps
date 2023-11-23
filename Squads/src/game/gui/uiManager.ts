import { DynamicComponent } from "../basic/component";
import { Game } from "../main/game";
import { UIComponent } from "./uiComponent";
import { UIBuilder } from "./uiBuilder";
import { map } from "../util/math";
import { Graphics } from "pixi.js";

export type InteractionMode = 'hold' | 'toggle';

export class UIManager implements DynamicComponent {
    game: Game;
    builder: UIBuilder;

    children: UIComponent[] = [];
    
    worldmap: {
        visible: boolean,
        range: number,
        interactionMode: InteractionMode,
        blips: {
            x: number,
            y: number,
            graphic: Graphics
        }[],
        setVisibility: (set: boolean) => void,
        register: (x: number, y: number, graphic: Graphics) => void
    } = {
        visible: false,
        range: 10000,
        interactionMode: 'toggle',
        blips: [],
        setVisibility: (set: boolean) => {
            this.worldmap.visible = set;
            this.builder.elements.worldmapContainer && (this.builder.elements.worldmapContainer.container.visible = set);
        },
        register: (x: number, y: number, graphic: Graphics) => {
            this.worldmap.blips.push({ x, y, graphic });
        }
    }

    debug: {
        setHeight: (height: number) => void,
    } = {
        setHeight: (height: number) => {
            this.builder.elements.debug && (this.builder.elements.debug.container.height = height);
        }
    }

    constructor(game: Game) {
        this.game = game;
        this.builder = new UIBuilder(this);
    }

    update(delta: number) {
        const w = this.builder.minimap.width / this.game.input.maxZoom;
        const h = this.builder.minimap.height / this.game.input.maxZoom;
        const mx = map(-this.game.playerManager.agent.position.x * this.game.input.maxZoom, -this.worldmap.range / 2, this.worldmap.range / 2, 0, w) + 10;
        const my = map(-this.game.playerManager.agent.position.y * this.game.input.maxZoom, -this.worldmap.range / 2, this.worldmap.range / 2, 0, h) + 10;
        this.builder.minimap.position.set(mx, my);

        if (this.worldmap.visible) {
            const px = map(this.game.playerManager.agent.position.x, -this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.width) + 10;
            const py = map(this.game.playerManager.agent.position.y, -this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.height) + 10;
            this.builder.player.position.set(px, py);

            this.builder.viewport.clear();
            this.builder.viewport.lineStyle(1, 0xffffff);
            const tl = this.game.camera.out(0, 0);
            const br = this.game.camera.out(this.game.width, this.game.height);
            const tlx = map(tl.x, - this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.width) + 10;
            const tly = map(tl.y, - this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.height) + 10;
            const brx = map(br.x, - this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.width) + 10;
            const bry = map(br.y, - this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.height) + 10;
            this.builder.viewport.drawRect(tlx, tly, brx - tlx, bry - tly);
        }
    }

    resize() {
        for (const child of this.children) {
            child.resize();
        }
    }
}