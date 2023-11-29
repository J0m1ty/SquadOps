import { Bodies } from "matter-js";
import { GameObject } from "./gameObject";
import { Game } from "../main/game";
import { Container, Graphics } from "pixi.js";
import { angleBetween, angleTo, lerp } from "../util/math";
import { Hand } from "./hand";
import { GameAction, actions } from "../weapons/weapons";
import { ActionInstance } from "../weapons/action";
import { GunInstance } from "../weapons/gun";
import { MeleeInstance } from "../weapons/melee";

export class Agent extends GameObject {
    protected _rotation: number = 0;
    rotation: number = 0;
    rotationSpeed: number = 10;

    center: Graphics = new Graphics();
    handBox: Container = new Container();
    level = {
        below: new Container(),
        above: new Container()
    };
    holding: Container = new Container();
    hand: {
        left: Hand,
        right: Hand
    };

    equipped?: GunInstance | MeleeInstance;

    actions: ActionInstance[] = [];

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

    equip = (item: GunInstance | MeleeInstance) => {
        this.actions = [];
        this.equipped?.reset();
        
        this.equipped = item;
        
        const sprite = item.getSprite(this.game);
        
        if (sprite) {
            if (item.info.type == "twohanded") {
                this.holding.addChild(sprite);
            }
            else if (item.info.type == "pistollike" && "dualable" in item.info && item.info.dualable && item instanceof GunInstance && item.dual) {
                const dual = item.getDualSprite(this.game);

                if (dual) {
                    this.hand.left.holding[item.info.idle.left?.vertical ?? "above"].addChild(dual);
                    this.hand.right.holding[item.info.idle.right?.vertical ?? "above"].addChild(sprite);
                }
            }
            else if (item.info.type == "singlehanded" && "side" in item.info) {
                const side = item.info.side;
                this.hand[side].holding[item.info.idle[side]?.vertical ?? "above"].addChild(sprite);
            }
        }

        this.hand.left.container.removeFromParent();
        this.level[item.info.idle.left?.vertical ?? "above"].addChild(this.hand.left.container);
        this.hand.left.container.visible = item.info.idle.left != null;

        this.hand.right.container.removeFromParent();
        this.level[item.info.idle.right?.vertical ?? "above"].addChild(this.hand.right.container);
        this.hand.right.container.visible = item.info.idle.right != null;
    }

    action = (action: GameAction) => {
        this.actions.push(new ActionInstance(action, this.game.app.ticker.lastTime));
    }

    fire = (): number | null => {
        // if (this.equipped == null || !(this.equipped instanceof Gun)) return null;
        
        // const recoil = this.equipped.recoil;

        // switch (this.equipped.hand) {
        //     case "both":

        //         const x = lerp(this.handBox.position.x, - recoil.x, 0.5);
        //         const y = lerp(this.handBox.position.y, recoil.y * (Math.round(Math.random()) * 2 - 1), 0.8);

        //         this.handBox.position.set(x, y);
        //         break;
        //     case "dual":
        //         const hands = [this.equipped.idle.left, this.equipped.idle.right].filter((a): a is (HandPosition<"left"> | HandPosition<"right">) => a != null);
        //         if (hands.length == 0) return null;

        //         const hand = hands[Math.floor(Math.random() * hands.length)];

        //         const x1 = lerp(0, - recoil.x, 0.5);
        //         const y1 = lerp(0, recoil.y * (Math.round(Math.random()) * 2 - 1), 0.8);

        //         this.hand[hand.side].container.position.set(hand.position.x + x1, hand.position.y + y1);

                
        //         break;
        // }

        // return 150;
        return null;
    }

    melee = () => {
        if (this.equipped == null || !(this.equipped instanceof MeleeInstance)) return;
        
        const name = this.equipped.getAction();
        const action = Object.values(actions).flatMap<GameAction>(actionType => Object.values(actionType)).find(action => action.name === name);
        if (action == null) return;

        this.action(action);

        return action.data.cooldown;
    }

    animate = (delta: number) => {
        const update = { left: false, right: false, holding: false };
        
        for (const action of this.actions) {
            for (const animation of action.animations) {
                const elapsed = this.game.app.ticker.lastTime - animation.start;
                const destroy = elapsed > animation.info.duration, end = !animation.info.next && destroy;
                const origin = "side" in animation.info ? (this.equipped?.info.idle[animation.info.side]?.position ?? { x: 0, y: 0 }) : { x: 0, y: 0 };
                const { x, y, r} = animation.info.curve(animation.info.easing(elapsed / animation.info.duration), origin);

                if ("side" in animation.info) {
                    update[animation.info.side] = true;
                    
                    if (animation.info.pivot == "body") {
                        this.hand[animation.info.side].container.position.set(x - origin.x, y - origin.y);
                        this.hand[animation.info.side].container.pivot.set(-origin.x, -origin.y);
                    }
                    else {
                        this.hand[animation.info.side].container.position.set(x, y);
                        this.hand[animation.info.side].container.pivot.set(0, 0);
                    }

                    if (!end) this.hand[animation.info.side].container.rotation = r ?? 0;
                }
                else {
                    update.left = update.right = update.holding = true;

                    this.handBox.position.set(x, y);
                    this.handBox.rotation = r ?? 0;
                }

                if (destroy) {
                    if (animation.info.next != null) {
                        animation.info = animation.info.next;
                        animation.start = this.game.app.ticker.lastTime;
                    }
                    else {
                        action.animations.splice(action.animations.indexOf(animation), 1);
                    }
                }
            }

            if (action.animations.length == 0) {
                this.actions.splice(this.actions.indexOf(action), 1);
            }
        }

        if (!update.left) {
            this.hand.left.container.position.x = lerp(this.hand.left.container.position.x, this.equipped?.info.idle.left?.position.x ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.left.container.position.y = lerp(this.hand.left.container.position.y, this.equipped?.info.idle.left?.position.y ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.left.container.pivot.set(0, 0);
            this.hand.left.container.rotation = 0;
        }
        
        if (!update.right) {
            this.hand.right.container.position.x = lerp(this.hand.right.container.position.x, this.equipped?.info.idle.right?.position.x ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.right.container.position.y = lerp(this.hand.right.container.position.y, this.equipped?.info.idle.right?.position.y ?? 0, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.right.container.pivot.set(0, 0);
            this.hand.right.container.rotation = 0;
        }

        if (!update.holding) {
            this.handBox.position.x = lerp(this.handBox.position.x, 0, 1 - Math.pow(0.5, delta / 1.5));
            this.handBox.position.y = lerp(this.handBox.position.y, 0, 1 - Math.pow(0.5, delta / 1.5));
            this.handBox.rotation = 0;
        }
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
        
        this.animate(delta);

        super.update(delta);
    }
}