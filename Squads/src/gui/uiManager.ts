import { DynamicComponent } from "../basic/component";
import { Game } from "../main/game";
import { UIComponent } from "./uiComponent";
import { UIBuilder } from "./uiBuilder";
import { map } from "../util/math";
import { InteractionMode } from "../basic/types";

export class UIManager implements DynamicComponent {
    game: Game;
    builder: UIBuilder;

    children: UIComponent[] = [];
    
    worldmap: {
        visible: boolean,
        range: number,
        interactionMode: InteractionMode
    } = {
        visible: false,
        range: 10000,
        interactionMode: 'toggle'
    }

    constructor(game: Game) {
        this.game = game;
        this.builder = new UIBuilder(this);
        
        this.builder.start();

        this.worldmapVisibility(true);
    }

    worldmapVisibility = (set: boolean) => {
        this.worldmap.visible = set;

        this.builder.elements.worldmapContainer && (this.builder.elements.worldmapContainer.container.visible = set);
    }

    update(delta: number) {
        if (this.worldmap.visible) {
            const px = map(this.game.playerManager.agent.position.x, - this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.width) + 10;
            const py = map(this.game.playerManager.agent.position.y, - this.worldmap.range / 2, this.worldmap.range / 2, 0, this.builder.worldmap.height) + 10;
            this.builder.player.position.set(px, py);

            this.builder.viewport.clear();
            this.builder.viewport.lineStyle(2, 0xffffff);
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