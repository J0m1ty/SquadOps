import { Agent } from "../basic/agent";
import { AnimationInstance } from "./animation";
import { DualAnimation, GameAction, cloneAction, isHandAnimation } from "./definitions";

export class ActionInstance {
    agent: Agent;
    info: GameAction;
    
    animations: AnimationInstance[] = [];

    constructor(agent: Agent, info: GameAction, start: number) {
        this.agent = agent;
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

    animate = (time: number) => {
        const update = { left: false, right: false, holding: false };

        for (const animation of this.animations) {
            const elapsed = time - animation.start;
            const destroy = elapsed > animation.info.duration, end = !animation.info.next && destroy;
            const origin = "side" in animation.info ? (this.agent.equipped?.info.idle[animation.info.side]?.position ?? { x: 0, y: 0 }) : { x: 0, y: 0 };
            const { x, y, r} = animation.info.curve(animation.info.easing(elapsed / animation.info.duration), origin);

            if (isHandAnimation(animation.info)) {
                update[animation.info.side] = true;
                
                if (animation.info.pivot == "body" && !end) {
                    this.agent.hand[animation.info.side].container.position.set(x - origin.x, y - origin.y);
                    this.agent.hand[animation.info.side].container.pivot.set(-origin.x, -origin.y);
                }
                else {
                    this.agent.hand[animation.info.side].container.position.set(x, y);
                    this.agent.hand[animation.info.side].container.pivot.set(0, 0);
                }

                if (!end) this.agent.hand[animation.info.side].container.rotation = r ?? 0;
            }
            else {
                update.left = update.right = update.holding = true;

                this.agent.handBox.position.set(x, y);
                this.agent.handBox.rotation = r ?? 0;
            }

            if (destroy && animation.info.next != null) {
                animation.info = animation.info.next;
                animation.start = time;
            }

            if (end) {
                this.animations.splice(this.animations.indexOf(animation), 1);
            }
        }

        return update;
    }
}