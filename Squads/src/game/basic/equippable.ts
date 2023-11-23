import { Sprite } from "pixi.js";
import { AssetName } from "../assets/builder";
import { DuelHandAnimation, Item } from "../items/types";
import { Game } from "../main/game";

export type Asset = {
    name: AssetName;
    offset?: { x: number, y: number };
    rotation?: number;
    tint?: number;
    anchor?: { x: number, y: number };
};

export interface Equippable {
    type: Item;
    name: string;
    idle: DuelHandAnimation;
    asset: Asset | null;
    sprite?: Sprite;
    
    getSprite: (game: Game) => Sprite | null;
}