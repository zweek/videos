import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2'
    const PINK = 'fc3c96'

    const angle = createSignal(0)
    const wishdirScale = createSignal(0)
    const arcAngleSize = createSignal(120)

    let wish_speed = 0
    let current_speed = 0
    let add_speed = 0
    let accel_speed = 0

    const arrowGroup = createRef<Node>()
    const baseCircle = createRef<Line>()

    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const arcLengthComp = createRef<Circle>()

    const labelAngle = createRef<Txt>()
    const arcAngle = createRef<Circle>()
    const arcAngleGroup = createRef<Node>()

    const cbCurrentSpeed = createRef<CodeBlock>()
    const cbSV_AirAccelerate = createRef<CodeBlock>()

    const cbThirty = createRef<CodeBlock>()

    view.add(<>
        <CodeBlock
            ref={cbSV_AirAccelerate}
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
            opacity={0}
            x={800}
        />

        <Node ref={arrowGroup} position={[-600,250]} scale={1.5}>
            <Circle ref={baseCircle}
                fill={'white'}
                size={0}
                zIndex={0}
            />
            <Line ref={vecVel} endArrow
                stroke={MINT_GREEN}
                lineCap={'round'}
                lineWidth={15}
                arrowSize={30}
                zIndex={-1}
            />
            <Line ref={vecWishvel} endArrow
                stroke={PINK}
                lineCap={'round'}
                lineWidth={15}
                arrowSize={30}
                points={() => [Vector2.zero, Vector2.down.scale(wishdirScale())]}
                zIndex={-1}
                rotation={() => angle()}
            />
            <Circle ref={arcLengthComp}
                stroke={'white'}
                lineWidth={1}
                lineCap={'round'}
                startAngle={0 - 90}
                endAngle={0 - 90}
                size={800}
                zIndex={-2}
                lineDash={[2,4]}
            />
            <Node ref={arcAngleGroup} zIndex={-3}>
                <Node rotation={() => angle()/2}>
                    <Txt ref={labelAngle}
                        text={() => parseInt(angle()).toString() + '°'}
                        fill={'white'}
                        fontFamily={'JetBrains Mono'}
                        fontWeight={600}
                        fontSize={70}
                        y={() => -arcAngleSize()*1.3}
                        rotation={() => -angle()/2}
                        offset={Vector2.left}
                        opacity={0}
                    />
                </Node>
                <Circle ref={arcAngle}
                    stroke={'white'}
                    lineWidth={7}
                    lineCap={'round'}
                    startAngle={0 - 90}
                    endAngle={() => angle() - 90}
                    size={() => arcAngleSize() * 2}
                    zIndex={-2}
                />
            </Node>
            <CodeBlock ref={cbThirty}
                language="c#"
                fontFamily={'JetBrains Mono'}
                fontWeight={600}
                fontSize={35}
                theme={Catppuccin.Theme}
                code={`30`}
                position={[20, -440]}
                opacity={0}
            />
        </Node>

        <CodeBlock ref={cbCurrentSpeed}
            language={'c#'}
            fontFamily={'JetBrains Mono'}
            theme={Catppuccin.Theme}
            code={`current_speed`}
            offset={[-1,-1]}
            position={[-200, -450]}
            opacity={0}
        />
    </>)

    yield* all(
        baseCircle().size(40, 0.3, easeOutCubic),
        vecVel().points([Vector2.zero, Vector2.down.scale(400)], 1),
        wishdirScale(120,1),
        cbSV_AirAccelerate().opacity(0.5, 0.5),
        cbSV_AirAccelerate().y(cbSV_AirAccelerate().y() + 100, 0).to(cbSV_AirAccelerate().y(), 0.7, easeOutCubic),
    )

    yield* waitUntil("at 90 degrees")
    yield* all(
        angle(90,1),
        labelAngle().opacity(1,1)
    )

    yield* waitUntil("of course")
    yield* all(
        cbSV_AirAccelerate().opacity(0, 0.3),
        cbCurrentSpeed().opacity(1,0.3),
        cbCurrentSpeed().y(cbCurrentSpeed().y() + 100, 0).to(cbCurrentSpeed().y(),0.5, easeOutCubic),
    )

    yield* waitUntil("zero")
    yield* cbCurrentSpeed().edit(0.3,false)`current_speed${insert(' = 0')}`

    yield* waitUntil("but this means")
    const cbAddSpeed = cbCurrentSpeed().clone()
        .code('add_speed')
        .y(cbCurrentSpeed().y() + 90)
        .opacity(0)
    view.add(cbAddSpeed)
    yield* all(
        cbAddSpeed.opacity(1,0.3),
        cbAddSpeed.y(cbAddSpeed.y() + 100,0).to(cbAddSpeed.y(), 0.5, easeOutCubic),
    )

    yield* waitUntil("find out addspeed")
    yield* cbAddSpeed.edit(0.6,false)`add_speed${insert(' = wish_speed - current_speed')}`

    yield* waitUntil("subtract nothing")
    yield* cbAddSpeed.edit(0.6,false)`add_speed = wish_speed - ${edit('current_speed', '0')}`

    yield* waitUntil("added to the player")
    yield* chain(
        all(
            cbAddSpeed.selection(word(0,0,10), 0.3),
            cbCurrentSpeed().selection(word(0,0,0), 0.3),
        ),
        waitFor(0.5),
        all(
            cbAddSpeed.selection(DEFAULT, 1),
            cbCurrentSpeed().selection(DEFAULT, 1),
        ),
    )

    yield* waitUntil("equal to")
    const lineAddSpeed = vecWishvel().clone()
        .arrowSize(0)
        .stroke('white')
        .points([Vector2.zero, Vector2.down.scale(wishdirScale() - 15)])
        .zIndex(-2)
        .opacity(0)
    arrowGroup().add(lineAddSpeed)
    yield* all(
        cbAddSpeed.edit(0.3,false)`add_speed = wish_speed${remove(' - 0')}`,
        lineAddSpeed.opacity(1,0.3),
        lineAddSpeed.y(50,0.5, easeOutCubic),
    )

    yield* waitUntil("per-frame accel limit")
    const cbAccelSpeed = cbAddSpeed.clone()
        .y(cbAddSpeed.y()+90)
        .opacity(0)
        .code(`
accel_speed = sv_accelerate *
              grounded_wish_speed *
              host_frametime`)
    view.add(cbAccelSpeed)

    const lineAddSpeedClipped = lineAddSpeed.clone()
        .stroke(PINK)
        .opacity(0.5)
