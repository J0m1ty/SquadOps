import { AssetKey } from "../basic/assets";
import { smoothstep } from "../util/curves";
import { lerp } from "../util/math";

// TYPES

export type GunType = "pistollike" | "twohanded";
export type GunKey<T extends GunType> = T extends "pistollike" ? "m9" : T extends "twohanded" ? "ak47" : never;

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
    data: {
        cooldown: number;
    }
} & (T extends "single" ? {
    animation: DualAnimation;
} : {
    animation: Animation;
});

export type GameAction = Action<ActionType>;

export type Gun<T extends GunType> = {
    name: GunKey<T>;
    type: T;
    classifcation: "pistol" | "smg" | "rifle" | "sniper" | "shotgun" | "lmg" | "dmr";
    idle: HandPositions;
    asset: AssetData;
    data: {
        tint: number;
        recoil: { x: number, y: number };
        fireRate: number;
    }
} & (T extends "pistollike" ? {
    dualable: boolean;
} : {});

export type GameGun = Gun<GunType>;

export type Melee<T extends MeleeType> = {
    name: MeleeKey<T>;
    type: T;
    idle: HandPositions;
    actions: Set<ActionKey<T extends "twohanded" ? "dual" : "single">>; 
} & (T extends "none" ? {} : {
    asset: AssetData;
}) & (T extends "singlehanded" ? {
    side: "left" | "right";
} : {});

export type GameMelee = Melee<MeleeType>;

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
        data: { ...source.data },
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
        classifcation: source.classifcation,
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
        data: {
            tint: source.data.tint,
            recoil: { ...source.data.recoil },
            fireRate: source.data.fireRate
        },
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
        ...("asset" in source ? { asset: source.asset } : {}),
        ...("side" in source ? { side: source.side } : {})
    };

    return clone;
}

// DATA

