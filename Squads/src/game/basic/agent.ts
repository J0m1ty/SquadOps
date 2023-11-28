import { Bodies } from "matter-js";
import { GameObject } from "./gameObject";
import { Game } from "../main/game";
import { Animation, GameAnimation, HandPosition, HandType, Vertical } from "./animation";
import { Container, Graphics } from "pixi.js";
import { angleBetween, angleTo, lerp, map } from "../util/math";
import { Equippable } from "./equippable";
import { GameGun, Gun } from "../weapons/gun";
import { GameMelee, Melee } from "../weapons/melee";
import { actions } from "../weapons/actions";
import { Hand } from "./hand";

export type AnimationInstance = GameAnimation & {
    start: number;
};

export class Agent extends GameObject {
    protected _rotation: number = 0;
    rotation: number = 0;
    rotationSpeed: number = 10;

    center: Graphics = new Graphics();
    handBox: Container = new Container();
    level: Record<Vertical, Container> = {
        below: new Container(),
        above: new Container()
    };
    holding: Container = new Container();
    hand: Record<HandType, Hand>;

    equipped: Equippable | null = null;

    animations: AnimationInstance[] = [];

    get size() {
        return this.body.circleRadius ?? 0;
    }

    constructor(game: Game) {
        super(game, Bodies.circle(0, 0, 50, {
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0
        }), {
            layer: "player"
        });

        this.info.trackBodyRotation = false;
        
        this.center.beginFill(0xd5a98a);
        this.center.drawCircle(0, 0, this.size);
        this.center.endFill();
        this.container.addChild(this.center);

        this.handBox.addChild(this.level.below);
        this.handBox.addChild(this.holding);
        this.handBox.addChild(this.level.above);
        this.container.addChild(this.handBox);

        this.hand = {
            left: new Hand(this),
            right: new Hand(this)
        };
    }

    equip = (item: GameGun | GameMelee) => {
        this.animations = [];
        this.equipped?.sprite?.removeFromParent();
        this.equipped?.dual?.removeFromParent();

        this.equipped = item;

        const sprite = item.getSprite(this.game);
        
        if (sprite) {
            switch (item.hand) {
                case "left":
                    this.hand.left.holding[item.idle.left?.vertical ?? "above"].addChild(sprite);
                    break;
                case "right":
                    this.hand.right.holding[item.idle.right?.vertical ?? "above"].addChild(sprite);
                    break;
                case "dual":
                    const dual = item.getDualSprite(this.game);

                    if (dual) {
                        this.hand.left.holding[item.idle.left?.vertical ?? "above"].addChild(dual);
                        this.hand.right.holding[item.idle.right?.vertical ?? "above"].addChild(sprite);
                    }
                    break;
                case "both":
                    this.holding.addChild(sprite);
                    break;
            }
        }

        this.hand.left.container.removeFromParent();
        this.level[item.idle.left?.vertical ?? "above"].addChild(this.hand.left.container);
        this.hand.left.container.visible = item.idle.left != null;

        this.hand.right.container.removeFromParent();
        this.level[item.idle.right?.vertical ?? "above"].addChild(this.hand.right.container);
        this.hand.right.container.visible = item.idle.right != null;
    }

    animate = (animation: GameAnimation) => {
        this.animations.push({
            ...animation,
            start: this.game.app.ticker.lastTime
        });
    }

    fire = (): number | null => {
        if (this.equipped == null || !(this.equipped instanceof Gun)) return null;
        
        const recoil = this.equipped.recoil;

        switch (this.equipped.hand) {
            case "both":

                const x = lerp(this.handBox.position.x, - recoil.x, 0.5);
                const y = lerp(this.handBox.position.y, recoil.y * (Math.round(Math.random()) * 2 - 1), 0.8);

                this.handBox.position.set(x, y);
                break;
            case "dual":
                const hands = [this.equipped.idle.left, this.equipped.idle.right].filter((a): a is (HandPosition<"left"> | HandPosition<"right">) => a != null);
                if (hands.length == 0) return null;

                const hand = hands[Math.floor(Math.random() * hands.length)];

                const x1 = lerp(0, - recoil.x, 0.5);
                const y1 = lerp(0, recoil.y * (Math.round(Math.random()) * 2 - 1), 0.8);

                this.hand[hand.side].container.position.set(hand.position.x + x1, hand.position.y + y1);

                
                break;
        }

        return 150;
    }

