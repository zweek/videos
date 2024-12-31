import { createRef, makeRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInCubic, easeInOutQuad } from '@motion-canvas/core';
import { makeScene2D, Circle, Line, Node, Txt, Grid, Rect, Shape } from '@motion-canvas/2d'
import { CodeBlock, lines, word, range, insert, remove, edit } from '@motion-canvas/2d/lib/components/CodeBlock'

import { Catppuccin } from '../theme/catppuccin'
import { slideIn, slideOut, arrowAppear } from '../presets/anims'
import { degreesToRadians, DotProduct } from '../components/Utils'
import { Key, WASDKeys } from '../components/Key'
import { Colors } from '../presets/consts'

export default makeScene2D(function* (view) {

    const groupMain = createRef<Node>()
    const innerGroupMain = createRef<Node>()
    const baseCircle = createRef<Circle>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const grid = createRef<Grid>()
    const axes = createRef<Grid>()
    const mainMask = createRef<Rect>()
    const lockedOffQuadrants = createRef<Rect>()

    view.add(<Node ref={groupMain} cache>
        <Rect ref={mainMask}
            fill={'white'}
            radius={50}
        />
        <Node ref={innerGroupMain} compositeOperation={'source-in'}>
            <Circle ref={baseCircle}
                fill={'white'}
                size={40}
                zIndex={2}
                scale={0}
            />
            <Grid ref={grid}
                width={"100%"} height={"100%"}
                scale={1.6}
                stroke={'white'}
                zIndex={-2}
            />
            <Grid ref={axes}
                width={"100%"} height={"100%"}
                scale={20}
                lineWidth={0.3}
                stroke={'white'}
                zIndex={-2}
            />
            <Line ref={vecVel} endArrow
                stroke={Colors.MINT_GREEN}
                lineCap={'round'}
                lineWidth={20}
                arrowSize={40}
                points={[Vector2.zero, Vector2.zero]}
                rotation={() => Math.min(vecWishvel().rotation() - 85, 5)}
            />
            <Line ref={vecWishvel} endArrow
                stroke={() => vecWishvel().rotation() > 90 || vecWishvel().rotation() < -90 ? Colors.WHITE : Colors.PINK}
                opacity={() => vecWishvel().rotation() > 90 || vecWishvel().rotation() < -90 ? 0.5 : 1}
                lineCap={'round'}
                lineWidth={15}
                arrowSize={30}
                points={[Vector2.zero, Vector2.zero]}
                zIndex={1}
            />
            <Rect ref={lockedOffQuadrants}
                size={[2000,1000]}
                top={Vector2.up}
                fill={'red'}
                zIndex={-3}
                opacity={0}
            />
        </Node>
        <Rect
            size={() => mainMask().size()}
            stroke={'grey'}
            lineWidth={10}
            radius={50}
        />
    </Node>)

    yield* all(
        arrowAppear(vecVel(), 300, 1),
        arrowAppear(vecWishvel(), 130, 1),
        vecWishvel().rotation(90-10, 1),
        baseCircle().scale(1, 1),
        mainMask().size(1000, 1),
    )

    const vecWishvelProjected = vecWishvel().clone()
        .stroke(Colors.PINK)
        .opacity(1)
        .rotation(() => {
            switch (true) {
                case vecWishvel().rotation() <= 90 && vecWishvel().rotation() >= -90:
                    return vecWishvel().rotation()
                case vecWishvel().rotation() > 90:
                    return 90
                case vecWishvel().rotation() < -90:
                    return -90
            }
        })
        .points(() => {
            if (vecWishvel().rotation() <= 90 && vecWishvel().rotation() >= -90)
                return [Vector2.zero, Vector2.down.scale(vecWishvel().arcLength())]
            else
                return [Vector2.zero, Vector2.down.scale(Math.sin(degreesToRadians(vecWishvel().rotation())) * vecWishvel().arcLength())]
        })
        .zIndex(1)
    innerGroupMain().add(vecWishvelProjected)

    yield* all(
        vecWishvel().rotation(130, 6),
        vecVel().points([Vector2.zero, Vector2.down.scale(320)], 3),
        chain(
            waitUntil("locked quadrants"),
            lockedOffQuadrants().opacity(0.5, 0.3),
        )
    ) 

    yield* waitUntil("doesnt go any further")
    yield* vecWishvel().rotation(150, 0.7)
    yield* vecWishvel().rotation(110, 0.7)
    yield* vecWishvel().rotation(130, 0.7)

    yield* waitUntil("holding the correct buttons")
    const wasd = createRef<WASDKeys>()
    innerGroupMain().add(
        <WASDKeys ref={wasd}
            direction={'r'}
            scale={0.5}
            position={[200,150]}
            opacity={0}
        />
    )
    yield* slideIn(wasd(), 'up', 50, 0.5)

    yield* waitUntil("turning the camera")
    const vecLookdir = createRef<Line>()
    innerGroupMain().add(<Line ref={vecLookdir} endArrow
        stroke={Colors.WHITE}
        lineWidth={30}
        arrowSize={60}
        lineDash={[0,100]}
        points={[Vector2.zero, Vector2.zero]}
        zIndex={1}
    />)
    yield* all(
        arrowAppear(vecLookdir(), 60, 0.5),
        vecLookdir().rotation(45, 1.2),
    )

    yield* waitUntil("other direction")
    yield* all(
        slideOut(wasd(), 'down', 100, 1),
        vecLookdir().points([Vector2.zero, Vector2.zero], 0.5),
        vecWishvel().rotation(-80, 2),
        vecVel().rotation(() => {
            if (vecWishvel().rotation() > 5-85)
                return 5
            else
                return vecWishvel().rotation()+85
        })
    )

    yield* waitUntil("wishvel angle")
    const dotlineWishvelAngle = createRef<Line>()
    const dotarcWishvelAngle = createRef<Circle>()
    const allowedQuadrant = createRef<Rect>()
    innerGroupMain().add(<>
        <Line ref={dotlineWishvelAngle}
            points={[Vector2.zero, Vector2.zero]}
            stroke={'white'}
            lineWidth={10}
            lineDash={[30,30]}
            lineCap={'round'}
            rotation={vecWishvel().rotation()}
            opacity={0.7}
        />
        <Circle ref={dotarcWishvelAngle}
            stroke={'white'}
            lineWidth={10}
            lineDash={[20,30]}
            lineCap={'round'}
            size={240}
            opacity={0.7}
            zIndex={-1}
            startAngle={() => vecVel().rotation()-90}
            endAngle={() => vecVel().rotation()-90}
        />
        <Rect ref={allowedQuadrant}
            size={1000,1000}
            fill={'lime'}
            opacity={0}
            offset={Vector2.bottomRight}
            zIndex={-3}
        />
    </>)
    yield* all(
        dotarcWishvelAngle().startAngle(vecWishvel().rotation()-90, 1),
        arrowAppear(dotlineWishvelAngle(), 500, 1),
    ),
    yield* sequence(1,
        vecWishvel().rotation(-90, 2),
        allowedQuadrant().opacity(0.5, 1),
    )

    yield* waitUntil("if ur moving")
    yield* all(
        allowedQuadrant().opacity(0, 1),
        lockedOffQuadrants().opacity(0, 1),
        dotarcWishvelAngle().startAngle(() => vecVel().rotation()-90, 1),
        dotlineWishvelAngle().points([Vector2.zero, Vector2.zero], 1),
        vecWishvel().points([Vector2.zero, Vector2.zero], 1),
    )

    yield* waitUntil("not aligned")
    yield* axes().stroke('red', 1)

    yield* waitUntil("diagonally")
    yield* all(
        axes().stroke('white', 1),
        vecVel().rotation(45, 1),
    )

    yield* waitFor(10)
})
