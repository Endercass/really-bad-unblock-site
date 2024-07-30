import { flavors } from "@catppuccin/palette";
import type { Color, Theme } from "./Themes";

export const mochaTheme = Object.fromEntries(
    flavors.mocha.colorEntries.map(([name, color]) => [
        name,
        {
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl,
        } as Color,
    ]),
) as Theme;

export const latteTheme = Object.fromEntries(
    flavors.latte.colorEntries.map(([name, color]) => [
        name,
        {
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl,
        } as Color,
    ]),
) as Theme;

export const macchiatoTheme = Object.fromEntries(
    flavors.macchiato.colorEntries.map(([name, color]) => [
        name,
        {
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl,
        } as Color,
    ]),
) as Theme;

export const frappeTheme = Object.fromEntries(
    flavors.frappe.colorEntries.map(([name, color]) => [
        name,
        {
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl,
        } as Color,
    ]),
) as Theme;

export default [mochaTheme, macchiatoTheme, latteTheme, frappeTheme];
