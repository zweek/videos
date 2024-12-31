import {makeScene2D, Circle, Line, Node, Txt, Latex} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove, edit} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, chain, sequence, waitUntil, waitFor, Vector2, createSignal, makeRef, easeInCubic, tween, map, easeOutCubic, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

    view.add(
        <CodeBlock
            language="c#"
            fontFamily={'JetBrains Mono'}
            theme={Catppuccin.Theme}
            code={`accel_speed = sv_accelerate * grounded_wish_speed * host_frametime`
            }
        />

    )

})
