import { makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect } from '@motion-canvas/2d';
import { createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, easeOutCubic, easeOutElastic } from '@motion-canvas/core';

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2'
    const PINK = 'fc3c96'

    const angle = createSignal(90)
    const wishdirScale = createSignal(0)
    const arcAngleSize = createSignal(120)
    const arcEndAngle = createSignal(0)

    const arrowGroup = createRef<Node>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const arcLengthComp = createRef<Circle>()
    const baseCircle = createRef<Circle>()
    const arcAngle = createRef<Circle>()
    const arcAngleGroup = createRef<Node>()
    const labelAngle = createRef<Txt>()

    view.add(<>
        <Node ref={arrowGroup} position={[0,350]} scale={2}>
            <Circle ref={baseCircle}
                fill={'white'}
                size={0}
                zIndex={0}
            />
            <Line ref={vecVel} endArrow
                stroke={MINT_GREEN}
                lineCap={'round'}
                lineWidth={15}
                arrowSize={30}
                points={() => [Vector2.zero, Vector2.zero]}
                zIndex={-1}
            />
            <Line ref={vecWishvel} endArrow
                stroke={PINK}
                lineCap={'round'}
                lineWidth={15}
                arrowSize={30}
                points={() => [Vector2.zero, Vector2.down.scale(wishdirScale())]}
                zIndex={-1}
                rotation={() => angle()}
            />
            <Circle ref={arcLengthComp}
                stroke={'white'}
                lineWidth={1}
                lineCap={'round'}
                startAngle={0 - 90}
                endAngle={0 - 90}
                size={800}
                zIndex={-2}
                lineDash={[2,4]}
            />
            <Node ref={arcAngleGroup} zIndex={-3}>
                <Node rotation={() => (arcEndAngle()+90)/2}>
                    <Txt ref={labelAngle}
                        text={'90°'}
                        fill={'white'}
                        fontFamily={'JetBrains Mono'}
                        fontWeight={600}
                        fontSize={70}
                        y={() => -arcAngleSize()*1.3}
                        rotation={() => -(arcEndAngle()+90)/2}
                        offset={Vector2.left}
                        opacity={0}
                    />
                </Node>
                <Circle ref={arcAngle}
                    stroke={'white'}
                    lineWidth={7}
                    lineCap={'round'}
                    startAngle={0}
                    endAngle={() => arcEndAngle()}
                    size={() => arcAngleSize() * 2}
                    zIndex={-2}
                />
            </Node>
        </Node>
    </>)

    yield* all(
        baseCircle().size(40, 0.3, easeOutCubic),
        vecVel().points([Vector2.zero, Vector2.down.scale(400)], 1),
        wishdirScale(120, 1),
    )

    yield* waitUntil("redirected")
    const vecVelGhost = vecVel().clone()
        .stroke('white')
        .opacity(0.5)
        .zIndex(-2)
    arrowGroup().add(vecVelGhost)
    yield* vecVel().points([Vector2.zero, [60,-400]], 1)

    yield* waitUntil("readjust")
    yield* angle(99, 1, easeOutElastic)

    yield* waitUntil("90 degrees")
    arcAngle().startAngle(angle() - 180)
    arcEndAngle(angle() - 180)
    yield* all(
        arcEndAngle(angle() - 90, 1),
        labelAngle().opacity(1, 1),
    )

    yield* waitFor(10)
})
