import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect} from '@motion-canvas/2d'
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInOutQuad} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut, arrowAppear} from '../presets/anims'
import {Colors} from '../presets/consts'

export default makeScene2D(function* (view) {
    const angle = createSignal(90)

    const groupMain = createRef<Node>()
    const baseCircle = createRef<Circle>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const vecAddvel = createRef<Line>()

    view.add(<Node ref={groupMain} y={350}> 
        <Circle ref={baseCircle}
            fill={'white'}
            size={60}
            zIndex={0}
        />
        <Line ref={vecVel} endArrow
            stroke={Colors.MINT_GREEN}
            lineCap={'round'}
            lineWidth={30}
            arrowSize={60}
            points={() => [Vector2.zero, Vector2.down.scale(600)]}
            zIndex={-1}
        />
        <Line ref={vecAddvel} endArrow
            position={() => vecVel().parsedPoints()[1]}
            stroke={Colors.WHITE}
            lineCap={'round'}
            lineWidth={25}
            arrowSize={50}
            points={() => [Vector2.zero, Vector2.zero]}
            rotation={() => angle()}
        />
        <Line ref={vecWishvel} endArrow
            stroke={Colors.PINK}
            lineCap={'round'}
            lineWidth={30}
            arrowSize={60}
            points={() => [Vector2.zero, Vector2.down.scale(200)]}
            zIndex={-1}
            rotation={() => angle()}
        />
    </Node>)

    yield* arrowAppear(vecAddvel(), 150, 1);

    yield* waitUntil("constant 30")
    const labelThirty = createRef<Txt>()
    groupMain().add(<Txt ref={labelThirty}
        text={"30"}
        fontFamily={"JetBrains Mono"}
        fontSize={60}
        fontWeight={600}
        fill={Catppuccin.Colors.Peach}
        position={[vecAddvel().position().x - vecAddvel().parsedPoints()[1].y/2 - vecAddvel().arrowSize()/2, vecAddvel().position().y - 60]} // yuck!
        opacity={0}
    />)
    yield* slideIn(labelThirty(), 'down', 50, 0.6)

    yield* waitUntil("but that doesn't mean")
    const vecVelClone = vecVel().clone()
    groupMain().add(vecVelClone)
    vecVel().stroke('white').opacity(0.5).zIndex(-2)
    yield* vecVelClone.points([Vector2.zero, [-vecAddvel().parsedPoints()[1].y,vecVel().parsedPoints()[1].y]], 1)

    yield* waitUntil("gain 30 units")
    const labelPlusThirty = labelThirty().clone()
        .text("+30")
        .fill(Colors.MINT_GREEN)
        .position([vecAddvel().position().x + 230, vecAddvel().position().y + 150])
        .opacity(0)
    groupMain().add(labelPlusThirty)
    yield* slideIn(labelPlusThirty, 'up', 50, 0.6)

    yield* waitUntil("actual speedgain")
    yield* all(
        vecWishvel().points([Vector2.zero, Vector2.zero], 1),
        vecAddvel().points([Vector2.zero, Vector2.zero], 1),
        vecAddvel().scale(0, 1),
        slideOut(labelThirty(), 'up', 50, 1),
        slideOut(labelPlusThirty, 'down', 50, 1),
        groupMain().scale(1.2, 1),
        groupMain().x(-600, 1),
    )

    yield* waitUntil("figure out")
    const dottedLinesFade = createSignal(0)
    const dottedLineX = createRef<Line>()
    const labelDottedLineX = createRef<Txt>()
    groupMain().add(<>
        <Line ref={dottedLineX}
            stroke={'red'}
            opacity={0.5}
            lineCap={'round'}
            lineWidth={15}
            lineDash={[10, 30]}
            points={() => [Vector2.zero, Vector2.right.scale(150 * dottedLinesFade())]}
            zIndex={-2}
        >
            <Txt
                text={"30"}
                fontSize={60}
                fontWeight={600}
                fontFamily={"JetBrains Mono"}
                fill={'red'}
                x={() => dottedLinesFade() * 150/2}
                y={60}
            />
        </Line>
    </>)

    const dottedLineY = dottedLineX().clone()
        .points(() => [Vector2.zero, Vector2.up.scale(600 * dottedLinesFade())])
        .position(vecVelClone.parsedPoints()[1])
        .stroke('green')
    dottedLineY.children()[0]
        .text("140")
        .fill('green')
        .x(90)
        .y(() => dottedLinesFade() * 600/2)
    groupMain().add(dottedLineY)
    yield* all(
        dottedLinesFade(1, 1),
        dottedLineX().children()[0].opacity(0,0).to(1,1),
        dottedLineY.children()[0].opacity(0,0).to(1,1),
    )

    yield* waitUntil("pythagoras")
    const latexPythagoras = createRef<Latex>()
    view.add(<Latex ref={latexPythagoras}
        tex="\color{white}|\vec{v'}| = \sqrt{30^2 + 140^2} \approx 143.178"
        height={100}
        position={[400, -100]}
    />)
    latexPythagoras().add(latexPythagoras().clone()
        .tex("\\color{white}143.178 - 140 = +3.178")
        .height(55)
        .y(140)
        .x(0)
        .opacity(0)
    )
    yield* slideIn(latexPythagoras(), 'up', 100, 1),
    yield* waitUntil("difference")
    yield* slideIn(latexPythagoras().children()[0], 'up', 100, 1),

    yield* waitFor(10)
})
