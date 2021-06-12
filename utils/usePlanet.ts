import { useState, useEffect, useRef } from "preact/hooks";
import { forwardRef } from "preact/compat";
import { Planet } from "@darkforest_eth/types/dist/planet";

//WIP

function useInterval(callback, delay, ...args) {
  const savedCallback = useRef<(...args: any[]) => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current(...args);
      }
    }
    if (delay !== null && delay !== undefined) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function usePlanet(locationId): Planet {
  //@ts-expect-error
  let [planet, setPlanet] = useState(df.getPlanetById(locationId));

  const refreshPlanet = () => {
    //@ts-expect-error
    setPlanet(df.getPlanetById(locationId));
  };
  useInterval(refreshPlanet, 15, locationId);
  return planet as Planet;
}
