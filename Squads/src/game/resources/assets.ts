import { Graphics } from "pixi.js";

export type AssetKey = 'gun_long' | 'gun_short';

export type Asset<T extends string> = {
    name: T,
    generator: () => Promise<Graphics>
};

export type GameAsset = Asset<AssetKey>;

export const Assets: {
    [key in AssetKey]: Asset<key>;
} = {
    gun_long: {
        name: 'gun_long',
        generator: async () => {
            const graphic = new Graphics();
            graphic.lineStyle(2, 0x4b4b4b);
            graphic.beginFill(0xfdfdfd);
            graphic.drawRoundedRect(0, 0, 13, 132, 30);
            graphic.endFill();
            return graphic;
        }
    },
    gun_short: {
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
};

export const AssetList: GameAsset[] = Object.values(Assets);