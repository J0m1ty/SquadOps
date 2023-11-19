import { Graphics, Texture } from "pixi.js";
import { Component } from "../basic/component";
import { Game } from "../main/game";

export type Asset = { name: string, generator: () => Promise<Graphics> };

export class Loader implements Component {
    game: Game;

    assets: Map<string, Texture> = new Map();

    constructor(game: Game, ) {
        this.game = game;
    }

    async load(assets: Asset[], onUpdate?: (text: string) => void, onProgress?: (value: number) => void, onComplete?: () => void) {
        if (assets.length === 0) {
            onProgress?.(1);
            onComplete?.();
            return;
        }
    
        for (const [index, asset] of assets.entries()) {
            try {
                onUpdate?.(`Loading asset: ${asset.name}`);
                await this.create(asset);
                onProgress?.((index + 1) / assets.length);
            } catch (error) {
                console.error(`Error loading asset: ${asset.name}`, error);
            }
        }

        onUpdate?.(`Done loading assets!`);

        await new Promise(resolve => setTimeout(resolve, 1000));
    
        onComplete?.();
    }

    async create(asset: Asset) {
        if (this.assets.has(asset.name)) return;

        const graphics = await asset.generator();
        
        const texture = this.game.app.renderer.generateTexture(graphics);

        graphics.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
        
        this.assets.set(asset.name, texture);
    }
}