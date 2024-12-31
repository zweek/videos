void SV_AirAccelerate (vec3 wish_velocity)
{
	float add_speed, wish_speed, accel_speed, current_speed;
		
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
}
