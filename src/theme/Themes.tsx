import { Colors } from "@catppuccin/palette";
import Catppuccin from "./Catppuccin";

export type Color = {
    hex: string;
    rgb: {
        r: number;
        g: number;
        b: number;
    };
    hsl: {
        h: number;
        s: number;
        l: number;
    };
};
export type Theme = Colors<Color>;

export * from "./Catppuccin";

export default [...Catppuccin];
