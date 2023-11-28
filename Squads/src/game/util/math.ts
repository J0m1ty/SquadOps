export const map = (value: number, min1: number, max1: number, min2: number, max2: number) => {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
}

export const lerp = (a: number, b: number, t: number) => {
    return a + (b - a) * t;
}

export const angleBetween = (a: number, b: number) => {
    return Math.min((2 * Math.PI) - Math.abs(a - b), Math.abs(a - b));
}

export const angleTo = (current: number, target: number) => {
    const sin = Math.sin(target - current);

    return Math.abs(sin) / sin;
}