    melee = (): number | null => {
        if (this.equipped == null || !(this.equipped instanceof Melee)) return null;
        
        const info = this.equipped.actions[Math.floor(Math.random() * this.equipped.actions.length)];
        if (!info) return null;

        const action = actions[info.action];

        const animations = ("dual" in action) ? [action.left, action.right].filter((a): a is (Animation<"left"> | Animation<"right">) => a != null) : [action];
        this.animate(animations[Math.floor(Math.random() * animations.length)]);

        return info.cooldown;
    }

    update(delta: number) {
        for (let i = 0; i < this.rotationSpeed; i++) {
            const diff = angleBetween(this._rotation, this.rotation);

            if (Math.abs(diff) < 0.01) {
                this._rotation = this.rotation;
                break;
            }

            const modify = angleTo(this._rotation, this.rotation) * (Math.PI / 180) * delta;
            
            this._rotation = (modify + this._rotation) % (2 * Math.PI);
        }

        this.container.rotation = this._rotation;

        let update = { left: false, right: false, holding: false };

        if (this.equipped instanceof Melee) {
            let append: GameAnimation[] = [];
            for (const animation of this.animations) {
                const elapsed = this.game.app.ticker.lastTime - animation.start;
                const destroy = elapsed >= animation.duration, end = !animation.next && destroy;

                const origin = 'side' in animation ? (this.equipped?.idle[animation.side]?.position ?? { x: 0, y: 0 }) : { x: 0, y: 0 };

                const { x, y, r } = animation.curve(animation.easing(elapsed / animation.duration), origin);

                if ('side' in animation) {
                    update[animation.side] = true;
                    this.hand[animation.side].container.position.set(x, y); 

                    if ('pivot' in animation && animation.pivot == "body" && !end) {
                        this.hand[animation.side].container.position.set(x - origin.x, y - origin.y);

                        this.hand[animation.side].container.pivot.set(- origin.x, - origin.y);
                    }
                    else {
                        this.hand[animation.side].container.pivot.set(0, 0);
                    }

                    if (!end) this.hand[animation.side].container.rotation = r ?? 0;
                } else {
                    update = { left: true, right: true, holding: true };
                    this.handBox.position.set(x, y);
                    this.handBox.rotation = r ?? 0;
                }

                if (destroy) {
                    this.animations.splice(this.animations.indexOf(animation), 1);

                    if (animation.next != null) {
                        append.push(animation.next);
                    }
                }
            }

            for (const animation of append) {
                this.animate(animation);
            }
        }

        if (!update.left) {
            this.hand.left.container.position.x = lerp(this.hand.left.container.position.x, this.equipped?.idle.left?.position.x ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.left.container.position.y = lerp(this.hand.left.container.position.y, this.equipped?.idle.left?.position.y ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.left.container.pivot.set(0, 0);
            this.hand.left.container.rotation = 0;
        }
        
        if (!update.right) {
            this.hand.right.container.position.x = lerp(this.hand.right.container.position.x, this.equipped?.idle.right?.position.x ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.right.container.position.y = lerp(this.hand.right.container.position.y, this.equipped?.idle.right?.position.y ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.right.container.pivot.set(0, 0);
            this.hand.right.container.rotation = 0;
        }

        if (!update.holding) {
            this.handBox.position.x = lerp(this.handBox.position.x, 0, 1 - Math.pow(0.5, delta / 1.5));
            this.handBox.position.y = lerp(this.handBox.position.y, 0, 1 - Math.pow(0.5, delta / 1.5));
            this.handBox.rotation = 0;
        }

        super.update(delta);
    }
}