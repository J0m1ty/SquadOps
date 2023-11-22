import { AssetName } from '../assets/builder';
import { Equippable } from './equippable';
import { Point } from '../basic/types';
import { DuelHandAnimation } from './types';

export class Gun implements Equippable {
    name: string;
    asset: AssetName;
    idle: DuelHandAnimation;

    constructor(name: string, asset: AssetName, idle: DuelHandAnimation) {
        this.name = name;
        this.asset = asset;
        this.idle = idle;
    }
}