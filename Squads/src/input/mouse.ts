export class Mouse {
    destroy: () => void;

    constructor() {
        const scrollListener = (e: WheelEvent) => {
            e.preventDefault();
            this._scroll(e.deltaY == 0 ? 0 : (e.deltaY > 0 ? 1 : -1));
        };
        
        window.addEventListener('wheel', scrollListener);

        this.destroy = () => {
            window.removeEventListener('wheel', scrollListener);
        };
    }

    private _scroll = (deltaY: number) => {};

    scroll = (f: (deltaY: number) => void) => {
        this._scroll = f;
        return this;
    }
}