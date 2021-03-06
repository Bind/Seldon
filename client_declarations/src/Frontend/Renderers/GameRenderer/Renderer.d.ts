import BackgroundRenderer from "./Entities/BackgroundRenderer";
import Overlay2DRenderer from "./Overlay2DRenderer";
import PlanetRenderer from "./Entities/PlanetRenderer";
import VoyageRenderer from "./Entities/VoyageRenderer";
import { UIRenderer } from "./UIRenderer";
import LineRenderer from "./Entities/LineRenderer";
import CircleRenderer from "./Entities/CircleRenderer";
import TextRenderer from "./Entities/TextRenderer";
import RectRenderer from "./Entities/RectRenderer";
import PlanetRenderManager from "./Entities/PlanetRenderManager";
import AsteroidRenderer from "./Entities/AsteroidRenderer";
import BeltRenderer from "./Entities/BeltRenderer";
import { SpriteRenderer } from "./Entities/SpriteRenderer";
import { GameGLManager } from "./WebGL/GameGLManager";
import { WormholeRenderer } from "./Entities/WormholeRenderer";
import GameUIManager from "../../../Backend/GameLogic/GameUIManager";
import { QuasarRenderer } from "./Entities/QuasarRenderer";
import { SpacetimeRipRenderer } from "./Entities/SpacetimeRipRenderer";
import { RuinsRenderer } from "./Entities/RuinsRenderer";
import RingRenderer from "./Entities/RingRenderer";
import BlackDomainRenderer from "./Entities/BlackDomainRenderer";
import { MineRenderer } from "./Entities/MineRenderer";
declare class Renderer {
    static instance: Renderer | null;
    canvas: HTMLCanvasElement;
    glCanvas: HTMLCanvasElement;
    bufferCanvas: HTMLCanvasElement;
    frameRequestId: number;
    gameUIManager: GameUIManager;
    frameCount: number;
    now: number;
    glManager: GameGLManager;
    overlay2dRenderer: Overlay2DRenderer;
    lineRenderer: LineRenderer;
    circleRenderer: CircleRenderer;
    textRenderer: TextRenderer;
    rectRenderer: RectRenderer;
    bgRenderer: BackgroundRenderer;
    planetRenderer: PlanetRenderer;
    asteroidRenderer: AsteroidRenderer;
    beltRenderer: BeltRenderer;
    mineRenderer: MineRenderer;
    spriteRenderer: SpriteRenderer;
    quasarRenderer: QuasarRenderer;
    spacetimeRipRenderer: SpacetimeRipRenderer;
    ruinsRenderer: RuinsRenderer;
    ringRenderer: RingRenderer;
    blackDomainRenderer: BlackDomainRenderer;
    uiRenderManager: UIRenderer;
    planetRenderManager: PlanetRenderManager;
    voyageRenderManager: VoyageRenderer;
    wormholeRenderManager: WormholeRenderer;
    constructor(canvas: HTMLCanvasElement, glCanvas: HTMLCanvasElement, bufferCanvas: HTMLCanvasElement, gameUIManager: GameUIManager);
    setup(): void;
    static destroy(): void;
    static initialize(canvas: HTMLCanvasElement, glCanvas: HTMLCanvasElement, bufferCanvas: HTMLCanvasElement, gameUIManager: GameUIManager): Renderer;
    loop(): void;
    draw(): void;
    debug(interval?: number): boolean;
}
export default Renderer;
