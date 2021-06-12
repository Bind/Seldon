import { CanvasCoords } from '../../../../Backend/Utils/Coordinates';
import { Planet, WorldCoords } from '@darkforest_eth/types';
import Viewport from '../../../Game/Viewport';
import { RGBVec } from '../EngineTypes';
import { GameGLManager } from '../WebGL/GameGLManager';
import { GenericRenderer } from '../WebGL/GenericRenderer';
import { RingProps, RING_PROGRAM_DEFINITION } from '../Programs/RingProgram';
export default class RingRenderer extends GenericRenderer<typeof RING_PROGRAM_DEFINITION> {
    viewport: Viewport;
    topRectPosBuffer: number[];
    botRectPosBuffer: number[];
    posBuffer: number[];
    constructor(manager: GameGLManager);
    queueBeltWorld(centerW: CanvasCoords, radiusW: number, // screen coords
    color: RGBVec, l?: number, // number of radii length
    z?: number, delZ?: number, props?: RingProps, angle?: number): void;
    queueBelt(center: CanvasCoords, radius: number, // screen coords
    color: RGBVec, l?: number, // number of radii length
    z?: number, delZ?: number, props?: RingProps, angle?: number): void;
    queueBeltAtIdx(planet: Planet, centerW: WorldCoords, radiusW: number, color: RGBVec, beltIdx: number, angle?: number): void;
    setUniforms(): void;
}
