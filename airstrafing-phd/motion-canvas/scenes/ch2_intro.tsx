import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, waitUntil, waitFor, Vector2, createSignal, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2';
    const PINK = 'fc3c96';

	const SV_AirAccelerate = createRef<CodeBlock>();

    const baseCircle = createRef<Circle>();
    const baseVel = createRef<Line>();
    const addVel = createRef<Line>();
    const questionMark = createRef<Txt>();
    const velLabel = createRef<Txt>();

    const baseVelScale = createSignal(0);
    const addVelScale = createSignal(0);

    const addVelRot = createSignal(10);

    const arrowSize = 40;

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
                    opacity={0}
                />

                <Node y={250}>
                    <Circle
                        ref={baseCircle}
                        zIndex={0}
                        fill={'white'}
                    />
                    
                    <Line ref={baseVel} endArrow
                        points={[Vector2.zero, () => Vector2.down.scale(baseVelScale())]}
                        lineWidth={20}
                        stroke={MINT_GREEN}
                        zIndex={-1}
                        arrowSize={arrowSize}
                    >
                        <Txt ref={velLabel}
                            text={'vel'}
                            fontFamily={'JetBrains Mono'}
                            fontSize={45}
                            fontWeight={600}
                            fill={MINT_GREEN}
                            scale={0}
                            y={() => -baseVelScale() / 2 + arrowSize / 2}
                            x={-80}
                        />
                    </Line>

                    <Line ref={addVel} endArrow
                        points={[Vector2.zero, () => Vector2.down.scale(addVelScale())]}
                        y = {() => -baseVelScale() + arrowSize / 2}
                        rotation={() => addVelRot()}
                        arrowSize={arrowSize}
                        lineWidth={20}
                        lineCap = {'round'}
                        stroke={PINK}
                        zIndex={-2}
                    >
                        <Txt ref={questionMark}
                            text={'?'}
                            fontFamily={'JetBrains Mono'}
                            fontSize={60}
                            fontWeight={600}
                            fill={PINK}
                            scale={0}
                            y={() => -addVelScale() / 2 + arrowSize / 2}
                            x={-70}
                            rotation={() => -addVelRot()}
                        />
                    </Line>
                </Node>
            </>
    )

    // `SV_AirAccelerate` runs once every frame,
    yield* sequence(0.2,
        SV_AirAccelerate().scale(0.8,1),
        SV_AirAccelerate().opacity(0.8,0.8),
    );

    SV_AirAccelerate().offset(Vector2.left)
    SV_AirAccelerate().middle(Vector2.zero)

    yield* waitUntil('always ending');

    yield* all(
        SV_AirAccelerate().selection(lines(17,18), 0.7),
        SV_AirAccelerate().scale(1,0.7),
        SV_AirAccelerate().y(-450,0.7),
    )

    yield* waitUntil('The obvious question is:');

    yield* all(
        SV_AirAccelerate().opacity(0,1),
        baseCircle().width(50,1),
        baseCircle().height(50,1),
        baseVelScale(500,1),
        velLabel().scale(1,1),
    );

    yield* waitUntil('What is this vector');

    yield* sequence(0.2,
        addVelScale(200,1),
        questionMark().scale(1,1),
    );
    yield* sequence(0.5,
        addVelRot(300,1.5),
        addVelScale(300, 1.5),
    );

    SV_AirAccelerate().scale(0.8)
    SV_AirAccelerate().y(0)
    SV_AirAccelerate().selection(DEFAULT,0)

    yield* waitUntil('Let\'s just step through the function')

    yield* all(
        SV_AirAccelerate().opacity(1,1),
        baseCircle().scale(0,0.8),
        velLabel().opacity(0,0.4),
        questionMark().opacity(0,0.4),
        baseVelScale(0,0.5),
        addVelScale(0,0.4),
    )

    yield* waitUntil('First off');
    
    yield* all(
        SV_AirAccelerate().selection(lines(0),1),
        SV_AirAccelerate().y(550,1),
        SV_AirAccelerate().scale(1,0.9),
    )
    yield* waitFor(1);
    yield* SV_AirAccelerate().selection(word(0,23,4), 0.5); // select 'vec3'
    yield* waitFor(0.5);
    yield* SV_AirAccelerate().selection(word(0,23,4+1+13), 0.5); // select 'vec3 wish_velocity'

    yield* waitFor(10);
});
