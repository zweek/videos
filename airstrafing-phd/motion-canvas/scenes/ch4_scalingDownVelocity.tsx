import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect} from '@motion-canvas/2d'
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInOutQuad} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut, arrowAppear} from '../presets/anims'
import {Colors} from '../presets/consts'

// overlay over gameplay
export default makeScene2D(function* (view) {
    const groupMain = createRef<Node>()
    const baseCircle = createRef<Circle>()
    const vecVel = createRef<Line>()
    const vecOpposite = createRef<Line>()
    const vecViewdir = createRef<Line>()

    const latexMultiply = createRef<Latex>()
    const latexAddOppositeVec = createRef<Latex>()

    view.add(<Node ref={groupMain} position={[-300,150]} rotation={10}>
        <Circle ref={baseCircle}
            fill={'white'}
            size={60}
            zIndex={1}
        />
        <Line ref={vecVel} endArrow
            stroke={Colors.MINT_GREEN}
            lineCap={'round'}
            lineWidth={30}
            arrowSize={60}
            points={[Vector2.zero, Vector2.zero]}
        />
        <Line ref={vecOpposite} endArrow
            stroke={Catppuccin.Colors.Peach}
            lineWidth={30}
            arrowSize={60}
            points={[Vector2.zero, Vector2.zero]}
        />
        <Line ref={vecViewdir} endArrow
            stroke={Colors.WHITE}
            lineWidth={30}
            arrowSize={50}
            lineDash={[0,100]}
            points={[Vector2.zero, Vector2.zero]}
            rotation={-10}
            shadowColor={'#00000099'}
            shadowBlur={50}
        />
    </Node>)

    yield* all(
        baseCircle().scale(0, 0).to(1, 1),
        arrowAppear(vecVel(), 500, 1),
    )

    yield* waitUntil("multiply by some value")
    const vecVelGhost = vecVel().clone().opacity(0.5).zIndex(-1)
    groupMain().add(vecVelGhost)
    view.add(
        <Latex ref={latexMultiply}
            tex="\color{#3cfca2}\vec{v}\color{white}\cdot0.6"
            height={80}
            x={200}
            opacity={0}
        />
    )
    yield* all(
        vecVel().points([Vector2.zero, Vector2.down.scale(300)], 1),
        slideIn(latexMultiply(), 'down', 50, 0.7),
    )

    yield* waitUntil("add impulse")
    view.add(
        <Latex ref={latexAddOppositeVec}
            tex="\color{#3cfca2}\vec{v}\color{white}+\color{#fab387}\vec{o}"
            height={80}
            x={200}
            opacity={0}
        />
    )
    yield* all(
        arrowAppear(vecOpposite(), 200, 1),
        vecOpposite().rotation(170, 1),
        slideOut(latexMultiply(), 'down', 200, 0.7),
        slideIn(latexAddOppositeVec(), 'down', 200, 0.7),
    )

    yield* waitUntil("look direction")
    yield* arrowAppear(vecViewdir(), 100, 1)

    yield* waitFor(10)
})
