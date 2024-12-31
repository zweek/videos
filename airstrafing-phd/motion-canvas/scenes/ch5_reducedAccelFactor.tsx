import {makeScene2D, Circle, Line, Node, Txt, Latex, Grid, Rect} from '@motion-canvas/2d'
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, chain, loop, waitUntil, waitFor, Vector2, createSignal, DEFAULT, easeOutCubic, easeInOutQuad} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'
import {slideIn, slideOut, arrowAppear} from '../presets/anims'
import {Colors} from '../presets/consts'

// overlay over gameplay
export default makeScene2D(function* (view) {

    const textVarBlock = `
float sv_stopspeed         = 100;    
float sv_maxspeed          = 320;    
float sv_spectatormaxspeed = 500;
float sv_accelerate        = 10;     
float sv_airaccelerate     = 0.7;    
float sv_wateraccelerate   = 10;     
float sv_friction          = 4;      
`

    const cbAccel = createRef<CodeBlock>()
    const codeFrame = createRef<Rect>()
    const codeTitle = createRef<Txt>()

    view.add(<Rect ref={codeFrame} layout
        direction={'column'}
        gap={20}
        x={-400}
        opacity={0}
    >
        <Txt ref={codeTitle} text={'Quake I'}
            fontFamily={"JetBrains Mono"}
            fill={'white'}
            fontSize={35}
            paddingLeft={30}
        />
        <Rect layout
            padding={30}
            width={800}
            height={350}
            stroke={'white'}
            fill={Catppuccin.Colors.Base}
            lineWidth={5}
            radius={20}
        >
            <CodeBlock ref={cbAccel}
                language={"c"}
                fontFamily={"JetBrains Mono"}
                fontWeight={600}
                fontSize={35}
                theme={Catppuccin.Theme}
                code={textVarBlock}
                offset={Vector2.left}
                selection={lines(3,3)}
            />
        </Rect>
    </Rect>)

    yield* slideIn(codeFrame(), 'right', 200, 0.7)

    yield* waitUntil("10 to 1")
    yield* all(
        codeTitle().text("Quake II", 0),
        cbAccel().edit(0.6,false)`
float ${edit('sv', 'pm')}_stopspeed         = 100;
float ${edit('sv', 'pm')}_maxspeed          = 3${edit('2', '0')}0;
float ${edit('sv', 'pm')}_spectatormaxspeed = 500;
float ${edit('sv', 'pm')}_accelerate        = 1${remove('0')};
float ${edit('sv', 'pm')}_airaccelerate     = 0${remove('.7')};
float ${edit('sv', 'pm')}_wateraccelerate   = 10;
float ${edit('sv', 'pm')}_friction          = ${edit('4', '6')};`,
    )

    yield* waitUntil("limit accel_speed")
    const cbAccelSpeed = createRef<CodeBlock>()

    view.add(<CodeBlock ref={cbAccelSpeed} x={200}
        language={"c#"}
        theme={Catppuccin.Theme}
        fontFamily={"JetBrains Mono"}
        fontWeight={600}
        fontSize={35}
        offset={[-1,-1]}
        code={`
accel_speed = pm_accelerate *
              pml.frametime *
              wishspeed;`}
        opacity={0}
    />)
    yield* slideIn(cbAccelSpeed(), 'left', 200, 0.7)

    yield* waitFor(10)
})
