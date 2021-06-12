import { Planet } from '@darkforest_eth/types';
import { Wrapper } from '../../Backend/Utils/Wrapper';
/** Preview basic planet information - used in `PlanetContextPane` and `HoverPlanetPane` */
export declare function PlanetCard({ planetWrapper: p }: {
    planetWrapper: Wrapper<Planet | undefined>;
}): JSX.Element;
