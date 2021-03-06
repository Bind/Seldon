import { Artifact, Planet } from "@darkforest_eth/types";
import { mat4 } from "gl-matrix";
import GameUIManager from "../../../Backend/GameLogic/GameUIManager";
import { RGBVec } from "../GameRenderer/EngineTypes";
import { SpriteRenderer } from "../GameRenderer/Entities/SpriteRenderer";
import { WebGLManager } from "../GameRenderer/WebGL/WebGLManager";
import { PathRenderer } from "./PathRenderer";
export declare class PlanetscapeRenderer extends WebGLManager {
    planet: Planet | undefined;
    projectionMatrix: mat4;
    uiManager: GameUIManager;
    artifacts: Artifact[];
    moonCtx: CanvasRenderingContext2D;
    moonCanvas: HTMLCanvasElement;
    frameRequestId: number;
    TICK_SIZE: number;
    pathRenderer: PathRenderer;
    spriteRenderer: SpriteRenderer;
    isPaused: boolean;
    constructor(canvas: HTMLCanvasElement, moonCanvas: HTMLCanvasElement, uiManager: GameUIManager);
    setPaused(isPaused?: boolean): void;
    destroy(): void;
    loop(): void;
    setPlanet(planet: Planet | undefined): void;
    drawHill(fn: (x: number) => number, color: RGBVec): void;
    drawScape(): void;
    flushArtifactOnce(): void;
    queueArtifacts(): void;
    draw(): void;
    drawMoon(): void;
}
