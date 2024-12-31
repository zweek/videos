import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2';
    const PINK = 'fc3c96';

	const SV_AirAccelerate = createRef<CodeBlock>();

    view.add(
            <>
                <CodeBlock
                    ref={SV_AirAccelerate}
                    // x={-250}
                    language="c#"
                    fontFamily={'JetBrains Mono'}
                    theme={Catppuccin.Theme}
                    code={`
void SV_AirAccelerate (vec3 wish_velocity)
{
    float wish_speed, current_speed, add_speed, accel_speed;

    wish_speed = VectorNormalize(wish_velocity);
    if (wish_speed > 30)
        wish_speed = 30;

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
                    }
                    scale={0.7}
                />
            </>
        );

    yield* chain(
        waitUntil("difference"),
        SV_AirAccelerate().selection(lines(9,9),1),
        waitUntil("wishspeed"),
        SV_AirAccelerate().selection(word(9,16,10),0.5),
        waitUntil("currentspeed"),
    )
})
