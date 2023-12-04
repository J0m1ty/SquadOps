export class Vector {
    static epsilon = 0.00001;

    static add = (a: { x: number, y: number }, b: { x: number, y: number }) => ({ x: a.x + b.x, y: a.y + b.y });

    static subtract = (a: { x: number, y: number }, b: { x: number, y: number }) => ({ x: a.x - b.x, y: a.y - b.y });

    static mult = (a: { x: number, y: number }, b: number) => ({ x: a.x * b, y: a.y * b });

    static dot = (a: { x: number, y: number }, b: { x: number, y: number }) => a.x * b.x + a.y * b.y;

    static distance = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    static magnitude = ({ x, y }: { x: number, y: number }) => Vector.distance({ x, y }, { x: 0, y: 0 });

    static normalize = ({ x, y }: { x: number, y: number }, range = 1) => {
        const magnitude = Vector.magnitude({ x, y });
        return { x: x * range / magnitude, y: y * range / magnitude };
    }

    static rotate = ({ x, y }: { x: number, y: number }, angle: number) => {
        const direction = Math.atan2(y, x);
        const magnitude = Vector.magnitude({ x, y });
        return { x: Math.cos(direction + angle) * magnitude, y: Math.sin(direction + angle) * magnitude };
    }
}