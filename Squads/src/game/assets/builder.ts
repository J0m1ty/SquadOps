import { Graphics } from "pixi.js";
import { RawAsset } from "./loader";

export type AssetName = 'gun_long' | 'gun_short';

export const RawAssets: RawAsset<AssetName>[] = [
    {
        name: 'gun_long',
        generator: async () => {
            const graphic = new Graphics();
            graphic.lineStyle(2, 0x4b4b4b);
            graphic.beginFill(0xfdfdfd);
            graphic.drawRoundedRect(0, 0, 10, 122, 30);
            graphic.endFill();
            return graphic;
        }
    },
    {
        name: 'gun_short',
        generator: async () => {
            const graphic = new Graphics();
            graphic.lineStyle(2, 0x4b4b4b);
            graphic.beginFill(0xfdfdfd);
            graphic.drawRect(0, 0, 18, 66);
            graphic.endFill();
            return graphic;
        }
    }
];