import GameManager from "@df/GameManager";
import GameUIManager from "@df/GameUIManager";

export declare const df: GameManager;
export declare const ui: GameUIManager;

export interface Action {
  type: MoveType;
  id: string;
  payload: any;
  meta?: any;
}

export enum MoveType {
  FLOOD,
  OVERLOAD,
  PESTER,
  AID,
  FEED,
  SUPPLY,
  EXPLORE,
  DELAYED_MOVE,
  CHAINED_MOVE,
}
