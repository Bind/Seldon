import { CanvasCoords } from '../../../Backend/Utils/Coordinates';
import { HatType } from '../../Utils/Hats';
import Renderer from './Renderer';
import { TextAlign } from './EngineTypes';
import { Artifact, WorldCoords } from '@darkforest_eth/types';
export default class Overlay2DRenderer {
    renderer: Renderer;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(engine: Renderer, canvas: HTMLCanvasElement);
    clear(): void;
    drawRectStrokeAtCenterWorld(center: WorldCoords, width: number, height: number, strokeWidth: number, color?: string): void;
    drawArtifactAroundPlanet(artifact: Artifact, coords: CanvasCoords, size: number): void;
    drawHat(hatType: HatType, pathHeight: number, // height of svg path
    pathWidth: number, // width of svg path
    center: WorldCoords, // center of planet
    width: number, // width of hat
    height: number, // height of hat
    radius: number, // radius of planet
    rotation: number, // rotation of planet / hat (no-op right now)
    fill1?: string | CanvasPattern, // hat fill color for bottom layer
    fill2?: string | CanvasPattern, // hat fill color for top layer
    hoverCoords?: WorldCoords | null): void;
    drawLoopWorld(center: WorldCoords, radius: number, width: number, color?: string, dotted?: boolean): void;
    drawArcWorld(center: WorldCoords, radius: number, width: number, percent: number, color?: string, dotted?: boolean): void;
    drawLine(startCoords: WorldCoords, endCoords: WorldCoords, lineWidth: number, color?: string, dotted?: boolean): void;
    drawText(text: string, x: number, y: number, color?: string, align?: TextAlign): void;
    drawArtifactIcon(glassLoc: WorldCoords, scale: number, color?: string): void;
    drawMiner(): void;
}
