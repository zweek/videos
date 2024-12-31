export function degreesToRadians(x: number): number
{
    return x * (Math.PI/180)
}

export function DotProduct(v1: Vector2, v2: Vector2): number
{
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z
}

export function Clamp(val: number, min: number, max: number): number
{
    return Math.min(Math.max(val, min), max)
}