export const guns: {
    [type in GunType]: {
        [gun in GunKey<type>]: Gun<type>;
    }
} = {
    pistollike: {
        m9: {
            name: "m9",
            type: "pistollike",
            classifcation: "pistol",
            asset: {
                name: "m9",
                offset: { x: 45, y: 0 },
                rotation: - Math.PI / 2,
                anchor: { x: 0, y: 0 }
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
            data: {
                tint: 0xffffff,
                recoil: { x: 10, y: 1 },
                fireRate: 150
            },
            dualable: true
        },
    },
    twohanded: {
        ak47: {
            name: "ak47",
            type: "twohanded",
            classifcation: "rifle",
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
            data: {
                tint: 0x865232,
                recoil: { x: 15, y: 2 },
                fireRate: 160
            }
        }
    }
}

export const actions: {
    [type in ActionType]: {
        [action in ActionKey<type>]: Action<type>;
    }
} = {
    single: {
        punch_left: {
            name: "punch_left",
            type: "single",
            data: {
                cooldown: 325
            },
            animation: new DualAnimation(null, {
                duration: 130,
                pivot: "hand",
                side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => {
                    return {
                        x: lerp(x, x + 33, t),
                        y: lerp(y, y - 20, t)
                    }
                },
                next: {
                    duration: 195,
                    pivot: "hand",
                    side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => {
                        return {
                            x: lerp(x + 33, x, t),
                            y: lerp(y - 20, y, t)
                        }
                    }
                }
            })
        },
        punch_right: {
            name: "punch_right",
            type: "single",
            data: {
                cooldown: 325
            },
            animation: new DualAnimation({
                duration: 130,
                pivot: "hand",
                side: "left",
                easing: smoothstep,
                curve: (t, { x, y }) => {
                    return {
                        x: lerp(x, x + 33, t),
                        y: lerp(y, y + 20, t)
                    }
                },
                next: {
                    duration: 195,
                    pivot: "hand",
                    side: "left",
                    easing: smoothstep,
                    curve: (t, {x, y }) => {
                        return {
                            x: lerp(x + 33, x, t),
                            y: lerp(y + 20, y, t)
                        }
                    }
                }
            }, null)
        },
        slash: {
            name: "slash",
            type: "single",
            data: {
                cooldown: 325
            },
            animation: new DualAnimation(null, {
                duration: 130,
                pivot: "hand",
                side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => {
                    return {
                        x: lerp(x, x + 42, t),
                        y: lerp(y, y - 20, t),
                        r: lerp(0, - Math.PI / 2, t)
                    }
                },
                next: {
                    duration: 195,
                    pivot: "hand",
                    side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => {
                        return {
                            x: lerp(x + 42, x, t),
                            y: lerp(y - 20, y, t),
                            r: lerp(- Math.PI / 2, 0, t)
                        }
                    }
                }
            })
        },
        cut: {
            name: "cut",
            type: "single",
            data: {
                cooldown: 325
            },
            animation: new DualAnimation(null, {
                duration: 32,
                pivot: "body",
                side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => {
                    return {
                        x: lerp(x, x + 10, t),
                        y: lerp(y, y - 5, t),
                        r: lerp(0, - Math.PI / 4, t)
                    };
                },
                next: {
                    duration: 146,
                    pivot: "body",
                    side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => {
                        return {
                            x: lerp(x + 10, x - 10, t),
                            y: lerp(y - 5, y + 10, t),
                            r: lerp(- Math.PI / 4, Math.PI / 4, t)
                        };
                    },
                    next: {
                        duration: 178,
                        pivot: "body",
                        side: "right",
                        easing: smoothstep,
                        curve: (t, { x, y }) => {
                            return { 
                                x: lerp(x - 10, x, t),
                                y: lerp(y + 10, y, t),
                                r: lerp(Math.PI / 4, 0, t)
                            };
                        }
                    }
                }
            })
        },
        thrust: {
            name: "thrust",
            type: "single",
            data: {
                cooldown: 325
            },
            animation: new DualAnimation(null, {
                duration: 32,
                pivot: "hand",
                side: "right",
                easing: smoothstep,
                curve: (t, { x, y }) => {
                    return { x: lerp(x, x - 10, t), y };
                },
                next: {
                    duration: 130,
                    pivot: "hand",
                    side: "right",
                    easing: smoothstep,
                    curve: (t, { x, y }) => {
                        return { x: lerp(x - 10, x + 37, t), y };
                    },
                    next: {
                        duration: 162,
                        pivot: "hand",
                        side: "right",
                        easing: smoothstep,
                        curve: (t, { x, y }) => {
                            return { x: lerp(x + 37, x, t), y };
                        }
                    }
                }
            })
        }
    },
    dual: {
        heavy_swing: {
            name: "heavy_swing",
            type: "dual",
            data: {
                cooldown: 500
            },
            animation: {
                duration: 100,
                easing: smoothstep,
                curve: t => {
                    return { x: 0, y: 0, r: lerp(0, Math.PI / 8, t) };
                },
                next: {
                    duration: 200,
                    easing: smoothstep,
                    curve: t => {
                        return { x: 0, y: 0, r: lerp(Math.PI / 8, -Math.PI / 2, t) };
                    },
                    next: {
                        duration: 180,
                        easing: smoothstep,
                        curve: t => {
                            return { x: 0, y: 0, r: lerp(-Math.PI / 2, 0, t) };
                        }
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
        fists: {
            name: "fists",
            type: "none",
            idle: {
                left: {
                    vertical: "above",
                    position: { x: 33, y: -33 }
                },
                right: {
                    vertical: "above",
                    position: { x: 33, y: 33 }
                }
            },
            actions: new Set(["punch_left", "punch_right"])
        }
    },
    singlehanded: {
        karambit: {
            name: "karambit",
            type: "singlehanded",
            side: "right",
            asset: {
                name: "karambit",
                offset: { x: 13, y: 15 },
                rotation: 0,
                anchor: { x: 0.5, y: 0.5 }
            },
            idle: {
                left: {
                    vertical: "above",
                    position: { x: 33, y: -33 }
                },
                right: {
                    vertical: "below",
                    position: { x: 33, y: 33 }
                }
            },
            actions: new Set(["punch_left", "punch_right", "slash"])
        },
        bayonet: {
            name: "bayonet",
            type: "singlehanded",
            side: "right",
            asset: {
                name: "bayonet",
                offset: { x: 25, y: -12 },
                rotation: - Math.PI / 6,
                anchor: { x: 0.5, y: 0.5 }
            },
            idle: {
                left: {
                    vertical: "above",
                    position: { x: 33, y: -33 }
                },
                right: {
                    vertical: "below",
                    position: { x: 33, y: 33 }
                }
            },
            actions: new Set(["cut", "thrust"])
        }
    },
    twohanded: {
        sledgehammer: {
            name: "sledgehammer",
            type: "twohanded",
            asset: {
                name: "sledgehammer",
                offset: { x: 43, y: 20 },
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
                    position: { x: 43, y: 33 }
                }
            },
            actions: new Set(["heavy_swing"])
        }
    }
}