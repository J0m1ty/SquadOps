import { Body, Query } from "matter-js"
import { Vector } from "./vector";

export type Collision = {
    body: Body,
    point: { x: number, y: number },
    normal: { x: number, y: number }
}

export const bodyEdges = (body: Body) => {
    const edges: { start: { x: number, y: number }, end: { x: number, y: number } }[] = [];

    for (let i = body.parts.length - 1; i >= 0; i--) {
        for (let k = body.parts[i].vertices.length - 1; k >= 0; k--) {
            let k2 = k + 1;
            if (k2 >= body.parts[i].vertices.length) k2 = 0;
            
            edges.push({ start: body.parts[i].vertices[k], end: body.parts[i].vertices[k2] });
        }
    }

    return edges;
}

export const intersect = (
    { start: a, end: b }: { start: { x: number, y: number }, end: { x: number, y: number } }, 
    { start: c, end: d }: { start: { x: number, y: number }, end: { x: number, y: number } }
) => {
    let s1_x = b.x - a.x, s1_y = b.y - a.y, s2_x = d.x - c.x, s2_y = d.y - c.y;

    const s = (-s1_y * (a.x - c.x) + s1_x * (a.y - c.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = ( s2_x * (a.y - c.y) - s2_y * (a.x - c.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        return { x: a.x + (t * s1_x), y: a.y + (t * s1_y) };
    }

    return null;
}

export const raycast = (bodies: Body[], start: { x: number, y: number }, end: { x: number, y: number }) => {
    const query = Query.ray(bodies, start, end);

    const out: Collision[] = [];

    const register = (body: Body, point: { x: number, y: number }, normal: { x: number, y: number }) => {
        out.push({ body, point, normal });
    }
    
    for (let i = 0; i < query.length; i++) {
        const body = query[i].bodyA;

        if (body.circleRadius) {
            const E = start;
            const L = end;
            const C = body.position;
            const r = body.circleRadius;

            const d = Vector.subtract(L, E);
            const f = Vector.subtract(E, C);

            const a = Vector.dot(d, d);
            const b = 2 * Vector.dot(f, d);
            const c = Vector.dot(f, f) - r * r;

            let discriminant = b * b - 4 * a * c;
            if (discriminant < 0) continue;
            else {
                discriminant = Math.sqrt(discriminant);
                
                const t1 = (-b - discriminant) / (2 * a);
                const t2 = (-b + discriminant) / (2 * a);

                if (t1 >= 0 && t1 <= 1) {
                    register(body, Vector.add(E, Vector.mult(d, t1)), Vector.normalize(Vector.subtract(Vector.add(E, Vector.mult(d, t1)), C)));
                }

                if (t2 >= 0 && t2 <= 1) {
                    register(body, Vector.add(E, Vector.mult(d, t2)), Vector.normalize(Vector.subtract(Vector.add(E, Vector.mult(d, t2)), C)));
                }
            }
        }
        else {
            const edges = bodyEdges(body);

            for (let i = 0; i < edges.length; i++) {
                const intersection = intersect({ start, end }, edges[i]);
                if (intersection) {
                    const normal1 = Vector.rotate(Vector.normalize(Vector.subtract(edges[i].end, edges[i].start)), Math.PI / 2);
                    const normal2 = Vector.rotate(Vector.normalize(Vector.subtract(edges[i].end, edges[i].start)), - Math.PI / 2);

                    const normal = Vector.distance(Vector.add(end, normal1), intersection) < Vector.distance(Vector.add(end, normal2), intersection) ? normal1 : normal2;

                    register(body, intersection, normal);
                }
            }
        }
    }

    return out.length == 0 ? [] : out.sort((a, b) => Vector.distance(start, a.point) - Vector.distance(start, b.point));
}
