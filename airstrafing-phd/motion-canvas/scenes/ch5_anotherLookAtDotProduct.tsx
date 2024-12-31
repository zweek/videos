import { createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInCubic, easeInOutQuad } from '@motion-canvas/core';
import { makeScene2D, Circle, Line, Node, Txt, Grid, Rect, Latex } from '@motion-canvas/2d'
import { CodeBlock, lines, word, range, insert, remove, edit } from '@motion-canvas/2d/lib/components/CodeBlock'

import { Catppuccin } from '../theme/catppuccin'
import { slideIn, slideOut, arrowAppear, wiggleSine } from '../presets/anims'
import { degreesToRadians, DotProduct, Clamp } from '../components/Utils'
import { Key, WASDKeys } from '../components/Key'
import { Arrow } from '../components/Arrow'
import { Colors, SV_AirAccelerate_code_Q1, PM_Accelerate_code_Q2 } from '../presets/consts'

export default makeScene2D(function* (view) {

    const groupArrows = createRef<Node>()
    const vecVel = createRef<Arrow>()
    const vecWishvel = createRef<Arrow>()
    const baseCircle = createRef<Circle>()

    const latexV = createRef<Latex>()
    const latexW = createRef<Latex>()

    const rectSlider = createRef<Rect>()
    const circSlider = createRef<Circle>()
    const labelDotProduct = createRef<Txt>()
    
    const vel = 600

    view.add(<>
        <Node ref={groupArrows}
            position={[0, 200]}
            scale={3}
        >
            <Arrow ref={vecVel}
                color={Colors.MINT_GREEN}
            />
            <Arrow ref={vecWishvel}
                color={Colors.PINK}
            />
            <Circle ref={baseCircle}
                fill={'white'}
            />
        </Node>
        <Rect ref={rectSlider}
            size={[50, 600]}
            radius={50}
            fill={Catppuccin.Colors.Base}
            position={[0, 20]}
            opacity={0}
        >
            <Latex
                y={-400}
                tex="\color{#3cfca2}\vec{v} \color{#ffffff}\cdot \color{#fc3c96}\hat{w}"
                scale={5}
            />
            <Circle ref={circSlider}
                y={() => -Math.cos(degreesToRadians(vecWishvel().rotation())) * (rectSlider().size().y/2 - 40/2 - 5)}
                size={40}
                fill={'white'}
            />
            <Txt ref={labelDotProduct}
                fontFamily={"JetBrains Mono"}
                text={() => Math.round(Math.cos(degreesToRadians(vecWishvel().rotation())) * vel).toString()}
                fill={'white'}
                offset={Vector2.left}
                x={60}
                y={() => circSlider().y()}
                opacity={0}
            />
        </Rect>
    </>)

    yield* all(
        vecVel().length(500, 1),
        vecWishvel().length(100, 1),
        baseCircle().size(30, 1, easeOutCubic),
    )

    yield* waitUntil("returns")
    yield* all(
        rectSlider().opacity(1, 1),
        rectSlider().position([300, 20], 1, easeOutCubic),
        groupArrows().position([-300, 200], 1),
    )

    yield* waitUntil("length")
    yield* slideIn(labelDotProduct(), 'right', 50, 1)

    yield* waitUntil("zero")
    yield* vecWishvel().rotation(90, 2)

    yield* waitUntil("subtracting")
    const equation = createRef<Node>()
    const equationDot = createRef<Txt>()
    const equationWishSpeed = createRef<Txt>()
    const equationResult = createRef<Txt>()
    rectSlider().add(<Node ref={equation} scale={1.2}>
        <Txt ref={equationWishSpeed}
            fontFamily={"JetBrains Mono"}
            text={`300 -`}
            fill={'white'}
            opacity={0}
        />
        <Txt ref={equationDot}
            fontFamily={"JetBrains Mono"}
            text={() => Math.round(Math.cos(degreesToRadians(vecWishvel().rotation())) * vel).toString()}
            fill={Colors.MINT_GREEN}
            x={160}
            opacity={0}
        />
        <Txt ref={equationResult}
            fontFamily={"JetBrains Mono"}
            text={() => `= ${(300 - parseInt(equationDot().text())).toString()}`}
            fill={'white'}
            x={260}
            opacity={0}
            offset={Vector2.left}
        />
    </Node>)
    yield* all(
        rectSlider().x(-100, 1),
        groupArrows().x(-600, 1),
        equation().x(350, 1),
        equation().y(-100, 1),
        equationDot().opacity(1, 1),
    )

    yield* waitUntil("from wishspeed")
    yield* all(
        slideIn(equationWishSpeed(), 'right', 100, 0.5),
        slideIn(equationResult(), 'left', 100, 0.5),
        equationDot().fill('white', 0.5),
        equationWishSpeed().fill(Colors.MINT_GREEN, 0.5),
    )

    yield* waitUntil("any value")
    yield* all(
        equationWishSpeed().fill('white', 0.5),
        equationResult().fill(Colors.MINT_GREEN, 0.5),
        vecWishvel().rotation(61, 1)
    )

    yield* waitUntil("above 5")
    const equationComp = equationResult().clone()
        .text('< 5')
        .x(380)
        .opacity(0)
    equation().add(equationComp)
    yield* all(
        equationResult().fill('white', 0.5),
        slideIn(equationComp, 'left', 100, 0.5),
    )

    yield* waitUntil("clipped")
    const equationAccelSpeed = createRef<Txt>()
    equation().add(<Txt ref={equationAccelSpeed}
        fontFamily={"JetBrains Mono"}
        text={() => `accel_speed = ${Clamp(300 - parseInt(equationDot().text()), 0, 5)}`}
        fill={'white'}
        y={100}
        x={-70}
        opacity={0}
        offset={Vector2.left}
    />)
    yield* all(
        slideIn(equationAccelSpeed(), 'down', 100, 0.5),
        equationComp.fill('white', 0.5),
        equationAccelSpeed().fill(Colors.MINT_GREEN, 0.5),
    )

    yield* waitUntil("pointed forward enough")
    yield* all(
        vecWishvel().rotation(60.5, 2),
        equationComp.opacity(0, 1),
    )

    yield* waitUntil("final accelspeed smaller")
    yield* vecWishvel().rotation(60, 2)

    yield* waitUntil("anywhere else")
    yield* vecWishvel().rotation(150, 3)

    yield* waitUntil("best thing")
    yield* vecWishvel().rotation(60.5, 3)

    yield* waitFor(10)
})
