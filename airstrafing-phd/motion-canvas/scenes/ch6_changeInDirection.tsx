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
    const velScale = createSignal(700)
    const groupArrows = createRef<Node>()

    view.add(<Node ref={groupArrows} y={350}>
        <Line ref={vVel}
            endArrow arrowSize={40}
            lineWidth={20} lineCap={'round'}
            stroke={Colors.MINT_GREEN}
            points={() => [[0,0], Vector2.down.scale(velScale())]}
        >
            <Latex
                tex={"\\color{#3cfca2}\\vec{v}"}
                height={100}
                rotation={() => -vVel().rotation()}
                y={() => -velScale() / 2}
                x={-80}
            />
        </Line>
        <Line ref={vWishdir}
            endArrow arrowSize={40}
            lineWidth={20} lineCap={'round'}
            stroke={Colors.PINK}
            points={() => [[0,0], Vector2.down.scale(velScale())]}
        >
            <Latex
                tex={"\\color{#fc3c96}\\vec{w}"}
                height={100}
                rotation={() => -vWishdir().rotation()}
                y={() => -velScale() / 2}
                x={80}
            />
        </Line>
    </Node>)

    yield* all(
        vWishdir().rotation(70, 3),
        groupArrows().x(-200, 3),
    )

    yield* waitUntil("move")

    const vToW = createRef<Line>()
    groupArrows().add(<Line ref={vToW}
        endArrow arrowSize={40}
        lineWidth={20} lineCap={'round'}
        stroke={'grey'}
        position={vVel().points()[1]}
        zIndex={-1}
    />)
    const xw = () => vWishdir().arcLength() * Math.sin(degreesToRadians(vWishdir().rotation())) - vVel().points()[1].x
    const yw = () => vWishdir().arcLength() * -Math.cos(degreesToRadians(vWishdir().rotation())) - vVel().points()[1].y
    yield* vToW().points(() => [[0,0], [xw(), yw()]], 1)

    yield* waitUntil("single frame")

    const vToWClipped = vToW().clone().lineDash([20,50]).zIndex(-2)
    groupArrows().add(vToWClipped)

    yield* vToW().points( () => [[0,0], [
        xw() / vToWClipped.arcLength() * Math.min(200, Vector2.magnitude(xw(), yw())),
        yw() / vToWClipped.arcLength() * Math.min(200, Vector2.magnitude(xw(), yw()))
    ]], 1),

    yield* waitUntil("always")
    const vVelClone = vVel().clone().zIndex(-1)
    groupArrows().add(vVelClone)
    yield* all(
        vVel().opacity(0.5, 0),
        vVelClone.points( () =>[[0,0], new Vector2(vVel().points()[1]).add(vToW().points()[1])], 1),
    )

    yield* waitUntil("function tries")
    const circ = createRef<Circle>()
    const lineSpeedloss = createRef<Line>()

    const arcPoint = [
        vVelClone.parsedPoints()[1].x / vVelClone.arcLength() * velScale(),
        vVelClone.parsedPoints()[1].y / vVelClone.arcLength() * velScale()
    ]

    groupArrows().add(<>
        <Circle ref={circ}
            lineWidth={8} lineCap={'round'}
            size={velScale()*2}
            stroke={'white'}
            startAngle={-90} endAngle={-90}
            opacity={0}
        />
        <Line ref={lineSpeedloss}
            lineWidth={10} lineCap={'round'}
            stroke={'red'}
            points={[vVelClone.points()[1]]}
            zIndex={-1}
            opacity={0}
        />
    </>)

    yield* all(
        groupArrows().scale(2.5, 2),
        groupArrows().position([-300, 1500], 2),
    )

    yield* waitUntil("straight line")
    yield* vToW().stroke("white", 0.5)
    yield* vToW().stroke("grey", 0.5)

    yield* waitUntil("curve")
    yield* sequence(0.1,
        all(
            circ().endAngle(-90 + 25, 1),
            circ().opacity(1, 0.2),
        ),
        all(
            lineSpeedloss().points([vVelClone.points()[1], arcPoint], 1),
            lineSpeedloss().opacity(1, 0.2),
        ),
    )

    yield* waitUntil("the only")
    yield* sequence(0.7,
        all(
            circ().endAngle(-90, 1),
            lineSpeedloss().points([vVelClone.points()[1]], 1),
            groupArrows().scale(1, 2),
            groupArrows().position([-200, 350], 2),
        ),
        all(
            circ().opacity(0, 0.3),
            lineSpeedloss().opacity(0, 0.3),
        ),
    )

    yield* waitUntil("push vector")
    yield* all(
        vWishdir().rotation(15, 3),
        vVelClone.opacity(0, 3),
    )

    yield* waitFor(10)
})
