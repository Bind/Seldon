import { default as c } from "../constants.js";
import {
  checkNumInboundVoyages,
  waitingForPassengers,
} from "../utils/planet.js";
import { within5Minutes } from "../utils/time.js";

export default async function chainedMove(action) {
  const {
    srcId,
    syncId,
    passengers,
    departure,
    percentageSend,
    createdAt,
  } = action.payload;

  const match = df.getMyPlanets().filter((t) => t.locationId == srcId);
  if (match.length == 0) {
    //Should delete self on this case
    return false;
  }
  const source = match[0];
  if (checkNumInboundVoyages(syncId) >= 7) {
    //Too many inbound
    return false;
  }
  const send = () => {
    console.log("[chained]: launching attack");
    terminal.println("[chained]: launching attack", 4);

    //send attack
    terminal.jsShell(`df.move('${srcId}', '${syncId}', ${FORCES}, ${0})`);
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
) {
  return {
    type: c.CHAINED_MOVE,
    id: `${c.CHAINED_MOVE}-${srcId}-${syncId}`,
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

export function markChainedMoveSent(chainedMove) {
  chainedMove.meta.sent = true;
  return chainedMove;
}
