import {makeScene2D, Circle, Line, Node, Txt, Latex, Rect} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, chain, sequence, waitUntil, waitFor, Vector2, createSignal, makeRef, easeInCubic, tween, map, easeOutCubic, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view)
{
    const MINT_GREEN = '3cfca2';
    const PINK = 'fc3c96';

    const VectorNormalize = createRef<CodeBlock>()
    const arrLeft = createRef<Line>()
    const arrLength = 150

    const baseCircleLeft = createRef<Circle>()
    const vecNormalized = createRef<Line>()
    const vecNormalizedScale = createSignal(400)

    const questionMark = createRef<Txt>()

    view.add (
        <>
            <CodeBlock ref={VectorNormalize}
                language="c#"
                fontFamily={'JetBrains Mono'}
                code={`VectorNormalize()`}
                y={-200} opacity={0}
            />

            <Line ref={arrLeft} endArrow
                lineCap={'round'}
                stroke={'white'}
                lineWidth={10}
                rotation={180+45}
                points={[Vector2.zero, Vector2.zero]} opacity={0}
            />

            <Circle ref={baseCircleLeft}
                position={[-350,350]}
                fill={'white'}
                zIndex={0}
            />
            <Line ref={vecNormalized} endArrow
                position={baseCircleLeft().position()}
                zIndex={-1}
                stroke={MINT_GREEN}
                lineCap={'round'}
                lineWidth={15}
                arrowSize={30}
                opacity={0} points={() => [Vector2.zero, Vector2.down.scale(vecNormalizedScale())]}
            >
                <Txt
                    text={() => vecNormalizedScale() < 80 ? '0' : (vecNormalizedScale() - 80).toFixed(0).toString()}
                    fontFamily={'JetBrains Mono'}
                    fontWeight={600}
                    fill={MINT_GREEN}
                    right={() => [-60, -vecNormalizedScale()/2]}
                    opacity={() => vecNormalizedScale() / 80}
                />
            </Line>
            <Txt ref={questionMark}
                text={'?'}
                fill={'white'}
                fontFamily={'Comic Sans MS'}
                fontSize={300}
                y={350} opacity={0} rotation={-20}
            />
        </>
    )

    const arrRight = arrLeft().clone().rotation(90+45)
    view.add(arrRight)

    const baseCircleRight = baseCircleLeft().clone()
        .x(-baseCircleLeft().x())
    const vecReturnLength = vecNormalized().clone()
        .position(baseCircleRight.position())
        .points([Vector2.zero, Vector2.zero])
    vecReturnLength.removeChildren()

    arrLeft().x(-100)
    arrRight.x(100)

    yield* sequence(0.2,
        all (
            VectorNormalize().y(-100, 1, easeOutCubic),
            VectorNormalize().opacity(1, 0.5),
        ),
        all(
            arrLeft().points([Vector2.zero, Vector2.down.scale(arrLength)], 0.5),
            arrLeft().opacity(1,0.3),
        ),
        all(
            baseCircleLeft().size(40, 0.5),
            vecNormalized().opacity(1, 0.5)
        ),
        vecNormalizedScale(81, 1)
    )

    view.add(baseCircleRight)
    view.add(vecReturnLength)

    vecReturnLength.add(
        <Line
            x={50}
            zIndex={-1}
            stroke={'white'}
            lineCap={'round'}
            lineWidth={15}
            points={() => [Vector2.zero, Vector2.up.scale(vecReturnLength.parsedPoints()[1].y + 10)]}
            opacity={() => -vecReturnLength.parsedPoints()[1].y / 100}
        >
            <CodeBlock
                language={'c#'}
                theme={Catppuccin.Theme}
                fontFamily={'JetBrains Mono'}
                code={'return 320'}
                position={() => [200, vecReturnLength.parsedPoints()[1].y / 2 + 10]}
            />
        </Line>
    )

    yield* sequence(0.2,
        all(
            arrRight.points([Vector2.zero, Vector2.down.scale(arrLength)], 1),
            arrRight.opacity(1,0.3),
        ),
        baseCircleRight.size(40, 0.5),
        all(
            vecReturnLength.points([Vector2.zero, Vector2.down.scale(400)], 0.5),
            vecReturnLength.opacity(1, 0.3),
        )
    )

    yield* waitUntil('ambiguous')

    yield* all(
        questionMark().y(300, 0.5, easeOutCubic),
        questionMark().rotation(0, 0.5, easeOutCubic),
        questionMark().opacity(1, 0.3),
    )

    yield* waitFor(10)
})
