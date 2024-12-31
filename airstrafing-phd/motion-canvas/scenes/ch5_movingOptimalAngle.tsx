import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect, Img} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInCubic, easeInOutQuad, easeOutElastic, linear} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut} from '../presets/anims'
import {Colors} from '../presets/consts'
import {Key, WASDKeys} from '../components/Key'
import {degreesToRadians} from '../components/Utils'
import copySVG from '../../images/icon_copy.svg'

export default makeScene2D(function* (view) {

    const groupAccelGraph = createRef<Node>()
    const maskAccelGraph = createRef<Rect>()
    const groupAccelGraphInner = createRef<Node>()
    const drawLine = createRef<Line>()
    const label90 = createRef<Txt>()
    const labelVelocity = createRef<Txt>()

    const speed = createSignal(0)
    const angleRange = createSignal(0)

    view.add(<>
        <Node cache ref={groupAccelGraph} y={100}>
            <Rect ref={maskAccelGraph}
                fill={'white'}
                width={1920/1.5}
                height={1080/1.5}
            />
            <Node ref={groupAccelGraphInner}
                scale={3}
                compositeOperation={'source-in'}
            >
                <Grid // base grid
                    width={"2000%"} height={"2000%"}
                    scale={0.563} // bleh but lines up the 3rd line with 90 degrees}
                    stroke={'white'}
                    opacity={0.5}
                    zIndex={-2}
                />
                <Grid // 0-lines
                    width={"100%"} height={"100%"}
                    scale={10}
                    lineWidth={0.2}
                    stroke={'white'}
                    zIndex={-2}
                />
                <Line ref={drawLine}
                    lineWidth={5}
                    lineCap={'round'}
                    stroke={Colors.MINT_GREEN}
                    points={() => {
                        let arr = []
                        for (let i=-720; i<720; i++) {
                            arr.push(new Vector2(i*(1/0.67)/4, -speedgain(speed(), i/4)))
                        }
                        return arr
                    }}
                />
                <Txt ref={label90}
                    fontFamily={"JetBrains Mono"}
                    fill={'white'}
                    opacity={0.5}
                    text={'90°'}
                    scale={0.3}
                    position={[-117,15]}
                />
            </Node>
        </Node>
        <Txt ref={labelVelocity}
            fill={'white'}
            fontFamily={"JetBrains Mono"}
            offset={Vector2.left}
            text={() => `velocity = ${parseInt(speed())}`}
            position={[-650, -460]}
        />
    </>)
    const labelWishspeed = labelVelocity().clone()
        .text("wish_speed = 300")
        .opacity(0)
    view.add(labelWishspeed)
    maskAccelGraph().filters.blur(50)
    groupAccelGraphInner().add(
        label90().clone()
            .x(152)
    )

    yield* waitUntil("as you gain speed")
    yield* speed(300, 3)

    yield* waitUntil("gradually move")
    yield* all(
        speed(450, 6),
        chain(
            waitUntil("wishspeed"),
            all(
                labelWishspeed.opacity(1, 0.5),
                labelWishspeed.position(() => [labelVelocity().x(), labelVelocity().y()+80], 0.5, easeOutCubic),
            )
        )
    )

    const groupArrows = groupAccelGraph().clone()
        .scale(0.7)
        .position([550,170])
    for (let i=0; i<3; i++)
        groupArrows.children()[1].children()[2].remove()
    const groupArrowsMask = groupArrows.children()[0]
        .width(700)
        .height(1000)
        .y(-150)
        .scale(0)
    const groupArrowsInner = groupArrows.children()[1]
    const zeroLines = groupArrowsInner.children()[1]
    const arrowVel = createRef<Line>()
    groupArrowsInner.add(<>
        <Line ref={arrowVel} endArrow
            points={[Vector2.zero, Vector2.down.scale(220)]}
            stroke={Colors.MINT_GREEN}
            lineWidth={8}
            lineCap={"round"}
            arrowSize={20}
        />
        <Circle
            size={100}
            stroke={Catppuccin.Colors.Peach}
            lineWidth={6}
            lineCap={"round"}
            startAngle={() => (-angleRange()/4.3)-90}
            endAngle={() => (angleRange()/4.3)-90}
        />
    </>)
    view.add(groupArrows)

    yield* waitUntil("(transition)")
    yield* all(
        groupAccelGraph().position([-360,170], 3),
        groupAccelGraph().scale(0.7, 3),
        labelVelocity().position([-820, -400], 3),
        groupArrowsMask.scale(1, 3),
    )

    yield* waitUntil("current velocity")
    yield* labelVelocity().fill(Colors.MINT_GREEN, 0.5)
    yield* waitFor(0.5)
    yield* labelVelocity().fill('white', 0.5)

    yield* waitUntil("bigger than wishspeed")
    yield* labelWishspeed.fill(Colors.MINT_GREEN, 0.5)
    yield* waitFor(0.5)
    yield* labelWishspeed.fill('white', 0.5)

    yield* waitUntil("range of angles")
    const lineAngleRange = createRef<Line>()
    groupAccelGraph().add(<Line ref={lineAngleRange}
        points={() => [Vector2.left.scale(angleRange()), Vector2.right.scale(angleRange())]}
        scale={0}
        stroke={Catppuccin.Colors.Peach}
        lineWidth={15}
        lineCap={'round'}
        y={-50}
    />)
    yield* all(
        angleRange(190, 1),
        lineAngleRange().scale(1,0.2),
    )

    yield* waitUntil("clamped to 0")
    const clampSnippet = createRef<CodeBlock>()
    view.add(<CodeBlock ref={clampSnippet}
        fontFamily={'JetBrains Mono'}
        theme={Catppuccin.Theme}
        code={`
add_speed = wish_speed - current_speed;
if (add_speed <= 0)
    return;`}
        opacity={0}
        scale={0.9}
    />)
    yield* all(
        clampSnippet().opacity(1,0.5),
        clampSnippet().scale(1,1,easeOutCubic),
        groupAccelGraph().opacity(0.3, 1),
        groupArrows.opacity(0.3, 1),
        labelVelocity().opacity(0, 1),
        labelWishspeed.opacity(0, 1),
    )

    yield* waitUntil("rotate wishdir")
    const arrowWishdir = createRef<Line>()
    const lineWishdir = createRef<Line>()
    const wishdirRotation = createSignal(0)
    groupArrowsInner.add(<Line ref={arrowWishdir} endArrow
        points={[Vector2.zero]}
        lineWidth={6}
        arrowSize={15}
        lineCap={'round'}
        stroke={Catppuccin.Colors.Sapphire}
        rotation={() => wishdirRotation()}
    />)
    groupAccelGraphInner().add(<Line ref={lineWishdir}
        points={[Vector2.zero]}
        lineWidth={3}
        lineCap={'round'}
        stroke={Catppuccin.Colors.Sapphire}
        x={() => wishdirRotation() * 1.5}
    />)
    yield* all(
        clampSnippet().position([-300,-360], 1),
        groupAccelGraph().opacity(1, 1),
        groupArrows.opacity(1, 1),
        arrowWishdir().points([Vector2.zero, Vector2.down.scale(80)], 1.5),
        lineWishdir().points([Vector2.up.scale(150), Vector2.down.scale(150)], 1.5),
        wishdirRotation(30, 2),
    )
    yield* wishdirRotation(-0, 2)

    yield* waitUntil("current")
    yield* clampSnippet().selection(word(0,25,13), 0.3)

    yield* waitUntil("wish")
    yield* clampSnippet().selection(word(0,12,11), 0.3)

    yield* waitUntil("stuck to 0")
    yield* clampSnippet().selection(word(2,4,6), 0.3)

    yield* waitUntil("the bigger that difference")
    labelWishspeed.y(-300)
    yield* all(
        speed(900, 4),
        angleRange(0, 1),
        sequence(0.2,
            clampSnippet().opacity(0, 0.4),
            slideIn(labelVelocity(), 'down', 100, 1),
            slideIn(labelWishspeed, 'down', 100, 1),
        ),
    )
    const labelCurrentspeed = labelVelocity().clone()
        .text(() => `current_speed = ${parseInt(Math.cos(degreesToRadians(wishdirRotation()))*900)}`)
        .opacity(0)
    view.add(labelCurrentspeed)
    yield* all(
        wishdirRotation(71, 4),
        chain(
            slideOut(labelVelocity(), 'up', 100, 1),
            slideIn(labelCurrentspeed, 'down', 100, 1),
        )
    )

    yield* waitUntil("get some accel")
    const bracket = createRef<Txt>()
    const labelAddspeed = labelVelocity().clone()
        .text(() => `add_speed = ${300 - parseInt(Math.cos(degreesToRadians(wishdirRotation()))*900)}`)
        .position([-160, -350])
    view.add([
        labelAddspeed,
        <Txt ref={bracket}
            text={'}'}
            fontFamily={'JetBrains Mono'}
            scale={3}
            fill={'white'}
            position={[-220, -340]}
            opacity={0}
        />
    ])
    yield* sequence(0.2,
        slideIn(labelAddspeed, 'right', 100, 1),
        slideIn(bracket(), 'right', 50, 1),
    )

    yield* waitUntil("a nice way to visualize this")
    yield* all(
        maskAccelGraph().scale(0, 1),
        groupAccelGraph().x(-500, 1, easeInCubic),
        sequence(0.1,
            slideOut(labelCurrentspeed, 'left', 100, 1),
            slideOut(labelWishspeed, 'left', 100, 1),
            slideOut(bracket(), 'left', 100, 1),
            slideOut(labelAddspeed, 'left', 100, 1),
        ),

        groupArrows.position([0,0], 1),
        groupArrowsMask.position([0,0], 1),
        groupArrowsMask.width(2500, 1),
        groupArrowsMask.height(1300, 1),
        groupArrowsInner.y(500, 1),

        arrowWishdir().points([Vector2.zero], 1),
    )

    yield* waitUntil("copy")
    const copyIcon = createRef<Img>()
    groupArrowsInner.add(<Img ref={copyIcon} src={copySVG}
        size={40}
        position={[50, -200]}
    />)
    const arrowVelCopy = arrowVel().clone()
        .points(() => [Vector2.zero, Vector2.down.scale(arrowVel().height())])
    groupArrowsInner.add([arrowVelCopy,
    ])
    yield* arrowVelCopy.stroke('white', 0),
    yield* all(
        copyIcon().opacity(0, 1),
        copyIcon().y(-230, 1, easeInCubic),
        arrowVelCopy.stroke(Colors.MINT_GREEN, 0.5),
        arrowVelCopy.opacity(0.5, 0.5),
    )

    yield* waitUntil("rotating it")
    const lineWishspeed = createRef<Line>()
    const lineWishspeedLabel = createRef<Txt>()
    groupArrowsInner.add(
        <Line ref={lineWishspeed}
            points={[Vector2.left.scale(8000), Vector2.right.scale(8000)]}
            lineCap={'round'}
            stroke={Catppuccin.Colors.Peach}
            zIndex={-1}
        >
            <Txt ref={lineWishspeedLabel}
                fontFamily={"JetBrains Mono"}
                fontSize={30}
                fill={() => lineWishspeed().stroke()}
                text={'300'}
                position={[235, -25]}
                opacity={() => lineWishspeed().lineWidth()/6}
            />
        </Line>
    )
    yield* all(
        arrowVelCopy.rotation(65, 4),
        chain(
            waitUntil("line at height"),
            all(
                lineWishspeed().y(-90, 1),
                lineWishspeed().lineWidth(6, 1),
            ),
        ),
    )

    yield* waitUntil("as we increase")
    yield* all(
        lineWishspeedLabel().opacity(0, 1),
        arrowVel().points([Vector2.zero, Vector2.down.scale(300)], 4),
    )

    yield* waitUntil("more rotation")
    yield* arrowVelCopy.rotation(72, 1)

    yield* waitUntil("line in relation")
    yield* all(
        groupArrowsInner.scale(0.4, 3),
        zeroLines.scale(3*10/0.4, 3),
        lineWishspeed().scale(1/0.4, 3),
        arrowVel().scale(1/0.2, 3),
        arrowVelCopy.scale(1/0.2, 3),
    )

    yield* waitUntil("necessary rotation")
    yield* arrowVelCopy.rotation(86, 3)


    yield* waitFor(10)
})

function speedgain(speed: Number, rotation: Number): Number {
    const wish_speed = 300
    const current_speed = Math.cos(degreesToRadians(rotation)) * speed
    const add_speed = Math.max(wish_speed - current_speed, 0)
    const accel_speed = Math.min(1 * 300 * (1/60), add_speed)

    const vecAddSpeed = new Vector2(
        Math.sin(degreesToRadians(rotation)) * accel_speed,
        Math.cos(degreesToRadians(rotation)) * accel_speed
    )
    const vecNewVel = new Vector2(vecAddSpeed.x, speed + vecAddSpeed.y)
    const newSpeed = Math.sqrt(vecNewVel.x*vecNewVel.x + vecNewVel.y*vecNewVel.y)
    const speedgain = newSpeed - speed
    return speedgain * 10
}
