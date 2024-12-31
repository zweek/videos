import { Node, Line } from '@motion-canvas/2d'
import { Vector2, ThreadGenerator, all, chain, easeOutCubic, easeInCubic, map } from '@motion-canvas/core'

export function* slideIn(node: Node, direction: String, distance: float, time: float): ThreadGenerator
{
    switch(direction)
    {
        case 'down':
            yield* all(
                node.y(node.position.y() - distance, 0).to(node.position.y(), time, easeOutCubic),
                node.opacity(0, 0).to(1, time / 2),
            )
            break
        case 'up':
            yield* all(
                node.y(node.position.y() + distance, 0).to(node.position.y(), time, easeOutCubic),
                node.opacity(0, 0).to(1, time / 2),
            )
            break
        case 'right':
            yield* all(
                node.x(node.position.x() - distance, 0).to(node.position.x(), time, easeOutCubic),
                node.opacity(0, 0).to(1, time / 2),
            )
            break
        case 'left':
            yield* all(
                node.x(node.position.x() + distance, 0).to(node.position.x(), time, easeOutCubic),
                node.opacity(0, 0).to(1, time / 2),
            )
            break
    }

}

export function* slideOut(node: Node, direction: String, distance: float, time: float): ThreadGenerator
{
    switch(direction)
    {
        case 'down':
            yield* all(
                node.y(node.position.y() + distance, time),
                node.opacity(0, time / 2),
            )
            node.y(node.position.y() - distance)
            break
        case 'up':
            yield* all(
                node.y(node.position.y() - distance, time),
                node.opacity(0, time / 2),
            )
            node.y(node.position.y() + distance)
            break
        case 'right':
            yield* all(
                node.x(node.position.x() + distance, time),
                node.opacity(0, time / 2),
            )
            node.x(node.position.x() - distance)
            break
        case 'left':
            yield* all(
                node.x(node.position.x() - distance, time),
                node.opacity(0, time / 2),
            )
            node.x(node.position.x() + distance)
            break
    }

}

export function* scaleIn(node: Node, scale: float, time: float): ThreadGenerator
{

        yield* all(
            node.scale(scale, time, easeOutCubic),
            node.opacity(1, time / 2),
        )
}

export function* arrowAppear(arrow: Line, scale: float, time: float): ThreadGenerator
{
    yield* all(
        arrow.points([Vector2.zero, Vector2.down.scale(scale)], time),
        arrow.scale(0, 0).to(1, time * 0.5),
    )
}

export function wiggleSine(value, from = 0, to = 1) {
    value = Math.sin(2.4637 * Math.PI * value) / (Math.PI * (value + 1/Math.PI)) - 0.2399 * value
    return map(from, to, value)
}
