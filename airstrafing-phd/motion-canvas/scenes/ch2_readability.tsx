import {makeScene2D, Circle, Line, Node, Txt, Img} from '@motion-canvas/2d';
import {CodeBlock, lines, word, range, insert, remove} from '@motion-canvas/2d/lib/components/CodeBlock'
import {createRef, all, sequence, waitUntil, waitFor, Vector2, createSignal, DEFAULT} from '@motion-canvas/core';
import {Catppuccin} from '../theme/catppuccin'

import SVAA_refimg from '../../images/svaa-orig.png'

export default makeScene2D(function* (view) {

    const SV_AirAccelerate = createRef<CodeBlock>();
    const SV_AirAccelerateClone = createRef<CodeBlock>();
    // const SVAA_ref = createRef<Img>();

    const origCode = `
void SV_AirAccelerate (vec3_t wishveloc)
{
        int                     i;
        float           addspeed, wishspd, accelspeed, currentspeed;
		
        wishspd = VectorNormalize (wishveloc);
        if (wishspd > 30)
                wishspd = 30;
        currentspeed = DotProduct (velocity, wishveloc);
        addspeed = wishspd - currentspeed;
        if (addspeed <= 0)
                return;
//      accelspeed = sv_accelerate.value * host_frametime;
        accelspeed = sv_accelerate.value*wishspeed * host_frametime;
        if (accelspeed > addspeed)
                accelspeed = addspeed;
	
        for (i=0 ; i<3 ; i++)
                velocity[i] += accelspeed*wishveloc[i];	
}`

    view.add(
        <>
            {/* <Img src={SVAA_refimg} /> */}
            <CodeBlock
                ref={SV_AirAccelerate}
                language="c"
                y={28}
                x={-35}
                lineHeight={79.5}
                code={origCode}
                scale={.56}
            />
            <CodeBlock ref={SV_AirAccelerateClone}
                language='c#'
                theme={Catppuccin.Theme}
                code={origCode}
                scale={0.8}
                opacity={0}
            />
        </>
    )

    yield* all(
        SV_AirAccelerate().scale(0.8,1),
        SV_AirAccelerate().lineHeight(DEFAULT,1),
        SV_AirAccelerate().x(0,1),
        SV_AirAccelerate().y(0,1),
    )
    yield* waitUntil("adjustments")
    yield* all(
        SV_AirAccelerate().edit(1,false)`
void SV_AirAccelerate (vec3_t wishveloc)
{${remove('\n        int                     i;')}
${remove('    ')}    float ${remove('          ')}addspeed, wishspd, accelspeed, currentspeed;
		
${remove('    ')}    wishspd = VectorNormalize${remove(' ')}(wishveloc);
${remove('    ')}    if (wishspd > 30)
${remove('        ')}        wishspd = 30;${insert('\n ')}
${remove('    ')}    currentspeed = DotProduct${remove(' ')}(velocity, wishveloc);
${remove('    ')}    addspeed = wishspd - currentspeed;
${remove('    ')}    if (addspeed <= 0)
${remove('        ')}        return;
${remove('//      accelspeed = sv_accelerate.value * host_frametime;')}
${remove('    ')}    accelspeed = sv_accelerate.value${insert(' ')}*${insert(' ')}wishspeed * host_frametime;
${remove('    ')}    if (accelspeed > addspeed)
${remove('        ')}        accelspeed = addspeed;
	
${remove('    ')}    for (${insert('int ')}i=0${remove(' ')}; i<3${remove(' ')}; i++)
${remove('        ')}        velocity[i] += accelspeed${insert(' ')}*${insert(' ')}wishveloc[i];	
}`,
        SV_AirAccelerateClone().edit(1,false)`
void SV_AirAccelerate (vec3_t wishveloc)
{${remove('\n        int                     i;')}
${remove('    ')}    float ${remove('          ')}addspeed, wishspd, accelspeed, currentspeed;
		
${remove('    ')}    wishspd = VectorNormalize${remove(' ')}(wishveloc);
${remove('    ')}    if (wishspd > 30)
${remove('        ')}        wishspd = 30;${insert('\n ')}
${remove('    ')}    currentspeed = DotProduct${remove(' ')}(velocity, wishveloc);
${remove('    ')}    addspeed = wishspd - currentspeed;
${remove('    ')}    if (addspeed <= 0)
${remove('        ')}        return;
${remove('//      accelspeed = sv_accelerate.value * host_frametime;')}
${remove('    ')}    accelspeed = sv_accelerate.value${insert(' ')}*${insert(' ')}wishspeed * host_frametime;
${remove('    ')}    if (accelspeed > addspeed)
${remove('        ')}        accelspeed = addspeed;
	
${remove('    ')}    for (${insert('int ')}i=0${remove(' ')}; i<3${remove(' ')}; i++)
${remove('        ')}        velocity[i] += accelspeed${insert(' ')}*${insert(' ')}wishveloc[i];	
}`,
        SV_AirAccelerateClone().opacity(1,0.8),
        SV_AirAccelerate().opacity(0,1)
    ) 
 
    yield* SV_AirAccelerateClone().edit(1,false)`
void SV_AirAccelerate (vec3${remove('_t')} wish${insert('_')}veloc${insert('ity')})
{
    float add${insert('_')}speed, wish${insert('_')}sp${insert('ee')}d, accel${insert('_')}speed, current${insert('_')}speed;

    wish${insert('_')}sp${insert('ee')}d = VectorNormalize(wish${insert('_')}veloc${insert('ity')});
    if (wish${insert('_')}sp${insert('ee')}d > 30)
        wish${insert('_')}sp${insert('ee')}d = 30;

    current${insert('_')}speed = DotProduct(velocity, wish${insert('_')}veloc${insert('ity')});
    add${insert('_')}speed = wish${insert('_')}sp${insert('ee')}d - current${insert('_')}speed;
    if (add${insert('_')}speed <= 0)
        return;

    accel${insert('_')}speed = sv_accelerate${remove('.value')} * ${insert('grounded_')}wish${insert('_')}speed * host_frametime;
    if (accel${insert('_')}speed > add${insert('_')}speed)
        accel${insert('_')}speed = add${insert('_')}speed;

    for (int i=0; i<3; i++)
        velocity[i] += accel${insert('_')}speed * wish${insert('_')}veloc${insert('ity')}[i];
}`

    yield* waitFor(10)
})