import { Sprite } from 'pixi.js';
import { Asset, Equippable } from '../basic/equippable';
import { DuelHandAnimation, Item } from './types';
import { Game } from '../main/game';

export class Gun<T extends string> implements Equippable {
    type: Item = "gun";
    name: T;
    asset: Asset;
    idle: DuelHandAnimation;
    sprite?: Sprite;
    
    constructor(name: T, asset: Asset, idle: DuelHandAnimation) {
        this.name = name;
        this.asset = asset;
        this.idle = idle;
    }

    getSprite = (game: Game) => {
        if (!this.sprite) this.sprite = new Sprite(game.loader.getAsset(this.asset.name));

        return this.sprite;
    }
}

export type GunName = "ak47";

export const guns: {
    [key in GunName]: Gun<key>
} = {
    ak47: new Gun("ak47", { 
        name: "gun_long",
        offset: { x: 33, y: 0 },
        rotation: - Math.PI / 2,
        tint: 0x8b4513,
        anchor: { x: 0.5, y: 0 }
    }, { 
        left: {
            side: "left",
            vertical: "below",
            target: { x: 103, y: -30 },
            start: 0,
            duration: 250
        },
        right: {
            side: "right",
            vertical: "above",
            target: { x: 43, y: -33 },
            start: 0,
            duration: 250
        }
    }),
};