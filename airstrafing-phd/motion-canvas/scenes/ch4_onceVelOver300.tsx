import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Layout, Rect, Img} from '@motion-canvas/2d';
import {CodeBlock, lines, word, edit, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeOutBounce} from '@motion-canvas/core';
import {slideIn, slideOut, arrowAppear, wiggleSine} from '../presets/anims'
import {degreesToRadians} from '../components/Utils'
import {Colors} from '../presets/consts'
import {Catppuccin} from '../theme/catppuccin'
import padlockSVG from '../../images/padlock.svg'

export default makeScene2D(function* (view) {

    const groupMain = createRef<Node>()
    const innerGroupMain = createRef<Node>()
    const baseCircle = createRef<Circle>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const labelVel = createRef<Txt>()
    const grid = createRef<Grid>()
    const mainMask = createRef<Rect>()

    view.add(<Node ref={groupMain} cache>
        <Rect ref={mainMask}
            fill={'white'}
            radius={50}
        />
        <Node ref={innerGroupMain} compositeOperation={'source-in'}>
            <Circle ref={baseCircle}
                fill={'white'}
                size={40}
                zIndex={2}
                scale={0}
            />
            <Grid ref={grid}
                width={"100%"} height={"100%"}
                scale={1.6}
                stroke={'white'}
                zIndex={-2}
            />
            <Grid
                width={"100%"} height={"100%"}
                scale={20}
                lineWidth={0.3}
                stroke={'white'}
                zIndex={-2}
            />
            <Line ref={vecVel} endArrow
                stroke={Colors.MINT_GREEN}
                lineCap={'round'}
                lineWidth={20}
                arrowSize={40}
                rotation={10}
                points={[Vector2.zero, Vector2.zero]}
            >
                <Txt ref={labelVel}
                    fill={Colors.MINT_GREEN}
                    fontFamily={'JetBrains Mono'}
                    fontWeight={600}
                    text={() => (Math.floor(Math.abs(vecVel().arcLength()/1.5))).toString()}
                    rotation={() => -vecVel().rotation()}
                    position={() => [100, -vecVel().arcLength()/2 + vecVel().arrowSize()/2]}
                />
            </Line>
            <Line ref={vecWishvel} endArrow
                stroke={Colors.PINK}
                lineCap={'round'}
                lineWidth={20}
                arrowSize={40}
                points={[Vector2.zero, Vector2.zero]}
                zIndex={1}
            />
        </Node>
        <Rect
            size={() => mainMask().size()}
            stroke={'grey'}
            lineWidth={10}
            radius={50}
        />
    </Node>)

    yield* all(
        arrowAppear(vecVel(), 200, 1),
        baseCircle().scale(1, 1),
        mainMask().size(1000, 1),
    )

    yield* waitUntil("over 300")
    yield* vecVel().points([Vector2.zero, Vector2.down.scale(300*1.5)], 1)
    
    const lineXcomponent = createRef<Line>()
    innerGroupMain().add(<Line ref={lineXcomponent}
        lineWidth={15}
        lineCap={'round'}
        stroke={'red'}
        points={[Vector2.zero, Vector2.zero]}
        zIndex={-1}
    >
        <Txt
            fontFamily={'JetBrains Mono'}
            text={() => (Math.floor(lineXcomponent().arcLength()/1.5)).toString()}
            position={() => [lineXcomponent().arcLength()/2, lineXcomponent().lineWidth()*4]}
            fontWeight={600}
            zIndex={1}
            fill={'red'}
            opacity={0}
        />
    </Line>)
    const lineYcomponent = lineXcomponent().clone()
        .points([Vector2.zero, Vector2.zero])
        .stroke('green')
    lineYcomponent.children()[0]
        .fill('green')
        .text(() => (Math.floor(lineYcomponent.arcLength()/1.5).toString()))
        .position(() => [-lineYcomponent.lineWidth()*5, -lineYcomponent.arcLength()/2])
    innerGroupMain().add(lineYcomponent)

    yield* all(
        chain(
            waitUntil("x component"),
            all(
                lineXcomponent().points(() => [Vector2.zero, Vector2.right.scale(Math.sin(degreesToRadians(vecVel().rotation())) * vecVel().arcLength())], 1, easeOutCubic),
                lineXcomponent().children()[0].opacity(1, 1, easeOutCubic),
            )
        ),
        chain(
            waitUntil("y component"),
            all(
                lineYcomponent.points(() => [Vector2.zero, Vector2.down.scale(Math.cos(degreesToRadians(vecVel().rotation())) * vecVel().arcLength())], 1, easeOutCubic),
                lineYcomponent.children()[0].opacity(1, 1, easeOutCubic),
            )
        ),
    )

    yield* waitUntil("check if >150")
    const layoutCompTrue = createRef<Rect>()
    const compElement = createRef<Txt>()
    const groupComps = createRef<Node>()
    view.add(<Node ref={groupComps} position={[420,-220]}>
        <Rect layout ref={layoutCompTrue}
            gap={40}
            scale={0.9}
            opacity={0}
        >
            <Txt ref={compElement}
                fontFamily={'JetBrains Mono'}
                fontWeight={600}
                fontSize={60}
                text={"295"}
                fill={'green'}
            />
        </Rect>
    </Node>)

    layoutCompTrue().add([
        compElement().clone()
            .text(">")
            .fill(Catppuccin.Colors.Text),
        compElement().clone()
            .text("150")
            .fill(Catppuccin.Colors.Peach),
        compElement().clone()
            .text("==")
            .fill(Catppuccin.Colors.Text)
            .opacity(0),
        compElement().clone()
            .text("true")
            .fill(Catppuccin.Colors.Green)
            .opacity(0),
    ])

    const layoutCompFalse = layoutCompTrue().clone()
        .y(120)
    layoutCompFalse
        .children()[0]
            .text("52")
            .fill("red")
    layoutCompFalse
        .children()[4]
            .text("false")
            .fill(Catppuccin.Colors.Red)
    groupComps().add(layoutCompFalse)
    
    yield* all(
        sequence(0.3,
             slideIn(layoutCompTrue(), 'up', 100, 0.5),
             slideIn(layoutCompFalse, 'up', 100, 0.5),
        ),
        labelVel().opacity(0, 0.3),
    )

    yield* waitUntil("for whichever")
    yield* sequence(0.1,
        layoutCompTrue().children()[3].opacity(1, 0.5),
        layoutCompTrue().children()[4].opacity(1, 0.5),
        layoutCompFalse.children()[3].opacity(1, 0.5),
        layoutCompFalse.children()[4].opacity(1, 0.5),
    )

    yield* waitUntil("true")
    yield* all(
        slideOut(layoutCompFalse, 'down', 100, 1),
        lineXcomponent().points([Vector2.zero, Vector2.zero], 0.5),
        lineXcomponent().opacity(0, 0.5),
    )

    yield* waitUntil("locks")
    const lockedOffQuadrants = createRef<Rect>()
    const padlock1 = createRef<Img>()
    const padlock2 = createRef<Img>()
    innerGroupMain().add(<>
        <Rect ref={lockedOffQuadrants}
            size={[2000,0]}
            fill={'red'}
            zIndex={-3}
            opacity={0.5}
        />
        <Img ref={padlock1} src={padlockSVG}
            size={200}
            position={[-250,250]}
            opacity={0}
        />
        <Img ref={padlock2} src={padlockSVG}
            size={200}
            position={[250,250]}
            opacity={0}
        />
    </>)
    yield* all(
        lockedOffQuadrants().size([2000,1000], 2),
        lockedOffQuadrants().top(Vector2.down, 2),
        sequence(0.2,
            slideIn(padlock1(), 'down', 70, 1),
            slideIn(padlock2(), 'down', 70, 1),
        )
    )

    yield* waitUntil("wishvelocity")
    yield* all(
        arrowAppear(vecWishvel(), 150, 1),
        lineYcomponent.opacity(0, 1),
        layoutCompTrue().opacity(0, 1),
    )
    yield* sequence(0.42,
        vecWishvel().rotation(90, 1.2, easeOutBounce),
        chain(
            padlock2().rotation(20, 0.3, wiggleSine),
            padlock2().rotation(0, 0),
        ),
    ) 

    yield* waitUntil("either")
    yield* sequence(0.42,
        vecWishvel().rotation(-90, 1.2, easeOutBounce),
        chain(
            padlock1().rotation(20, 0.3, wiggleSine),
            padlock1().rotation(0, 0),
        ),
    ) 

    yield* waitUntil("the way")
    yield* all(
        groupMain().x(-400, 2),
        vecWishvel().rotation(-135, 1),
    )

    yield* waitUntil("taking x")
    const cbXcomponent = createRef<CodeBlock>()
    view.add(<CodeBlock ref={cbXcomponent}
        fontFamily={"JetBrains Mono"}
        theme={Catppuccin.Theme}
        language={"js"}
        code={`wish_velocity.x`}
        opacity={0}
        position={[150,0]}
        center={Vector2.left}
        offset={Vector2.left}
    />)
    yield* slideIn(cbXcomponent(), 'up', 70, 0.5)

    yield* waitUntil("taking y")
    yield* cbXcomponent().edit(1,false)`wish_velocity.x${insert('\n\nwish_velocity.y')}`

    yield* waitUntil("setting to 0")
    yield* cbXcomponent().edit(1,false)`wish_velocity.x${insert(' = 0')}\n\nwish_velocity.y${insert(' = 0')}`

    yield* waitUntil("if they happen")
    yield* cbXcomponent().edit(1,false)`${insert(`if (wish_velocity.x >= 150)\n    `)}wish_velocity.x = 0\n\n${insert(`if (wish_velocity.y >= 150)\n    `)}wish_velocity.y = 0`

    yield* waitUntil("squishing down")
    const vecWishvelGhost = vecWishvel().clone()
        .stroke('white')
        .opacity(0)
    groupMain().add(vecWishvelGhost)
    yield* sequence(0.3,
        vecWishvel().points([Vector2.zero, Vector2.topRight.scale(Math.sqrt((vecWishvel().arcLength()*vecWishvel().arcLength())/2) / Math.sqrt(2))], 1),
        vecWishvelGhost.opacity(0.5, 1),
    )

    yield* waitFor(10)
})

