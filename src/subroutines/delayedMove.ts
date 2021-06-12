import { default as c } from "../constants.js";
import { checkNumInboundVoyages } from "../utils/planet.js";
import { msToSeconds } from "../utils/time.js";
import { df, MoveType, Action } from "../types/global.js";
import { LocationId } from "@darkforest_eth/types";

export interface DelayedMove extends Action {
  type: MoveType.DELAYED_MOVE;
  payload: {
    srcId: LocationId;
    syncId: LocationId;
    sendAt: number;
    percentageSend: number;
  };
  meta: {
    any;
  };
}

export default function delayedMove(action: DelayedMove) {
  const { srcId, syncId, sendAt, percentageSend } = action.payload;

  const source = df.getPlanetWithId(srcId);

  if (checkNumInboundVoyages(syncId) >= 7) {
    //Too many inbound
    return;
  }
  if (!source) {
    return false;
  }
  const FORCES = Math.floor((source.energy * percentageSend) / 100);
  console.log(sendAt);

  if (sendAt < new Date().getTime()) {
    console.log(`[delay]: ${source.locationId} attack launch`);
    df.terminal.current.println(
      `[delay]: ${source.locationId} attack launch`,
      4
    );

    //send attack
    df.terminal.current.printShellLn(
      `df.move('${srcId}', '${syncId}', ${FORCES}, ${0})`
    );
    df.move(srcId, syncId, FORCES, 0);
    return true;
  } else {
    console.log(
      `[delay]: ${source.locationId} launch in ${msToSeconds(
        sendAt - new Date().getTime()
      )}`
    );
  }
  return false;
}

export function createDelayedMove(
  srcId: LocationId,
  syncId: LocationId,
  sendAt: number,
  percentageSend: number = 80,
  meta = {
    sent: false,
  }
): DelayedMove {
  return {
    type: MoveType.DELAYED_MOVE,
    id: `${MoveType.DELAYED_MOVE}-${srcId}-${syncId}`,
    payload: {
      srcId,
      syncId,
      sendAt,
      percentageSend,
    },
    meta: meta as any,
  };
}
