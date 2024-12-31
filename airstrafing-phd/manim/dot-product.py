from manim import *
import math

COLOR_V = RED_A
COLOR_W = GREEN_A

class Numerical(Scene):
    def construct(self):
        # self.add(ImageMobject("arrowref.png"))
        # self.add(NumberPlane()) # only for reference, dont use in final render

        # ARROWS
        arrow_v = Vector([1,1],buff=0,color=COLOR_V)
        arrow_w = Vector([-1,2],buff=0,color=COLOR_W)
        arrow_dot = Dot()
        arrows = VGroup(arrow_v,arrow_w,arrow_dot)
        arrows.move_to(LEFT*4)

        arrow_v_overlay = Arrow(start= LEFT*1.17 + DOWN*3.1, end= RIGHT*2.07 + UP*2.4, buff=0, color=COLOR_V, tip_length=1.1, stroke_width=25)
        arrow_w_overlay = Arrow(start= LEFT*0.95 + DOWN*3.4, end= RIGHT*4.9 + DOWN*2, buff=0, color=COLOR_W, tip_length=1.1, stroke_width=25)

        # musical intro
        self.play(
            Write(arrow_v_overlay),
            Write(arrow_w_overlay),
            run_time=1,
        )
        self.play(
            Transform(arrow_v_overlay, arrow_v),
            Transform(arrow_w_overlay, arrow_w),
            Create(arrow_dot),
            run_time=1.75,
        )

        # EQUATION
        matrix_v = Matrix(
            [[1],[2]],
            left_bracket="(",
            right_bracket=")",
        )
        vdot = MathTex("\cdot")
        matrix_w = Matrix(
            [[2],[3]],
            left_bracket="(",
            right_bracket=")",
        )
        vequals = MathTex("=")
        matrices = VGroup(matrix_v,vdot,matrix_w,vequals).arrange(RIGHT).next_to(arrows, RIGHT)

        # mathematically, taking the dot product ...
        self.play(
            Write(matrix_v),
            Write(matrix_w),
            Write(vdot),
            run_time=1,
        )
        
        pairs = list(zip(matrix_v.get_entries(), matrix_w.get_entries()))
        self.play(
            VGroup(*pairs[0]).animate.set_color(COLOR_V),
            VGroup(*pairs[1]).animate.set_color(COLOR_W),
            run_time=1,
        )

        products_target = VGroup(*[
            VGroup(
                p1.copy(), vdot.copy(), p2.copy()
            ).arrange(RIGHT)
            for p1,p2 in pairs
        ]).arrange(DOWN, buff=MED_LARGE_BUFF).next_to(matrices, RIGHT, buff=MED_SMALL_BUFF)

        products = VGroup(*[
            VGroup(p1.copy(), vdot.copy(), p2.copy())
            for p1,p2 in pairs
        ])
        
        # multiplying
        self.add(products)
        self.play(
            Write(vequals),
            Transform(products, products_target),
            run_time=1,
        )
        self.wait(1.41666)

        # adding
        plus = MathTex("+").shift(RIGHT*2.5)
        right_product_target = products[1].copy().move_to([3.5,0,0])
        self.play(
            products[0].animate.move_to([products[0].get_center()[0],0,0]),
            Transform(products[1], right_product_target, path_arc=1),
            Write(plus),
            run_time=1,
        )
        self.wait(0.71666)

        # single number
        result = MathTex("= 8").shift(RIGHT*4.7)
        self.play(
            Write(result),
            run_time=1,
        )

        self.wait()

def get_projection(vector_to_project, stable_vector):
    v1, v2 = stable_vector, vector_to_project
    return v1*np.dot(v1, v2)/(np.linalg.norm(v1)**2)

def get_vect_mob_projection(vector_to_project, stable_vector):
    return Vector(
        get_projection(
            vector_to_project.get_end(),            
            stable_vector.get_end()
            ),
        color = vector_to_project.get_color()
    )

