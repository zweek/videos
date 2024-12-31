import { createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInCubic, easeInOutQuad } from '@motion-canvas/core';
import { makeScene2D, Circle, Line, Node, Txt, Grid, Rect } from '@motion-canvas/2d'
import { CodeBlock, lines, word, range, insert, remove, edit } from '@motion-canvas/2d/lib/components/CodeBlock'

import { Catppuccin } from '../theme/catppuccin'
import { slideIn, slideOut, arrowAppear } from '../presets/anims'
import { degreesToRadians, DotProduct } from '../components/Utils'
import { Key, WASDKeys } from '../components/Key'
import { Colors } from '../presets/consts'

export default makeScene2D(function* (view) {

    const cbAccelLimit = createRef<CodeBlock>()
    const vecAddSpeed = createRef<Line>()

    const clip = createSignal(300)

    view.add(<>
        <CodeBlock ref={cbAccelLimit}
            language="c#"
            fontFamily={"JetBrains Mono"}
            theme={Catppuccin.Theme}
            code={`accel_speed = sv_accelerate * grounded_wish_speed * host_frametime;`}
            offset={Vector2.left}
            x={-770}
            scale={0.8}
            opacity={0}
        />
        <Line ref={vecAddSpeed} endArrow
            stroke={Colors.MINT_GREEN}
            points={[Vector2.zero, Vector2.zero]}
            lineWidth={20}
            arrowSize={35}
            lineCap={'round'}
            position={[400, 150]}
        />
    </>)
    const vecVel = vecAddSpeed().clone().y(250)

    yield* slideIn(cbAccelLimit(), 'right', 300, 1)

    yield* waitUntil("this line")
    yield* all(
        cbAccelLimit().edit(1, false)`accel_speed = sv_accelerate *${remove(' grounded_wish_speed * host_frametime;')}${insert('\n              grounded_wish_speed *\n              host_frametime;')}`,
        arrowAppear(vecAddSpeed(), clip(), 1)
    )

    yield* waitUntil("accel limit")
    const vecAddSpeedUnclipped = vecAddSpeed().clone()
        .stroke('white')
        .opacity(0.5)
        .lineDash([20, 40])
        .zIndex(-1)
        .rotation(() => vecAddSpeed().rotation())
        .position(() => vecAddSpeed().position())
    view.add(vecAddSpeedUnclipped)
    vecAddSpeed().points(() => [Vector2.zero, Vector2.down.scale(clip())])
    yield* clip(180, 2)

    yield* waitUntil("accelerate")
    yield* cbAccelLimit().selection(word(0,14,13), 1)

    yield* waitUntil("airaccelerate")
    yield* all(
        cbAccelLimit().selection(word(0,14,16), 1),
        cbAccelLimit().edit(1, false)`
accel_speed = sv_${insert('air')}accelerate *
              grounded_wish_speed *
              host_frametime;`,
    )

    yield* waitUntil("added to vel")
    const circAngle = createRef<Circle>()
    view.add(<Circle ref={circAngle}
        stroke={'white'}
        lineWidth={15}
        lineCap={'round'}
        size={200}
        position={vecVel.position()}
        opacity={0}
        startAngle={-90}
        endAngle={-90}
    />)
    view.add(vecVel)
    yield* all(
        arrowAppear(vecVel, 500, 1),
        vecAddSpeed().stroke('white', 1),
        vecAddSpeed().rotation(90, 1),
        vecAddSpeed().y(-250, 1),
        slideIn(circAngle(), 'up', 300, 1),
        circAngle().endAngle(30-90, 1),
    )
    yield* all (
        clip(100, 2),
        circAngle().endAngle(20-90, 2),
    )

    yield* waitFor(10)
})
