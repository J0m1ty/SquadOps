import { Container } from "pixi.js";
import { Anchor, Dimention } from "./types";
import { UIManager } from "./uiManager";

export class UIComponent {
    manager: UIManager;

    parent?: UIComponent | Container | null;
    children: UIComponent[] = [];

    container: Container = new Container();

    size: 'static' | { w: Dimention, h: Dimention } | ((w: number, h: number) => { w: number, h: number }) = 'static';
    relativeTo: 'parent' | 'global' = 'parent';

    position: 'static' | 'relative' = 'relative';
    anchor: Anchor = { w: 0, h: 0 };
    offset: { x: number, y: number } = { x: 0, y: 0 };

    self: Anchor = { w: 0, h: 0 };
    
    get width() {
        return this.container.width;
    }

    get height() {
        return this.container.height;
    }

    get globalWidth() {
        return this.manager.game.width;
    }

    get globalHeight() {
        return this.manager.game.height;
    }

    get parentWidth() {
        return this.parent?.width ?? this.globalWidth;
    }

    get parentHeight() {
        return this.parent?.height ?? this.globalHeight;
    }

    get relativeWidth() {
        return this.relativeTo === 'parent' ? this.parentWidth : this.globalWidth;
    }

    get relativeHeight() {
        return this.relativeTo === 'parent' ? this.parentHeight : this.globalHeight;
    }
     
    constructor(manager: UIManager, parent: UIComponent | Container | null | undefined, options: {
        size?: 'static' | { w: Dimention, h: Dimention } | ((w: number, h: number) => { w: number, h: number }),
        relativeTo?: 'parent' | 'global',
        position?: 'relative' | { x: number, y: number },
        anchor?: Anchor,
        offset?: { x: number, y: number },
        self?: Anchor,
    } = {}) {
        this.manager = manager;
        this.parent = parent;

        this.size = options.size ?? this.size;
        this.relativeTo = options.relativeTo ?? this.relativeTo;
        this.position = options.position ? (options.position === 'relative' ? 'relative' : 'static') : this.position;
        this.anchor = options.anchor ?? this.anchor;
        this.offset = options.offset ?? this.offset;
        this.self = options.self ?? this.self;

        if (options.position != 'relative') {
            this.container.position.set(options.position?.x ?? 0, options.position?.y ?? 0);
        }

        if (parent instanceof Container) {
            parent.addChild(this.container);
        }
        else if (parent instanceof UIComponent) {
            parent.children.push(this);
        }
        else if (parent === null) {
            this.manager.game.layers.ui.addChild(this.container);
            manager.children.push(this);
        }
    }

    resize() {
        if (typeof this.size === 'function') {
            const { w, h } = this.size(this.relativeWidth, this.relativeHeight);
            this.container.width = w;
            this.container.height = h;
        }
        else if (this.size != 'static') {
            this.container.width = typeof this.size.w === 'number' ? this.size.w : this.relativeWidth * (parseInt(this.size.w) / 100);
            this.container.height = typeof this.size.h === 'number' ? this.size.h : this.relativeHeight * (parseInt(this.size.h) / 100);
        }

        if (this.position === 'relative') {
            this.container.x = this.relativeWidth * this.anchor.w + this.offset.x - this.container.width * this.self.w;
            this.container.y = this.relativeHeight * this.anchor.h + this.offset.y - this.container.height * this.self.h;
        }

        for (const child of this.children) {
            child.resize();
        }
    }

    destroy() {
        if (this.parent instanceof UIComponent) {
            this.parent.children.splice(this.parent.children.indexOf(this), 1);
        }
        else if (this.parent instanceof Container) {
            this.parent.removeChild(this.container);
        }
        else if (this.parent === null) {
            this.manager.children.splice(this.manager.children.indexOf(this), 1);
        }

        this.container.destroy({
            children: true,
            texture: true
        });

        for (const child of this.children) {
            child.destroy();
        }
    }
}