import { AssetName } from '../assets/builder';
import { Equippable } from './equippable';
import { Point } from '../basic/types';
import { DuelHandAnimation } from './types';

export class Gun implements Equippable {
    name: string;
    asset: AssetName;
    idle: DuelHandAnimation;

    constructor(name: string, asset: AssetName, idle: {left: Point, right: Point }) {
        this.name = name;
        this.asset = asset;
        this.idle = {
            left: {
                side: "left",
                target: idle.left,
                start: 0,
                duration: 0
            },
            right: {
                side: "right",
                target: idle.right,
                start: 0,
                duration: 0
            }
        }
    }
}