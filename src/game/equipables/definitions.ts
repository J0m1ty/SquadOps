import { AssetKey } from "../basic/assets";
import { smoothstep } from "../util/curves";
import { lerp } from "../util/math";

// TYPES

export type GunType = "pistollike" | "riflelike";
export type GunKey<T extends GunType> = T extends "pistollike" ? "m9" : T extends "riflelike" ? "ak47" | "famas" : never;

export type ActionType = "single" | "dual";
export type ActionKey<T extends ActionType> = T extends "single" ? "punch_left" | "punch_right" | "slash" | "thrust" | "cut" : T extends "dual" ?  "heavy_swing" : never;

export type MeleeType = "none" | "singlehanded" | "twohanded";
export type MeleeKey<T extends MeleeType | "none"> = T extends "none" ? "fists" : T extends "singlehanded" ? "karambit" | "bayonet" : T extends "twohanded" ? "sledgehammer" : never;

export type HandPosition = {
    vertical: "above" | "below";
    position: { x: number, y: number };
}

export type HandPositions = {
    left: HandPosition;
    right: HandPosition;
}

export type AssetData = {
    name: AssetKey;
    offset: { x: number, y: number };
    rotation: number;
    anchor: { x: number, y: number };
};

export type Animation = {
    duration: number;
    easing: (t: number) => number;
    curve: (t: number, origin: { x: number, y: number }) => { x: number, y: number, r?: number };
    next?: Animation;
};

export type HandAnimation = Animation & {
    pivot: "hand" | "body";
    side: "left" | "right";
    next?: HandAnimation;
}

export class DualAnimation {
    left: HandAnimation | null;
    right: HandAnimation | null;

    constructor(left: HandAnimation | null, right: HandAnimation | null) {
        this.left = left;
        this.right = right;
    }

    *[Symbol.iterator]() {
        yield this.left;
        yield this.right;
    }
}

export type Action<T extends ActionType> = {
    name: ActionKey<T>;
    type: T;
    cooldown: number;
} & (T extends "single" ? {
    animation: DualAnimation;
} : {
    animation: Animation;
});

export type GameAction = Action<ActionType>;

export type Equippable<T extends GunType | MeleeType> = {
    name: T extends GunType ? GunKey<T> : T extends MeleeType ? MeleeKey<T> : never;
    type: T;
    idle: HandPositions;
    carryingSpeedMult: number;
}

export type Gun<T extends GunType> = Equippable<T> & {
    classification: "pistol" | "smg" | "rifle" | "sniper" | "shotgun" | "lmg" | "dmr";
    asset: AssetData;
    tint: number;
    recoil: { x: number, y: number };
    range: number,
    bulletVelocity: number,
    muzzleOffset: number,
    shootingSpeedMult: number,
    fireMode: { type: "auto", cooldown: number } 
            | { type: "semi", cooldown: number } 
            | { type: "burst", mode: "auto" | "semi", cooldown: number, burstCooldown: number, shots: number };
} & (T extends "pistollike" ? {
    dualable: boolean;
} : {});

export type GameGun = Gun<GunType>;

export type Melee<T extends MeleeType> = Equippable<T> & {
    actions: Set<ActionKey<T extends "twohanded" ? "dual" : "single">>; 
} & (T extends "none" ? {} : {
    asset: AssetData;
}) & (T extends "singlehanded" ? {
    side: "left" | "right";
} : {});

export type GameMelee = Melee<MeleeType>;

// DATA VERIFICATION

export const isGun = (equippable: Equippable<any>): equippable is GameGun => {
    return 'classification' in equippable;
}

export const isMelee = (equippable: Equippable<any>): equippable is GameMelee => {
    return 'actions' in equippable;
}

export const isHandAnimation = (animation: Animation): animation is HandAnimation => {
    return 'pivot' in animation;
}

// FACTORIES

export const cloneAnimation = (source: Animation): Animation => {
    const clone: Animation = {
        duration: source.duration,
        easing: source.easing,
        curve: source.curve,
        ...(source.next ? {
            next: cloneAnimation(source.next)
        } : {})
    }

    return clone;
}

export const cloneHandAnimation = (source: HandAnimation): HandAnimation => {
    const clone: HandAnimation = {
        duration: source.duration,
        easing: source.easing,
        curve: source.curve,
        pivot: source.pivot,
        side: source.side,
        ...(source.next ? {
            next: cloneHandAnimation(source.next)
        } : {})
    }

    return clone;
}

export const cloneAction = (source: GameAction): GameAction => {
    const clone: GameAction = {
        name: source.name,
        type: source.type,
        cooldown: source.cooldown,
        ...(source.animation instanceof DualAnimation ? {
            animation: new DualAnimation(
                source.animation.left ? cloneHandAnimation(source.animation.left) : null,
                source.animation.right ? cloneHandAnimation(source.animation.right) : null
            )
        } : {
            animation: cloneAnimation(source.animation)
        })
    }

    return clone;
}

