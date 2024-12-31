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
    const velScale = createSignal(0)
    const wishdirScale = createSignal(0)

    view.add(<Node y={200}>
        <Line ref={vVel}
            endArrow arrowSize={40}
            lineWidth={20} lineCap={'round'}
            stroke={Colors.MINT_GREEN}
            points={() => [[0,0], Vector2.down.scale(velScale())]} opacity={0}
            rotation={20}
        >
            <Latex
                tex={"\\color{#3cfca2}\\vec{v}"}
                height={100}
                rotation={-20}
                y={() => -velScale() / 2}
                x={-80}
            />
            <Line ref={vWishdir} x={60}
                endArrow arrowSize={40}
                lineWidth={20} lineCap={'round'}
                stroke={Colors.PINK}
                points={() => [[0,0], Vector2.down.scale(wishdirScale())]}
            >
                <Latex
                    tex={"\\color{#fc3c96}\\vec{w}"}
                    height={100}
                    rotation={-20}
                    y={() => -wishdirScale() / 2}
                    x={80}
                />
            </Line>
        </Line>
    </Node>)

    yield* all(
        velScale(600, 1),
        wishdirScale(200, 1),
        vVel().opacity(1, 0.3),
    )

    yield* waitUntil("slow you down")
    yield* velScale(200, 1.5)

    yield* waitFor(10)
})
