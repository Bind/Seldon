export function secondsToMs(s) {
  return s * 1000;
}
export function msToSeconds(ms) {
  return ms / 1000;
}

export function within5Minutes(before, now) {
  return (before - now) / 1000 / 60 < 5;
}
