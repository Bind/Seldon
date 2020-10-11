// Do not Use
// Experimenting with Dynamic Loading from a hosted module

(async () => {
  const Seldon = await import(
    "https://cdn.jsdelivr.net/gh/Bind/Seldon/dist/seldon.umd.js"
  );
})();
