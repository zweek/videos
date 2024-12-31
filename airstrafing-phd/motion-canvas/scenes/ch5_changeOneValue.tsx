import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect} from '@motion-canvas/2d'
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInOutQuad} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut, arrowAppear} from '../presets/anims'
import { Colors, SV_AirAccelerate_code_Q1, PM_Accelerate_code_Q2 } from '../presets/consts'

// overlay over gameplay
export default makeScene2D(function* (view) {

    const textVarBlock = `float sv_accelerate = 10;`

    const cbAccel = createRef<CodeBlock>()
    const codeFrame = createRef<Rect>()
    const codeTitle = createRef<Txt>()

    view.add(<Rect ref={codeFrame}
        position={[100,-100]}
        opacity={0}
    >
        <CodeBlock ref={cbAccel}
            language={"c"}
            fontFamily={"JetBrains Mono"}
            fontWeight={600}
            fontSize={35}
            theme={Catppuccin.Theme}
            code={textVarBlock}
            offset={Vector2.left}
        />
    </Rect>)

    yield* slideIn(codeFrame(), 'up', 200, 0.7)

    yield* waitUntil("10 to 1")
    yield* all(
        cbAccel().edit(0.6,false)`float sv_accelerate = 1${remove('0')};`,
    )

    yield* waitUntil("delete")
    const cbAccelSpeed = createRef<CodeBlock>()

    view.add(<CodeBlock ref={cbAccelSpeed}
        language={"c#"}
        theme={Catppuccin.Theme}
        fontFamily={"JetBrains Mono"}
        fontWeight={600}
        fontSize={35}
        code={SV_AirAccelerate_code_Q1}
        opacity={0}
        scale={0.7}
        position={[400,-100]}
    />)
    yield* all(
        slideOut(codeFrame(), 'up', 200, 0.7),
        slideIn(cbAccelSpeed(), 'up', 200, 0.7)
    )
    yield* waitFor(0.2)
    yield* cbAccelSpeed().edit(0.6,false)`
void SV_AirAccelerate (vec3 wish_velocity)
{
    float wish_speed, current_speed, add_speed, accel_speed;

${edit('    wish_speed = VectorNormalize(wish_velocity);', ' ')}
${edit('    if (wish_speed > 30)', ' ')}
${edit('        wish_speed = 30;', ' ')}

    current_speed = DotProduct(velocity, wish_velocity);
    add_speed = wish_speed - current_speed;
    if (add_speed <= 0)
        return;

    accel_speed = sv_accelerate * grounded_wish_speed * host_frametime;
    if (accel_speed > add_speed)
        accel_speed = add_speed;

    for (int i=0; i<3; i++)
        velocity[i] += accel_speed * wish_velocity[i];
}`

    yield* waitUntil("fadeout")
    yield* slideOut(cbAccelSpeed(), 'up', 200, 0.7)

    yield* waitFor(10)
})
