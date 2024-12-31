import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {createRef, all, sequence, chain, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic} from '@motion-canvas/core';
import {slideIn, arrowAppear} from '../presets/anims'
import {Colors} from '../presets/consts'
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    const groupMain = createRef<Node>()
    const baseCircle = createRef<Circle>()
    const vecVel = createRef<Line>()
    const vecWishvel = createRef<Line>()
    const vecAddvel = createRef<Line>()
    const dottedLineX = createRef<Line>()
    const latexPythagoras = createRef<Latex>()

    view.add(<>
        <Node ref={groupMain} position={[-600,350]}> 
            <Circle ref={baseCircle}
                fill={'white'}
                size={60}
                zIndex={0}
            />
            <Line ref={vecVel} endArrow
                stroke={Colors.WHITE}
                lineCap={'round'}
                lineWidth={30}
                arrowSize={60}
                points={[ [0,0], [0,-600] ]}
                opacity={0.5}
                zIndex={-1}
            />
            <Line ref={vecAddvel} endArrow
                position={() => vecVel().parsedPoints()[1]}
                stroke={Colors.WHITE}
                lineCap={'round'}
                lineWidth={25}
                arrowSize={50}
                points={[ [0,0], [200,0]]}
            />

            <Line ref={dottedLineX}
                stroke={'red'}
                opacity={0.5}
                lineCap={'round'}
                lineWidth={15}
                lineDash={[10, 30]}
                points={() => [ [0,0], [vecVelClone.parsedPoints()[1].x,0] ]}
                zIndex={-2}
            >
                <Txt
                    text={() => Math.ceil(vecVelClone.parsedPoints()[1].x/6.66667).toString()}
                    fontSize={60}
                    fontWeight={600}
                    fontFamily={"JetBrains Mono"}
                    fill={'red'}
                    x={() => vecVelClone.parsedPoints()[1].x/2}
                    y={60}
                />
            </Line>
        </Node>
        <Latex ref={latexPythagoras}
            tex="\color{white}|\vec{v'}| = \sqrt{30^2 + \hspace{8mm}^2} \approx \hspace{17mm}"
            height={100}
            position={[400, -100]}
        >
            <Txt
                text={() => -Math.ceil(vecVelClone.parsedPoints()[1].y/4.28571).toString()}
                fill={'white'}
                fontFamily={'Computer Modern'}
                fontSize={65}
                position={[40,14]}
            />
            <Txt
                text={() => Math.sqrt(Math.pow(-vecVelClone.parsedPoints()[1].y/4.28571, 2) + 30*30).toFixed(2).toString()}
                fill={'white'}
                fontFamily={'Computer Modern'}
                fontSize={65}
                position={[340,14]}
            />
        </Latex>
    </>)

    const vecVelClone = vecVel().clone()
        .stroke(Colors.MINT_GREEN)
        .points(() => [ [0,0], [200, vecVel().parsedPoints()[1].y] ])
        .opacity(1)
    const dottedLineY = dottedLineX().clone()
        .points(() => [ [0,0], [0, -vecVelClone.parsedPoints()[1].y] ])
        .position(() => vecVelClone.parsedPoints()[1])
        .stroke('green')
    dottedLineY.children()[0]
        .text(() => -Math.ceil(vecVelClone.parsedPoints()[1].y/4.28571).toString())
        .fill('green')
        .x(90)
        .y(600/2)
    groupMain().add([dottedLineY, vecVelClone])

    const latexPythagoras2 = latexPythagoras().clone()
        .tex("\\color{white}\\hspace{8mm} - \\hspace{8mm} = +\\hspace{8mm}")
        .height(55)
        .y(140)
        .x(0)
    latexPythagoras2.children()[0]
        .x(-50)
        .y(5)
    latexPythagoras2.children()[1]
        .x(-320)
        .y(5)
    latexPythagoras2.add(latexPythagoras2.children()[0].clone()
        .text(() => (Math.sqrt(Math.pow(-vecVelClone.parsedPoints()[1].y/4.28571, 2) + 30*30) + vecVelClone.parsedPoints()[1].y/4.28571).toFixed(2).toString())
        .x(270)
    )
    latexPythagoras().add(latexPythagoras2)

    yield* all(
        vecVel().points([[0,0],[0,-2000]], 3),
        groupMain().scale(0.4, 2.5),
    )

    yield* waitUntil("sideways vector")
    yield* vecAddvel().stroke(Catppuccin.Colors.Peach, 0.3)

    yield* waitUntil("not only")
    const vecVelClone2 = vecVelClone.clone().opacity(0.8)
    groupMain().add(vecVelClone2)
    yield* all(
        vecVelClone2.points([[0,0], [200, -600]], 0.8),
        vecAddvel().opacity(0, 0.8),
    )

    const arcHighvel = createRef<Circle>()
    const arcLowvel = createRef<Circle>()
    baseCircle().add(<>
        <Circle ref={arcHighvel}
            size={Math.sqrt(Math.pow(vecVelClone.parsedPoints()[1].x,2) + Math.pow(vecVelClone.parsedPoints()[1].y,2))*2}
            stroke={'white'}
            lineWidth={20}
            lineCap={'round'}
            startAngle={-90}
            endAngle={-90}
        />
        <Circle ref={arcLowvel}
            size={Math.sqrt(Math.pow(vecVelClone2.parsedPoints()[1].x,2) + Math.pow(vecVelClone2.parsedPoints()[1].y,2))*2}
            stroke={'white'}
            lineWidth={20}
            lineCap={'round'}
            startAngle={-90}
            endAngle={-90}
        />
    </>)

    yield* all(
        arcHighvel().endAngle(5.8-90, 1),
        arcLowvel().endAngle(19-90, 1),
    )

    yield* waitUntil("overall speedgain")
    yield* latexPythagoras2.children()[2].fill(Colors.PINK, 0.5)

    yield* waitFor(10)
})
