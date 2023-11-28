import { Sprite } from "pixi.js";
import { Equippable, Item } from "../basic/equippable";
import { Game } from "../main/game";
import { DualHandPosition, GunHolding } from "../basic/animation";
import { AssetKey } from "../basic/assets";

export type GunData = {
    offset: { x: number, y: number };
    rotation: number;
    tint: number;
    anchor: { x: number, y: number };
};

export type SingleGunKey = "ak47" | "m9";
export type DualGunKey = "dual_m9";
export type GunKey = SingleGunKey | DualGunKey;

export class Gun<T extends GunKey> implements Equippable {
    type: Item = "gun";
    hand: GunHolding;
    name: T;
    asset: AssetKey;
    idle: DualHandPosition;
    recoil: { x: number, y: number };
    data: GunData;
    sprite?: Sprite;
    dual?: Sprite;

    constructor(name: T, hand: GunHolding, asset: AssetKey, idle: DualHandPosition, recoil: { x: number, y: number }, data?: Partial<GunData>) {
        this.name = name;
        this.hand = hand;
        this.asset = asset;
        this.idle = idle;
        this.recoil = recoil;
        
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

        this.sprite.position.copyFrom(this.data.offset);
        this.sprite.rotation = this.data.rotation;
        this.sprite.anchor.copyFrom(this.data.anchor);
        this.sprite.tint = this.data.tint;

        return this.sprite;
    };

    getDualSprite = (game: Game) => {
        if (this.hand != "dual") return null;

        if (!this.dual) this.dual = new Sprite(game.loader.getAsset(this.asset));

        this.dual.position.copyFrom(this.data.offset);
        this.dual.rotation = this.data.rotation;
        this.dual.anchor.copyFrom(this.data.anchor);
        this.dual.tint = this.data.tint;

        return this.dual;
    };
}

export type GameGun = Gun<GunKey>;

export const guns: {
    [key in GunKey]: Gun<key>;
} = {
    ak47: new Gun("ak47", "both", "gun_long", {
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
    }, { x: 15, y: 2 }, {
        offset: { x: 45, y: 0 },
        rotation: - Math.PI / 2,
        tint: 0x865232,
        anchor: { x: 0.5, y: 0 }
    }),
    m9: new Gun("m9", "both", "m9", {
        left: {
            side: "left",
            vertical: "above",
            position: { x: 45, y: 0 }
        },
        right: {
            side: "right",
            vertical: "above",
            position: { x: 45, y: 0 }
        }
    }, { x: 10, y: 1 }, {
        offset: { x: 45, y: 0 },
        rotation: - Math.PI / 2,
        tint: 0x222222,
        anchor: { x: 0.5, y: 0 }
    }),
    dual_m9: new Gun("dual_m9", "dual", "m9", {
        left: {
            side: "left",
            vertical: "below",
            position: { x: 33, y: -33 }
        },
        right: {
            side: "right",
            vertical: "below",
            position: { x: 33, y: 33 }
        }
    }, { x: 10, y: 1 }, {
        rotation: - Math.PI / 2,
        tint: 0x222222,
        anchor: { x: 0.5, y: 0 }
    })
}