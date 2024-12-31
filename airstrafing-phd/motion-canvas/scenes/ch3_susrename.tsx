import {makeScene2D, Circle, Line, Node, Txt, Latex, Img, Rect, blur} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2';
    const PINK = 'fc3c96';

	const SV_AirAccelerate = createRef<CodeBlock>();
    const githubScreenshot = createRef<Img>();

    view.add(
            <>
                <CodeBlock
                    ref={SV_AirAccelerate}
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
                    scale={0.8}
                />
                <Img ref={githubScreenshot}
                    src="./images/quake-github-currentspeed.jpg"
                    scale={1.6}
                    x={-1000}
                    y={-150}
                    opacity={0}
                    zIndex={-2}
                >
                    <Rect
                        fill={'black'}
                        width={1920}
                        height={1080}
                        left={[0, 0]}
                        zIndex={-1}
                    />
                </Img>
            </>
    )
    SV_AirAccelerate()
        .offset([-1,0])
        .middle([0,0])

    yield* waitUntil("incorrectly")
    yield* all(
        SV_AirAccelerate().scale(1.4, 1),
        SV_AirAccelerate().selection(word(8,0,17), 1)
    )

    yield* waitUntil("suspiciously")
    yield* all(
        SV_AirAccelerate().x(-80, 0.7),
        githubScreenshot().x(0, 0.7),
        githubScreenshot().opacity(1, 0.7),
    )

    yield* waitFor(10);
});
