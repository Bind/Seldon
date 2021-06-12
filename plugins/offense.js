import { Manager } from "https://practical-snyder-a3b69f.netlify.app/core.esm.js";
import {
  html,
  render,
  useState,
  useLayoutEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import figures from "https://cdn.skypack.dev/figures";

function msToSeconds(ms) {
  return ms / 1000;
}
let Spacing = {
  marginLeft: "12px",
  marginRight: "12px",
};
let HorizontalSpacing = {
  marginRight: "12px",
};
let VerticalSpacing = {
  marginBottom: "12px",
};
let Clickable = {
  cursor: "pointer",
  textDecoration: "underline",
};
let ActionEntry = {
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  color: "",
};

function FloodList() {
  const actions = op.actions;
  const ActionGroups = actions
    .filter((a) => a.meta.ROUTINE == "FLOOD")
    .reduce((acc, action) => {
      if (typeof acc[action.payload.syncId] == "undefined") {
        acc[action.payload.syncId] = [];
      }
      acc[action.payload.syncId].append(action);
      return acc;
    }, {});
  ActionGroupChildren = Object.keys(ActionGroups).map((group) => {
    html`<${FloodGroup} actions=${ActionGroup[group]} />`;
  });
  return html``;
}

function FloodGroup({ actions }) {
  let summary = {
    totalLandingEnergy: 0,
  };
  let totalLandingEnergy = actions.reduce((acc, act) => {
    return (
      acc +
      (df.getPlanetWithId(act.payload.id).energy /
        action.payload.percentageSend) *
        100
    );
  }, 0);

  const FloodItems = actions.map((a) => {
    return html`<${Flood} action=${a} />`;
  });

  return html`<div>
    <span>Total Arriving Energy: ${totalLandingEnergy}</span>
    ${FloodItems}
  </div>`;
}
function centerPlanet(id) {
  let planet = df.getPlanetWithId(id);
  if (planet) {
    ui.centerPlanet(planet);
  }
}

function Flood({ action }) {
  let contentString =
    action.payload.sendAt < new Date().getTime()
      ? `Launched!`
      : `Launching in ${msToSeconds(sendAt - new Date().getTime())}`;
  return html`
      <div key=${action.id} style=${ActionEntry}>
        <span>
          <span
            style=${Spacing}
            onClick=${() => centerPlanet(action.payload.srcId)}
            >${action.payload.srcId.substring(5, 10)}</span
          ${figures.arrowRight}
          >
          <span style=${Spacing}>${contentString}</span></span
        >
      </div>
    `;
}

function Pester({ action }) {
  return html`
    <div key=${action.id} style=${ActionEntry}>
      <span>
        <span
          style=${{ ...Spacing, ...Clickable }}
          onClick=${() => centerPlanet(action.payload.srcId)}
          >${action.payload.srcId.substring(5, 10)}</span
        >
        ${figures.arrowRight}
        <span
          style=${{ ...Spacing, ...Clickable }}
          onClick=${() => centerPlanet(action.payload.syncId)}
          >${action.payload.syncId.substring(5, 10)}</span
        ></span
      >
      <button
        onClick=${() => {
          op.delete(action.id);
        }}
      >
        ${figures.cross}
      </button>
    </div>
  `;
}

function AddPester({ planet }) {
  let [source, setSource] = useState(false);
  let [target, setTarget] = useState(false);

  function createPester(source, target) {
    op.pester(source.locationId, target.locationId);
  }

  return html`
    <div>
      <button
        style=${VerticalSpacing}
        onClick=${() => {
          console.log("clicked");
          setSource(planet);
        }}
      >
        Set Source
      </button>
      <span style=${{ ...Spacing }}
        >${source ? source.locationId.substring(5, 10) : ""}</span
      >
    </div>
    <div>
      <button
        style=${VerticalSpacing}
        onClick=${() => {
          setTarget(planet);
        }}
      >
        Set Target
      </button>
      <span style=${{ ...Spacing }}
        >${target ? target.locationId.substring(5, 10) : ""}</span
      >
    </div>
    <button
      style=${VerticalSpacing}
      onClick=${() => createPester(source, target)}
    >
      submit
    </button>
  `;
}

// function PreviewOverload({ target, actions }) {
//   const actions
//   const addedEnergy = juice.reduce(
//     (acc, a) => acc + getEnergyArrival(a.payload.srcId, srcId, 75),
//     0
//   );
//   console.log(
//     `OVERLOAD TEST: Expect at Minimum ${getEnergyArrivalAbs(
//       srcId,
//       targetId,
//       addedEnergy
//     )}`
//   );
// }

function AddOverload({ planet, selected }) {
  let [src, setSrc] = useState(false);
  let [target, setTarget] = useState(false);
  let [duration, setDuration] = useState("short");
  let [test, setTest] = useState(true);

  function createOverload(target) {
    const durationMap = {
      short: 15 * 60,
      medium: 60 * 60,
      long: 3 * 60 * 60,
    };

    console.log(
      op.overload(
        src.locationId,
        target.locationId,
        durationMap[duration],
        7,
        5,
        test
      )
    );
  }
  function handleOptionChange(changeEvent) {
    setDuration(changeEvent.target.value);
  }
  if (!selected) {
    return;
  }
  return html`
    <div>
      <h1 style=${VerticalSpacing}>
        Funnel nearby energy into a friendly planet for a single large attack
        <span style=${{ float: "right" }}>
          <input
            type="checkbox"
            checked=${test}
            onChange=${() => setTest(!test)}
            id="test"
            style=${HorizontalSpacing}
          />
          <label for="test">Estimate Landing Force</label>
        </span>
      </h1>
      <i style=${VerticalSpacing}>How long should gathering energy take?</i>
      <div>
        <input
          checked=${duration == "short"}
          type="radio"
          id="short"
          name="distance"
          value="short"
          onChange=${handleOptionChange}
        />
        <label for="short">15 minutes</label><br />
        <input
          checked=${duration == "medium"}
          type="radio"
          id="medium"
          name="distance"
          value="medium"
          onChange=${handleOptionChange}
        />
        <label for="medium">1 hour</label><br />
        <input
          checked=${duration == "long"}
          type="radio"
          id="long"
          name="distance"
          value="long"
          onChange=${handleOptionChange}
        />
        <label for="long">3 hours</label>
      </div>
    </div>
    <div>
      <button
        style=${VerticalSpacing}
        onClick=${() => {
          setSrc(planet);
        }}
      >
        Set Source
      </button>
      <span style=${{ ...Spacing }}
        >${src ? src.locationId.substring(5, 10) : ""}</span
      >
    </div>
    <div>
      <button
        style=${VerticalSpacing}
        onClick=${() => {
          setTarget(planet);
        }}
      >
        Set Target
      </button>
      <span style=${{ ...Spacing }}
        >${target ? target.locationId.substring(5, 10) : ""}</span
      >
      <div>
        <button
          style=${VerticalSpacing}
          onClick=${() => createOverload(target)}
        >
          submit
        </button>
      </div>
    </div>
  `;
}

function AddFlood({ planet, selected }) {
  let [target, setTarget] = useState(false);
  let [duration, setDuration] = useState("short");

  function createFlood(target) {
    const durationMap = {
      short: 15 * 60,
      medium: 60 * 60,
      long: 3 * 60 * 60,
    };
    op.flood(target.locationId, 7, 5, durationMap[duration]);
  }
  function handleOptionChange(changeEvent) {
    setDuration(changeEvent.target.value);
  }
  if (!selected) {
    return;
  }
  return html`
    <div>
      <h1 style=${VerticalSpacing}>
        Coordinate large attacks to land at the same time
      </h1>
      <i style=${VerticalSpacing}>How soon should attacks land?</i>
      <div>
        <input
          checked=${duration == "short"}
          type="radio"
          id="short"
          name="distance"
          value="short"
          onChange=${handleOptionChange}
        />
        <label for="short">15 minutes</label><br />
        <input
          checked=${duration == "medium"}
          type="radio"
          id="medium"
          name="distance"
          value="medium"
          onChange=${handleOptionChange}
        />
        <label for="medium">1 hour</label><br />
        <input
          checked=${duration == "long"}
          type="radio"
          id="long"
          name="distance"
          value="long"
          onChange=${handleOptionChange}
        />
        <label for="long">3 hours</label>
      </div>
      <span style=${{ ...Spacing }}
        >${target ? target.locationId.substring(5, 10) : ""}</span
      >
    </div>
    <div>
      <button
        style=${VerticalSpacing}
        onClick=${() => {
          setTarget(planet);
        }}
      >
        Set Target
      </button>
    </div>
    <div>
      <button style=${VerticalSpacing} onClick=${() => createFlood(target)}>
        submit
      </button>
    </div>
  `;
}

function AddSwarm({ planet, selected }) {
  let [target, setTarget] = useState(false);

  function createSwarm(target) {
    op.swarm(target.locationId);
  }
  if (!selected) {
    return;
  }
  return html`
    <div>
      <h1 style=${VerticalSpacing}>Create a Swarm of recurring attack</h1>
      <div>
        <button
          style=${VerticalSpacing}
          onClick=${() => {
            setTarget(planet);
          }}
        >
          Set Target
        </button>
        <span style=${{ ...Spacing }}
          >${target ? target.locationId.substring(5, 10) : ""}</span
        >
      </div>
    </div>
    <button style=${VerticalSpacing} onClick=${() => createSwarm(target)}>
      submit
    </button>
  `;
}

function PesterList({ planet, selected }) {
  if (!selected) {
    return;
  }
  const [actions, setActions] = useState(op.actions);

  const [showHint, setShowHint] = useState(false);
  let actionList = {
    maxHeight: "100px",
    overflowX: "hidden",
    overflowY: "scroll",
  };

  let actionsChildren = actions
    .filter((a) => a.type == "PESTER")
    .map((action) => {
      return html`<${Pester} action=${action}></${Pester}>`;
    });

  return html`
    <h1 style=${VerticalSpacing}>
      Create a Recurring Attack<button
        style=${{ float: "right" }}
        onClick=${() => {
          setShowHint(!showHint);
        }}
      >
        ?
      </button>
    </h1>
    ${showHint &&
    html`<i style=${VerticalSpacing}
      >When the source planet energy is >75% it will launch an attack
    </i>`}

    <${AddPester} planet=${planet} />
    <h1 style=${VerticalSpacing}>
      Recurring Attacks
      <button
        style=${{ float: "right" }}
        onClick=${() => setActions([...op.actions])}
      >
        refresh
      </button>
    </h1>
    <div style=${{ ...actionList, ...VerticalSpacing }}>
      ${actionsChildren.length ? actionsChildren : "No Actions."}
    </div>
  `;
}

function ButtonBar({ tab, setTab }) {
  let buttonBar = {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "10px",
  };
  let buttonStyle = (selected) => {
    return selected ? { color: "black", backgroundColor: "white" } : {};
  };

  return html`<div style=${buttonBar}>
    <button
      style=${buttonStyle(tab === "pester")}
      onClick=${() => setTab("pester")}
    >
      Pester
    </button>
    <button
      style=${buttonStyle(tab === "swarm")}
      onClick=${() => setTab("swarm")}
    >
      Swarm
    </button>
    <div>
      <button
        style=${buttonStyle(tab === "flood")}
        onClick=${() => setTab("flood")}
      >
        Flood
      </button>
    </div>
    <div>
      <button
        style=${buttonStyle(tab === "overload")}
        onClick=${() => setTab("overload")}
      >
        Overload
      </button>
    </div>
  </div>`;
}
function App() {
  let [planet, setPlanet] = useState(ui.getSelectedPlanet());
  let onClick = () => {
    console.log("onclick");
    setPlanet(ui.getSelectedPlanet());
  };
  useLayoutEffect(() => {
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [onClick]);
  // ['unfound', 'withdraw', 'deposit', 'untaken']
  let [tab, setTab] = useState("pester");
  return html`
    <${ButtonBar} tab=${tab} setTab=${setTab} />
    <div>
      <${PesterList} planet=${planet} selected=${tab === "pester"} />
      <${AddSwarm} planet=${planet} selected=${tab === "swarm"} />
      <${AddFlood} planet=${planet} selected=${tab === "flood"} />
      <${AddOverload} planet=${planet} selected=${tab === "overload"} />
    </div>
  `;
}

class Plugin {
  constructor() {
    if (typeof window.op === "undefined") {
      window.op = new Manager();
    }
    this.op = window.op;
    this.root = null;
    this.container = null;
  }

  async render(container) {
    this.container = container;
    container.style.width = "450px";
    this.root = render(html`<${App} />`, container);
  }

  destroy() {
    render(null, this.container, this.root);
  }
}

export default Plugin;
