import { AssetKey } from "../basic/assets";
import { smoothstep } from "../util/curves";
import { lerp } from "../util/math";

export type GunType = "pistol" | "smg" | "rifle" | "sniper" | "shotgun" | "lmg" | "dmr";
export type GunKey<T extends GunType> = T extends "pistol" ? "m9" : T extends "rifle" ? "ak47" : never;

export type WeildingType = "single" | "dual";
export type ActionKey<T extends WeildingType> = T extends "single" ? "punch" | "slash" | "thrust" | "cut" : T extends "dual" ?  "heavy_swing" : never;

export type MeleeType = WeildingType | "none";
export type MeleeKey<T extends MeleeType | "none"> = T extends "none" ? "fists" : T extends "single" ? "karambit" | "bayonet" : T extends "dual" ? "sledgehammer" : never;

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
    next?: HandAnimation;
}

export type DualAnimation = {
    left: HandAnimation | null;
    right: HandAnimation | null;
}

export const isDualAnimation = (animation: Animation | DualAnimation): animation is DualAnimation => {
    return 'left' in animation && 'right' in animation;
}

export type Action<T extends WeildingType> = {
    name: ActionKey<T>;
    data: {
        cooldown: number;
    }
} & (T extends "single" ? {
    animation: DualAnimation;
} : {
    animation: Animation;
});

export type GameAction = Action<WeildingType>;

export type Gun<T extends GunType> = {
    name: GunKey<T>;
    idle: HandPositions;
    asset: AssetData;
    data: {
        tint: number;
        recoil: { x: number, y: number };
        fireRate: number;
    }
} & (T extends "pistol" ? {
    dual: boolean;
} : {});

export type GameGun = Gun<GunType>;

export type Melee<T extends MeleeType> = {
    name: MeleeKey<T>;
    idle: HandPositions;
    actions: Set<ActionKey<T extends WeildingType ? T : "single">>; 
} & (T extends "none" ? {} : {
    asset: AssetData;
});

export type GameMelee = Melee<MeleeType>;

export const guns: {
    [type in GunType]: {
        [gun in GunKey<type>]: Gun<type>;
    }
} = {
    pistol: {
        m9: {
            name: "m9",
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
            dual: true
        },
    },
    rifle: {
        ak47: {
            name: "ak47",
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
    },
    smg: {},
    sniper: {},
    shotgun: {},
    lmg: {},
    dmr: {}
}

export const actions: {
    [type in WeildingType]: {
        [action in ActionKey<type>]: Action<type>;
    }
} = {
    single: {
        punch: {
            name: "punch",
            animation: {
                left: {
                    duration: 130,
                    pivot: "hand",
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
                        easing: smoothstep,
                        curve: (t, {x, y }) => {
                            return {
                                x: lerp(x + 33, x, t),
                                y: lerp(y + 20, y, t)
                            }
                        }
                    }
                },
                right: {
                    duration: 130,
                    pivot: "hand",
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
                        easing: smoothstep,
                        curve: (t, { x, y }) => {
                            return {
                                x: lerp(x + 33, x, t),
                                y: lerp(y - 20, y, t)
                            }
                        }
                    }
                }
            }
        },
        slash: {
            name: "slash",
            animation: {
                left: null,
                right: {
                    duration: 130,
                    pivot: "hand",
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
                        easing: smoothstep,
                        curve: (t, { x, y }) => {
                            return {
                                x: lerp(x + 42, x, t),
                                y: lerp(y - 20, y, t),
                                r: lerp(- Math.PI / 2, 0, t)
                            }
                        }
                    }
                }
            }
        },
        cut: {
            name: "cut",
            animation: {
                left: null,
                right: {
                    duration: 32,
                    pivot: "body",
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
                }
            }
        },
        thrust: {
            name: "thrust",
            animation: {
                left: null,
                right: {
                    duration: 32,
                    pivot: "hand",
                    easing: smoothstep,
                    curve: (t, { x, y }) => {
                        return { x: lerp(x, x - 10, t), y };
                    },
                    next: {
                        duration: 130,
                        pivot: "hand",
                        easing: smoothstep,
                        curve: (t, { x, y }) => {
                            return { x: lerp(x - 10, x + 37, t), y };
                        },
                        next: {
                            duration: 162,
                            pivot: "hand",
                            easing: smoothstep,
                            curve: (t, { x, y }) => {
                                return { x: lerp(x + 37, x, t), y };
                            }
                        }
                    }
                }
            }
        }
    },
    dual: {
        heavy_swing: {
            name: "heavy_swing",
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
            actions: new Set(["punch"]),
            data: {
                cooldown: 325
            }
        }
    },
    single: {
        karambit: {
            name: "karambit",
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
            actions: new Set(["punch", "slash"]),
            data: {
                cooldown: 325
            }
        },
        bayonet: {
            name: "bayonet",
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
            actions: new Set(["cut", "thrust"]),
            data: {
                cooldown: 325
            }
        }
    },
    dual: {
        sledgehammer: {
            name: "sledgehammer",
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
            actions: new Set(["heavy_swing"]),
            data: {
                cooldown: 500
            }
        }
    }
}