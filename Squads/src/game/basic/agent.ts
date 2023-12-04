import { Bodies } from "matter-js";
import { GameObject } from "./gameObject";
import { Game } from "../main/game";
import { Container, Graphics } from "pixi.js";
import { angleBetween, angleTo, equalsXY, lerp, lerpXY, mod } from "../util/math";
import { Hand } from "./hand";
import { ActionInstance } from "../equipables/action";
import { GunInstance } from "../equipables/gun";
import { MeleeInstance } from "../equipables/melee";
import { GameGun, GameMelee, Gun, isGun, isMelee } from "../equipables/definitions";

export class Agent extends GameObject {
    protected _rotation: number = 0;
    rotation: number = 0;
    rotationSpeed: number = 10 * (Math.PI / 180);

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
    settled: boolean = false;

    actions: ActionInstance[] = [];

    get size() {
        return this.body.circleRadius ?? 0;
    }

    constructor(game: Game) {
        super(game, Bodies.circle(0, 0, 50, {
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            collisionFilter: {
                category: game.categories.agent,
                mask: game.categories.wall | game.categories.bullet
            }
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
        this.actions = [];
        this.equipped?.reset();
        this.settled = false;

        this.equipped = isGun(item) ? new GunInstance(this, item) : isMelee(item) ? new MeleeInstance(this, item) : undefined;
        
        if (!this.equipped) return;

        if (this.equipped instanceof GunInstance) {
            const sprite = this.equipped.getSprite(this.game);

            if (this.equipped.info.type == "pistollike" && this.equipped.isDualPistol()) {
                const dual = this.equipped.getDualSprite(this.game);

                if (dual) {
                    this.hand.left.holding[this.equipped.info.idle.left?.vertical ?? "above"].addChild(dual);
                    this.hand.right.holding[this.equipped.info.idle.right?.vertical ?? "above"].addChild(sprite);
                }
            }
            else {
                this.holding.addChild(sprite);
            }
        }
        else if (this.equipped instanceof MeleeInstance) {
            const sprite = this.equipped.getSprite(this.game);

            if (sprite) {
                if (this.equipped.info.type == "singlehanded" && "side" in this.equipped.info) {
                    const side = this.equipped.info.side;
                    this.hand[side].holding[this.equipped.info.idle[side]?.vertical ?? "above"].addChild(sprite);
                }
                else {
                    this.holding.addChild(sprite);
                }
            }
        }

        this.hand.left.container.removeFromParent();
        this.level[this.equipped.info.idle.left?.vertical ?? "above"].addChild(this.hand.left.container);
        this.hand.left.container.visible = this.equipped.info.idle.left != null;

        this.hand.right.container.removeFromParent();
        this.level[this.equipped.info.idle.right?.vertical ?? "above"].addChild(this.hand.right.container);
        this.hand.right.container.visible = this.equipped.info.idle.right != null;
    }

    update(delta: number) {
        this._rotation = mod(this._rotation + Math.min(angleBetween(this._rotation, this.rotation), this.rotationSpeed * delta) * angleTo(this._rotation, this.rotation), 2 * Math.PI);

        if (Math.abs(angleBetween(this._rotation, this.rotation)) < 0.01) this._rotation = this.rotation;

        this.container.rotation = this._rotation;

        const update = this.actions.reduce((acc, action) => {
            const update = action.animate(this.game.app.ticker.lastTime);
            
            return { 
                left: acc.left || update.left,
                right: acc.right || update.right,
                holding: acc.holding || update.holding
            };
        }, { left: false, right: false, holding: false });

        this.actions = this.actions.filter(action => action.animations.length > 0);
        
        if (!update.left) {
            this.hand.left.container.position = lerpXY(this.hand.left.container.position, this.equipped?.info.idle.left?.position ?? { x: 0, y: 0 }, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.left.container.pivot.set(0, 0);
            this.hand.left.container.rotation = 0;
        }
        
        if (!update.right) {
            this.hand.right.container.position = lerpXY(this.hand.right.container.position, this.equipped?.info.idle.right?.position ?? { x: 0, y: 0 }, 1 - Math.pow(0.5, delta / 1.5));
            this.hand.right.container.pivot.set(0, 0);
            this.hand.right.container.rotation = 0;
        }

        if (!update.holding) {
            this.handBox.position.x = lerp(this.handBox.position.x, 0, 1 - Math.pow(0.5, delta / 1.5));
            this.handBox.position.y = lerp(this.handBox.position.y, 0, 1 - Math.pow(0.5, delta / 1.5));
            this.handBox.rotation = 0;
        }

        // Make sure the agent's hands are settled before allowing actions
        if (equalsXY(this.hand.left.container.position, this.equipped?.info.idle.left?.position ?? { x: 0, y: 0 }, 0.1) && equalsXY(this.hand.right.container.position, this.equipped?.info.idle.right?.position ?? { x: 0, y: 0 }, 0.1) && equalsXY(this.handBox.position, { x: 0, y: 0 }, 0.1)) {
            this.settled = true;
        }

        super.update(delta);
    }
}