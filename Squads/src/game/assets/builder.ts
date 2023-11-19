import { Graphics, Texture } from "pixi.js";
import { Asset } from "./loader";

export const Assets: Asset[] = [
    {
        name: 'gun_long',
        generator: async () => {
            const graphic = new Graphics();
            graphic.beginFill(0x000000);
            graphic.drawRect(0, 0, 100, 10);
            graphic.endFill();
            return graphic;
        }
    },
    {
        name: 'gun_short',
        generator: async () => {
            const graphic = new Graphics();
            graphic.beginFill(0x000000);
            graphic.drawRect(0, 0, 50, 10);
            graphic.endFill();
            return graphic;
        }
    }
];