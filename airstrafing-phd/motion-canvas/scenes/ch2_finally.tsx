import {makeScene2D, Circle, Line, Node, Txt, Latex, Rect} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, chain, sequence, waitUntil, waitFor, Vector2, createSignal, makeRef, easeInCubic, tween, map, easeOutCubic, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

// vec = vector (line with endArrow)
// circ = Circle
// n = node
// sig = signal
// lay = layout
// cb = CodeBlock

export default makeScene2D(function* (view) {

    const MINT_GREEN = '3cfca2'
    const PINK = 'fc3c96'

	const SV_AirAccelerate = createRef<CodeBlock>()
    const vecVel = createRef<Line>()
    const vecWishdir = createRef<Line>()
    const dottedLineArrows = createRef<Line>()
    const vecCombined = createRef<Line>()
    const circBase = createRef<Circle>()
    const circEnd = createRef<Circle>()

    const nArrows = createRef<Node>();
    const labelVel = createRef<Latex>()
    const labelWishdir = createRef<Latex>()
    const labelCombined = createRef<Latex>()

    const arrowSize = 60
    const addspeed = 300
    const wishdirRotation = 40

    const sigVelScale = createSignal(0)
    const sigWishdirScale = createSignal(0)
    const sigAddspeedScale = createSignal(0)

    const layRecapHoriz = createRef<Rect>()
    const layRecapVert = createRef<Rect>()

    view.add(<>
        <CodeBlock ref={SV_AirAccelerate}
            language="c#"
            fontFamily={'JetBrains Mono'}
            theme={Catppuccin.Theme}
            scale={0.8}
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

        <Node ref={nArrows}
            position={[-550,100]}
            rotation={70}
        >
            <Circle ref={circBase}
                zIndex={0}
                fill={'white'}
            />

            <Circle ref={circEnd}
                zIndex={-4}
                fill={'white'}
                position={() => [
                    Math.sin(vecWishdir().rotation()*(Math.PI/180)) * sigWishdirScale(),
                    Math.cos(vecWishdir().rotation()*(Math.PI/180)) * -sigWishdirScale() + vecWishdir().y()
                ]}
            />

            <Line ref={vecVel} endArrow
                points={[ Vector2.zero, () => Vector2.down.scale(sigVelScale()) ]}
                lineWidth={arrowSize/2}
                stroke={MINT_GREEN}
                zIndex={-1}
                arrowSize={arrowSize}
                lineCap={'round'}
            >
                <Latex ref={labelVel}
                    tex="\color{#3cfca2}\vec{v}"
                    x={-100}
                    y={() => -sigVelScale() / 2 + arrowSize / 2}
                    rotation={() => -nArrows().rotation()}
                    width={50}
                    opacity={0}
                />
            </Line>
            <Line ref={vecWishdir} endArrow
                points={[ Vector2.zero, () => Vector2.down.scale(sigWishdirScale()) ]}
                lineWidth={arrowSize/2}
                stroke={PINK}
                zIndex={-2}
                arrowSize={arrowSize}
                rotation={wishdirRotation}
                lineCap={'round'}
            >
                <Latex ref={labelWishdir}
                    tex="\color{#fc3c96}\hat{w}"
                    x={100}
                    y={() => -sigWishdirScale() / 2 + arrowSize / 2}
                    rotation={() => -nArrows().rotation()-vecWishdir().rotation()}
                    width={50}
                    opacity={0}
                />
            </Line>
            <Line ref={dottedLineArrows}
                points={[ Vector2.zero, () => Vector2.down.scale(sigAddspeedScale()) ]}
                lineWidth={arrowSize/2}
                stroke={'white'}
                opacity={0.2}
                zIndex={-3}
                arrowSize={arrowSize}
                rotation={wishdirRotation}
                lineCap={'round'}
                lineDash={[10,50]}
            >
            </Line>
            <Line ref={vecCombined} endArrow
                points={[ Vector2.zero, () => [
                    Math.sin(vecWishdir().rotation()*(Math.PI/180)) * sigWishdirScale(),
                    Math.cos(vecWishdir().rotation()*(Math.PI/180)) * -sigWishdirScale() + vecWishdir().y()
                ]]}
                lineWidth={arrowSize*0.3}
                stroke={'white'}
                opacity={0.5}
                zIndex={-3}
                arrowSize={arrowSize}
                lineCap={'round'}
            >
                <Node
                    rotation={() => (Math.atan(sigWishdirScale() / -vecWishdir().y())*180/Math.PI)}
                    x={() => Math.sin(vecWishdir().rotation()*(Math.PI/180)) * (sigWishdirScale() + arrowSize/2) / 2}
                    y={() => Math.cos(vecWishdir().rotation()*(Math.PI/180)) * (-sigWishdirScale() + arrowSize/2) + vecWishdir().y() / 2}
                >
                    <Latex ref={labelCombined}
                        tex="\color{#ffffff}\vec{v}'"
                        x={100}
                        width={80}
                        rotation={() => -nArrows().rotation() - (Math.atan(sigWishdirScale() / -vecWishdir().y())*180/Math.PI)}
                        opacity={0}
                    />
                </Node>
            </Line>
        </Node>

        <Rect layout ref={layRecapVert}
            scale={1.2}
            opacity={0}
            direction={"column"}
            alignItems={"center"}
            gap={50}
        >
            <Rect layout ref={layRecapHoriz}
                direction={"row"}
            />
        </Rect>
    </>)
    SV_AirAccelerate().offset(Vector2.left)
    SV_AirAccelerate().middle(Vector2.zero)

    layRecapVert().offset(Vector2.down)
    layRecapVert().middle(Vector2.zero)

    const latexV = createRef<Latex>()
    const latexW = createRef<Latex>()
    layRecapHoriz().add([
        SV_AirAccelerate().clone().code(`DotProduct( `).scale(1),
        <Latex ref={latexV} tex="\color{#3cfca2}\vec{v}" scale={5}/>,
        SV_AirAccelerate().clone().code(` , `).scale(1),
        <Latex ref={latexW} tex="\color{#fc3c96}\hat{w}" scale={5}/>,
        SV_AirAccelerate().clone().code(` )`).scale(1),
    ])
                    
    yield* waitUntil("updated")
    yield* all(
        SV_AirAccelerate().scale(1,1),
        SV_AirAccelerate().y(-450,1),
        SV_AirAccelerate().selection(lines(17,18),1)
    )

    yield* all(
        SV_AirAccelerate().opacity(0,0.7),
        SV_AirAccelerate().y(-1000,0.7,easeInCubic),
        chain(
            waitUntil("scaling"),
            all(
                circBase().size(70,0.3),
                sigVelScale(800,1),
                sigWishdirScale(150,1),
                sigAddspeedScale(addspeed,1),
                labelVel().opacity(1,1),
                labelWishdir().opacity(1,1),
            )
        )
    )

    yield* waitUntil("up to")
    yield* all(
        sigWishdirScale(addspeed,1),
        labelWishdir().width(70,1),
        chain(
            waitFor(0.2),
            labelWishdir().opacity(0,0.2),
            labelWishdir().tex("\\color\{\#fc3c96\}\\vec\{w\}",0),
            labelWishdir().opacity(1,0.2),
        )
    )

    yield* waitUntil("adding")
    yield* all(
        vecWishdir().y(-sigVelScale() + arrowSize/2,1),
        circEnd().size(50,1),
        labelCombined().opacity(1,1),
        labelWishdir().x(-100,1),
    )

    yield* waitUntil("recap")
    yield* all(
        nArrows().rotation(0,1),
        nArrows().position([0,200],1),
        sigVelScale(500,1),
        labelVel().x(100,1),
        vecWishdir().position([0,0],1),
        vecWishdir().rotation(270+30,1),
        sigWishdirScale(200,1),
        chain(
            labelWishdir().opacity(0,0.2),
            labelWishdir().tex("\\color\{\#fc3c96\}\\hat\{w\}",0),
            labelWishdir().opacity(1,0.2),
        ),
        circEnd().scale(0,1),
        circEnd().opacity(0,1),
        vecCombined().opacity(0,1),
        labelCombined().opacity(0,1),

        dottedLineArrows().y(() => Math.min(Math.cos(vecWishdir().rotation()*(Math.PI/180)) * -sigWishdirScale(),0),1),
        sigAddspeedScale(() => -Math.sin(vecWishdir().rotation()*(Math.PI/180)) * sigWishdirScale(),1),
        dottedLineArrows().rotation(-90,1),
        dottedLineArrows().lineWidth(arrowSize*0.3,1),
        dottedLineArrows().lineDash([10,30],1),
    )

    yield* waitUntil("dot product")
    layRecapVert().y(-200)
    yield* all(
        nArrows().x(-400,1),
        layRecapVert().opacity(1,1),
        layRecapVert().x(300,1,easeOutCubic),
    )

    yield* waitUntil("velocity")
    yield* all(
        latexV().scale(6,0.3,easeOutCubic),
        labelVel().scale(1.2,0.3,easeOutCubic),
    )
    yield* waitFor(0.3)
    yield* all(
        latexV().scale(5,0.3,easeInCubic),
        labelVel().scale(1,0.3,easeOutCubic),
    )

    yield* waitUntil("wishvelocity")
    yield* all(
        latexW().scale(6,0.3,easeOutCubic),
        labelWishdir().scale(1.2,0.3,easeOutCubic),
    )
    yield* waitFor(0.3)
    yield* all(
        latexW().scale(5,0.3,easeInCubic),
        labelWishdir().scale(1,0.3,easeOutCubic),
    )

    const sigCurrentSpeedScale = createSignal(0)
    const lineCurrentSpeed = createRef<Line>()
    nArrows().add(
        <Line ref={lineCurrentSpeed}
            stroke={'white'}
            x={60}
            lineWidth={arrowSize*0.3}
            points={() => [Vector2.zero, Vector2.down.scale(sigCurrentSpeedScale())]}
            lineCap={'round'}
            opacity={0}
        />
    )
    const cbCurrentSpeed = createRef<CodeBlock>()
    const arrowResult = createRef<Line>()
    layRecapVert().add([
        <Rect height={100}>
            <Line ref={arrowResult} endArrow
                points={[Vector2.zero, Vector2.up.scale(0)]}
                opacity={0}
                stroke={'white'}
                lineWidth={arrowSize/3}
                arrowSize={arrowSize/2}
                lineCap={"round"}
            />
        </Rect>,
        <CodeBlock ref={cbCurrentSpeed}
            code={`current_speed`}
            language={"c#"}
            fontFamily={"JetBrains Mono"}
            theme={Catppuccin.Theme}
            opacity={0}
        />,
    ])

    yield* all(
        labelVel().x(150,0.5),
        lineCurrentSpeed().opacity(1,0.2),
        sigCurrentSpeedScale(sigVelScale()*0.7,0.5),
        arrowResult().opacity(1,0.3),
        arrowResult().points([Vector2.zero, Vector2.up.scale(100)],0.5),
        cbCurrentSpeed().opacity(1,0.5)
    )

    yield* waitUntil("difference")
    cbCurrentSpeed().reparent(lineCurrentSpeed())
    yield* all(
        labelVel().x(100,0.5),
        dottedLineArrows().opacity(0,1),
        cbCurrentSpeed().offset(Vector2.left,1),
        cbCurrentSpeed().middle(Vector2.zero,1),
        cbCurrentSpeed().position(() => [50,lineCurrentSpeed().parsedPoints()[1].y/2],1),
        lineCurrentSpeed().position([700,100],1),
        layRecapVert().y(layRecapVert().y()-300,1),
        layRecapVert().opacity(0,0.5),
    )
    const lineWishSpeed = lineCurrentSpeed().clone()
        .position([-50,0])
        .points([Vector2.zero,Vector2.zero])
        .opacity(0)
    lineWishSpeed.removeChildren()
    lineCurrentSpeed().add(lineWishSpeed)
    lineWishSpeed.add(cbCurrentSpeed().clone().code(`wish_speed`)
        .offset(Vector2.right)
        .middle(Vector2.zero)
        .position(() => [-50,lineWishSpeed.parsedPoints()[1].y/2]))

    const lineAddSpeed = lineCurrentSpeed().clone()
        .position([0,lineCurrentSpeed().parsedPoints()[1].y - arrowSize/2])
        .endArrow(true).startArrow(true)
        .points(() => [Vector2.zero, Vector2.up.scale(Math.min(0,lineWishSpeed.parsedPoints()[1].y - lineCurrentSpeed().parsedPoints()[1].y + arrowSize/3))])
        .opacity(0)
    lineAddSpeed.removeChildren()
    lineCurrentSpeed().add(lineAddSpeed)
    const cbAddSpeed = cbCurrentSpeed().clone().code(`add_speed`)
        .position(() => [50,lineAddSpeed.parsedPoints()[1].y/2])
    lineAddSpeed.add(cbAddSpeed)

    yield* all(
        lineWishSpeed.points([Vector2.zero, Vector2.down.scale(600)],1),
        lineWishSpeed.opacity(1,0.3),
        lineAddSpeed.opacity(1,1),
    )
    yield* waitFor(0.2)

    yield* all(
        lineAddSpeed.points([Vector2.zero,Vector2.down.scale(150)],1),
        cbAddSpeed.edit(1,false)`${edit('add_speed','30')}`
    )


    yield* waitUntil("compare")
    lineAddSpeed.reparent(view)
    const lineAccelLimit = lineAddSpeed.clone()
        .startArrow(false)
        .position([-50,-10])
        .points([Vector2.zero,Vector2.zero])
        .arrowSize(0)
    lineAccelLimit.removeChildren()
    lineAddSpeed.add(lineAccelLimit)
    yield* all(
        lineWishSpeed.y(lineWishSpeed.y() + 200,0.5,easeInCubic),
        lineWishSpeed.opacity(0,0.5),
        lineCurrentSpeed().y(lineCurrentSpeed().y() + 200,0.5,easeInCubic),
        lineCurrentSpeed().opacity(0,0.5),
        lineAddSpeed.position([250,100],1),
        cbAddSpeed.edit(1,false)`${edit('30','add_speed')}`,
        lineAccelLimit.points([Vector2.zero,Vector2.down.scale(60)],1),
    )

    const cbAccelLimit = cbCurrentSpeed().clone()
        .code(`grounded_wish_speed * sv_accelerate * host_frametime;`)
        .scale(0.7)
        .position([-200,400])
        .opacity(0)
    view.add(cbAccelLimit)
    yield* waitUntil("accel limit")
    yield* all(
        cbAccelLimit.opacity(0.5,0.3),
        cbAccelLimit.y(cbAccelLimit.y()-100,0.5,easeOutCubic),
    )

    lineAccelLimit.reparent(vecVel())
    yield* waitUntil("smaller")
    yield* all(
        lineAddSpeed.opacity(0,0.5),
        lineAddSpeed.x(lineAddSpeed.x()+100,1),
        cbAccelLimit.opacity(0,0.5),
        cbAccelLimit.y(cbAccelLimit.y()+100,1),
    )

    yield* waitUntil("added")
    yield* chain(
        all(
            lineAccelLimit.arrowSize(arrowSize/2,1),
            lineAccelLimit.rotation(vecWishdir().rotation()-360,1),
            lineAccelLimit.points([Vector2.zero,Vector2.down.scale(80)],1),
            lineAccelLimit.position(vecVel().points()[1],1),
        ),
        nArrows().x(0,1),
    )

    yield* waitFor(10)

});
