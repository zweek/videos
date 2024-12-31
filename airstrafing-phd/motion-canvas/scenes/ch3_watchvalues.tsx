import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInOutQuad} from '@motion-canvas/core';
import {cancel} from "@motion-canvas/core/lib/threading"
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut} from '../presets/anims'
import {SV_AirAccelerate_code, Colors} from '../presets/consts'

export default makeScene2D(function* (view) {

    const groupArrows = createRef<Node>()
    const groupAccelGraph = createRef<Node>()

    const velocity = new Vector2(0,320)
    const wish_speed = 30

    const groupValueDisplays = createRef<Node>()
    const cbWishSpeed = createRef<CodeBlock>()
    const groupArrowsInner = createRef<Node>()
    const maskArrows = createRef<Rect>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const ninetyLine = createRef<Line>()

    const SV_AirAccelerate = createRef<CodeBlock>()

    const angle = createSignal(0)
    const current_speed = createSignal(() => Math.cos(angle()*Math.PI/180) * 320)
    const add_speed = createSignal(() => Math.max(wish_speed - current_speed(), 0))
    const accel_speed = createSignal(() => Math.min(10*320*(1/60), add_speed()))

    const vecAddSpeed = createSignal(() => new Vector2(
        Math.sin(angle() * Math.PI/180) * add_speed(),
        Math.cos(angle() * Math.PI/180) * add_speed()
    ))
    const vecNewVel = createSignal(() => new Vector2(velocity.x + vecAddSpeed().x, velocity.y + vecAddSpeed().y))
    const newSpeed = createSignal(() => Math.sqrt(vecNewVel().x*vecNewVel().x + vecNewVel().y*vecNewVel().y))
    const speedgain = createSignal(() => newSpeed() - 320)

    const ninetyLineScale = createSignal(0)

    view.add(<>
        <Node ref={groupValueDisplays}>
            <CodeBlock ref={cbWishSpeed}
                language="c#"
                fontFamily={'JetBrains Mono'}
                theme={Catppuccin.Theme}
                code={() => `wish_speed = 30`}
                offset={Vector2.left}
                position={[200, -250]}
                opacity={0}
            />
        </Node>

        <Node cache ref={groupArrows}>
            <Rect ref={maskArrows}
                fill={'white'}
                width={1920/2}
                height={1080}
                x={-1920/4}
            />
            <Node ref={groupArrowsInner}
                scale={3}
                compositeOperation={'source-in'}
            >
                <Grid // base grid
                    width={"200%"} height={"200%"}
                    scale={0.5}
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
                <Circle
                    fill={'white'}
                    size={30}
                    zIndex={0}
                />
                <Line ref={vecVel} endArrow
                    stroke={Colors.MINT_GREEN}
                    lineCap={'round'}
                    lineWidth={15}
                    arrowSize={30}
                    points={() => [Vector2.zero, Vector2.down.scale(400)]}
                    zIndex={-1}
                />
                <Line ref={vecWishvel} endArrow
                    stroke={Colors.PINK}
                    lineCap={'round'}
                    lineWidth={15}
                    arrowSize={30}
                    points={() => [Vector2.zero, Vector2.down.scale(120)]}
                    zIndex={-1}
                    rotation={() => angle()}
                />
                <Circle
                    stroke={'white'}
                    lineWidth={7}
                    lineCap={'round'}
                    startAngle={() => angle() >= 0 ? 0 - 90 : angle() - 90}
                    endAngle={() => angle() >= 0 ? angle() - 90 : 0 - 90} // prevents wraparound when arrow is on the left side
                    size={120*2}
                    zIndex={-2}
                />
                <Line ref={ninetyLine}
                    points={() => [Vector2.left.scale(ninetyLineScale()), Vector2.right.scale(ninetyLineScale())]}
                    lineWidth={3}
                    lineCap={'round'}
                    stroke={Catppuccin.Colors.Sky}
                    zIndex={-2}
                />
            </Node>
        </Node>

        <CodeBlock ref={SV_AirAccelerate}
            theme={Catppuccin.Theme}
            fontFamily={'JetBrains Mono'}
            code={SV_AirAccelerate_code}
            x={1300}
            scale={1.2}
            opacity={0}
        />
    </>)
    maskArrows().filters.blur(50)

    groupArrowsInner().position(() => [
        -300 + Math.sin(angle() * Math.PI/180) * vecWishvel().parsedPoints()[1].y * 3,
        -Math.cos(angle() * Math.PI/180) * vecWishvel().parsedPoints()[1].y * 3
    ])

    const textVerticalDistance = 150;
    const cbCurrentSpeed = cbWishSpeed().clone()
        .code(() => `current_speed = ${Math.floor(current_speed())}`)
        .y(cbWishSpeed().y() + textVerticalDistance*1)
    const cbAddSpeed = cbWishSpeed().clone()
        .code(() => `add_speed = ${Math.ceil(add_speed())}`)
        .y(cbWishSpeed().y() + textVerticalDistance*2)
    const cbAccelSpeed = cbWishSpeed().clone()
        .code(() => `accel_speed = ${Math.ceil(accel_speed())}`)
        .y(cbWishSpeed().y() + textVerticalDistance*3)
    groupValueDisplays().add([cbCurrentSpeed, cbAddSpeed, cbAccelSpeed])

    yield* sequence(0.1,
        slideIn(cbWishSpeed(), 'up', 80, 0.5),
        slideIn(cbCurrentSpeed, 'up', 80, 0.5),
        slideIn(cbAddSpeed, 'up', 80, 0.5),
        slideIn(cbAccelSpeed, 'up', 80, 0.5),
    )

    yield* waitUntil("specifically")
    yield* all(
        cbWishSpeed().opacity(0.3,1),
        cbAddSpeed.opacity(0.3,1),
        cbAccelSpeed.opacity(0.3,1),
    )
    yield* cbAddSpeed.opacity(1,1)

    yield* waitUntil("music cue")
    yield* angle(90, 4.8)

    yield* waitUntil("once")
    yield* angle(75, 1)
    yield* all(
        angle(84.8, 3),
        all(
            cbCurrentSpeed.scale(1.2, 1.5),
            cbAddSpeed.scale(1.2, 1.5),
        )
    )

    yield* waitUntil("addspeed above 0")
    yield* cbAddSpeed.scale(1.3, 0.5)

    yield* waitUntil("continue")
    SV_AirAccelerate().selection(lines(10,11))
    yield* all(
        slideOut(groupValueDisplays(), 'left', 500, 1),
        slideIn(SV_AirAccelerate(), 'left', 500, 1),
    )

    yield* waitUntil("from here")
    yield* all(
        slideIn(groupValueDisplays(), 'right', 300, 1),
        slideOut(SV_AirAccelerate(), 'right', 500, 1),
    )
    yield* angle(90, 4, easeInOutQuad)
    
    yield* waitUntil("simulating")
    yield* all(
        slideOut(groupValueDisplays(), 'right', 300, 1),
        groupArrowsInner().position([-500,350], 1),
        groupArrowsInner().scale(2,1),
        angle(84.7, 1)
    )
    yield* waitUntil("switch")
    yield* angle(-84.7, 0.7)

    yield* waitUntil("but thanks to")
    cbAddSpeed.scale(1.2)
    cbWishSpeed().opacity(0)
    cbAccelSpeed.opacity(0)
    groupValueDisplays().y(-300)
    yield* all(
        slideIn(groupValueDisplays(), 'left', 300, 1),
        sequence(0.3,
            angle(0, 1),
            all(
                groupArrowsInner().scale(3,1.5),
                groupArrowsInner().position(() => [
                    -300 + Math.sin(angle() * Math.PI/180) * vecWishvel().parsedPoints()[1].y * 3,
                    -Math.cos(angle() * Math.PI/180) * vecWishvel().parsedPoints()[1].y * 3
                ], 1.5),
            )
        )
    )

    yield* waitUntil("30 unit threshold")

    const maskAccelGraph = createRef<Rect>()
    const dot = createRef<Circle>()
    const drawLine = createRef<Line>()
    const groupAccelGraphInner = createRef<Node>()

    view.add(<Node cache ref={groupAccelGraph} position={[280,200]}>
        <Rect ref={maskAccelGraph}
            fill={'white'}
            x={250}
        />
        <Node ref={groupAccelGraphInner}
            scale={3}
            compositeOperation={'source-in'}
        >
            <Grid // base grid
                width={"200%"} height={"200%"}
                scale={0.563} // bleh but lines up the 3rd line with 90 degrees
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
            <Circle ref={dot}
                size={10}
                fill={'white'}
                x={() => angle() * 1.5}
                y={() => -speedgain() * 10}
                zIndex={1}
            />
            <Line ref={drawLine}
                lineWidth={5}
                lineCap={'round'}
                stroke={Colors.MINT_GREEN}
                points={[Vector2.zero]}
            />
        </Node>
    </Node>)
    maskAccelGraph().filters.blur(20)

    const task = yield loop(Infinity, () => plotLine(drawLine(), dot()))
    yield* all(
        maskAccelGraph().width(1920/3, 0.3),
        maskAccelGraph().height(1080/3, 0.3),
        angle(90, 5),
    )
    yield* waitUntil("this leniency")
    yield* angle(95.3, 2)

    yield* waitUntil("bigger than 90")
    groupAccelGraphInner().add(
        ninetyLine().clone()
            .rotation(-90)
            .x(90+45)
            .lineWidth(2)
    )
    yield* ninetyLineScale(300, 1)

    yield* waitUntil("also more punishing")
    yield* angle(110, 2)
    cancel(task)

    yield* waitUntil("See,")
    yield* all(
        slideOut(groupValueDisplays(), 'up', 500, 1),
        groupArrows().scale(0.5,1),
        groupArrows().position([-400,300], 1),
        maskArrows().height(1920/3, 1),
        maskArrows().filters.blur(20, 1),
        groupArrowsInner().position([-500,150], 1),
        groupAccelGraph().position([-100,0], 1),
        groupAccelGraph().scale(1.5, 1),
        maskAccelGraph().height(600, 1),
        angle(60,2),
    )
    yield* angle(86, 2)

    yield* waitUntil("overstrafing")
    dot().fill(() => dot().y() > 0 ? Colors.PINK : 'white')
    yield* angle(100, 2)

    yield* waitUntil("leniency range")
    const lineLeniencyRange = createRef<Line>()
    view.add(
        <Line ref={lineLeniencyRange}
            position={[470,-100]}
            lineWidth={15} lineCap={'round'}
            stroke={Catppuccin.Colors.Peach}
            points={[Vector2.zero, Vector2.right.scale(0)]}
            opacity={0}
        >
            <Txt
                text={'leniency range'}
                fill={Catppuccin.Colors.Peach}
                fontFamily={'JetBrains Mono'}
                x={-250}
            />
        </Line>
    )
    yield* all(
        slideIn(lineLeniencyRange(), 'down', 50, 0.5),
        lineLeniencyRange().points([Vector2.zero, Vector2.right.scale(80)], 1),
    )

    yield* waitUntil("because now")
    vecVel().add(<Line endArrow
        lineWidth={10}
        lineCap={'round'}
        stroke={() => Colors.WHITE.lerp(Colors.PINK, dot().y()/300, 'rgb')}
        position={() => vecVel().parsedPoints()[1]}
        points={() => [Vector2.zero, Vector2.down.scale(add_speed())]}
        rotation={() => angle()}
    />)
    yield* all(
        slideOut(lineLeniencyRange(), 'up', 50, 0.5),
        slideIn(groupValueDisplays(), 'down', 50, 1),
        angle(90, 1),
        groupArrows().scale(1, 1),
        groupArrows().position([0,0], 1),
        groupArrowsInner().position([-500,350], 1),
        groupArrowsInner().scale(2,1),
        maskArrows().filters.blur(50, 1),
        maskArrows().width(1920/2, 1),
        maskArrows().height(1080, 1),
        groupAccelGraph().scale(1, 1),
        groupAccelGraph().position([250,200], 1),
        maskAccelGraph().width(1920/3, 1),
        maskAccelGraph().height(1080/3, 1),
    )
    yield* angle(110, 3)

    yield* waitUntil("because current_speed")
    yield* all(
        cbCurrentSpeed.scale(1.25, 1),
        cbAddSpeed.scale(1, 1),
        cbAddSpeed.opacity(0.3, 1),
    )

    yield* waitUntil("negative")
    yield* cbCurrentSpeed.selection(word(0,16,4), 0.3)

    yield* waitUntil("it results")
    yield* all(
        cbCurrentSpeed.selection(DEFAULT, 0.3),
        cbCurrentSpeed.scale(1.1, 1),
        cbAddSpeed.scale(1.1, 1),
        cbAddSpeed.opacity(1, 1),
        angle(180, 2),
    )

    yield* waitFor(10)
})

function* plotLine(line: Line, dot: Node): ThreadGenerator {
        line.points([...line.points(), dot.position()])
        yield
}
