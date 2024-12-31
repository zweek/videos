import { Shape, ShapeProps, Node, Rect, Txt, initial, signal, colorSignal } from '@motion-canvas/2d'
import { Color, ColorSignal, PossibleColor, SignalValue, SimpleSignal, createRef } from '@motion-canvas/core'

export interface KeyProps extends ShapeProps {
    text?: SignalValue<string>;
    pressed?: SignalValue<boolean>;
    pressedColor?: SignalValue<PossibleColor>;
    unpressedColor?: SignalValue<PossibleColor>;
}

export interface WASDKeysProps extends ShapeProps {
    direction?: SignalValue<string>;
}

export class Key extends Shape {
    @signal()
    public declare readonly text: SimpleSignal<string, this>

    @initial(false)
    @signal()
    public declare readonly pressed: SimpleSignal<boolean, this>

    @initial("#3cfca2")
    @colorSignal()
    public declare readonly pressedColor: ColorSignal<this>

    @initial("#ffffff")
    @colorSignal()
    public declare readonly unpressedColor: ColorSignal<this>

    private readonly key = createRef<Rect>()
    private readonly label = createRef<Txt>()

    public constructor(props?: KeyProps) {
        super({ ...props })

        this.add(
            <Node cache>
                <Txt ref={this.label()}
                    fontFamily={"JetBrains Mono"}
                    fontWeight={600}
                    text={this.text()}
                />
                <Rect ref={this.key}
                    fill={() => this.pressed() ? this.pressedColor() : this.unpressedColor()}
                    size={[100,100]}
                    radius={10}
                    compositeOperation={'xor'}
                />
            </Node>
        )
    }
}

export class WASDKeys extends Shape {
    @initial('')
    @signal()
    public declare readonly direction: SimpleSignal<string, this>

    public constructor(props?: WASDKeysProps) {
        super({ ...props })

        this.add(<>
            <Key text={"W"} position={[0,-60]}
                pressed={() => this.direction().toLowerCase().includes('u')}
            />
            <Key text={"S"} position={[0,60]}
                pressed={() => this.direction().toLowerCase().includes('d')}
            />
            <Key text={"D"} position={[120,60]}
                pressed={() => this.direction().toLowerCase().includes('r')}
            />
            <Key text={"A"} position={[-120,60]}
                pressed={() => this.direction().toLowerCase().includes('l')}
            />
        </>)

    }
}
