import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInOutQuad, easeOutElastic} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut} from '../presets/anims'
import {Colors} from '../presets/consts'
import {Key, WASDKeys} from '../components/Key'

export default makeScene2D(function* (view) {

    const groupArrows = createRef<Node>()
    const groupAccelGraph = createRef<Node>()

    const velocity = new Vector2(0,320)

    const groupArrowsInner = createRef<Node>()
    const maskArrows = createRef<Rect>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const optimalAngleLine = createRef<Line>()

    const wasd = createRef<WASDKeys>()

    const angle = createSignal(90)

    view.add(<>
        <Node cache ref={groupArrows}>
            <Rect ref={maskArrows}
                fill={'white'}
                width={1920/2}
                height={1080}
                x={-1920/4}
            />
            <Node ref={groupArrowsInner}
                scale={3}
                compositeOperation={'source-in'}
                position={[-500,350]}
            >
                <Grid // base grid
                    width={"200%"} height={"200%"}
                    scale={0.5}
                    stroke={'white'}
                    opacity={0.5}
                    zIndex={-2}
                />
                <Grid // 0-lines
                    width={"100%"} height={"100%"}
                    scale={10}
                    lineWidth={0.2}
                    stroke={'white'}
                    zIndex={-2}
                />
                <Circle
                    fill={'white'}
                    size={30}
                    zIndex={0}
                />
                <Line ref={vecVel} endArrow
                    stroke={Colors.MINT_GREEN}
                    lineCap={'round'}
                    lineWidth={15}
                    arrowSize={30}
                    points={() => [Vector2.zero, Vector2.down.scale(400)]}
                    zIndex={-1}
                />
                <Line ref={vecWishvel} endArrow
                    stroke={Colors.PINK}
                    lineCap={'round'}
                    lineWidth={15}
                    arrowSize={30}
                    points={() => [Vector2.zero, Vector2.down.scale(120)]}
                    zIndex={-1}
                    rotation={() => angle()}
                />
                <Line endArrow
                    stroke={'white'}
                    lineWidth={0}
                    arrowSize={30}
                    points={() => [Vector2.zero, Vector2.down.scale(50)]}
                    zIndex={-1}
                    rotation={() => angle()-90}
                />
                <Line ref={optimalAngleLine}
                    points={[[-200,0], [0,0], [200,0]]}
                    stroke={Catppuccin.Colors.Sapphire}
                    lineWidth={0}
                    zIndex={-2}
                />
            </Node>
        </Node>
        <WASDKeys ref={wasd}
            direction={'r'}
            position={[500,0]}
            scale={1.3}
        />
    </>)
    maskArrows().filters.blur(50)

    yield* waitUntil("optimal angle")
    yield* optimalAngleLine().lineWidth(4, 1, easeOutElastic)

    yield* waitUntil("farther forward")
    yield* optimalAngleLine().points([[-200,-30], [0,0], [200,-30]], 1)

    yield* waitUntil("adjust our inputs")
    yield* all(
        wasd().direction('ur', 0),
        vecWishvel().rotation(() => angle()-45, 0.3, easeOutCubic),
        angle(130, 3),
    )
    yield* angle(126.2, 2),

    yield* waitUntil("find mirrored")
    yield* sequence(0.7,
        angle(53.6, 2),
        all(
            wasd().direction('ul', 0),
            vecWishvel().rotation(() => angle()-135, 0.3, easeOutCubic),
        ),
    )

    yield* waitUntil("required angle change")
    yield* all(
        wasd().direction('l', 0),
        angle(90, 1),
        vecWishvel().rotation(-90, 1),
    )
    yield* waitUntil("180 degree flip")
    yield* all(
        wasd().direction('r', 0),
        vecWishvel().rotation(90, 0.5, easeOutCubic),
    )
    yield* waitFor(1)
    yield* all(
        wasd().direction('l', 0),
        vecWishvel().rotation(-90, 0.5, easeOutCubic),
    )

    yield* waitFor(10)
})
