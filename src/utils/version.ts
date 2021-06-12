function parseVersionString(string) {
  const [major, minor, patch] = string.split(".");
  return { major, minor, patch };
}

export function areVersionsCompatible(newVersion, oldVersion) {
  if (!oldVersion) {
    return false;
  }
  const newV = parseVersionString(newVersion);
  const oldV = parseVersionString(oldVersion);
  if (newV.major !== oldV.major) {
    //Raise Error
    return false;
  } else if (newV.minor !== oldV.minor) {
    //Should have a migration available
    return false;
  } else if (newV.patch !== oldV.patch) {
    //Should not effect actions schema
    return true;
  } else {
    return true;
  }
}
