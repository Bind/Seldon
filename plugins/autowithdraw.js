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
      message.innerText = "Please wait...";
      this.clearIntervals();
      setInterval(() => {
        for (let planet of df.getMyPlanets().filter(isSpaceRift)) {
          setTimeout(() => {
            silver += withdrawSilver(planet.locationId);
            message.innerText = `Withdrawn ${silver}.`;
          }, 0);
        }
      }, 5 * 60 * 1000);
    };
    let stopButton = document.createElement("button");
    stopButton.style.width = "49%";
    stopButton.style.marginBottom = "10px";
    stopButton.innerHTML = "Stop";
    stopButton.onclick = () => {
      this.clearIntervals();
    };
    container.appendChild(withdrawButton);
    container.appendChild(stopButton);
    container.appendChild(message);
  }
  destroy() {
    this.clearIntervals();
  }
}

function withdrawSilver(fromId) {
  const from = df.getPlanetWithId(fromId);
  const silver = Math.floor(from.silver);
  if (from.unconfirmedWithdrawSilver) {
    return 0;
  }
  if (silver > 0) {
    df.withdrawSilver(fromId, silver);
  }
  return silver;
}

function toPlanetOrSpaceRift(planet, toSpaceRift) {
  return toSpaceRift ? isSpaceRift(planet) : isPlanet(planet);
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

export default Plugin;
