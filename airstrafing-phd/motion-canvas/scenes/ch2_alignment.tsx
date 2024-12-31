import { makeScene2D, Line, Node, Txt, Latex } from '@motion-canvas/2d';
import { CodeBlock, lines, word } from '@motion-canvas/2d/lib/components/CodeBlock';
import { createRef, all, chain, waitUntil, waitFor } from '@motion-canvas/core';
import { Reference, createSignal, Vector2, Color } from '@motion-canvas/core';
import { Catppuccin } from '../theme/catppuccin'

export default makeScene2D(function* (view) {
    const velArrow = createRef<Line>();
    const wishdirArrow = createRef<Line>();
    const projectionLengthLine = createRef<Line>();
    const scaledProjectionLengthLine = createRef<Line>();

    const velScale = createSignal(0);
    const wishdirScale = createSignal(0);

    const velLabel = createRef<Latex>();
    const wishdirLabel = createRef<Latex>();
    const alignmentLabel = createRef<Txt>();
    const comment = createRef<Txt>();
    const equalsWishspeed = createRef<Txt>();

    const clipLine = createRef<Line>();
    const clipLineLength = createSignal(0);
    const wishspeedLineScale = createSignal(500);
    const wishspeedClipHeight = createSignal(48);
    const groundedwishspeedLineLabel = createRef<Line>();

    const MINT_GREEN = new Color('#3cfca2');
    const PINK = new Color('#fc3c96');
    const arrowWidth = 20

    const SV_AirAccelerate = createRef<CodeBlock>();

    function DotAlignment(v1: Reference<Line>, v2: Reference<Line>): number
    {
        // return alignment of 2 vectors based on the dot product in percents
        const v1rot = v1().rotation() * Math.PI / 180
        const v1scale = v1().size().y
        const v2rot = v2().rotation() * Math.PI / 180
        const v2scale = v2().size().y
        const v1v = new Vector2(Math.cos(v1rot) * v1scale, Math.sin(v1rot) * v1scale)
        const v2v = new Vector2(Math.cos(v2rot) * v2scale, Math.sin(v2rot) * v2scale)
        return parseInt(((v1v.x * v2v.x + v1v.y * v2v.y) / (v1scale * v2scale) * 100).toFixed(0))
    };

    view.add(<>
        <Node position={[200,200]}>
            <Line endArrow ref={velArrow}
                points={[Vector2.zero, () => Vector2.down.scale(velScale())]}
                lineWidth={arrowWidth}
                arrowSize={arrowWidth*2}
                lineCap={'round'}
                stroke={MINT_GREEN}
            >
                <Latex ref={velLabel}
                    tex="\color{#3cfca2}\vec{v}"
                    y={() => -velArrow().size().y / 2}
                    x={-arrowWidth*5}
                    rotation={() => -velArrow().rotation()}
                    width={arrowWidth*2}
                />
            </Line>
            <Line endArrow ref={wishdirArrow}
                points={[Vector2.zero, () => Vector2.down.scale(wishdirScale())]}
                lineWidth={arrowWidth}
                arrowSize={arrowWidth*2}
                lineCap={'round'}
                stroke={PINK}
                zIndex={1}
                rotation={90}
            >
                <Latex ref={wishdirLabel}
                    tex="\color{#fc3c96}\hat{w}"
                    y={() => -wishdirArrow().size().y / 2}
                    x={arrowWidth*5}
                    rotation={() => -wishdirArrow().rotation()}
                    width={arrowWidth*2.5}
                />
            </Line>
            <Line 
                points={() => [
                    Vector2.zero,
                    Vector2.down.scale(Math.sin((wishdirArrow().rotation() - velArrow().rotation())/180*Math.PI) * wishdirScale())
                ]}
                x={() => Math.sin(wishdirArrow().rotation()/180*Math.PI) * (wishdirScale() - arrowWidth/2)}
                y={() => -Math.cos(wishdirArrow().rotation()/180*Math.PI) * (wishdirScale() - arrowWidth/2)}
                rotation={() => velArrow().rotation()-90}
                lineWidth={arrowWidth/2}
                stroke={'white'}
                opacity={0.5}
                zIndex={-1}
            />
            <Line ref={projectionLengthLine}
                points={() => [
                    Vector2.zero,
                    Vector2.down.scale(Math.cos((wishdirArrow().rotation() - velArrow().rotation())/180*Math.PI) * wishdirScale())
                ]}
                rotation={() => velArrow().rotation()}
                lineWidth={arrowWidth}
                lineCap={'round'}
                stroke={'white'}
            />
            <Line ref={scaledProjectionLengthLine}
                points={() => [
                    Vector2.zero,
                    Vector2.down.scale(Math.cos((wishdirArrow().rotation() - velArrow().rotation())/180*Math.PI) * (velScale() - arrowWidth))
                ]}
                x={arrowWidth + 10}
                rotation={() => velArrow().rotation()}
                lineWidth={arrowWidth}
                lineCap={'round'}
                stroke={() => PINK.lerp(MINT_GREEN, DotAlignment(velArrow, wishdirArrow)/100, 'lab')}
            />
        </Node>
        <Node ref={alignmentLabel} position={[-450,0]}>
            <Txt text={() => "Alignment:"}
                fontFamily={'JetBrains Mono'}
                fontWeight={600}
                fill={'white'}
                x={-60}
                scale={1.3}
            />
            <Txt text={() => `${DotAlignment(velArrow, wishdirArrow)}%`}
                fontFamily={'JetBrains Mono'}
                fontWeight={600}
                offset={[-1,0]}
                fill={() => PINK.lerp(MINT_GREEN, DotAlignment(velArrow, wishdirArrow)/100, 'lab')}
                // note: this goes beyond the defined pink value bc it lerps from -1 to 1 instead of 0 to 1
                x={150}
                scale={1.3}
            />
        </Node>
        <CodeBlock ref={SV_AirAccelerate}
            scale={0.8}
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
        <Txt ref={comment}
            text={"<- this evaluates to \'false\'"}
            fontFamily={'JetBrains Mono'}
            fontWeight={600}
            fontStyle={'italic'}
            offset={[-1,0]}
            scale={0.7}
            fill={MINT_GREEN}
            position={[-250,0]}
        />
        <Txt ref={equalsWishspeed}
            text={"= wish_speed"}
            fontFamily={'JetBrains Mono'}
            offset={[-1,0]}
            fill={'white'}
            scale={1.3}
            position={[100,5]}
            opacity={0}
        />
        <Node y={400}>
            <Line // grounded wish speed
                points={() => [Vector2.zero, Vector2.down.scale(wishspeedLineScale())]}
                x={-350}
                lineWidth={arrowWidth*2}
                stroke={'white'}
            >
                <Txt ref={groundedwishspeedLineLabel}
                    text={() => `${Math.floor(wishspeedLineScale() / 500 * 320)}`}
                    position={() =>[
                        -arrowWidth*5 ,
                        -wishspeedLineScale()*0.9
                    ]}
                    fontFamily={'JetBrains Mono'}
                    fontWeight={600}
                    fill={'white'}
                    opacity={() => (wishspeedLineScale()-100)/40}
                />
            </Line>
            <Line // wishspeed
                points={() => [
                    Vector2.zero,
                    Vector2.down.scale(Math.min(wishspeedLineScale(), wishspeedClipHeight()))
                ]}
                x={350}
                lineWidth={arrowWidth*2}
                stroke={'white'}
            >
                <Txt
                    text={() => `${Math.floor(Math.min(wishspeedLineScale(), wishspeedClipHeight()) / 500 * 320)}`}
                    position={() =>[
                        arrowWidth*5,
                        -Math.min(wishspeedLineScale(), wishspeedClipHeight()) * 0.9
                    ]}
                    fontFamily={'JetBrains Mono'}
                    fontWeight={600}
                    fill={() => wishspeedLineScale() <= wishspeedClipHeight() ? 'white' : PINK}
                    opacity={() => wishspeedLineScale()/40}
                />
            </Line>
            <Line ref={clipLine}
                points={() => [Vector2.left.scale(clipLineLength()), Vector2.right.scale(clipLineLength())]}
                y={() => -wishspeedClipHeight()}
                lineWidth={arrowWidth}
                stroke={'white'}
                opacity={0}
                lineCap={'round'}
                lineDash={[30,30]}
            />
            <Line
                points={() => [
                    Vector2.zero,
                    Vector2.down.scale(wishspeedLineScale() - wishspeedClipHeight() < 0 ? 0 : wishspeedLineScale() - wishspeedClipHeight())
                ]}
                x={350}
                y={-wishspeedClipHeight()}
                lineWidth={arrowWidth*2}
                stroke={PINK}
            />
        </Node>
    </>);

    alignmentLabel().opacity(0);
    velLabel().opacity(0);
    wishdirLabel().opacity(0);
    scaledProjectionLengthLine().opacity(0);
    projectionLengthLine().opacity(0);
    comment().opacity(0);

    velArrow().scale(0);
    wishdirArrow().scale(0);

    wishspeedLineScale(0)

    SV_AirAccelerate().opacity(0);
    SV_AirAccelerate().offset(new Vector2(-1,0))
    SV_AirAccelerate().middle(Vector2.zero)
    SV_AirAccelerate().y(100)

    yield* all(
        velArrow().scale(1,0.2),
        wishdirArrow().scale(1,0.2),
        velScale(500,1),
        velLabel().opacity(1,1),
        wishdirLabel().opacity(1,1),
        wishdirScale(200,1),
        alignmentLabel().opacity(1,1),
    )

    yield* waitUntil("wishvelocity")
    yield* all(
        velArrow().rotation(15,1),
        velScale(567,1),
        scaledProjectionLengthLine().opacity(0.5,0.1),
        projectionLengthLine().opacity(1,0.1),
    )
    yield* all(
        wishdirLabel().x(-arrowWidth*4,2),
        wishdirArrow().rotation(335,2),
    )

    yield* waitUntil("the next step")
    yield* all(
        wishdirScale(0,0.5),
        velScale(0,0.5),
        velLabel().opacity(0,0.5),
        wishdirLabel().opacity(0,0.5),
        alignmentLabel().opacity(0,0.5),
        scaledProjectionLengthLine().opacity(0,0.5),

        SV_AirAccelerate().opacity(1,1),
        SV_AirAccelerate().y(0,1),
    )

    yield* waitUntil("difference")
    yield* all(
        SV_AirAccelerate().selection(lines(9,9),0.5),
        SV_AirAccelerate().scale(1.2,1),
        chain(
            waitUntil("wishspeed"),
            SV_AirAccelerate().selection(word(9,16,10),0.5),
            waitFor(0.4),
            SV_AirAccelerate().selection(word(9,16,Infinity),0.5),
        ),
    )
    yield* waitUntil("how much")
    yield* SV_AirAccelerate().selection(lines(9,9),0.5)

    yield* waitUntil("if zero")
    yield* all(
        SV_AirAccelerate().selection(lines(10,10),0.5),
        SV_AirAccelerate().y(SV_AirAccelerate().y() - 60, 1) // scroll down 60px
    )

    yield* waitUntil("exit early")
    yield* all(
        SV_AirAccelerate().selection(lines(11,11),0.5),
        SV_AirAccelerate().y(SV_AirAccelerate().y() - 60, 1) // scroll down 60px
    )
    yield* waitUntil("computing")
    yield* all(
        SV_AirAccelerate().selection([...lines(0,11), ...lines(19,19)],0.5),
        SV_AirAccelerate().scale(0.7,1),
    )

    yield* waitUntil("otherwise")
    yield* all(
        SV_AirAccelerate().selection(lines(10,10),0.5),
        SV_AirAccelerate().scale(0.8,1),
        SV_AirAccelerate().y(SV_AirAccelerate().y() + 100, 1),
    )

    yield* waitUntil("evaluates to false")
    yield* comment().opacity(1,0.3)

    yield* waitUntil("we keep going")
    yield* all(
        comment().opacity(0,0.3),
        SV_AirAccelerate().y(SV_AirAccelerate().y() - 60*3, 1), 
        SV_AirAccelerate().selection(lines(13,15),1),
    )

    yield* waitUntil("b-roll")
    yield* all(
        SV_AirAccelerate().y(SV_AirAccelerate().y() - 50, 1),
        SV_AirAccelerate().selection(lines(15,15),1),
    )

    yield* waitUntil("limit")
    yield* all(
        SV_AirAccelerate().y(SV_AirAccelerate().y() + 50*2, 1),
        SV_AirAccelerate().selection(lines(13,13),1),
    )

    // "3 new variables" hand drawn 1,2,3 in fusion

    yield* waitUntil("grounded_wish_speed")
    yield* all(
        SV_AirAccelerate().selection(word(13,18,19),0.5),
        SV_AirAccelerate().unselectedOpacity(0,1),
        SV_AirAccelerate().scale(1.3,1),
        SV_AirAccelerate().position(SV_AirAccelerate().position().add(new Vector2(-530,-100)),1),
    )
    yield* all(
        equalsWishspeed().opacity(1,0.5),
        equalsWishspeed().x(70,0.5),
    )

    yield* waitUntil("not clipped")
    yield* all(
        SV_AirAccelerate().y(SV_AirAccelerate().y() - 250, 1),
        equalsWishspeed().y(equalsWishspeed().y() - 250, 1),
        wishspeedLineScale(100, 1),
        chain(
            waitFor(0.5),
            all(
                clipLine().opacity(0.5,1),
                clipLineLength(400,1),
            )
        )
    )
    yield* wishspeedLineScale(500, 2)

    yield* waitUntil("320")
    yield* groundedwishspeedLineLabel().fill(MINT_GREEN,0.3)

    yield* waitFor(5)
});
