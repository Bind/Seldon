import { default as c } from "../constants";
import { checkNumInboundVoyages } from "../utils/planet";
export default function delayedMove(action) {
  const { srcId, syncId, sendAt, percentageSend } = action.payload;

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

  if (sendAt < new Date().getTime()) {
    console.log("[DELAYED]: LAUNCHING ATTACK");
    terminal.println("[DELAYED]: LAUNCHING ATTACK", 4);

    //send attack
    terminal.jsShell(`df.move('${srcId}', '${syncId}', ${FORCES}, ${0})`);
    df.move(srcId, syncId, FORCES, 0);
    return true;
  }
  return false;
}

export function createDelayedMove(srcId, syncId, sendAt, percentageSend = 80) {
  return {
    type: c.DELAYED_MOVE,
    id: `${c.DELAYED_MOVE}-${srcId}-${syncId}`,
    payload: {
      srcId,
      syncId,
      sendAt,
      percentageSend,
    },
  };
}
