import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic} from '@motion-canvas/core';
import {slideIn, arrowAppear} from '../presets/anims'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2'
    const PINK = 'fc3c96'

    const centerCircle = createRef<Circle>()
    const noAccelTxt = createRef<Txt>()
    const arrowCircle = createRef<Circle>()
    const wishvelArrow = createRef<Line>()

    view.add(<>
        <Circle ref={centerCircle}
            size={500}
            stroke={'white'}
            lineWidth={10}
            startAngle={-90}
            endAngle={-90}
            lineCap={'round'}
            opacity={0.6}
        />
        <Circle ref={arrowCircle}
            size={35}
            fill={'white'}
            scale={0}
        />
        <Line ref={wishvelArrow} endArrow
            stroke={PINK}
            lineWidth={15}
            arrowSize={30}
            points={[Vector2.zero, Vector2.down.scale(0)]}
            scale={0}
            zIndex={-1}
        />
        <Txt ref={noAccelTxt}
            text={'no acceleration'}
            fill={PINK}
            fontFamily={'JetBrains Mono'}
            fontWeight={600}
            y={() => -centerCircle().size().y / 2 - 70}
            opacity={0}
        />
    </>)

    const noAccelCircle = centerCircle().clone().stroke(PINK).opacity(1)
    view.add(noAccelCircle)

    yield* all(
        centerCircle().startAngle(-90-180, 1),
        centerCircle().endAngle(-90+180, 1),
    )

    yield* waitUntil('too far forward')
    yield* all(
        noAccelCircle.startAngle(-90-80, 1),
        noAccelCircle.endAngle(-90+80, 1),
        arrowCircle().scale(1, 0.5),
        arrowAppear(wishvelArrow(), 150, 1),
        wishvelArrow().rotation(-90, 0).to(0, 1),
    )
    yield* chain(
        wishvelArrow().rotation(60, 0.7),
        wishvelArrow().rotation(-30, 0.6),
        wishvelArrow().rotation(0, 0.5),
    )

    yield* waitUntil("don't accelerate")
    yield* slideIn(noAccelTxt(), 'down', 50, 0.5)

    yield* waitFor(10)
})
