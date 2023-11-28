import { Animation, DualAnimation } from "../basic/animation";
import { smoothstep } from "../util/curves";
import { lerp } from "../util/math";

export type SingleAction = "punch" | "slash" | "thrust" | "cut";
export type DualAction = "heavy_swing";
export type ActionKey = SingleAction | DualAction;

export const actions: {
    [key in ActionKey]: key extends SingleAction ? DualAnimation : Animation<"none">;
} = {
    punch: {
        dual: true,
        left: {
            side: "left",
            duration: 130,
            easing: smoothstep,
            curve: (t, { x, y }) => {
                return {
                    x: lerp(x, x + 33, t),
                    y: lerp(y, y + 20, t)
                }
            },
            next: {
                side: "left",
                duration: 195,
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
            side: "right",
            duration: 130,
            easing: smoothstep,
            curve: (t, { x, y }) => {
                return {
                    x: lerp(x, x + 33, t),
                    y: lerp(y, y - 20, t)
                }
            },
            next: {
                side: "right",
                duration: 195,
                easing: smoothstep,
                curve: (t, { x, y }) => {
                    return {
                        x: lerp(x + 33, x, t),
                        y: lerp(y - 20, y, t)
                    }
                }
            }
        }
    },
    slash: {
        dual: true,
        left: null,
        right: {
            side: "right",
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
                side: "right",
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
    },
    thrust: {
        dual: true,
        left: null,
        right: {
            side: "right",
            duration: 32,
            easing: smoothstep,
            curve: (t, { x, y }) => {
                return { x: lerp(x, x - 10, t), y };
            },
            next: {
                side: "right",
                duration: 130,
                easing: smoothstep,
                curve: (t, { x, y }) => {
                    return { x: lerp(x - 10, x + 37, t), y };
                },
                next: {
                    side: "right",
                    duration: 162,
                    easing: smoothstep,
                    curve: (t, { x, y }) => {
                        return { x: lerp(x + 37, x, t), y };
                    }
                }
            }
        }
    },
    cut: {
        dual: true,
        left: null,
        right: {
            side: "right",
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
                side: "right",
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
                    side: "right",
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
    },
    heavy_swing: {
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
};
