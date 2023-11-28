import { Sprite } from "pixi.js";
import { Equippable, Item } from "../basic/equippable";
import { Game } from "../main/game";
import { Animation, DualAnimation, DualHandPosition, MeleeHolding } from "../basic/animation";
import { AssetKey } from "../basic/assets";
import { lerp } from "../util/math";
import { smoothstep } from "../util/curves";
import { ActionKey } from "./actions";

export type MeleeData = {
    offset: { x: number, y: number };
    rotation: number;
    anchor: { x: number, y: number };
};

export type MeleeKey = "fists" | "karambit" | "bayonet" | "sledgehammer";

export type ActionInfo = {
    action: ActionKey;
    cooldown: number;
}

export class Melee<T extends MeleeKey> implements Equippable {
    type: Item = "melee";
    name: T;
    hand: MeleeHolding | null;
    asset: AssetKey | null;
    idle: DualHandPosition;
    actions: ActionInfo[];
    data: MeleeData;
    sprite?: Sprite;

    constructor(name: T, hand: MeleeHolding | null, asset: AssetKey | null, actions: ActionInfo[] | ActionInfo, idle: DualHandPosition, data: Partial<MeleeData> = {}) {
        this.name = name;
        this.hand = hand;
        this.asset = asset;
        this.actions = Array.isArray(actions) ? actions : [actions];
        this.idle = idle;

        this.data = {
            offset: { x: 0, y: 0 },
            rotation: 0,
            anchor: { x: 0, y: 0 },
            ...data
        };
    }

    getSprite = (game: Game) => {
        if (!this.asset) return null;

        if (!this.sprite) this.sprite = new Sprite(game.loader.getAsset(this.asset));
        
        this.sprite.position.copyFrom(this.data.offset);
        this.sprite.rotation = this.data.rotation;
        this.sprite.anchor.copyFrom(this.data.anchor);

        return this.sprite;
    };
}

export type GameMelee = Melee<MeleeKey>;

export const melees: {
    [key in MeleeKey]: Melee<key>;
} = {
    fists: new Melee("fists", null, null, { action: "punch", cooldown: 325 }, {
        left: {
            side: "left",
            vertical: "above",
            position: { x: 33, y: -33 }
        },
        right: {
            side: "right",
            vertical: "above",
            position: { x: 33, y: 33 }
        }
    }),
    karambit: new Melee("karambit", "right", "karambit", [
        { action: "punch", cooldown: 325 },
        { action: "slash", cooldown: 325 }
    ], {
        left: {
            side: "left",
            vertical: "above",
            position: { x: 33, y: -33 }
        },
        right: {
            side: "right",
            vertical: "below",
            position: { x: 33, y: 33 }
        }
    }, {
        offset: { x: 13, y: 15 },
        anchor: { x: 0.5, y: 0.5 }
    }),
    bayonet: new Melee("bayonet", "right", "bayonet", [
        { action: "thrust", cooldown: 325 },
        { action: "cut", cooldown: 325 }
    ], {
        left: {
            side: "left",
            vertical: "above",
            position: { x: 33, y: -33 }
        },
        right: {
            side: "right",
            vertical: "below",
            position: { x: 33, y: 33 }
        }
    }, {
        offset: { x: 25, y: -12 },
        rotation: - Math.PI / 6,
        anchor: { x: 0.5, y: 0.5 }
    }),
    sledgehammer: new Melee("sledgehammer", "both", "sledgehammer", { action: "heavy_swing", cooldown: 500 }, { 
        left: {
            side: "left",
            vertical: "above",
            position: { x: 33, y: -33 }
        },
        right: {
            side: "right",
            vertical: "above",
            position: { x: 43, y: 33 }
        }
     }, {
        offset: { x: 43, y: 20 },
        rotation: - Math.PI / 16,
        anchor: { x: 0.5, y: 0.5 }
    })
};