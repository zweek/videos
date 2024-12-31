import { Line, LineProps, initial, signal, colorSignal } from '@motion-canvas/2d'
import { Color, ColorSignal, PossibleColor, SignalValue, SimpleSignal, createRef, Vector2 } from '@motion-canvas/core'

export interface ArrowProps extends LineProps {
    thickness?: SignalValue<number>;
    length?: SignalValue<number>;
    color?: SignalValue<PossibleColor>;
}

export class Arrow extends Line {
    
    @initial(15)
    @signal()
    public declare readonly thickness: SimpleSignal<number, this>

    @initial(0)
    @signal()
    public declare readonly length: SimpleSignal<number, this>

    @initial('white')
    @colorSignal()
    public declare readonly color: ColorSignal<this>

	private readonly arrow = createRef<Line>()

    public constructor(props?: ArrowProps) {
        super({ ...props })

        this.add(
            <Line ref={this.arrow} endArrow
                lineWidth={() => this.thickness()}
                arrowSize={() => this.thickness() * 2}
                stroke={() => this.color()}
                lineCap={'round'}
                points={() => [Vector2.zero, Vector2.down.scale(this.length())]}
            />
        )
    }
}
