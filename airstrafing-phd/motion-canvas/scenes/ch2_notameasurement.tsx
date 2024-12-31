import { makeScene2D, Line, Node, Txt, Layout, Rect, blur } from '@motion-canvas/2d';
import { createRef, all, sequence, chain, waitUntil, waitFor, map } from '@motion-canvas/core';
import { Reference, createSignal, Vector2, Color } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const velArrow = createRef<Line>();
    const wishdirArrow = createRef<Line>();

    const velScale = createSignal(0);
    const wishdirScale = createSignal(0);

    const velLabel = createRef<Txt>();
    const alignmentLabel = createRef<Txt>();

    const MINT_GREEN = new Color('#3cfca2');
    const PINK = new Color('#fc3c96');
    const arrowWidth = 20

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

    view.add(
        <>
            <Node y={200}>
                <Line endArrow ref={velArrow}
                    points={[Vector2.zero, () => Vector2.down.scale(velScale())]}
                    lineWidth={arrowWidth}
                    arrowSize={arrowWidth*2}
                    lineCap={'round'}
                    stroke={MINT_GREEN}
                >
                    <Txt ref={velLabel}
                        text={() => Math.floor(velArrow().size().y).toString()}
                        fontFamily={'JetBrains Mono'}
                        fontWeight={600}
                        fill={MINT_GREEN}
                        y={() => -velArrow().size().y / 2}
                        x={-arrowWidth*5}
                        rotation={() => -velArrow().rotation()}
                    />
                </Line>
                <Line endArrow ref={wishdirArrow}
                    points={[Vector2.zero, () => Vector2.down.scale(wishdirScale())]}
                    lineWidth={arrowWidth}
                    arrowSize={arrowWidth*2}
                    lineCap={'round'}
                    stroke={PINK}
                />
                <Node ref={alignmentLabel} y={100}>
                        <Rect
                            height={100}
                            width={500}
                            fill={'black'}
                            filters={[blur(20)]}
                        />
                        <Txt text={() => "Alignment:"}
                            fontFamily={'JetBrains Mono'}
                            fontWeight={600}
                            fill={'white'}
                            x={-60}
                        />
                        <Txt text={() => `${DotAlignment(velArrow, wishdirArrow)}%`}
                            fontFamily={'JetBrains Mono'}
                            fontWeight={600}
                            offset={new Vector2(-1,0)}
                            fill={() => PINK.lerp(MINT_GREEN, DotAlignment(velArrow, wishdirArrow)/100, 'lab')}
                            // note: this goes beyond the defined pink value bc it lerps from -1 to 1 instead of 0 to 1
                            x={120}
                        />
                </Node>
            </Node>
        </>
    );

    alignmentLabel().opacity(0);
    velLabel().opacity(0);
    wishdirArrow().rotation(90);
    velArrow().scale(0);

    yield* chain(
        all(
            velScale(500,3),
            velArrow().scale(1,1),
            chain(
                waitUntil("how fast"),
                velLabel().opacity(1,1),
            ),
        ),

        waitUntil("how closely"),
        all(
            wishdirScale(200,1),
            alignmentLabel().opacity(1,1),
        ),
        waitUntil("wishvelocity"),
        all(
            velArrow().rotation(15,1.5),
            velScale(567,1.5),
        ),
        wishdirArrow().rotation(375,2),

        waitFor(5)
    );
});
