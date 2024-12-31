import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeInCubic, easeOutCubic, easeOutElastic, loop} from '@motion-canvas/core';
import {slideIn, arrowAppear} from '../presets/anims'
import {Colors, SV_AirAccelerate_code} from '../presets/consts'
import {Catppuccin} from '../theme/catppuccin'
import {Key, WASDKeys} from '../components/Key'

export default makeScene2D(function* (view) {

    const groupMain = createRef<Node>()
    const baseCircle = createRef<Circle>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const vecLookdir = createRef<Line>()
    const xLine = createRef<Line>()
    const grid = createRef<Grid>()

    const arcSize = createSignal(0)

    view.add(<Node ref={groupMain}>
        <Circle ref={baseCircle}
            fill={'white'}
            size={0}
            zIndex={1}
        />
        <Grid ref={grid}
            width={"100%"} height={"100%"}
            scale={2}
            stroke={'white'}
            opacity={0}
            zIndex={-2}
        />
        <Line ref={xLine}
            stroke={'red'}
            lineWidth={10}
            points={[Vector2.zero, Vector2.zero]}
            zIndex={-1}
        >
            <Txt
                position={[510, 30]}
                fontFamily={'JetBrains Mono'}
                fontWeight={600}
                fill={'red'}
                text={'x'}
                opacity={0}
            />
        </Line>
        <Line ref={vecVel} endArrow
            stroke={Colors.MINT_GREEN}
            lineCap={'round'}
            lineWidth={30}
            arrowSize={60}
            rotation={10}
            points={[Vector2.zero, Vector2.zero]}
        />
        <Line ref={vecWishvel} endArrow
            stroke={Colors.PINK}
            lineCap={'round'}
            lineWidth={30}
            arrowSize={60}
            rotation={100}
            points={[Vector2.zero, Vector2.zero]}
        />
        <Circle
            size={350}
            stroke={'white'}
            lineWidth={10}
            startAngle={() => vecWishvel().rotation() - vecVel().rotation() > 0 ? vecVel().rotation()-90 : vecWishvel().rotation()-90}
            endAngle={() => vecWishvel().rotation() - vecVel().rotation() <= 0 ? vecVel().rotation()-90 : vecWishvel().rotation()-90}
            lineCap={'round'}
            zIndex={-1}
            scale={() => arcSize()}
        />
        <Node rotation={() => vecVel().rotation() + (vecWishvel().rotation() - vecVel().rotation())/2} scale={() => arcSize()}>
            <Txt
                y={-250}
                rotation={() => -vecVel().rotation() - (vecWishvel().rotation() - vecVel().rotation())/2}
                fontFamily={'JetBrains Mono'}
                fontWeight={600}
                fill={'white'}
                text={() => `${Math.floor(Math.abs(vecWishvel().rotation() - vecVel().rotation()))}°`}
            />
        </Node>
    </Node>)
    const yLine = xLine().clone().rotation(-90).stroke('green')
    yLine.children()[0].fill('green').text('y').rotation(90).position([290,-30])
    xLine().add(yLine)

    yield* all(
        baseCircle().size(60, 1),
        arrowAppear(vecVel(), 500, 1),
        arrowAppear(vecWishvel(), 200, 1),
        xLine().points([Vector2.left.scale(2000), Vector2.right.scale(2000)], 1),
        yLine.points([Vector2.left.scale(2000), Vector2.right.scale(2000)], 1),
        grid().opacity(0.5, 1),
        arcSize(1, 1),
    )

    yield* vecWishvel().rotation(150, 1.2)

    yield* waitUntil("axes")
    yield* sequence(0.1,
        slideIn(xLine().children()[0], 'up', 50, 0.5),
        slideIn(yLine.children()[0], 'right', 50, 0.5),
    )

    yield* waitUntil("current vel")
    yield* vecVel().rotation(70, 1.3)

    yield* waitUntil("on mkb")
    groupMain().add(<Line ref={vecLookdir} endArrow
        stroke={Colors.WHITE}
        lineWidth={30}
        arrowSize={60}
        lineDash={[0,100]}
        points={[Vector2.zero, Vector2.zero]}
    />)
    const groupKeys = createRef<WASDKeys>()
    groupMain().add(<WASDKeys ref={groupKeys}
        position={[-500,-200]}
        scale={0}
    />)
    yield* all(
        grid().start(0.5, 1),
        grid().end(0.5, 1),
        grid().opacity(0, 1, easeInCubic),
        xLine().start(0.5, 1),
        xLine().end(0.5, 1),
        xLine().opacity(0, 1, easeInCubic),
        arcSize(0, 1),
        vecVel().rotation(0, 1),
        vecWishvel().rotation(90, 1),
        vecLookdir().points([Vector2.zero, Vector2.down.scale(100)], 1),
        groupKeys().scale(1, 1),
        groupMain().y(200, 1),
    )

    yield* waitUntil("8 diff dirs")
    yield* all(
        loop(8,
             i => vecLookdir().rotation(45*[i+1], 0.5, easeOutElastic),
        ),
        sequence(0.5,
            groupKeys().direction('ur', 0),
            groupKeys().direction('u', 0),
            groupKeys().direction('ul', 0),
            groupKeys().direction('l', 0),
            groupKeys().direction('dl', 0),
            groupKeys().direction('d', 0),
            groupKeys().direction('dr', 0),
            groupKeys().direction('r', 0),
        ),
    )

    yield* waitUntil("math works out the same")
    const SV_AirAccelerate = createRef<CodeBlock>()
    view.add(<CodeBlock ref={SV_AirAccelerate}
        theme={Catppuccin.Theme}
        fontFamily={'JetBrains Mono'}
        code={SV_AirAccelerate_code}
        x={2000}
        scale={0.9}
    />)
    yield* SV_AirAccelerate().x(1200, 1),

    yield* waitFor(10)
})
