// Run me from your chrome dev tools
(async () => {
  const Seldon = await import(
    "https://raw.githubusercontent.com/Bind/Seldon/main/dist/seldon.umd.js"
  );
  console.log(Seldon);
  window.Seldon = Seldon;
})();
