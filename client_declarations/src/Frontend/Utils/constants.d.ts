import * as bigInt from 'big-integer';
declare const MIN_CHUNK_SIZE = 16;
declare const MAX_CHUNK_SIZE = 256;
declare const LOCATION_ID_UB: bigInt.BigInteger;
export { MIN_CHUNK_SIZE, MAX_CHUNK_SIZE, LOCATION_ID_UB };
export declare const BLOCK_EXPLORER_URL = "https://blockscout.com/poa/xdai";
export declare const XDAI_CHAIN_ID = 100;
export declare const HAT_SIZES: string[];
export declare const enum GameWindowZIndex {
    MenuBar = 4,
    HoverPlanet = 999,
    Modal = 1000,
    Tooltip = 16000000
}