export const cloneGun = (source: GameGun): GameGun => {
    const clone: GameGun = {
        name: source.name,
        type: source.type,
        classification: source.classification,
        idle: {
            left: {
                vertical: source.idle.left.vertical,
                position: { ...source.idle.left.position }
            },
            right: {
                vertical: source.idle.right.vertical,
                position: { ...source.idle.right.position }
            }
        },
        asset: {
            name: source.asset.name,
            offset: { ...source.asset.offset },
            rotation: source.asset.rotation,
            anchor: { ...source.asset.anchor }
        },
        tint: source.tint,
        recoil: { ...source.recoil },
        range: source.range,
        bulletVelocity: source.bulletVelocity,
        muzzleOffset: source.muzzleOffset,
        carryingSpeedMult: source.carryingSpeedMult,
        shootingSpeedMult: source.shootingSpeedMult,
        fireMode: { ...source.fireMode },
        ...("dualable" in source ? { dualable: source.dualable } : {})
    };

    return clone;
}

export const cloneMelee = (source: GameMelee): GameMelee => {
    const clone: GameMelee = {
        name: source.name,
        type: source.type,
        idle: {
            left: {
                vertical: source.idle.left.vertical,
                position: { ...source.idle.left.position }
            },
            right: {
                vertical: source.idle.right.vertical,
                position: { ...source.idle.right.position }
            }
        },
        actions: new Set(source.actions),
        carryingSpeedMult: source.carryingSpeedMult,
        ...("asset" in source ? { asset: source.asset } : {}),
        ...("side" in source ? { side: source.side } : {})
    };

    return clone;
}

// DATA

export const defaultHandPositions: HandPositions = {
    left: {
        vertical: "above",
        position: { x: 33, y: -33 }
    },
    right: {
        vertical: "above",
        position: { x: 33, y: 33 }
    }
}

export const guns: {
    [type in GunType]: {
        [gun in GunKey<type>]: Gun<type>;
    }
} = {
    pistollike: {
        m9: { name: "m9", type: "pistollike", classification: "pistol",
            asset: {
                name: "m9",
                offset: { x: 45, y: 0 },
                rotation: - Math.PI / 2,
                anchor: { x: 0.5, y: 0 }
            },
            idle: {
                left: {
                    vertical: "above",
                    position: { x: 45, y: 0 }
                },
                right: {
                    vertical: "above",
                    position: { x: 45, y: 0 }
                }
            },
            tint: 0x222222,
            recoil: { x: 10, y: 1 },
            range: 2000,
            bulletVelocity: 40,
            muzzleOffset: 45,
            carryingSpeedMult: 0.9,
            shootingSpeedMult: 0.8,
            fireMode: { type: "semi", cooldown: 150 },
            dualable: true
        },
    },
    riflelike: {
        ak47: { name: "ak47", type: "riflelike", classification: "rifle",
            asset: {
                name: "gun_long",
                offset: { x: 45, y: 0 },
                rotation: - Math.PI / 2,
                anchor: { x: 0.5, y: 0 }
            },
            idle: {
                left: {
                    vertical: "below",
                    position: { x: 115, y: -3 }
                },
                right: {
                    vertical: "above",
                    position: { x: 45, y: 0 }
                }
            },
            tint: 0x865232,
            recoil: { x: 15, y: 2 },
            range: 3000,
            bulletVelocity: 50,
            muzzleOffset: 115,
            carryingSpeedMult: 0.8,
            shootingSpeedMult: 0.5,
            fireMode: { type: "auto", cooldown: 120 }
        },
        famas: { name: "famas", type: "riflelike", classification: "rifle",
            asset: {
                name: "gun_long",
                offset: { x: 45, y: 0 },
                rotation: - Math.PI / 2,
                anchor: { x: 0.5, y: 0 }
            },
            idle: {
                left: {
                    vertical: "below",
                    position: { x: 115, y: -3 }
                },
                right: {
                    vertical: "above",
                    position: { x: 45, y: 0 }
                }
            },
            tint: 0x222222,
            recoil: { x: 20, y: 1 },
            range: 3500,
            bulletVelocity: 55,
            muzzleOffset: 115,
            carryingSpeedMult: 0.8,
            shootingSpeedMult: 0.5,
            fireMode: { type: "burst", mode: "auto", cooldown: 520, burstCooldown: 100, shots: 3 }
        }
    }
}