3       .zIndex(-3)
    arrowGroup().add(lineAddSpeedClipped)
    yield* all(
        lineAddSpeed.points([Vector2.zero, Vector2.down.scale(40)], 1),
        cbAccelSpeed.y(cbAccelSpeed.y() + 100,0).to(cbAccelSpeed.y(), 0.5, easeOutCubic),
        cbAccelSpeed.opacity(1,0.3),
    )

    yield* waitUntil("end result")
    yield* all(
        lineAddSpeedClipped.opacity(0, 1),
        lineAddSpeed.y(-400, 1),
        lineAddSpeed.arrowSize(20, 1),
        lineAddSpeed.points([Vector2.zero, Vector2.down.scale(60)], 1),
        cbAccelSpeed.edit(0.5, false)`
accel_speed = ${edit('sv_accelerate *', `add_speed`)}
${remove('              grounded_wish_speed *')}
${remove('              host_frametime')}`

    )
    yield* waitUntil("30 units")
    yield* all(
        cbThirty().opacity(1, 0.3),
        cbThirty().y(cbThirty().y() - 20, 0).to(cbThirty().y(), 0.5, easeOutCubic),
        sequence(0.1,
            cbAddSpeed.edit(0.5,false)`add_speed = ${edit('wish_speed', '30')}`,
            cbAccelSpeed.edit(0.5,false)`accel_speed = ${edit('add_speed', '30')}`,
        ),
    )

    yield* waitUntil("90 degree angle")
    yield* all(
        arcAngleGroup().rotation(90, 1),
        arcAngleGroup().y(-400, 1),
        arcAngleSize(60,1),
        labelAngle().rotation(-45 - 90,1),
        labelAngle().y(labelAngle().y()+50,1),
        labelAngle().scale(0.7,1),
    )
    
    yield* waitUntil("most apparently")
    yield* arcAngleGroup().opacity(0,0.5)

    yield* waitUntil("it changes")
    const vecVelGhost = vecVel().clone()
        .stroke('white')
        .opacity(0.5)
        .zIndex(-2)
    arrowGroup().add(vecVelGhost)
    yield* vecVel().points([Vector2.zero, [60,-400]], 1)

    yield* waitUntil("increases length")
    yield* all(
        cbCurrentSpeed().opacity(0,0.5),
        cbAddSpeed.opacity(0,0.5),
        cbAccelSpeed.opacity(0,0.5),
        cbThirty().opacity(0,0.5),
        lineAddSpeed.opacity(0,0.5),

        arrowGroup().position([-100,2000], 1),
        arrowGroup().scale(5, 1),
        vecVel().arrowSize(20, 1),
        vecVel().lineWidth(10, 1),
        vecVelGhost.arrowSize(20, 1),
        vecVelGhost.lineWidth(10, 1),
    )

    const vecVelGhostClone = vecVelGhost.clone()
        .opacity(0)
        .zIndex(0)
    arrowGroup().add(vecVelGhostClone)

    yield* all(
        arcLengthComp().endAngle(-90 + 12, 1),
        vecVelGhostClone.rotation(8.53, 1),
        vecVelGhostClone.opacity(1, 1),
        vecVelGhostClone.lineWidth(7, 1),
    )

    yield* waitFor(10)
})
