import { waitFor } from '@motion-canvas/core';
import { CodeStyle } from 'code-fns';

export class Catppuccin {
    public static readonly Colors = {
        // Mocha
        Rosewater: '#F5E0DC',
        Flamingo: '#F2CDCD',
        Pink: '#F5C2E7',
        Mauve: '#CBA6F7',
        Red: '#f38ba8',
        Maroon: '#EBA0AC',
        Peach: '#FAB387',
        Yellow: '#F9E2AF',
        Green: '#A6E3A1',
        Teal: '#94E2D5',
        Sky: '#89DCEB',
        Sapphire: '#74C7EC',
        Blue: '#89B4FA',
        Lavender: '#B4BEFE',

        Text: '#CDD6F4',
        Subtext1: '#bac2de',
        Subtext0: '#a6adc8',
        Overlay2: '#9399b2',
        Overlay1: '#7f849c',
        Overlay0: '#6c7086',
        Surface2: '#585b70',
        Surface1: '#45475a',
        Surface0: '#313244',
        Base: '#1e1e2e',
        Mantle: '#181825',
        Crust: '#11111b',
    };

    public static readonly Theme: CodeStyle = {
        keyword: {
            text: Catppuccin.Colors.Mauve,
        },
        entityName: {
            text: Catppuccin.Colors.Blue,
        },
        literal: {
            text: Catppuccin.Colors.Peach,
        },
        variable: {
            text: '#ffffff'
        },
        stringPunctuation: {
            text: Catppuccin.Colors.Red
        },
        stringContent: {
            text: Catppuccin.Colors.Green
        },
        parameter: {
            text: Catppuccin.Colors.Maroon
        },
    };
}