class VisualProjection(MovingCameraScene):
    def construct(self):
        number_plane_width = 20
        number_plane_height = 15
        number_plane = NumberPlane(
            x_range=(-number_plane_width,number_plane_width),
            y_range=(-number_plane_height,number_plane_height),
            x_length=number_plane_width*2,
            y_length=number_plane_height*2
        ).set_z_index(-2)
        arrow_v = Vector([4,1],buff=0,color=COLOR_V).set_z_index(0)
        arrow_w = Vector([1,2],buff=0,color=COLOR_W).set_z_index(0)
        dot = Dot().set_z_index(2)

        projection_target = get_vect_mob_projection(arrow_w, arrow_v).set_z_index(1)
        arrow_w_projected = arrow_w.copy().set_z_index(1)
        projection_line = Line(start=arrow_w.get_end(), end=projection_target.get_end()).set_opacity(0.5)

        velscale = 3

        self.camera.frame.set(width=13.95)
        self.camera.frame.save_state()
        self.camera.frame.move_to(UP + 2*RIGHT)
        self.camera.frame.set(width=9.9)

        # visually, ...
        self.play(
            Write(number_plane),
            Write(arrow_v),
            Write(arrow_w),
            Write(dot),
            run_time=2.016666
        )

        # projecting one of the vectors ...
        self.play(
            Transform(arrow_w_projected, projection_target),
            arrow_w.animate.set_opacity(0.5),
            FadeIn(projection_line),
            run_time=1
        )
        self.wait(1.46666)

        # multiplying it ...
        self.play(arrow_w_projected.animate.scale(4, about_point=ORIGIN), run_time=1)
        self.wait(2.55)

        # new length ...
        length_brace = BraceBetweenPoints(ORIGIN, arrow_w_projected.get_end())
        self.play(FadeIn(length_brace), run_time=0.85)
        self.wait(1.4)

        # In our case, ...
        self.play(
            arrow_w_projected.animate.scale(0, about_point=ORIGIN).set_opacity(0),
            FadeOut(length_brace),
            FadeOut(projection_line),
            arrow_w.animate.set_opacity(1),
            run_time=1
        )
        self.play(
            self.camera.frame.animate.move_to(UP),
            Transform(arrow_v, Vector([0,velscale],buff=0,color=COLOR_V)),
            Transform(arrow_w, Vector([1,0],buff=0,color=COLOR_W)),
            run_time=1.85
        )

        # unit vector
        arrow_w_unitlabel = MathTex("|\hat{w}| = 1",color=COLOR_W).next_to(arrow_w.get_end(), RIGHT).shift(UP/3)
        self.play(Write(arrow_w_unitlabel), run_time = 1)
        self.wait(0.8833333)

        # "shape"
        text_shape = Text("\"shape\"").shift(LEFT*2.5,UP*1.5)
        self.play(Write(text_shape), run_time=0.5)
        self.wait(1.583333)
        self.play(
            FadeOut(text_shape),
            FadeOut(arrow_w_unitlabel),
            run_time=1
        )

        # as we rotate ...
        self.play(Rotate(arrow_w, -1.5*PI, about_point=ORIGIN), run_time=2)
        self.wait(0.65)

        # both vectors pointing in the same direction
        yline = Line(start=DOWN*5,end=UP*5,color=YELLOW)
        self.play(Write(yline),run_time=1)
        self.wait(0.5)
        self.play(FadeOut(yline),run_time=0.55)


        rot_tracker = ValueTracker(0)
        cos_dot = always_redraw(lambda: Dot(point=[-rot_tracker.get_value(),velscale*np.cos(-rot_tracker.get_value()),0], z_index=1))

        tex_v = "\\vec{v}"

        dotscalar = DecimalNumber(0,num_decimal_places=2,color=YELLOW,stroke_width=1.5)
        dotscalar.add_updater(lambda x: x.set_value(np.cos(rot_tracker.get_value())))
        
        dotexpression1 = MathTex("|",tex_v,"|\cdot")
        dotexpression1.set_color_by_tex(tex_v, COLOR_V)
        dotexpression = VGroup(dotexpression1,dotscalar).arrange(RIGHT)
        dotexpression.add_updater(lambda x: x.next_to(cos_dot, RIGHT))

        dotprodline = Line(start=ORIGIN,end=[0,velscale,0],color=YELLOW,z_index=-1)
        dotprodline.add_updater(lambda x: x.put_start_and_end_on([-rot_tracker.get_value(),0,0],[-rot_tracker.get_value(),velscale*np.cos(rot_tracker.get_value()),0]))

        arrow_w_ref = arrow_w.copy()
        arrow_w.add_updater(
            lambda x: x.become(arrow_w_ref.copy()).rotate(
                rot_tracker.get_value(), about_point=ORIGIN
            )
        )

        axes = Axes(y_length=8,x_length=14)
        cos_graph_right = always_redraw(lambda:
            axes.plot(lambda x: velscale*np.cos(x), x_range=[0,-rot_tracker.get_value()], color=BLUE)
        )
        cos_graph_left = always_redraw(lambda:
           axes.plot(lambda x: velscale*np.cos(x), x_range=[-rot_tracker.get_value(),0], color=BLUE)
        )
        self.add(cos_graph_right)
        self.add(cos_graph_left)

        arrow_w.rotate(rot_tracker.get_value(), about_point=ORIGIN)

        # the result of the dot product ...
        self.play(
            Restore(self.camera.frame),
            Write(dotexpression),
            run_time=1.5
        )
        self.play(
            FadeIn(cos_dot),
            FadeIn(dotprodline),
            run_time=1
        )

        # the length of the velocity
        self.play(rot_tracker.animate.increment_value(-PI/2), run_time=2.03333)
        # passes over zero
        self.play(rot_tracker.animate.increment_value(-PI/2), run_time=2.05)
        # negative our velocity
        self.play(FadeIn(cos_graph_right.copy()),run_time=1.25)


        # and this is of course mirrored ...

        self.play(rot_tracker.animate.increment_value(PI), run_time=1)
        self.play(rot_tracker.animate.increment_value(PI), run_time=3)

