import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect, Img} from '@motion-canvas/2d'
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInOutQuad} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut, arrowAppear} from '../presets/anims'
import { Colors, SV_AirAccelerate_code_Q1, PM_Accelerate_code_Q2 } from '../presets/consts'
import padlockSVG from '../../images/padlockWhite.svg'

export default makeScene2D(function* (view) {

    const walkSpeedLabel = createRef<Txt>()
    const differenceLine = createRef<Line>()

    const walkSpeed = createSignal(0)
    const sprintSpeed = createSignal(190)
    const lineLength = createSignal(0)

    const padlock = createRef<Img>()
    

    view.add(<>
        <Txt ref={walkSpeedLabel}
            fontFamily={'JetBrains Mono'}
            fontWeight={600}
            scale={1.5}
            fill={'white'}
            text={() => `${parseInt(walkSpeed())}`}
            position={[-400,250]}
        />
        <Img ref={padlock} src={padlockSVG}
            size={150}
            position={[-220,231]}
            opacity={0}
        />
        <Line ref={differenceLine}
            points={() => [Vector2.zero, Vector2.down.scale(lineLength())]}
            lineWidth={15}
            stroke={'white'}
            lineCap={'round'}
            lineDash={[30, 50]}
            position={[walkSpeedLabel().x(), walkSpeedLabel().y() - 100]}
            opacity={0}
        />
    </>)

    yield* all(
        slideIn(walkSpeedLabel(), 'up', 200, 1),
        walkSpeed(190, 0.5)
    )

    yield* waitUntil("raises")

    const sprintSpeedLabel = walkSpeedLabel().clone()
        .text(() => `${parseInt(sprintSpeed())}`)
        .opacity(0)
    view.add(sprintSpeedLabel)

    yield* all(
        sprintSpeedLabel.position([-400,-250], 1.5),
        sprintSpeedLabel.opacity(1, 0.5),
        sprintSpeed(285, 1.5)
    )

    yield* waitUntil("does not touch")

    yield* slideIn(padlock(), 'down', 100, 1)

    yield* waitUntil("so even")

    yield* padlock().opacity(0, 0.5)

    yield* waitUntil("difference")

    yield* all(
        lineLength(330, 1),
        differenceLine().opacity(1, 0.3),
    )

    yield* waitFor(10)
})
