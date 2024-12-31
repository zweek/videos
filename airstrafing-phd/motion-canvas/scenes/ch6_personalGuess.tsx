import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect, Img} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInCubic, easeInOutQuad, easeOutElastic, linear} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut, scaleIn} from '../presets/anims'
import {degreesToRadians} from '../components/Utils'
import {Colors} from '../presets/consts'

export default makeScene2D(function* (view) {

    const vVel = createRef<Line>()
    const vWishdir = createRef<Line>()
    const dottedWishspeed = createRef<Line>()

    const velScale = createSignal(0)
    const wishdirScale = createSignal(0)

    view.add(<Node y={400}>
        <Line ref={vVel} x={-200}
            endArrow arrowSize={40}
            lineWidth={20} lineCap={'round'}
            stroke={Colors.MINT_GREEN} opacity={0}
            points={() => [[0,0], Vector2.down.scale(velScale())]}
        >
            <Latex
                tex={"\\color{#3cfca2}\\vec{v}"}
                height={100}
                y={() => -velScale() / 2}
                x={-80}
            />
        </Line>
        <Line ref={vWishdir} x={200}
            endArrow arrowSize={40}
            lineWidth={20} lineCap={'round'}
            stroke={Colors.PINK} opacity={0}
            points={() => [[0,0], Vector2.down.scale(wishdirScale())]}
        >
            <Latex
                tex={"\\color{#fc3c96}\\vec{w}"}
                height={100}
                y={() => -wishdirScale() / 2}
                x={80}
            />
        </Line>
        <Line ref={dottedWishspeed} y={-300}
            lineWidth={20} lineDash={[50,50]} lineCap={'round'}
            stroke={Colors.PINK} opacity={0} zIndex={-1}
            points={[[0,0],[0,0]]}
        >
            <Txt
                fontFamily={"JetBrains Mono"} fill={Colors.PINK}
                text={"wish_speed"}
                position={[520, 60]}
            />
        </Line>
    </Node>)

    yield* all(
        velScale(150, 1),
        vVel().opacity(1, 0.3),

        wishdirScale(300, 1),
        vWishdir().opacity(1, 0.3),

        dottedWishspeed().points([[-700,0],[700,0]], 1),
        dottedWishspeed().opacity(0.5, 0.3),
    )

    yield* waitUntil("scale")
    yield* all(
        velScale(800, 4),
        wishdirScale(() => Math.max(300, velScale()), 0)
    )

    yield* waitUntil("wishspeed constant")
    yield* dottedWishspeed().opacity(1, 0.5)
    yield* dottedWishspeed().opacity(0.5, 0.5)

    yield* waitFor(10)
})
