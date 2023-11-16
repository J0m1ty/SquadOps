import { Container, Graphics, Sprite } from "pixi.js";
import { Component } from "../basic/component";
import { UIComponent } from "./uiComponent";
import { UIManager } from "./uiManager";
import { map } from "../util/math";

export class UIBuilder {
    manager: UIManager;

    elements: Record<string, UIComponent | undefined> = {}

    minimap: Sprite = new Sprite(); 

    worldmap: Sprite = new Sprite();
    player: Graphics = new Graphics();
    viewport: Graphics = new Graphics();

    constructor(manager: UIManager) {
        this.manager = manager;
    }

    generateMapTexture = () => {
        const generator = new UIComponent(this.manager, undefined, {
            size: (w, h) => {
                const s = Math.min(w, h);
                return { w: s, h: s };
            },
            anchor: { w: 0.5, h: 0.5 },
            self: { w: 0.5, h: 0.5 },
        });

        const size = 1024;

        const background = new Graphics();
        background.beginFill(0x000000, 0.66);
        background.drawRect(0, 0, size, size);
        background.endFill();
        generator.container.addChild(background);

        const mask = new Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, size, size);
        mask.endFill();
        generator.container.addChild(mask);
        
        const container = new Container();
        container.mask = mask;
        generator.container.addChild(container);
        
        for (let blip of this.manager.worldmap.blips) {
            let gx = map(blip.x, - this.manager.worldmap.range / 2, this.manager.worldmap.range / 2, 0, generator.width);
            let gy = map(blip.y, - this.manager.worldmap.range / 2, this.manager.worldmap.range / 2, 0, generator.height);
            blip.graphic.position.set(gx, gy);
            blip.graphic.scale.set(size / this.manager.worldmap.range);
            container.addChild(blip.graphic);
        }

        const texture = this.manager.game.app.renderer.generateTexture(generator.container);

        generator.destroy();
        
        this.manager.worldmap.blips = [];

        return texture;
    }
    
    start() {
        const texture = this.generateMapTexture();

        (() => {
            this.elements.minimapContainer = new UIComponent(this.manager, null, {
                size: { w: 200, h: 200 },
                anchor: { w: 0, h: 0 },
                offset: { x: 20, y: 20 },
            });

            const size = 200;

            const background = new Graphics();
            background.beginFill(0x000000, 0.33);
            background.drawRoundedRect(0, 0, size, size, 10);
            background.endFill();
            this.elements.minimapContainer.container.addChild(background);

            const mask = new Graphics();
            mask.beginFill(0xffffff);
            mask.drawRect(10, 10, size - 20, size - 20);
            mask.endFill();
            this.elements.minimapContainer.container.addChild(mask);

            const container = new Container();
            container.mask = mask;
            this.elements.minimapContainer.container.addChild(container);

            this.elements.minimap = new UIComponent(this.manager, container, {
                size: { w: size - 20, h: size - 20 },
                anchor: { w: 0.5, h: 0.5 },
                self: { w: 0.5, h: 0.5 },
            });
            
            this.minimap.texture = texture.clone();
            this.minimap.anchor.set(0.5);
            this.minimap.position.set(size / 2, size / 2);
            this.minimap.width = this.minimap.height = size - 20;
            this.elements.minimap.container.addChild(this.minimap);
        })();

        (() => {
            this.elements.debug = new UIComponent(this.manager, null, {
                size: { w: 150, h: 50 },
                anchor: { w: 0, h: 1 },
                offset: { x: 20, y: -70 },
            });

            const background = new Graphics();
            background.beginFill(0x000000, 0.33);
            background.drawRoundedRect(0, 0, 150, 50, 10);
            background.endFill();
            this.elements.debug.container.addChild(background);
        })();

        (() => {
            this.elements.worldmapContainer = new UIComponent(this.manager, null, {
                size: (w, h) => {
                    const s = Math.min(w, h) * 0.75;
                    return { w: s, h: s };
                },
                anchor: { w: 0.5, h: 0.5 },
                self: { w: 0.5, h: 0.5 },
            });

            const size = 500;

            const background = new Graphics();
            background.beginFill(0x000000, 0.33);
            background.drawRoundedRect(0, 0, size, size, 10);
            background.endFill();
            this.elements.worldmapContainer.container.addChild(background);

            const mask = new Graphics();
            mask.beginFill(0xffffff);
            mask.drawRect(10, 10, size - 20, size - 20);
            mask.endFill();
            this.elements.worldmapContainer.container.addChild(mask);

            const container = new Container();
            container.mask = mask;
            this.elements.worldmapContainer.container.addChild(container);

            this.elements.worldmap = new UIComponent(this.manager, container, {
                size: { w: size - 20, h: size - 20 },
                anchor: { w: 0.5, h: 0.5 },
                self: { w: 0.5, h: 0.5 },
            });
            
            this.worldmap.texture = texture.clone();
            this.worldmap.anchor.set(0.5);
            this.worldmap.position.set(size / 2, size / 2);
            this.worldmap.width = this.worldmap.height = size - 20;
            container.addChild(this.worldmap);

            this.player.beginFill(0xd5a98a);
            this.player.drawCircle(0, 0, this.manager.game.playerManager.agent.size * (size / this.manager.worldmap.range));
            this.player.endFill();
            this.player.position.set(size / 2, size / 2);
            container.addChild(this.player);

            container.addChild(this.viewport);
        })();

        texture.destroy();

        this.manager.worldmap.setVisibility(false);
    }
}