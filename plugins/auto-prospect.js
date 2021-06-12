class Plugin {
  constructor() {
    this.intervalIds = [];
  }
  clearIntervals() {
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
    });
  }
  render(container) {
    // asteroid level
    let silver = 0;
    let message = document.createElement("p");
    let withdrawButton = document.createElement("button");
    withdrawButton.style.width = "49%";
    withdrawButton.style.marginBottom = "10px";
    withdrawButton.innerHTML = "Start";
    withdrawButton.onclick = () => {
      const planets = df.getMyPlanets().filter(isProspectable);

      if (planets.length === 0) {
        return;
      }
      planets.sort((a, b) => b.planetLevel - a.planetLevel);
      asyncForEach(planets, async (planet) => {
        message.onclick = () => {
          ui.centerLocationId(planet.locationId);
        };
        message.innerText = `prospecting ${planet.locationId} planets.`;
        await df.prospectPlanet(planet.locationId);
        await waitForFindable(planet.locationId);
        message.innerText = `Finding ${planet.locationId} planet.`;
        df.findArtifact(planet.locationId);
        await waitForArtifact(planet.locationId);
      });
    };

    container.appendChild(withdrawButton);

    container.appendChild(message);
  }
  destroy() {
    this.clearIntervals();
  }
}

function isPlanet(planet) {
  return planet.planetType === 0;
}

function isSpaceRift(planet) {
  return planet.planetType === 3;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

let waitFor = (predicate, locationId) => {
  if (!locationId) {
    return (curriedLocationId) => {
      return new Promise((resolve, reject) => {
        try {
          const intervalId = setInterval(() => {
            const location = df.getPlanetWithId(curriedLocationId);
            if (predicate(location)) {
              clearInterval(intervalId);
              resolve();
            }
          }, 5 * 1000);
        } catch (e) {
          clearInterval(intervalId);
          reject();
        }
      });
    };
  }
  return new Promise((resolve, reject) => {
    try {
      const intervalId = setInterval(() => {
        const location = df.getPlanetWithId(locationId);
        if (predicate(location)) {
          clearInterval(intervalId);
          resolve();
        }
      }, 5 * 1000);
    } catch (e) {
      clearInterval(intervalId);
      reject();
    }
  });
};

const isProspectable = (planet) => {
  return (
    planet.planetType === 2 &&
    planet.prospectedBlockNumber === undefined &&
    planet.energy > planet.energyCap * 0.95
  );
};

const isFindable = (planet) => {
  return (
    !planet.hasTriedFindingArtifact &&
    !planet.unconfirmedFindArtifact &&
    planet.planetType === 2 &&
    planet.prospectedBlockNumber !== undefined
  );
};
const hasArtifact = (planet) => {
  return planet.heldArtifactIds.length > 0;
};

let waitForFindable = waitFor(isFindable);
let waitForArtifact = waitFor(hasArtifact);

export default Plugin;
