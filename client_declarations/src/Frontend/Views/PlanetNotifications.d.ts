import { Planet } from '@darkforest_eth/types';
import { ModalHook } from './ModalPane';
import { Wrapper } from '../../Backend/Utils/Wrapper';
export declare enum PlanetNotifType {
    PlanetCanUpgrade = 0,
    CanProspect = 1,
    CanFindArtifact = 2,
    MaxSilver = 3
}
export declare type PlanetNotifHooks = {
    upgradeDetHook: ModalHook;
};
export declare function getNotifsForPlanet(planet: Planet | undefined, currentBlockNumber: number | undefined): PlanetNotifType[];
export declare function PlanetNotifications({ notifs, wrapper, upgradeDetHook, }: {
    notifs: PlanetNotifType[];
    wrapper: Wrapper<Planet | undefined>;
} & PlanetNotifHooks): JSX.Element;
