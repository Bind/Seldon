import { Planet } from '@darkforest_eth/types';
export declare function Find({ find, isFinding, currentBlockNumber, planet, }: {
    find: () => void;
    isFinding: boolean;
    currentBlockNumber: number | undefined;
    planet: Planet;
}): JSX.Element;
