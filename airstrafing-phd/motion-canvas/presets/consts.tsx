import { Color } from '@motion-canvas/core'

export const Colors = {
    WHITE: new Color('#ffffff'),
    MINT_GREEN: new Color('#3cfca2'),
    PINK: new Color('#fc3c96'),
}

export const SV_AirAccelerate_code_Q1 = `
void SV_AirAccelerate (vec3 wish_velocity)
{
    float wish_speed, current_speed, add_speed, accel_speed;

    wish_speed = VectorNormalize(wish_velocity);
    if (wish_speed > 30)
        wish_speed = 30;

    current_speed = DotProduct(velocity, wish_velocity);
    add_speed = wish_speed - current_speed;
    if (add_speed <= 0)
        return;

    accel_speed = sv_accelerate * grounded_wish_speed * host_frametime;
    if (accel_speed > add_speed)
        accel_speed = add_speed;

    for (int i=0; i<3; i++)
        velocity[i] += accel_speed * wish_velocity[i];
}`

export const PM_Accelerate_code_Q2 = `
void PM_Accelerate (vec3 wish_dir, float wish_speed, float accel)
{
    float add_speed, accel_speed, current_speed;





    current_speed = DotProduct(pml.velocity, wish_dir);
    add_speed = wish_speed - current_speed;
    if (add_speed <= 0)
        return;

    accel_speed = accel * wish_speed * pml.frametime;
    if (accel_speed > add_speed)
        accel_speed = add_speed;

    for (int i=0; i<3; i++)
        pml.velocity[i] += accel_speed * wish_dir[i];
}`