export const actions: {
    [type in ActionType]: {
        [action in ActionKey<type>]: Action<type>;
    }
} = {
    single: {
        punch_left: { name: "punch_left", type: "single", cooldown: 325,
            animation: new DualAnimation(null, { duration: 130, pivot: "hand", side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => ({
                    x: lerp(x, x + 33, t),
                    y: lerp(y, y - 20, t)
                }), next: { duration: 195, pivot: "hand", side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => ({
                        x: lerp(x + 33, x, t),
                        y: lerp(y - 20, y, t)
                    })
                }
            })
        },
        punch_right: { name: "punch_right", type: "single", cooldown: 325,
            animation: new DualAnimation({ duration: 130, pivot: "hand", side: "left",
                easing: smoothstep,
                curve: (t, { x, y }) => ({ 
                    x: lerp(x, x + 33, t), 
                    y: lerp(y, y + 20, t) 
                }), next: { duration: 195, pivot: "hand", side: "left",
                    easing: smoothstep,
                    curve: (t, {x, y }) => ({
                        x: lerp(x + 33, x, t),
                        y: lerp(y + 20, y, t)
                    })
                }
            }, null)
        },
        slash: { name: "slash", type: "single", cooldown: 325,
            animation: new DualAnimation(null, { duration: 130, pivot: "hand", side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => ({
                    x: lerp(x, x + 42, t),
                    y: lerp(y, y - 20, t),
                    r: lerp(0, - Math.PI / 2, t)
                }), next: { duration: 195, pivot: "hand", side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => ({
                        x: lerp(x + 42, x, t),
                        y: lerp(y - 20, y, t),
                        r: lerp(- Math.PI / 2, 0, t)
                    })
                }
            })
        },
        cut: { name: "cut", type: "single", cooldown: 325,
            animation: new DualAnimation(null, { duration: 32, pivot: "body", side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => ({
                    x: lerp(x, x + 10, t),
                    y: lerp(y, y - 5, t),
                    r: lerp(0, - Math.PI / 4, t)
                }), next: { duration: 146, pivot: "body", side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => ({
                        x: lerp(x + 10, x - 10, t),
                        y: lerp(y - 5, y + 10, t),
                        r: lerp(- Math.PI / 4, Math.PI / 4, t)
                    }), next: { duration: 178, pivot: "body", side: "right",
                        easing: smoothstep,
                        curve: (t, { x, y }) => ({
                            x: lerp(x - 10, x, t),
                            y: lerp(y + 10, y, t),
                            r: lerp(Math.PI / 4, 0, t)
                        })
                    }
                }
            })
        },
        thrust: { name: "thrust", type: "single", cooldown: 325,
            animation: new DualAnimation(null, { duration: 32, pivot: "hand", side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => ({ x: lerp(x, x - 10, t), y }), 
                next: { duration: 130, pivot: "hand", side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => ({ x: lerp(x - 10, x + 37, t), y }),
                    next: { duration: 162, pivot: "hand", side: "right", easing: smoothstep,
                        curve: (t, { x, y }) => ({ x: lerp(x + 37, x, t), y })
                    }
                }
            })
        }
    },
    dual: {
        heavy_swing: { name: "heavy_swing", type: "dual", cooldown: 500,
            animation: { duration: 100,
                easing: smoothstep,
                curve: t => ({ x: 0, y: 0, r: lerp(0, Math.PI / 8, t) }),
                next: {  duration: 200,
                    easing: smoothstep,
                    curve: t => ({ x: 0, y: 0, r: lerp(Math.PI / 8, -Math.PI / 2, t) }),
                    next: { duration: 180,
                        easing: smoothstep,
                        curve: t => ({ x: 0, y: 0, r: lerp(-Math.PI / 2, 0, t) })
                    }
                }
            }
        }
    },
}

export const melees: {
    [type in MeleeType]: {
        [melee in MeleeKey<type>]: Melee<type>;
    }
} = {
    none: {
        fists: { name: "fists", type: "none",
            idle: defaultHandPositions,
            actions: new Set(["punch_left", "punch_right"]),
            carryingSpeedMult: 1
        }
    },
    singlehanded: {
        karambit: { name: "karambit", type: "singlehanded", side: "right",
            asset: {
                name: "karambit",
                offset: { x: 13, y: 15 },
                rotation: 0,
                anchor: { x: 0.5, y: 0.5 }
            },
            idle: defaultHandPositions,
            actions: new Set(["punch_left", "punch_right", "slash"]),
            carryingSpeedMult: 1
        },
        bayonet: { name: "bayonet", type: "singlehanded", side: "right",
            asset: {
                name: "bayonet",
                offset: { x: 25, y: -12 },
                rotation: - Math.PI / 6,
                anchor: { x: 0.5, y: 0.5 }
            },
            idle: defaultHandPositions,
            actions: new Set(["cut", "thrust"]),
            carryingSpeedMult: 1
        }
    },
    twohanded: {
        sledgehammer: { name: "sledgehammer", type: "twohanded",
            asset: {
                name: "sledgehammer",
                offset: { x: 43, y: 15 },
                rotation: - Math.PI / 16,
                anchor: { x: 0.5, y: 0.5 }
            },
            idle: {
                left: {
                    vertical: "above",
                    position: { x: 33, y: -33 }
                },
                right: {
                    vertical: "above",
                    position: { x: 45, y: 33 }
                }
            },
            actions: new Set(["heavy_swing"]),
            carryingSpeedMult: 0.75
        }
    }
}