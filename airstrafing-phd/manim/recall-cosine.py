from manim import *
from manim_voiceover import VoiceoverScene
import math

COLOR_V = RED_A
COLOR_W = GREEN_A

class RecallCosine(MovingCameraScene):
    def construct(self):
        number_plane_width = 20
        number_plane_height = 15
        number_plane = NumberPlane(
            x_range=(-number_plane_width,number_plane_width),
            y_range=(-number_plane_height,number_plane_height),
            x_length=number_plane_width*2,
            y_length=number_plane_height*2
        ).set_z_index(-2)
        arrow_v = Vector([0,3],buff=0,color=COLOR_V).set_z_index(0)
        arrow_w = Vector([0,1],buff=0,color=COLOR_W).set_z_index(0)
        dot = Dot().set_z_index(2)

        velscale = 3

        rot_tracker = ValueTracker(-PI)
        cos_dot = always_redraw(lambda: Dot(point=[-rot_tracker.get_value(),velscale*np.cos(-rot_tracker.get_value()),0], z_index=1))

        dotprodline = Line(start=ORIGIN,end=[0,velscale,0],color=YELLOW,z_index=-1)
        dotprodline.add_updater(lambda x: x.put_start_and_end_on([-rot_tracker.get_value(),0,0],[-rot_tracker.get_value(),velscale*np.cos(rot_tracker.get_value()),0]))

        arrow_w_ref = arrow_w.copy()
        arrow_w.add_updater(
            lambda x: x.become(arrow_w_ref.copy()).rotate(
                rot_tracker.get_value(), about_point=ORIGIN
            )
        )

        axes = Axes(y_length=8,x_length=14)
        cos_graph = always_redraw(lambda:
            axes.plot(lambda x: velscale*np.cos(x), x_range=[-PI,-rot_tracker.get_value()], color=BLUE)
        )

        arrow_w.rotate(rot_tracker.get_value(), about_point=ORIGIN)

        # you might recall
        self.play(
            Write(number_plane),
            Write(arrow_v),
            Write(arrow_w),
            FadeIn(dot),
            run_time=1.253
        )

        # as we walk through
        self.play(rot_tracker.animate.increment_value(2*PI), run_time=2.8)

        # the dot product
        tex_v = "\\vec{v}"
        tex_w = "\\hat{w}"
        dotexpression = MathTex(tex_v,"\cdot",tex_w, height=0.5)
        dotexpression.set_color_by_tex(tex_v, COLOR_V)
        dotexpression.set_color_by_tex(tex_w, COLOR_W)
        dotexpression.shift(RIGHT*5, UP*2)
        self.play(Write(dotexpression), run_time=1.387)
        self.wait(2.926)

        # ends up drawing this cosine shape
        self.add(cos_graph)
        self.play(rot_tracker.animate.increment_value(-2*PI), run_time=2.04)

        # maybe some of the pieces are starting to fall into place
        self.play(
            self.camera.frame.animate.set(width=10).move_to(RIGHT),
            FadeOut(dotexpression),
            run_time=3.838
        )

        # the points where it crosses 0
        self.add(cos_dot)
        self.add(cos_graph.copy())
        self.remove(cos_graph)
        self.play(
            rot_tracker.animate.increment_value(PI/2),
            run_time=2.471
        )

        # exactly match
        arrow_w_yellow = arrow_w_ref.copy().set_fill(YELLOW).set_stroke(YELLOW).rotate(-PI/2, about_point=ORIGIN)
        self.play(FadeIn(arrow_w_yellow), run_time=1.919/2)
        self.play(FadeOut(arrow_w_yellow), run_time=1.919/2)

        self.play(
            rot_tracker.animate.increment_value(PI),
            self.camera.frame.animate.move_to(LEFT),
            run_time=2.275
        )

        self.wait(4)
