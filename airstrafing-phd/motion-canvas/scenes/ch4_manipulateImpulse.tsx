import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic} from '@motion-canvas/core';
import {slideIn, arrowAppear} from '../presets/anims'
import {Colors} from '../presets/consts'
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const groupMain = createRef<Node>()
    const baseCircle = createRef<Circle>()
    const vecVel = createRef<Line>()
    const vecOpposite = createRef<Line>()
    const vecViewdir = createRef<Line>()

    view.add(<Node ref={groupMain} position={[0,150]}>
        <Circle ref={baseCircle}
            fill={'white'}
            size={60}
            zIndex={1}
        />
        <Line ref={vecVel} endArrow
            stroke={Colors.MINT_GREEN}
            lineCap={'round'}
            lineWidth={30}
        </Line>
            arrowSize={60}
            rotation={10}
            points={[Vector2.zero, Vector2.down.scale(500)]}
        />
        <Line ref={vecViewdir} endArrow
            stroke={Colors.WHITE}
            lineWidth={30}
            arrowSize={50}
            lineDash={[0,100]}
            points={[Vector2.zero, Vector2.down.scale(100)]}
            shadowColor={'#00000099'}
            shadowBlur={50}
        />
        <Line ref={vecOpposite} endArrow
            stroke={Catppuccin.Colors.Peach}
            lineWidth={30}
            arrowSize={60}
            points={[Vector2.zero, Vector2.up.scale(300)]}
            rotation={() => vecViewdir().rotation()}
        />
    </Node>)

    yield* vecViewdir().rotation(30, 1)
    yield* waitFor(1)
    yield* vecViewdir().rotation(-30, 1.5)
    yield* vecViewdir().rotation(360+20, 3)

    yield* waitUntil("turning 180 degrees")
    yield* vecViewdir().rotation(180+10, 2)

    yield* waitUntil("bigger")
    yield* all(
        vecVel().points([Vector2.zero, Vector2.down.scale(2000)], 4),
        vecOpposite().points([Vector2.zero, Vector2.up.scale(1800)], 4),
        groupMain().scale(0.4, 4),
        groupMain().position([-50, 400], 4)
    )

    yield* waitFor(10)
})
