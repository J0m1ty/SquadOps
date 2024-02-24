export const map = (value: number, min1: number, max1: number, min2: number, max2: number) => {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const inverseLerp = (a: number, b: number, v: number) => (v - a) / (b - a);

export const lerpXY = (a: { x: number, y: number }, b: { x: number, y: number }, t: number) => {
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    };
}

export const inverseLerpXY = (a: { x: number, y: number }, b: { x: number, y: number }, v: { x: number, y: number }) => {
    return {
        x: inverseLerp(a.x, b.x, v.x),
        y: inverseLerp(a.y, b.y, v.y)
    };
}

export const equalsXY = (a: { x: number, y: number }, b: { x: number, y: number }, e: number = 0.001) => {
    return Math.abs(a.x - b.x) < e && Math.abs(a.y - b.y) < e;
}

export const mod = (a: number, n: number) => (a % n + n) % n;

export const angleBetween = (a: number, b: number) => Math.abs(mod( b - a + Math.PI, 2 * Math.PI) - Math.PI);

export const angleTo = (current: number, target: number) => {
    const sin = Math.sin(target - current);

    if (sin == 0) return 0;

    return Math.abs(sin) / sin;
}