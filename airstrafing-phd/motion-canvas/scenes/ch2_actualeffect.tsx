import {makeScene2D, Circle, Line, Node, Txt} from '@motion-canvas/2d';
import {CodeBlock, lines, word} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, chain, all, sequence, waitUntil, waitFor, Vector2, createSignal, createRefArray, range, easeOutCubic} from '@motion-canvas/core';
import {tween, map} from '@motion-canvas/core/lib/tweening'
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2';
    const PINK = 'fc3c96';
    const arrowSize = 40;

    const group1 = createRef<Node>();
    const VectorNormalize = createRef<CodeBlock>();
    const SV_AirAccelerate = createRef<CodeBlock>();

    const baseCircle = createRef<Circle>();
    const wishvel = createRef<Line>();
    const wishvelLabel = createRef<Txt>();
    const wishvelLengthLine = createRef<Line>();
    const wishvelLengthLabel = createRef<Txt>();
    const wishspeedLength = createRef<Txt>();

    const wishspeed = createRef<CodeBlock>();

    const wishvelScale = createSignal(0);

    const wishspdLineBase = createRef<Line>();
    const wishspdLineClip = createRef<Line>();
    const wishspdLineLabel = createRef<Txt>();


    view.add(
            <>
                <CodeBlock ref={VectorNormalize}
                    language="c#"
                    fontFamily={'JetBrains Mono'}
                    code={`
float VectorNormalize (vec3 v)
{
    float   length, ilength;

    length = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
    length = sqrt(length);

    if (length)
    {
        ilength = 1/length;
        v[0] *= ilength;
        v[1] *= ilength;
        v[2] *= ilength;
    }

    return length;
}`
                    }
                />

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

                <Node ref={group1} position={[0,150]}>
                    <Circle
                        ref={baseCircle}
                        width={50} height={50}
                        scale={0}
                        zIndex={0}
                        fill={'white'}
                    />
                    
                    <Line ref={wishvel} endArrow
                        points={[Vector2.zero, () => Vector2.down.scale(wishvelScale())]}
                        lineWidth={20}
                        stroke={MINT_GREEN}
                        zIndex={-1}
                        arrowSize={arrowSize}
                    >
                        <Txt ref={wishvelLabel}
                            text={'wish_velocity'}
                            fontFamily={'JetBrains Mono'}
                            fontSize={45}
                            fontWeight={600}
                            fill={MINT_GREEN}
                            right={() => [-60, -wishvelScale()/2 + arrowSize/2]}
                            opacity={0}
                        />
                    </Line>
                    <Line ref={wishvelLengthLine}
                        points={[Vector2.zero, () => wishvelScale() > arrowSize ? Vector2.down.scale(wishvelScale()-arrowSize) : 0]}
                        x={100}
                        lineWidth={10}
                        lineCap={'round'}
                        stroke={'white'}
                    >
                        <Txt ref={wishvelLengthLabel}
                            text={() => Math.floor(wishvelScale()-80).toString()}
                            fontFamily={'JetBrains Mono'}
                            fontSize={45}
                            fontWeight={600}
                            fill={'white'}
                            left={() => [60, -wishvelScale()/2 + arrowSize/2]}
                            opacity={0}
                        />
                        <Txt ref={wishspeedLength}
                            text={'320'}
                            fontFamily={'JetBrains Mono'}
                            fontSize={45}
                            fontWeight={600}
                            fill={Catppuccin.Colors.Peach}
                            left={() => wishvelLengthLabel().left()}
                            opacity={0}
                        />
                    </Line>
                </Node>

                <CodeBlock ref={wishspeed}
                    language="c#"
                    fontFamily={'JetBrains Mono'}
                    theme={Catppuccin.Theme}
                    code={`wish_speed =`}
                    y={-25}
                    opacity={0}
                />

                <Line ref={wishspdLineBase}
                    points={[Vector2.left.scale(500), Vector2.right.scale(500)]}
                    lineWidth={50}
                    stroke={'white'}
                    end={0}
                />
                <Txt ref={wishspdLineLabel}
                    text={() => `wish_speed = ${Math.floor(wishspdLineBase().size().x * wishspdLineBase().end() / 1000 * 320)}`}
                    fontFamily={'JetBrains Mono'}
                    fontWeight={600}
                    fill={'white'}
                    y={75}
                    opacity={0}
                />
                <Line ref={wishspdLineClip}
                    points={[Vector2.left.scale(500), Vector2.right.scale(500)]}
                    lineWidth={50}
                    stroke={Catppuccin.Colors.Red}
                    start={1}
                />
            </>
    )

    SV_AirAccelerate().offset(Vector2.left)
    SV_AirAccelerate().middle(Vector2.zero)
    yield SV_AirAccelerate()
    SV_AirAccelerate().unselectedOpacity(0.1)

    // so what we actually get out of it

    yield* chain(
            waitUntil('Length of'),
            sequence(
                0.5,
                all(
                    wishvelScale(400,1),
                    baseCircle().scale(1,0.4),
                    VectorNormalize().opacity(0,1)
                ),
                all(
                    wishvelLengthLabel().opacity(1,0.5),
                    wishvelLabel().opacity(1,0.5),
                ),
            ),
            waitFor(0.5),
            sequence(0.3,
                all(
                    group1().x(-300,1),
                    wishspeed().x(300,1),
                    wishspeedLength().absolutePosition([wishspeed().absolutePosition().x+550,wishspeed().absolutePosition().y],1),
                    wishspeedLength().opacity(1,0.3),
                ),
                wishspeed().opacity(1,1),
            ),

            waitUntil('wish_velocity itself'),
            wishvelScale(81,1.5),

            waitUntil('After this'),
            all( // transition
                group1().y(group1().y()-400,0.7),
                group1().opacity(0,0.7),
                wishspeed().y(wishspeed().y()-200,0.7),
                wishspeed().opacity(0,0.7),

                SV_AirAccelerate().y(SV_AirAccelerate().y()+100,0).to(0,1),
                SV_AirAccelerate().opacity(1,1),
            ),
            waitUntil('immediately'),
            all(
                SV_AirAccelerate().selection(lines(5,6),1),
                SV_AirAccelerate().scale(1.8,1),
                SV_AirAccelerate().y(200,1),
                wishspdLineBase().end(1,1),
                wishspdLineLabel().opacity(1,1)
            ),

            waitUntil('thirty'),
            all(
                wishspdLineBase().end(0.094,0),
                wishspdLineClip().start(0.094,0),

                tween(0.5, value => {
                    wishspdLineClip().x(map(0,50, easeOutCubic(value)))
                    wishspdLineBase().x(map(0,-50, easeOutCubic(value)))
                    wishspdLineClip().opacity(map(1,0.7, easeOutCubic(value)))
                }),
            ),

            waitUntil('next currentspeed'),
            all(
                wishspdLineBase().opacity(0,0.5),
                wishspdLineClip().opacity(0,0.5),
                wishspdLineLabel().opacity(0,0.5),
                wishspdLineBase().y(100,0.5),
                wishspdLineClip().y(100,0.5),
                wishspdLineLabel().y(200,0.5),
            ),
            all(
                SV_AirAccelerate().selection(lines(8,8),0.5),
                SV_AirAccelerate().scale(0.9,0.5),
                SV_AirAccelerate().y(0,0.5)
            ),
            waitUntil('dot product'),
            SV_AirAccelerate().selection(word(8,20,10),0.5),
            waitFor(0.7),
            SV_AirAccelerate().selection(word(8,20,8+11),0.5),
            waitFor(1),
            SV_AirAccelerate().selection(word(8,20,Infinity),0.5),


            waitFor(10),
    );
});
