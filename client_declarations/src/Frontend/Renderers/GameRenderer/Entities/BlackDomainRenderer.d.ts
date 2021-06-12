import { CanvasCoords } from '../../../../Backend/Utils/Coordinates';
import { GameGLManager } from '../WebGL/GameGLManager';
import { GenericRenderer } from '../WebGL/GenericRenderer';
import { Planet, WorldCoords } from '@darkforest_eth/types';
import { BLACKDOMAIN_PROGRAM_DEFINITION } from '../Programs/BlackDomainProgram';
/** Renders a shadow-type thing over destroyed planets */
export default class BlackDomainRenderer extends GenericRenderer<typeof BLACKDOMAIN_PROGRAM_DEFINITION> {
    quad3Buffer: number[];
    quad2Buffer: number[];
    constructor(manager: GameGLManager);
    queueBlackDomainScreen(_planet: Planet, center: CanvasCoords, radius: number, z: number): void;
    queueBlackDomain(planet: Planet, centerW: WorldCoords, radiusW: number): void;
    setUniforms(): void;
}
