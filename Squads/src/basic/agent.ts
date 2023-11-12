import { Bodies } from "matter-js";
import { GameObject } from "./gameObject";
import { Game } from "../main/game";
import { Hand } from "./types";
import { Container, Graphics, Point } from "pixi.js";
import { angleBetween, angleTo, map, smoothstep } from "../util/math";

export type HandAnimation = {
    target: { x: number, y: number }
    start: number;
    side: Hand;
    goBack: boolean;
    duration: number;
}

export class Agent extends GameObject {
    protected _rotation: number = 0;
    rotation: number = 0;
    rotationSpeed: number = 10;

    center: Graphics = new Graphics();
    hands: Container = new Container();
    leftHand: Graphics = new Graphics();
    rightHand: Graphics = new Graphics();

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
            layer: "player",
            cullable: false
        });

        this.trackBodyRotation = false;
        
        this.center.beginFill(0xd5a98a);
        this.center.drawCircle(0, 0, this.size);
        this.center.endFill();
        this.container.addChild(this.center);

        this.hands.position.set(this.size * 2/3, 0);
        this.container.addChild(this.hands);

        this.leftHand.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
        this.leftHand.beginFill(0xd5a98a);
        this.leftHand.drawCircle(0, 0, this.size * 6/19);
        this.leftHand.endFill();
        this.leftHand.position.set(0, -this.size * 2/3);
        this.hands.addChild(this.leftHand);

        this.rightHand.lineStyle({ width: 3, color: 0x000000, alignment: 0.5 });
        this.rightHand.beginFill(0xd5a98a);
        this.rightHand.drawCircle(0, 0, this.size * 6/19);
        this.rightHand.endFill();
        this.rightHand.position.set(0, this.size * 2/3);
        this.hands.addChild(this.rightHand);
    }

    punch = (side: Hand) => {
        this.animate({
            target: new Point(35, -20),
            side,
            goBack: true,
            start: this.game.app.ticker.lastTime,
            duration: 250,
        });
    }

    animate = (animation: HandAnimation) => {
        this.animations = this.animations.filter(a => a.side !== animation.side);
        this.animations.push(animation);
    }

    getHand = (side: Hand) => {
        return side == 'left' ? { sign: -1, hand: this.leftHand } : { sign: 1, hand: this.rightHand };
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
                if (anim.goBack) {
                    anim.start = this.game.app.ticker.lastTime;
                    anim.target = new Point(0, 0);
                    anim.goBack = false;
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