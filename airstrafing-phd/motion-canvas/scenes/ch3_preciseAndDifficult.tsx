import { makeScene2D, Circle, Txt, Line, Img, Node } from '@motion-canvas/2d'
import { all, sequence, chain, waitFor, waitUntil, createRef, createSignal, Vector2, easeOutCubic, easeOutElastic } from '@motion-canvas/core'
import { Colors } from '../presets/consts'
import quakeguy from '../../images/quakeguy_topDown.png'
import { slideIn, arrowAppear } from '../presets/anims'

export default makeScene2D(function* (view) {

    const imgQuakeguy = createRef<Img>()
    const vecVel = createRef<Line>()
    const arrowGroup = createRef<Node>()
    const dottedPerpendicular = createRef<Line>()
    const txt90Degrees = createRef<Txt>()
    const arcAngle = createRef<Circle>()
    const txtTurnExactly = createRef<Txt>()
    const txtIdiotHuman = createRef<Txt>()

    view.add(<>
        <Node ref={arrowGroup} y={200}>
            <Img src={quakeguy} ref={imgQuakeguy}
                scale={0}
                rotation={90}
            />
            <Line ref={vecVel} endArrow
                stroke={Colors.MINT_GREEN}
                lineWidth={20}
                arrowSize={40}
                points={[[0,0], [0,0]]}
                scale={0}
                zIndex={-1}
            />
            <Line ref={dottedPerpendicular}
                lineWidth={10}
                lineDash={[30, 30]}
                lineCap={'round'}
                stroke={'white'}
                opacity={0}
                points={[[0,0], [0,0]]}
                zIndex={-1}
            >
                <Txt ref={txt90Degrees}
                    fill={'white'}
                    fontFamily={'JetBrains Mono'}
                    fontWeight={600}
                    text={'90°'}
                    x={() => -dottedPerpendicular().size().x/2 - 70}
                    scale={1.2}
                    rotation={() => -dottedPerpendicular().rotation()}
                />
            </Line>
            <Circle ref={arcAngle}
                size={220*2}
                startAngle={-5}
                endAngle={-5}
                lineCap={'round'}
                stroke={'white'}
                lineWidth={5}
            />
            <Txt ref={txtTurnExactly}
                fill={'white'}
                fontFamily={'JetBrains Mono'}
                text={'turn EXACTLY\n8.451 degrees'}
                position={[250, -50]}
                offset={Vector2.left}
                opacity={0}
            />
            <Txt ref={txtIdiotHuman}
                fill={'white'}
                fontFamily={'JetBrains Mono'}
                textAlign={'center'}
                text={'idiot human only turned\n8.449 degrees'}
                scale={0.1}
                position={[210, 50]}
                opacity={0}
            />
        </Node>
    </>)
    const vecWishdir = vecVel().clone()
        .stroke(Colors.PINK)
        .rotation(90)
    arrowGroup().add(vecWishdir)

    yield* all(
        imgQuakeguy().scale(0.3, 0.7, easeOutCubic),
        imgQuakeguy().rotation(0, 0.7, easeOutCubic),
        arrowAppear(vecVel(), 550, 1),
        arrowAppear(vecWishdir, 220, 1),
        dottedPerpendicular().opacity(0.7, 0.5),
        dottedPerpendicular().points([Vector2.left.scale(500), Vector2.right.scale(500)], 1),
    )

    yield* waitUntil("really precise")
    yield* all(
        vecVel().points([Vector2.zero, [80,-550]], 1),
        dottedPerpendicular().rotation(8, 1),
    )

    yield* waitUntil("turning")
    yield* all(
        arcAngle().endAngle(8+5, 0.6),
        slideIn(txtTurnExactly(), 'left', 50, 0.6)
    )

    yield* waitUntil("exactly")
    yield* all(
        imgQuakeguy().rotation(8, 0.7, easeOutCubic),
        vecWishdir.rotation(97.5, 0.7, easeOutCubic),
    )

    yield* all (
        txtTurnExactly().opacity(0, 1),
        arcAngle().startAngle(8+5, 1),
    )

    yield* waitUntil("exacy 90 degrees")
    yield* txt90Degrees().fill(Colors.MINT_GREEN, 0.3)

    yield* waitUntil("IS very precise")
    yield* all(
        arrowGroup().scale(15, 3),
        arrowGroup().position([-3100,-500], 3),
        dottedPerpendicular().lineWidth(2, 2),
        vecWishdir.lineWidth(3, 2),
        vecWishdir.arrowSize(6, 2),
        chain(
            waitFor(2),
            slideIn(txtIdiotHuman(), 'up', 5, 0.7)
        )
    )

    yield* waitFor(10)
})
