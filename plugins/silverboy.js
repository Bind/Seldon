class Plugin {
  constructor() {
    this.maxEnergyPercent = 85;
    this.minPlanetLevel = 3;
    this.maxAsteroidLevel = 9;
    this.intervalIds = [];
  }
  clearIntervals() {
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
    });
  }
  render(container) {
    container.style.width = "200px";
    let message = document.createElement("p");
    let toSpaceRiftButton = document.createElement("button");
    let stopButton = document.createElement("button");
    toSpaceRiftButton.style.width = "100%";
    toSpaceRiftButton.style.marginBottom = "10px";
    toSpaceRiftButton.innerHTML = "All to space rift";
    toSpaceRiftButton.onclick = () => {
      let moves = 0;
      message.innerText = "Please wait...";
      const intervalId = setInterval(() => {
        for (let planet of df.getMyPlanets()) {
          if (
            isAsteroid(planet) &&
            planet.planetLevel <= this.maxAsteroidLevel
          ) {
            setTimeout(() => {
              moves += distributeSilver(
                planet.locationId,
                this.maxEnergyPercent,
                this.minPlanetLevel,
                true
              );
              message.innerText = `Sending to ${moves} space rift.`;
            }, 0);
          }
        }
      }, 1 * 60 * 1000);
      this.intervalIds.push(intervalId);
    };

    stopButton.style.width = "49%";
    stopButton.style.marginBottom = "10px";
    stopButton.innerHTML = "Stop";
    stopButton.onclick = () => {
      this.clearIntervals();
    };

    container.appendChild(toSpaceRiftButton);
    container.appendChild(stopButton);
    container.appendChild(message);
  }
}

function toPlanetOrSpaceRift(planet, toSpaceRift) {
  return toSpaceRift ? isSpaceRift(planet) : isPlanet(planet);
}

function distributeSilver(
  fromId,
  maxDistributeEnergyPercent,
  minPLevel,
  toSpaceRift
) {
  const from = df.getPlanetWithId(fromId);
  const silverBudget = Math.floor(from.silver);

  //ifgnore less than 85% full
  if ((from.silver / from.silverCap) * 100 < 50) {
    return 0;
  }
  if (
    df.getUnconfirmedMoves().filter((move) => move.from === fromId).length >= 1
  ) {
    return 0;
  }
  const candidates_ = df
    .getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter((p) => p.owner === df.getAccount()) //get player planets
    .filter((p) => toPlanetOrSpaceRift(p, toSpaceRift)) // filer planet or space rift
    .filter((p) => p.planetLevel >= minPLevel) // filer level
    .filter((p) => p.silverCap > silverBudget / 2) // Dont send if you cant deposit atleast half
    .map((to) => [to, distance(from, to)])
    .sort((a, b) => a[1] - b[1]);

  let i = 0;
  const energyBudget = Math.floor(
    (maxDistributeEnergyPercent / 100) * from.energy
  );

  let energySpent = 0;
  let silverSpent = 0;
  let moves = 0;
  while (energyBudget - energySpent > 0 && i < candidates_.length) {
    const silverLeft = silverBudget - silverSpent;
    const energyLeft = energyBudget - energySpent;

    // Remember its a tuple of candidates and their distance
    const candidate = candidates_[i++][0];

    // Rejected if has more than 5 pending arrivals. Transactions are reverted when more arrives. You can't increase it
    const unconfirmed = df
      .getUnconfirmedMoves()
      .filter((move) => move.to === candidate.locationId);
    const arrivals = getArrivalsForPlanet(candidate.locationId);
    if (unconfirmed.length + arrivals.length > 4) {
      continue;
    }

    const silverRequested = Math.ceil(candidate.silverCap - candidate.silver);
    const silverNeeded =
      silverRequested > silverLeft ? silverLeft : silverRequested;

    // Setting a 100 silver guard here, but we could set this to 0
    if (silverNeeded < 100) {
      continue;
    }

    // needs to be a whole number for the contract
    const energyNeeded = Math.ceil(
      df.getEnergyNeededForMove(fromId, candidate.locationId, 50)
    );
    if (energyLeft - energyNeeded < 0) {
      continue;
    }

    df.move(fromId, candidate.locationId, energyNeeded, silverNeeded);
    energySpent += energyNeeded;
    silverSpent += silverNeeded;
    moves += 1;
  }

  return moves;
}

function isAsteroid(planet) {
  return planet.planetType === 1;
}

function isPlanet(planet) {
  return planet.planetType === 0;
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

function getArrivalsForPlanet(planetId) {
  return df
    .getAllVoyages()
    .filter((arrival) => arrival.toPlanet === planetId)
    .filter((p) => p.arrivalTime > Date.now() / 1000);
}

export default Plugin;
