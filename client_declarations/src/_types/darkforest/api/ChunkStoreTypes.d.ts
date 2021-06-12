import { Rectangle } from '../../global/GlobalTypes';
import { LocationId } from '@darkforest_eth/types';
export declare type LSMBucket = string;
export interface LSMLoc {
    x: number;
    y: number;
    h: LocationId;
    p: number;
    b: number;
}
export interface LSMChunkData {
    x: number;
    y: number;
    s: number;
    l: LSMLoc[];
    p: number;
}
export interface ChunkStore {
    hasMinedChunk: (chunkFootprint: Rectangle) => boolean;
}
