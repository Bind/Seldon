function checkPlanetUpgradeLevel(planet) {
  return planet.upgradeState.reduce((acc, i) => acc + i, 0);
}

export async function autoUpgrade(location) {
  const planet = df.getPlanetById(location);
  if (planet.planetLevel < 4 && checkPlanetUpgradeLevel(planet) < 4) {
    //auto upgrade defense
    df.upgrade(planet.locationId, 0);
  }
}
