import { AnimationInstance } from "./animation";
import { DualAnimation, GameAction, cloneAction } from "./definitions";

export class ActionInstance {
    info: GameAction;
    animations: AnimationInstance[] = [];

    constructor(info: GameAction, start: number) {
        this.info = cloneAction(info);

        if (info.animation instanceof DualAnimation) {
            for (const animation of info.animation) {
                if (!animation) continue;

                this.animations.push(new AnimationInstance(animation, start));
            }
        }
        else {
            this.animations.push(new AnimationInstance(info.animation, start));
        }
    }
}