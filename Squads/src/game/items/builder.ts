import { Gun } from "./gun";

export type GunName = "ak47" | "ump";

export const guns: Record<GunName, Gun<GunName>> = {
    "ak47": new Gun("ak47", {name: "gun_long", tint: 0x8b4513}, {
        left: {
            side: "left",
            vertical: "above",
            target: { x: 0, y: 0 },
            start: 0,
            duration: 0
        },
        right: {
            side: "right",
            vertical: "above",
            target: { x: 0, y: 0 },
            start: 0,
            duration: 0
        }
    }),
    "ump": new Gun("ump", {name: "gun_short", tint: 0x808080 }, {
        left: {
            side: "left",
            vertical: "above",
            target: { x: 0, y: 0 },
            start: 0,
            duration: 0
        },
        right: {
            side: "right",
            vertical: "above",
            target: { x: 0, y: 0 },
            start: 0,
            duration: 0
        }
    })
}
    