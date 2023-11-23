import { Sprite } from "pixi.js";
import { Equippable, Item } from "../basic/equippable";
import { Game } from "../main/game";
import { DualHandPosition } from "../basic/animation";
import { AssetKey } from "./assets";

export type GunData = {
    offset: { x: number, y: number };
    rotation: number;
    tint: number;
    anchor: { x: number, y: number };
};

export type GunKey = "ak47";

export class Gun<T extends GunKey> implements Equippable {
    type: Item = "gun";
    name: T;
    asset: AssetKey;
    idle: DualHandPosition;
    data: GunData;
    sprite?: Sprite;

    constructor(name: T, asset: AssetKey, idle: DualHandPosition, data: Partial<GunData>) {
        this.name = name;
        this.asset = asset;
        this.idle = idle;
        
        this.data = {
            offset: { x: 0, y: 0 },
            rotation: 0,
            tint: 0xffffff,
            anchor: { x: 0, y: 0 },
            ...data
        };
    }

    getSprite = (game: Game) => {
        if (!this.sprite) this.sprite = new Sprite(game.loader.getAsset(this.asset));

        return this.sprite;
    };
}

export type GameGun = Gun<GunKey>;

export const guns: {
    [key in GunKey]: Gun<key>;
} = {
    ak47: new Gun("ak47", "gun_long", {
        left: {
            side: "left",
            vertical: "below",
            position: { x: 115, y: -3 }
        },
        right: {
            side: "right",
            vertical: "above",
            position: { x: 45, y: 0 }
        }
    }, {
        offset: { x: 45, y: 0 },
        rotation: - Math.PI / 2,
        tint: 0x865232,
        anchor: { x: 0.5, y: 0 }
    }),
}