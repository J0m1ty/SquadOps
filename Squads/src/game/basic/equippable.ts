import { Sprite } from "pixi.js";
import { Game } from "../main/game";
import { DualHandPosition, Holding } from "./animation";

export type Item = 'melee' | 'gun' | 'grenade';

export interface Equippable {
    type: Item;
    idle: DualHandPosition;
    hand: Holding | null;
    sprite?: Sprite;
    dual?: Sprite;
    
    getSprite: (game: Game) => Sprite | null;
    getDualSprite?: (game: Game) => Sprite | null;
}