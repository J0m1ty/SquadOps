import { Bodies } from "matter-js";
import { GameObject } from "./gameObject";
import { Game } from "../main/game";
import { Hand, HandAnimation, Vertical } from "../items/types";
import { Container, Graphics, Point } from "pixi.js";
import { angleBetween, angleTo, map, smoothstep } from "../util/math";
import { Gun } from "../items/gun";
import { Equippable } from "./equippable";

export class Agent extends GameObject {
    protected _rotation: number = 0;
    rotation: number = 0;
    rotationSpeed: number = 10;

    center: Graphics = new Graphics();
    level: Record<Vertical, Container> = {
        below: new Container(),
        above: new Container()
    };
    item: Container = new Container();
    hands: Record<Hand, Graphics> = {
        left: new Graphics(),
        right: new Graphics()
    };

    equipped: Equippable | null = null;

    animations: HandAnimation[] = [];

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
        
        this.container.addChild(this.level.below);
        this.container.addChild(this.item);
        this.container.addChild(this.level.above);

        this.hands.left.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
        this.hands.left.beginFill(0xd5a98a);
        this.hands.left.drawCircle(0, 0, this.size * 6/19);
        this.hands.left.endFill();

        this.hands.right.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
        this.hands.right.beginFill(0xd5a98a);
        this.hands.right.drawCircle(0, 0, this.size * 6/19);
        this.hands.right.endFill();
    }

    equip = (item: Equippable | null) => {
        this.equipped = item;

        this.item.removeChildren();

        if (item) {
            this.animate(item.idle.left);
            this.animate(item.idle.right);
            
            const sprite = item.getSprite(this.game);

            if (sprite) {
                this.item.addChild(sprite);
                sprite.position.x = item.asset?.offset?.x ?? 0;
                sprite.position.y = item.asset?.offset?.y ?? 0;
                sprite.rotation = item.asset?.rotation ?? 0;
                sprite.tint = item.asset?.tint ?? 0xffffff;
                sprite.anchor.x = item.asset?.anchor?.x ?? 0;
                sprite.anchor.y = item.asset?.anchor?.y ?? 0;
            }
        }
        else {
            this.animations = [];
        }
    }

    // punch = (side: Hand) => {
    //     if (this.equipped != null) return;

    //     this.animate({
    //         side,
    //         vertical: "above",
    //         target: new Point(35, -20),
    //         start: this.game.app.ticker.lastTime,
    //         duration: 250,
    //         next: "back"
    //     });
    // }

    animate = (animation: HandAnimation) => {
        this.animations = this.animations.filter(a => a.side !== animation.side);
        this.animations.push(animation);

        const hand = this.hands[animation.side];
        hand.removeFromParent();
        this.level[animation.vertical].addChild(hand);
    }

    getHand = (side: Hand) => {
        return side == 'left' ? { sign: -1, hand: this.hands.left } : { sign: 1, hand: this.hands.right };
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

        for (let i = 0; i < this.animations.length; i++) {
            const anim = this.animations[i];
            const { hand, sign } = this.getHand(anim.side);
            const target = new Point(anim.target.x, anim.target.y * sign)
            const total = target.add({ x: 0, y: this.size * 2/3 * sign });

            const elapsed = Math.max(0, Math.min(this.game.app.ticker.lastTime - anim.start, anim.duration));
            
            hand.position.x = map(smoothstep(0, anim.duration, elapsed), 0, 1, hand.position.x, total.x);
            hand.position.y = map(smoothstep(0, anim.duration, elapsed), 0, 1, hand.position.y, total.y);
            
            if (Math.abs(hand.position.x - total.x) < 0.5 && Math.abs(hand.position.x - total.x) < 0.5) {
                if (anim.next == "back") {
                    anim.start = this.game.app.ticker.lastTime;
                    anim.target = new Point(0, 0);
                    delete anim.next;
                }
                else if (anim.next) {
                    this.animations[i] = anim.next;
                }
                else {
                    this.animations.splice(i, 1);
                    i--;
                }
            }
        }

        super.update(delta);
    }
}