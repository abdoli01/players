import { Color } from "@/types/color";

export function applyUserColors(color: Color) {
    if (!color) return;

    const root = document.documentElement;

    const map: Record<string, string | undefined | null> = {
        h1: color.H1,
        h2: color.H2,
        g1: color.G1,
        g2: color.G2,
        hg3: color.HG3,
        hg4: color.HG4,
        acn1: color.ACN1,
        acn2: color.ACN2,
    };

    Object.entries(map).forEach(([key, value]) => {
        if (value) {
            root.style.setProperty(`--${key}`, value);
        }
    });
}