import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, chain, sequence, waitUntil, waitFor, Vector2, createSignal, makeRef, easeInCubic, tween, map, easeOutCubic, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2';
    const PINK = 'fc3c96';

	const SV_AirAccelerate = createRef<CodeBlock>();

    const bigVelArrow = createRef<Line>();
    const addspeedArrow = createRef<Line>();
    const addspeedSize = createSignal(0);
    const bigVelSize = createSignal(0);

    const accelLimit = 200;

    view.add(<>
        <CodeBlock ref={SV_AirAccelerate}
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

    accel_speed = grounded_wish_speed * sv_accelerate * host_frametime;
    if (accel_speed > add_speed)
        accel_speed = add_speed;

    for (int i=0; i<3; i++)
        velocity[i] += accel_speed * wish_velocity[i];
}`
            }
        />

        <Line ref={bigVelArrow} endArrow />
        <Line ref={addspeedArrow} endArrow
        />
    </>)

    SV_AirAccelerate()
        .scale(0.8)
        .selection(lines(13,13))
        .unselectedOpacity(0.1)
    bigVelArrow()
        .y(900)
        .points(() => [Vector2.zero, Vector2.down.scale(bigVelSize())])
        .stroke(MINT_GREEN)
        .lineWidth(100)
        .arrowSize(200)
        .zIndex(1)
    addspeedArrow()
        .y(() => bigVelArrow().y() - bigVelSize())
        .points(() => [Vector2.zero, Vector2.down.scale(addspeedSize())])
        .stroke('white').opacity(0.3)
        .lineWidth(40)
        .arrowSize(80)
        .lineCap('round')
        .scale(0)
    const clippedAddspeedArrow = addspeedArrow().clone()
        .points(() => [Vector2.zero, Vector2.down.scale(Math.min(accelLimit, addspeedSize()))])
        .stroke(PINK).opacity(1)
        .rotation(() => addspeedArrow().rotation())
        .scale(() => addspeedArrow().scale())
        .arrowSize(60)
    view.add(clippedAddspeedArrow)
    addspeedArrow().lineDash([10,50])

    yield* waitUntil("upper accel limit")
    yield* all(
        SV_AirAccelerate().opacity(0,1),
        bigVelSize(900,1),
    )
    yield* all(
        addspeedSize(400,1),
        addspeedArrow().scale(1,0.3),
    )
    yield* chain(
    all(
            addspeedArrow().rotation(70,1),
            addspeedSize(550,1),
        ),
        all(
            addspeedArrow().rotation(-70,1),
            chain(
                addspeedSize(400,0.5,easeInCubic),
                addspeedSize(600,0.5),
            )
        ),
    )

    yield* waitUntil("you can think")
    yield* all(
        SV_AirAccelerate().opacity(1,1),
        bigVelSize(0,1),
        SV_AirAccelerate().scale(1.15,1.5),
        SV_AirAccelerate().x(-300,1.5),
        SV_AirAccelerate().y(-200,1.5),
    )

    yield* waitUntil("accel constant")
    yield* SV_AirAccelerate().selection(word(13,40,13),0.5)
    yield* waitFor(0.5)
    yield* SV_AirAccelerate().selection(word(13,40,Infinity),0.5)

    yield* waitUntil("reach grounded")
    yield* SV_AirAccelerate().selection(word(13,18,Infinity),0.5)

    yield* waitUntil("tenth of a second")
    yield* SV_AirAccelerate().edit(0.5,false)`
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

    accel_speed = grounded_wish_speed * ${edit('sv_accelerate', '     10      ')} * host_frametime;
    if (accel_speed > add_speed)
        accel_speed = add_speed;

    for (int i=0; i<3; i++)
        velocity[i] += accel_speed * wish_velocity[i];
}`

    yield* waitUntil("note that")
    yield* all(
        SV_AirAccelerate().selection(word(13,18,19),1),
        SV_AirAccelerate().scale(1.3,1),
        SV_AirAccelerate().x(300,1),
        SV_AirAccelerate().y(0,1),
    )
    yield* SV_AirAccelerate().selection([...word(6,8,10), ...word(13,18,19)],1)

    yield* waitUntil("30")
    yield* SV_AirAccelerate().selection([...word(6,8,15), ...word(13,18,19)],0.5)

    yield* waitUntil("walking speed")
    yield* sequence(0.3,
        SV_AirAccelerate().edit(0.5,false)`
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

    accel_speed = grounded_wish_speed ${edit('*      10       * host_frametime;', '= 320;                          a')/* this is fucked up but avoids the rescaling */}
    if (accel_speed > add_speed)
        accel_speed = add_speed;

    for (int i=0; i<3; i++)
        velocity[i] += accel_speed * wish_velocity[i];
}`,
        SV_AirAccelerate().selection([...word(6,8,15), ...word(13,18,Infinity)],0.5)
    )

    yield* waitFor(10);
});
