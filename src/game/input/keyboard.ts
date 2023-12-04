class Key {
    value: string;
    state = false;
    isDown = false;
    isUp = true;
    _press: (() => void)[] = [];
    _release: (() => void)[] = [];
    press = (f: () => void) => {
        this._press.push(f);
        return this;
    };
    release = (f: () => void) => {
        this._release.push(f);
        return this;
    };

    constructor(value: string) {
        this.value = value;
    }
}

export class Keyboard {
    keys: Key[];
    nDown: number;
    destroy: () => void;

    constructor() {
        this.keys = [];

        this.nDown = 0;

        const downListener = this.onDown.bind(this);
        const upListener = this.onUp.bind(this);

        window.addEventListener('keydown', downListener, false);
        window.addEventListener('keyup', upListener, false);

        this.destroy = () => {
            window.removeEventListener('keydown', downListener);
            window.removeEventListener('keyup', upListener);
        };
    }

    private onDown(e: KeyboardEvent) {
        const key = this.keys.find(k => k.value == e.key);
        
        if (key) {
            e.preventDefault();

            if (key.isUp) {
                key.state = !key.state;
                key._press.forEach(f => f());
                this.nDown++;
            }

            key.isDown = true;
            key.isUp = false;
        }
    }

    private onUp(e: KeyboardEvent) {
        const key = this.keys.find(k => k.value == e.key);
        
        if (key) {
            e.preventDefault();

            if (key.isDown) {
                key._release.forEach(f => f());
                this.nDown = Math.max(0, this.nDown - 1);
            }

            key.isDown = false;
            key.isUp = true;
        }
    }

    key = (value: string) => {
        const find = this.keys.find(k => k.value == value);

        if (find) return find;

        const key = new Key(value);

        this.keys.push(key);

        return key;
    }

    getKeys = (...values: string[]) => {
        return values.map(this.key);
    }
}