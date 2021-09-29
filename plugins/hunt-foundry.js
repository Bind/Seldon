const isPlanetWithinRangeOfSpacetimeRift = (
  locationId,
  maxEnergyPercent = 75,
  minPlanetLevel = 3
) => {
  return (
    df
      .getPlanetsInRange(locationId, maxEnergyPercent)
      .filter(isSpaceRift)
      .filter((p) => p.planetLevel >= minPlanetLevel).length > 0
  );
};

class Plugin {
  constructor() {
    this.maxEnergyPercent = 50;
  }
  render(container) {
    container.style.width = "200px";

    let stepperLabel = document.createElement("label");
    stepperLabel.innerText = "Max % energy to spend";
    stepperLabel.style.display = "block";

    let stepper = document.createElement("input");
    stepper.type = "range";
    stepper.min = "0";
    stepper.max = "100";
    stepper.step = "5";
    stepper.value = `${this.maxEnergyPercent}`;
    stepper.style.width = "80%";
    stepper.style.height = "24px";

    let percent = document.createElement("span");
    percent.innerText = `${stepper.value}%`;
    percent.style.float = "right";

    stepper.onchange = (evt) => {
      percent.innerText = `${evt.target.value}%`;
      try {
        this.maxEnergyPercent = parseInt(evt.target.value, 10);
      } catch (e) {
        console.error("could not parse energy percent", e);
      }
    };

    let message = document.createElement("div");

    let globalButton = document.createElement("button");
    globalButton.style.width = "100%";
    globalButton.style.marginBottom = "10px";
    globalButton.innerHTML = "Globally hunt Asteroids!";
    globalButton.onclick = () => {
      message.innerText = "Please wait...";

      let moves = 0;
      for (let planet of df.getMyPlanets().filter((p) => p.planetLevel <= 5)) {
        // TODO: Make asteroid check configurable
        setTimeout(() => {
          moves += captureAsteroid(planet.locationId, this.maxEnergyPercent);
          message.innerText = `Capturing ${moves} planets.`;
        }, 0);
      }
    };

    container.appendChild(stepperLabel);
    container.appendChild(stepper);
    container.appendChild(percent);
    container.appendChild(globalButton);
    container.appendChild(message);
  }
}

export default Plugin;

function isFoundry(planet) {
  return planet.planetType === 2;
}

function captureAsteroid(fromId, maxDistributeEnergyPercent) {
  const from = df.getPlanetWithId(fromId);

  // Rejected if has pending outbound moves
  const unconfirmed = df
    .getUnconfirmedMoves()
    .filter((move) => move.from === fromId);
  if (unconfirmed.length !== 0) {
    return 0;
  }

  const candidates_ = df
    .getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter((p) => p.owner === "0x0000000000000000000000000000000000000000")
    .filter(isFoundry)
    .filter((p) =>
      isPlanetWithinRangeOfSpacetimeRift(
        p.locationId,
        maxDistributeEnergyPercent,
        3
      )
    )
    .map((to) => {
      return [to, distance(from, to)];
    })
    .sort((a, b) => a[1] - b[1]);

  let i = 0;
  const energyBudget = Math.floor(
    (maxDistributeEnergyPercent / 100) * from.energy
  );

  let energySpent = 0;
  let moves = 0;
  while (energyBudget - energySpent > 0 && i < candidates_.length) {
    const energyLeft = energyBudget - energySpent;

    // Remember its a tuple of candidates and their distance
    const candidate = candidates_[i++][0];

    // Rejected if has unconfirmed pending arrivals
    const unconfirmed = df
      .getUnconfirmedMoves()
      .filter((move) => move.to === candidate.locationId);
    if (unconfirmed.length !== 0) {
      continue;
    }

    // Rejected if has pending arrivals
    const arrivals = getArrivalsForPlanet(candidate.locationId);
    if (arrivals.length !== 0) {
      continue;
    }

    const energyArriving =
      candidate.energyCap * 0.15 + candidate.energy * (candidate.defense / 100);
    // needs to be a whole number for the contract
    const energyNeeded = Math.ceil(
      df.getEnergyNeededForMove(fromId, candidate.locationId, energyArriving)
    );
    if (energyLeft - energyNeeded < 0) {
      continue;
    }

    df.move(fromId, candidate.locationId, energyNeeded, 0);
    energySpent += energyNeeded;
    moves += 1;
  }

  return moves;
}

function getArrivalsForPlanet(planetId) {
  return df
    .getAllVoyages()
    .filter((arrival) => arrival.toPlanet === planetId)
    .filter((p) => p.arrivalTime > Date.now() / 1000);
}

function isSpaceRift(planet) {
  return planet.planetType === 3;
}

//returns tuples of [planet,distance]
function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt(
    (fromloc.coords.x - toloc.coords.x) ** 2 +
      (fromloc.coords.y - toloc.coords.y) ** 2
  );
}
