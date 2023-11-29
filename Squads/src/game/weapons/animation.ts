import { Animation, HandAnimation, cloneAnimation, cloneHandAnimation } from "./weapons";

export class AnimationInstance {
    info: HandAnimation | Animation;
    start: number;

    constructor(info: HandAnimation | Animation, start: number) {
        this.info = "side" in info ? cloneHandAnimation(info) : cloneAnimation(info);
        this.start = start;
    }
}