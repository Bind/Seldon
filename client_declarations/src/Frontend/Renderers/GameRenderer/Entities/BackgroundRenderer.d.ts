import { ExploredChunkData } from "../../../../_types/global/GlobalTypes";
import { MASK_PROGRAM_DEFINITION } from "../Programs/MaskProgram";
import { GameGLManager } from "../WebGL/GameGLManager";
import { GenericRenderer } from "../WebGL/GenericRenderer";
export default class BackgroundRenderer extends GenericRenderer<typeof MASK_PROGRAM_DEFINITION> {
    manager: GameGLManager;
    bgCanvas: HTMLCanvasElement;
    maskProgram: WebGLProgram;
    matrixULoc: WebGLUniformLocation | null;
    quadBuffer: number[];
    perlinThresholds: number[];
    constructor(manager: GameGLManager);
    drawChunks(exploredChunks: Iterable<ExploredChunkData>, highPerfMode: boolean): void;
    setUniforms(): void;
}
