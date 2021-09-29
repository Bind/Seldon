import { LocationId } from "@darkforest_eth/types";
import GameManager from "@df/GameManager";
import GameUIManager from "@df/GameUIManager";
declare const df: GameManager;
declare const ui: GameUIManager;
import { default as c } from "../constants.js";
import { MoveType, Action } from "../types/global";
import {
  checkNumInboundVoyages,
  waitingForPassengers,
} from "../utils/planet.js";
import { within5Minutes } from "../utils/time.js";

export interface ChainedMoved extends Action {
  payload: {
    srcId: LocationId;
    syncId: LocationId;
    passengers: LocationId[];
    departure: number;
    percentageSend: number;
    createdAt: number;
  };
  meta: {
    sent: boolean;
  };
}

export default async function chainedMove(action: ChainedMoved) {
  const { srcId, syncId, passengers, departure, percentageSend, createdAt } =
    action.payload;

  const source = df.getPlanetWithId(srcId);

  if (!source) {
    return false;
  }
  if (checkNumInboundVoyages(syncId) >= 7) {
    //Too many inbound
    return false;
  }
  const send = () => {
    console.log("[chained]: launching attack");
    df.terminal.current.println("[chained]: launching attack", 4);

    //send attack
    df.terminal.current.printShellLn(
      `df.move('${srcId}', '${syncId}', ${FORCES}, ${0})`
    );
    df.move(srcId, syncId, FORCES, 0);
    return true;
  };

  const FORCES = Math.floor((source.energy * percentageSend) / 100);
  if (within5Minutes(createdAt, new Date().getTime())) {
    console.log("too soon, waiting for passengers to depart");
    return false;
  } else if (await waitingForPassengers(srcId, passengers)) {
    console.log("Waiting for passengers for passengers to arrive'");
    return false;
  } else {
    return send();
  }
}

export function createChainedMove(
  srcId,
  syncId,
  passengers,
  departure,
  percentageSend = 90
): ChainedMoved {
  return {
    type: MoveType.CHAINED_MOVE,
    id: `${MoveType.CHAINED_MOVE}-${srcId}-${syncId}`,
    payload: {
      srcId,
      syncId,
      passengers,
      departure,
      percentageSend,
      createdAt: new Date().getTime(),
    },
    meta: {
      sent: false,
    },
  };
}

export function markChainedMoveSent(chainedMove): ChainedMoved {
  chainedMove.meta.sent = true;
  return chainedMove;
}
