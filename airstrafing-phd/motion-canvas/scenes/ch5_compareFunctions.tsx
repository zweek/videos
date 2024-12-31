import { createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInCubic, easeInOutQuad } from '@motion-canvas/core';
import { makeScene2D, Circle, Line, Node, Txt, Grid, Rect } from '@motion-canvas/2d'
import { CodeBlock, lines, word, range, insert, remove, edit } from '@motion-canvas/2d/lib/components/CodeBlock'

import { Catppuccin } from '../theme/catppuccin'
import { slideIn, slideOut, arrowAppear, wiggleSine } from '../presets/anims'
import { degreesToRadians, DotProduct } from '../components/Utils'
import { Key, WASDKeys } from '../components/Key'
import { Arrow } from '../components/Arrow'
import { Colors, SV_AirAccelerate_code_Q1, PM_Accelerate_code_Q2 } from '../presets/consts'

export default makeScene2D(function* (view) {

    const cbQ1 = createRef<CodeBlock>()
    const maskCodeLeft = createRef<Rect>()
    const titleQ1 = createRef<Txt>()

    view.add(<>
        <Node cache>
            <Rect ref={maskCodeLeft}
                width={1920/2}
                height={5000}
                offset={Vector2.right}
                x={-100}
                fill={'black'}
            />
            <CodeBlock ref={cbQ1}
                language={'c#'}
                fontFamily={"JetBrains Mono"}
                theme={Catppuccin.Theme}
                code= {SV_AirAccelerate_code_Q1}
                offset={Vector2.left}
                scale={0.75}
                x={-2700}
                y={50}
                compositeOperation={"source-in"}
            />
        </Node>
        <Txt ref={titleQ1}
            fontFamily={"JetBrains Mono"}
            fill={'white'}
            fontWeight={600}
            text={"Quake I"}
            offset={Vector2.left}
            position={() => cbQ1().position()}
            y={-450}
        />
    </>)
    maskCodeLeft().filters.blur(20)
    const cbQ2 = cbQ1().clone()
        .code(PM_Accelerate_code_Q2)
        .x(1000)
        .compositeOperation("normal")
    view.add(cbQ2)
    const titleQ2 = titleQ1().clone()
        .text("Quake II")
        .position(() => cbQ2.position())
        .y(-450)
    view.add(titleQ2)

    yield* all(
        cbQ1().x(-900, 1, easeOutCubic),
        cbQ2.x(100, 1, easeOutCubic),
    )

    yield* waitUntil("snippet")
    yield* cbQ1().selection(lines(4,7), 1)

    // @EDITOR ZWEEJ: hand drawn blinking lines on "missing" cue
    // highlighting the empty space

    yield* waitUntil("this would normally mean")

    const vecVel = createRef<Arrow>()
    const vecWishvel = createRef<Arrow>()
    const baseCircle = createRef<Circle>()
    const vecCombined = createRef<Line>()

    view.add(<>
        <Arrow ref={vecVel}
            color={Colors.MINT_GREEN}
        />
        <Arrow ref={vecWishvel}
            color={Colors.PINK}
            rotation={90}
            y={() => -vecVel().length()}
            zIndex={-1}
        />
        <Circle ref={baseCircle}
            fill={'white'}
        />
        <Line ref={vecCombined} endArrow
            stroke={'white'}
            lineWidth={15}
            arrowSize={30}
            lineCap={'round'}
            lineDash={[20,30]}
            points={() => [Vector2.zero, new Vector2(vecWishvel().length(), -vecVel().length())]}
            zIndex={-2}
            opacity={0}
        />
    </>)

    yield* all(
        cbQ1().x(-2700, 0.5, easeInCubic),
        cbQ2.x(1000, 0.5, easeInCubic),
        baseCircle().size(30, 1, easeOutCubic),
        vecVel().length(300, 1),
    )

    yield* waitUntil("holding")
    const wasd = createRef<WASDKeys>()
    view.add(
        <WASDKeys ref={wasd}
            y={300}
            scale={0}
        />
    )
    yield* wasd().scale(0.8, 0.5)

    yield* waitUntil("sideways")
    yield* wasd().direction('r')

    yield* waitUntil("vector max runspeed")
    yield* all(
        vecWishvel().length(300, 1),
        vecCombined().opacity(0.5, 1),
    )

    // @EDITOR ZWEEJ: hand drawn curved arrows on the left side
    // of each line (wishspeed -> addspeed -> accelspeed)
    yield* waitUntil("300")
    const cbWishSpeed = createRef<CodeBlock>()
    view.add(<CodeBlock ref={cbWishSpeed}
        language={"c#"}
        fontFamily={"JetBrains Mono"}
        theme={Catppuccin.Theme}
        code= {`wish_speed = 300`}
        offset={Vector2.left}
        position={[-700, -200]}
        opacity={0}
    />)
    const cbAddSpeed = cbWishSpeed().clone()
        .code(`add_speed = 300`)
        .y(-100)
    const cbAccelSpeed = cbWishSpeed().clone()
        .code(`accel_speed = 5`)
        .y(0)
    view.add([cbAddSpeed, cbAccelSpeed])
    yield* slideIn(cbWishSpeed(), 'down', 100, 0.5)

    yield* waitUntil("added")
    yield* slideIn(cbAddSpeed, 'down', 100, 0.5)

    yield* waitUntil("always clipped")
    const vecWishvelUnclipped = vecWishvel().clone()
        .opacity(0.5)
    view.add(vecWishvelUnclipped)
    yield* sequence(1,
        vecWishvel().length(70, 2),
        slideIn(cbAccelSpeed, 'down', 100, 0.5),
    )

    yield* waitUntil("never benefit")
    yield* vecWishvelUnclipped.rotation(100, 0.5, wiggleSine)
    yield* vecWishvelUnclipped.rotation(90, 0)

    yield* waitFor(10)
})
