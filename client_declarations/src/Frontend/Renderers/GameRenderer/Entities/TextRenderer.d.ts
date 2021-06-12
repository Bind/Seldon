import { CanvasCoords } from "../../../../Backend/Utils/Coordinates";
import { TEXT_PROGRAM_DEFINITION } from "../Programs/TextProgram";
import { WebGLManager } from "../WebGL/WebGLManager";
import { RGBAVec, TextAlign, TextAnchor } from "../EngineTypes";
import { GenericRenderer } from "../WebGL/GenericRenderer";
import { WorldCoords } from "@darkforest_eth/types";
declare type GlyphInfo = {
    x: number;
    y: number;
};
export default class TextRenderer extends GenericRenderer<typeof TEXT_PROGRAM_DEFINITION> {
    bufferCanvas: HTMLCanvasElement;
    quad3Buffer: number[];
    quad2Buffer: number[];
    glyphData: Map<string, GlyphInfo>;
    texIdx: number;
    constructor(manager: WebGLManager, bufferCanvas: HTMLCanvasElement);
    setTexture(texIdx: number): void;
    createGlyphs(debug?: boolean): void;
    queueTextWorld(text: string, coords: WorldCoords, color?: RGBAVec, offY?: number, // measured in text units - constant screen-coord offset that it useful for drawing nice things
    align?: TextAlign, anchor?: TextAnchor, zIdx?: number): void;
    queueText(text: string, { x, y }: CanvasCoords, color: RGBAVec, align?: TextAlign, anchor?: TextAnchor, zIdx?: number): void;
    queueGlyph(glyph: string, x: number, y: number, color: RGBAVec, zIdx: number): void;
    setUniforms(): void;
    flush(): void;
}
export {};
