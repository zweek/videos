import {makeScene2D, Circle, Rect, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, waitUntil, waitFor, Vector2, createSignal, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2';
    const PINK = 'fc3c96';

	const SV_AirAccelerate = createRef<CodeBlock>();

    const VectorNormalize = createRef<CodeBlock>();
    const FuncRect = createRef<Rect>();

    const vVec = createRef<Line>();
    const vVecLabel = createRef<Latex>();
    const vVecToUnit = createRef<Line>();
    const vVecToUnitLabel = createRef<Txt>();
    const vUnit = createRef<Line>();
    const vUnitLabel = createRef<Latex>();
    const cVecCircle = createRef<Circle>();
    const cVecToUnitCircle = createRef<Circle>();

    const vVecScale = createSignal(0);
    const vVecToUnitScale = createSignal(400);
    const vUnitScale = createSignal(150);

    const arrowIn = createRef<Line>();
    const arrowOut = createRef<Line>();

    const arrowSize = 40;

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

                <Node y={-300}>
                    <CodeBlock ref={VectorNormalize}
                        language={"c"}
                        fontFamily={'JetBrains Mono'}
                        theme={Catppuccin.Theme}
                        code={`VectorNormalize()`}
                        opacity={0}
                    />
                    <Rect ref={FuncRect}
                        width={600}
                        height={550}
                        top={Vector2.up.scale(60)}
                        stroke='white'
                        lineWidth={5}
                        radius={30}
                        opacity={0.7}
                        end={0}
                    />
                    <Line ref={vVec} endArrow
                        points={[Vector2.zero, () => Vector2.down.scale(vVecScale())]}
                        rotation={20}
                        lineWidth={20}
                        stroke={MINT_GREEN}
                        lineCap={'round'}
                        arrowSize={arrowSize}
                        y={500}
                        x={-600}
                    >
                        <Circle ref={cVecCircle}
                            fill={'white'}
                        />
                        <Latex ref={vVecLabel}
                            tex="\color{#3cfca2}\vec{v}"
                            x={-70}
                            y={() => -vVecScale() / 2 + arrowSize / 2}
                            rotation={-20}
                            width={40}
                            scale={0}
                        />
                    </Line>
                    <Line ref={vVecToUnit} endArrow
                        points={[Vector2.zero, () => Vector2.down.scale(vVecToUnitScale())]}
                        rotation={20}
                        lineWidth={20}
                        stroke={MINT_GREEN}
                        lineCap={'round'}
                        arrowSize={arrowSize}
                        y={500}
                        x={-600}
                        opacity={0}
                    >
                        <Circle ref={cVecToUnitCircle}
                            fill={'white'}
                            width={50}
                            height={50}
                        />
                        <Txt ref={vVecToUnitLabel}
                            text={() => (vVecToUnitScale()/100/1.5).toFixed(2).toString()}
                            fontFamily={'JetBrains Mono'}
                            fontSize={50}
                            fontWeight={600}
                            fill={() => vVecToUnit().stroke()}
                            scale={1}
                            y={() => -vVecToUnitScale() / 2 + arrowSize}
                            x={-100}
                            rotation={-20}
                            opacity={() => vVecToUnit().opacity()}
                        />
                    </Line>
                    <Line ref={vUnit} endArrow
                        points={[Vector2.zero, () => Vector2.down.scale(vUnitScale())]}
                        rotation={20}
                        lineWidth={20}
                        stroke={PINK}
                        lineCap={'round'}
                        arrowSize={arrowSize}
                        y={500}
                        opacity={0}
                    >
                        <Circle ref={cVecToUnitCircle}
                            fill={'white'}
                            width={50}
                            height={50}
                        />
                        <Latex ref={vUnitLabel}
                            tex="\color{#fc3c96}\hat{v}"
                            x={-70}
                            y={() => -vUnitScale() / 2 + arrowSize / 2}
                            rotation={-20}
                            width={40}
                            opacity={() => vUnit().opacity()}
                        />
                    </Line>
                    <Line ref={arrowIn} endArrow
                        points={[Vector2.zero, Vector2.right.scale(100)]}
                        stroke={'white'}
                        lineWidth={20}
                        lineCap={'round'}
                        arrowSize={30}
                        y={330}
                        x={-340}
                        opacity={0}
                    />
                    <Line ref={arrowOut} endArrow
                        points={[Vector2.zero, Vector2.right.scale(100)]}
                        stroke={'white'}
                        lineWidth={20}
                        lineCap={'round'}
                        arrowSize={30}
                        y={330}
                        x={260}
                        opacity={0}
                    />
                </Node>
            </>
    )

    SV_AirAccelerate().offset(Vector2.left)
    SV_AirAccelerate().middle(Vector2.zero)
    SV_AirAccelerate().y(550)
    SV_AirAccelerate().scale(1)
    SV_AirAccelerate().selection(lines(0,0))

    yield* waitUntil('The first thing');
    yield* all(
            SV_AirAccelerate().selection(lines(4,4),1),
            SV_AirAccelerate().y(300,1)
    )

    yield* waitUntil('The VectorNormalize');
    yield* SV_AirAccelerate().selection(word(4,17,15),0.5);

    yield* waitUntil('we can glance');
    yield* sequence(
        0.2,
        all(
            SV_AirAccelerate().opacity(0,1),
            VectorNormalize().opacity(1,1),
            VectorNormalize().y(-100,0).to(0,1),
        ),
        FuncRect().end(1,1),
    );
    yield* waitUntil('it takes in');
    yield* sequence(
        0.1,
        all(
            cVecCircle().width(50,0.3),
            cVecCircle().height(50,0.3),
        ),
        all(
            vVecScale(400,0.7),
            vVecLabel().scale(1,0.5),
        ),
    );

    // normalize
    yield* sequence(
        0.5,
        all(
            vVecToUnit().opacity(1,1),
            vVecToUnit().x(0,1),
        ),
        arrowIn().opacity(1,0.5),
    );
    yield* all(
        vVecToUnitScale(150,1),
        vVecToUnit().stroke(PINK,1)
    );

    // spits out result
    yield* sequence(
        0.5,
        all(
            vUnit().opacity(1,1),
            vUnit().x(600-50,1),
        ),
        arrowOut().opacity(1,0.5),
    );

    yield* waitFor(10);
});
