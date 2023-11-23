import { Bodies } from "matter-js";
import { GameObject } from "./gameObject";
import { Game } from "../main/game";
import { Hand, Vertical, HandPosition, Animation } from "./animation";
import { Container, Graphics } from "pixi.js";
import { angleBetween, angleTo } from "../util/math";
import { Equippable } from "./equippable";
import { GameGun, Gun } from "../resources/gun";
import { GameMelee, Melee } from "../resources/melee";

export class Agent extends GameObject {
    protected _rotation: number = 0;
    rotation: number = 0;
    rotationSpeed: number = 10;

    center: Graphics = new Graphics();
    level: Record<Vertical, Container> = {
        below: new Container(),
        above: new Container()
    };
    holding: Container = new Container();
    hands: Record<Hand, Graphics> = {
        left: new Graphics(),
        right: new Graphics()
    };

    equipped: Equippable | null = null;

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
        this.container.addChild(this.holding);
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

    equip = (item: GameGun | GameMelee) => {
        this.holding.removeChildren();

        this.equipped = item;

        const sprite = item.getSprite(this.game);
        
        if (sprite) {
            this.holding.addChild(sprite);

            if (item instanceof Gun) {
                sprite.position.x = item.data.offset.x;
                sprite.position.y = item.data.offset.y;
                sprite.rotation = item.data.rotation;
                sprite.tint = item.data.tint;
                sprite.anchor.x = item.data.anchor.x;
                sprite.anchor.y = item.data.anchor.y;
            }
        }

        this.hands.left.removeFromParent();
        this.level[item.idle.left.vertical].addChild(this.hands.left);

        this.hands.right.removeFromParent();
        this.level[item.idle.right.vertical].addChild(this.hands.right);
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

        this.hands.left.position.x = this.equipped?.idle.left.position.x ?? 0;
        this.hands.left.position.y = this.equipped?.idle.left.position.y ?? 0;

        this.hands.right.position.x = this.equipped?.idle.right.position.x ?? 0;
        this.hands.right.position.y = this.equipped?.idle.right.position.y ?? 0;

        super.update(delta);
    }
}