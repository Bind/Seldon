import { CanvasCoords } from '../../../../Backend/Utils/Coordinates';
import { Planet, WorldCoords } from '@darkforest_eth/types';
import { RGBVec } from '../EngineTypes';
import { BELT_PROGRAM_DEFINITION, BeltProps } from '../Programs/BeltProgram';
import { GenericRenderer } from '../WebGL/GenericRenderer';
import { WebGLManager } from '../WebGL/WebGLManager';
export default class BeltRenderer extends GenericRenderer<typeof BELT_PROGRAM_DEFINITION> {
    topRectPosBuffer: number[];
    botRectPosBuffer: number[];
    posBuffer: number[];
    constructor(manager: WebGLManager);
    queueBeltWorld(centerW: CanvasCoords, radiusW: number, // screen coords
    color: RGBVec, l?: number, // number of radii length
    z?: number, delZ?: number, props?: BeltProps, angle?: number): void;
    queueBelt(center: CanvasCoords, radius: number, // screen coords
    color: RGBVec, l?: number, // number of radii length
    z?: number, delZ?: number, props?: BeltProps, angle?: number): void;
    queueBeltAtIdx(planet: Planet, center: WorldCoords | CanvasCoords, radius: number, color: RGBVec, beltIdx: number, angle?: number, screen?: boolean): void;
    setUniforms(): void;
}
