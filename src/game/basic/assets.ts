import { Graphics } from "pixi.js";

export type AssetKey = 'gun_long' | 'gun_short' | 'm9' | 'karambit' | 'bayonet' | 'sledgehammer';

export type Asset<T extends string> = {
    name: T,
    generator: () => Promise<Graphics>;
};

export type GameAsset = Asset<AssetKey>;

export const Assets: {
    [key in AssetKey]: Asset<key>;
} = {
    gun_long: {
        name: 'gun_long',
        generator: async () => {
            const graphic = new Graphics();
            graphic.lineStyle({ width: 3, color: 0x4b4b4b, alignment: 0.5 });
            graphic.beginFill(0xfdfdfd);
            graphic.drawRoundedRect(0, 0, 18, 122, 30);
            graphic.endFill();
            return graphic;
        }
    },
    gun_short: {
        name: 'gun_short',
        generator: async () => {
            const gun = new Graphics();
            gun.lineStyle({ width: 3, color: 0x4b4b4b, alignment: 0.5 });
            gun.beginFill(0xfdfdfd);
            gun.drawRoundedRect(0, 0, 16, 85, 30);
            gun.endFill();
            return gun;
        }
    },
    m9: {
        name: 'm9',
        generator: async () => {
            const gun = new Graphics();
            gun.lineStyle({ width: 3, color: 0x4b4b4b, alignment: 0.5 });
            gun.beginFill(0xfdfdfd);
            gun.drawRoundedRect(0, 0, 14, 52, 30);
            gun.endFill();
            return gun;
        }
    },
    karambit: {
        name: 'karambit',
        generator: async () => {
            const handle = new Graphics();
            handle.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
            handle.beginFill(0x5A5C5E);
            handle.drawRoundedRect(0, 0, 18, 45, 10);
            handle.endFill();

            const blade = new Graphics();
            blade.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
            blade.beginFill(0xc0c0c0);
            blade.drawRoundedRect(0, 0, 18, 45, 10);
            blade.endFill();
            blade.rotation = - Math.PI / 4;
            blade.position.set(0, 45);
            handle.addChild(blade);

            return handle;
        }
    },
    bayonet: {
        name: 'bayonet',
        generator: async () => {
            const handle = new Graphics();
            handle.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
            handle.beginFill(0x8B6C5C);
            handle.drawRoundedRect(0, 0, 45, 16, 10);
            handle.endFill();

            const blade = new Graphics();
            blade.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
            blade.beginFill(0xc0c0c0);
            blade.moveTo(0, -1);
            blade.lineTo(40, 3);
            blade.lineTo(52, 8);
            blade.lineTo(40, 13);
            blade.lineTo(0, 17);
            blade.closePath();
            blade.endFill();
            blade.position.set(45, 0);
            handle.addChild(blade);

            const hilt = new Graphics();
            hilt.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
            hilt.beginFill(0x5A5C5E);
            hilt.drawRoundedRect(0, 0, 10, 30, 10);
            hilt.endFill();
            hilt.position.set(42, -6);
            handle.addChild(hilt);

            return handle;
        }
    },
    sledgehammer: {
        name: 'sledgehammer',
        generator: async () => {
            const handle = new Graphics();
            handle.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
            handle.beginFill(0xB78130);
            handle.drawRoundedRect(0, 0, 16, 132, 5);
            handle.endFill();

            const head = new Graphics();
            head.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
            head.beginFill(0x5A5C5E);
            head.drawRect(0, 0, 50, 25);
            head.endFill();
            head.position.set(-16, 132);
            handle.addChild(head);

            return handle;
        }
    }
};

export const AssetList: GameAsset[] = Object.values(Assets);