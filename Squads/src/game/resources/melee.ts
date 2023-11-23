import { Sprite } from "pixi.js";
import { Equippable, Item } from "../basic/equippable";
import { Game } from "../main/game";
import { DualHandPosition } from "../basic/animation";
import { AssetKey } from "./assets";

export type MeleeKey = "fists";

export class Melee<T extends MeleeKey> implements Equippable {
    type: Item = "melee";
    name: T;
    asset: AssetKey | null;
    idle: DualHandPosition;
    sprite?: Sprite;

    constructor(name: T, asset: AssetKey | null, idle: DualHandPosition) {
        this.name = name;
        this.asset = asset;
        this.idle = idle;
    }

    getSprite = (game: Game) => {
        if (!this.asset) return null;

        if (!this.sprite) this.sprite = new Sprite(game.loader.getAsset(this.asset));
        return this.sprite;
    };
}

export type GameMelee = Melee<MeleeKey>;

export const melees: {
    [key in MeleeKey]: Melee<key>;
} = {
    fists: new Melee("fists", null, {
        left: {
            side: "left",
            vertical: "below",
            position: { x: 33, y: -33 }
        },
        right: {
            side: "right",
            vertical: "above",
            position: { x: 33, y: 33 }
        }
    })
};