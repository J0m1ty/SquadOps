import { AssetName } from '../assets/builder';
import { Equippable } from './equippable';
import { Point } from '../basic/types';
import { DuelHandAnimation, Item } from './types';

export class Gun<T extends string> implements Equippable {
    type: Item = "gun";
    name: T;
    asset: AssetName;
    tint?: number = 0xffffff;
    idle: DuelHandAnimation;

    constructor(name: T, asset: { name: AssetName, tint?: number }, idle: DuelHandAnimation) {
        this.name = name;
        this.asset = asset.name;
        this.tint = asset.tint;
        this.idle = idle;
    }
}