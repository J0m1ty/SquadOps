import { Texture } from "pixi.js";
import { Component } from "../basic/component";
import { Game } from "./game";
import { AssetKey, GameAsset } from "../resources/assets";

export type Loader = {
    load: GameAsset[];
    onUpdate?: (text: string) => void;
    onProgress?: (value: number) => void;
    onComplete?: () => void;
};

export class AssetLoader implements Component {
    game: Game;

    assets: Map<string, Texture> = new Map();

    constructor(game: Game) {
        this.game = game;
    }

    async load({ load: assets, onUpdate, onProgress, onComplete }: Loader) {
        if (assets.length === 0) {
            onProgress?.(1);
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

    async create(asset: GameAsset) {
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

    getAsset<T extends AssetKey>(name: T): Texture {
        return this.assets.get(name) ?? Texture.WHITE;
    }
}