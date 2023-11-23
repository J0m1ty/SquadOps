import { Sprite } from "pixi.js";
import { Game } from "../main/game";
import { DualHandPosition } from "./animation";

export type Item = 'melee' | 'gun' | 'grenade';

export interface Equippable {
    type: Item;
    idle: DualHandPosition;
    sprite?: Sprite;
    
    getSprite: (game: Game) => Sprite | null;
}