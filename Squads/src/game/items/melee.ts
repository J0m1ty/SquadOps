import { Sprite } from 'pixi.js';
import { AssetName } from '../assets/builder';
import { Asset, Equippable } from '../basic/equippable';
import { Game } from '../main/game';
import { DuelHandAnimation, Item } from './types';

export class Melee<T extends string> implements Equippable {
    type: Item = "melee";
    name: T;
    asset: Asset | null;
    idle: DuelHandAnimation;
    sprite?: Sprite;
    
    constructor(name: T, asset: Asset | null, idle: DuelHandAnimation) {
        this.name = name;
        this.asset = asset;
        this.idle = idle;
    }

    getSprite = (game: Game)  => {
        if (!this.asset) return null;
        
        if (!this.sprite) this.sprite = new Sprite(game.loader.getAsset(this.asset.name));
        return this.sprite;
    }
}

export type GunName = "fists";

export const melee: {
    [key in GunName]: Melee<key>
} = {
    fists: new Melee("fists", null, { 
        left: {
            side: "left",
            vertical: "above",
            target: { x: 35, y: 0 },
            start: 0,
            duration: 250
        },
        right: {
            side: "right",
            vertical: "above",
            target: { x: 35, y: 0 },
            start: 0,
            duration: 250
        }
    }),
};