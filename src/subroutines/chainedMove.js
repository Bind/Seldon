import { default as c } from "../constants";
import { checkNumInboundVoyages, waitingForPassengers } from "../utils/planet";
import { within5Minutes } from "../utils/time";

export default function chainedMove(action) {
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
    return;
  }
  const source = match[0];
  if (checkNumInboundVoyages(syncId) >= 7) {
    //Too many inbound
    return;
  }

  const FORCES = Math.floor((source.energy * percentageSend) / 100);

  if (!within5Minutes(createdAt, new Date().getTime())) {
    console.log("too soon, waiting for passengers to depart");
  } else if (
    !waitingForPassengers(srcId, passengers) ||
    departure < new Date().getTime()
  ) {
    console.log("[DELAYED]: LAUNCHING ATTACK");
    terminal.println("[DELAYED]: LAUNCHING ATTACK", 4);

    //send attack
    terminal.jsShell(`df.move('${srcId}', '${syncId}', ${FORCES}, ${0})`);
    df.move(srcId, syncId, FORCES, 0);
    return true;
  }
  return false;
}

export function createChainedMove(
  srcId,
  syncId,
  passengers,
  departure,
  percentageSend = 80
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
  };
}
