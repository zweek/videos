import {makeScene2D} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, waitUntil, waitFor, createSignal, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

export default makeScene2D(function* (view) {

const VectorNormalize = createRef<CodeBlock>();
    
    view.add(
        <>
            <CodeBlock ref={VectorNormalize}
                language="c#"
                fontFamily={'JetBrains Mono'}
                code={`
float VectorNormalize (vec3 v)
{
    float   length, ilength;

    length = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
    length = sqrt(length);

    if (length)
    {
        ilength = 1/length;
        v[0] *= ilength;
        v[1] *= ilength;
        v[2] *= ilength;
    }

    return length;
}`
                }
            />
        </>
    );

    yield* waitFor(0.1)
    yield* waitUntil("it does")
    yield* VectorNormalize().selection(lines(9,12),1)
    yield* waitUntil("it just")
    yield* VectorNormalize().selection(DEFAULT,1)
    yield* waitFor(10)
})
