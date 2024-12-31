import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect, Img} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInCubic, easeInOutQuad, easeOutElastic, linear} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut, scaleIn} from '../presets/anims'
import {degreesToRadians} from '../components/Utils'
import {Colors} from '../presets/consts'

export default makeScene2D(function* (view) {
    const altFunction = createRef<CodeBlock>()
    const origFunction = createRef<CodeBlock>()

    view.add(<>
        <CodeBlock ref={altFunction}
            language="c#"
            fontFamily={'JetBrains Mono'}
            theme={Catppuccin.Theme}
            code={`
// Unused Function
idVec3 wishVelocity, pushDir;
float  pushLen, canPush;

wishVelocity = wishdir * wishspeed;
pushDir = wishVelocity - current.velocity;
pushLen = pushDir.Normalize();

canPush = accel * frametime * wishspeed;
if (canPush > pushLen)
    canPush = pushLen;

current.velocity += canPush * pushDir;
`}
            opacity={0}
            scale={0.63}
        />
        <CodeBlock ref={origFunction}
            language="c#"
            fontFamily={'JetBrains Mono'}
            theme={Catppuccin.Theme}
            code={`
// Original Function
float addSpeed, accelSpeed, currentSpeed;

currentSpeed = DotProduct (pm->ps->velocity, wishdir);
addSpeed = wishSpeed - currentSpeed;
if (addspeed <= 0)
    return;

accelSpeed = accel * pml.frametime * wishSpeed;
if (accelSpeed > addSpeed)
    accelSpeed = addSpeed;

for (int i=0 ; i<3 ; i++)
    pm->ps->velocity[i] += accelSpeed * wishdir[i];	
`}
            scale={0.63}
            opacity={0}
        />
    </>)

    origFunction().offset(Vector2.right).middle([0,0]).x(1920/2-50)
    altFunction().offset(Vector2.left).middle([0,0]).x(-1920/2+50)

    yield* sequence(0.2,
        slideIn(altFunction(), 'up', 200, 1),
        slideIn(origFunction(), 'up', 200, 1),
    )

    yield* waitUntil("veer amount")
    const groupDotArrows = createRef<Node>()
    const dotArrowsVel = createRef<Line>()
    const dotArrowsWishdir = createRef<Line>()
    const labelVeerAmount = createRef<Txt>()
    const circAngle = createRef<Circle>()
    view.add(
        <Node ref={groupDotArrows}
            position={[-200, 300]}
            scale={1.2}
        >
            <Txt ref={labelVeerAmount}
                fill={'white'}
                fontFamily={"JetBrains Mono"}
                text={() => `Veer Amount: ${parseInt(Math.abs(Math.sin(degreesToRadians(dotArrowsWishdir().rotation() - dotArrowsVel().rotation())) * 100))}%`}
                offset={Vector2.left}
                opacity={0}
                position={[200, -300]}
            />
            <Line ref={dotArrowsVel} endArrow
                stroke={Colors.MINT_GREEN}
                lineWidth={20}
                lineCap={'round'}
                arrowSize={40}
                points={[0,0], [0,0]}
                rotation={10}
            />
            <Line ref={dotArrowsWishdir} endArrow
                stroke={Colors.PINK}
                lineWidth={20}
                lineCap={'round'}
                arrowSize={40}
                points={[0,0], [0,0]}
                rotation={10}
            />
            <Circle ref={circAngle}
                stroke={'white'} lineWidth={15} lineCap={'round'}
                size={270}
                startAngle={() => dotArrowsVel().rotation() - 90}
                endAngle={() => dotArrowsWishdir().rotation() - 90}
                zIndex={-1}
            />
        </Node>
    )
    yield* all(
        sequence(0.1,
            slideOut(altFunction(), 'up', 200, 1),
            slideOut(origFunction(), 'up', 200, 1),
            dotArrowsVel().points([[0,0], Vector2.down.scale(500)], 0.7),
            dotArrowsWishdir().points([[0,0], Vector2.down.scale(200)], 0.7),
            slideIn(labelVeerAmount(), 'up', 100, 0.7),
        ),
    )
    yield* dotArrowsWishdir().rotation(80, 1)

    yield* waitUntil("dot product")
    const layDotProduct = createRef<Rect>()
    const latexV = createRef<Latex>()
    const latexDot = createRef<Latex>()
    const latexW = createRef<Latex>()
    groupDotArrows().add([
        <Rect ref={layDotProduct}
            x={labelVeerAmount().middle().x}
            y={labelVeerAmount().middle().y+100}
            scale={5} opacity={0}
        >
            <Latex ref={latexV} tex="\color{#3cfca2}\vec{v}"  x={-13}
                rotation={() => -layDotProduct().rotation()}
            />
            <Latex ref={latexDot} tex="\color{#ffffff}\cdot"/>
            <Latex ref={latexW} tex="\color{#fc3c96}\hat{w}" x={13}
                rotation={() => -layDotProduct().rotation()}
            />
        </Rect>
    ])
    yield* slideIn(layDotProduct(), "down", 200, 1)

    yield* waitUntil("this impl")
    yield* sequence(0.1,
        slideOut(labelVeerAmount(), "right", 400, 1),
        groupDotArrows().position([-200,100], 1),
        all(
            layDotProduct().rotation(180, 1),
            layDotProduct().position([650,-250], 1),
            latexV().x(-17, 1),
            latexW().x(17, 1),
        ),
        chain(
            latexDot().opacity(0, 0.2),
            latexDot().tex("\\color{#ffffff}-", 0),
            latexDot().opacity(1, 0.2),
        ),
        dotArrowsVel().rotation(110, 1),
        dotArrowsWishdir().rotation(50, 1),
        dotArrowsWishdir().points([[0,0], Vector2.down.scale(300)], 1),
        circAngle().opacity(0, 0.3),
    )
    yield* waitUntil("subtracts")
    const invertedVel = dotArrowsVel().clone().opacity(0.5).zIndex(-1)
    const subtractedVector = createRef<Line>()

    const xw = dotArrowsWishdir().points()[1].y * -Math.sin(degreesToRadians(dotArrowsWishdir().rotation()))
    const yw = dotArrowsWishdir().points()[1].y * Math.cos(degreesToRadians(dotArrowsWishdir().rotation()))
    const xv = dotArrowsVel().points()[1].y * -Math.sin(degreesToRadians(dotArrowsVel().rotation()))
    const yv = dotArrowsVel().points()[1].y * Math.cos(degreesToRadians(dotArrowsVel().rotation()))

    groupDotArrows().add([
        invertedVel,
        <Line endArrow ref={subtractedVector}
            lineWidth={20} lineCap={'round'}
            arrowSize={40}
            stroke={Catppuccin.Colors.Lavender}
            zIndex={-1}
        />
    ])
    yield* sequence(0.5,
        invertedVel.position([xw - xv,yw - yv], 1),
        sequence(0.3,
            invertedVel.arrowSize(0, 0.5),
            all(
                invertedVel.startArrow(true, 0),
                invertedVel.endArrow(false, 0),
                invertedVel.arrowSize(40, 0.5),
            ),
        ),
    )

    yield* waitUntil("new vector")
    yield* subtractedVector().points([[0,0], [xw - xv,yw - yv]], 1)

    yield* waitUntil("tip of vel")
    yield* subtractedVector().position([xv,yv], 1)

    yield* waitUntil("clipped")
    const subtractedVectorClone = subtractedVector().clone().lineDash([10,50]).opacity(0.7)
    groupDotArrows().add(subtractedVectorClone)
    yield* subtractedVector().points([[0,0], [(xw - xv)*0.3, (yw - yv)*0.3]], 1)

    yield* waitFor(10)
})
