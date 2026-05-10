(() => {
  "use strict";

  /* ============================================================================
     CMB SIGNAL INSTRUMENT
     Single-file, self-contained implementation
     ========================================================================== */

  /* ---------------------------------------------------------------------------
     1. CONFIGURATION
     ------------------------------------------------------------------------- */

  const SVG_PATH = "cmb.svg";
  const AUDIO_PATH = "audio.wav";

  const ANNOTATIONS = [
    {
      speaker: "Person 1",
      text: "Text 1"
    },
    {
      speaker: "Person 2",
      text: "Text 2"
    },
    {
      speaker: "Person 3",
      text: "Text 3"
    }
  ];

  /* ---------------------------------------------------------------------------
     2. STYLE INJECTION
     ------------------------------------------------------------------------- */

  const style = document.createElement("style");
  style.textContent = `
    .cmb-frame {
      margin: 40px 0;
      padding: 12px;
      background: transparent;
      border: 1px solid rgba(255,204,0,0.35);
      font-family: monospace;
      color: #ffcc00;
      filter:
        drop-shadow(0 0 1.5px rgba(235,250,122,0.22))
        drop-shadow(0 0 4px rgba(255,204,0,0.14))
        drop-shadow(0 0 10px rgba(255,204,0,0.06));
      position: relative;
    }

    .cmb-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85em;
      margin-bottom: 8px;
    }

    .cmb-diagram {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: 620px;
      margin-bottom: 10px;
    }

    .cmb-diagram object {
      width: 100%;
      height: 100%;
      display: block;
    }

    .cmb-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }

    .cmb-button {
      background: rgba(38,38,38,0.65);
      color: #ffcc00;
      border: 1px solid rgba(255,204,0,0.35);
      backdrop-filter: blur(2px);
      font-family: monospace;
      padding: 4px 8px;
      cursor: pointer;
      filter:
        drop-shadow(0 0 1.5px rgba(235,250,122,0.22))
        drop-shadow(0 0 4px rgba(255,204,0,0.14))
        drop-shadow(0 0 10px rgba(255,204,0,0.06));
    }

    .cmb-button:hover {
      background: rgba(255,204,0,0.12);
    }

    .cmb-status {
      font-size: 0.8em;
      opacity: 0.75;
    }

    .cmb-divider {
      height: 1px;
      margin: 8px 0;
      background: rgba(255,204,0,0.35);
      opacity: 0.6;
    }

    .cmb-annotations {
      font-size: 0.85em;
      line-height: 1.5;
    }

    .cmb-note {
      margin: 4px 0;
    }

    .cmb-speaker {
      opacity: 0.65;
      margin-right: 6px;
    }
  `;
  document.head.appendChild(style);

  /* ---------------------------------------------------------------------------
     3. DOM CONSTRUCTION
     ------------------------------------------------------------------------- */

  const mount = document.getElementById("compass");
  if (!mount) return;

  const frame = document.createElement("div");
  frame.className = "cmb-frame";

  frame.innerHTML = `
    <div class="cmb-top">
      <span>Composite Spectrography-Map of New Cassini Signal</span>
    </div>

    <div class="cmb-diagram">
      <object id="cmb-svg" data="${SVG_PATH}" type="image/svg+xml"></object>
    </div>

    <div class="cmb-controls">
      <button id="cmb-play" class="cmb-button" type="button">PLAY AUDIO</button>
      <span id="cmb-status" class="cmb-status">[READY]</span>
    </div>

    <div class="cmb-divider"></div>

    <div id="cmb-annotations" class="cmb-annotations"></div>
  `;

  mount.appendChild(frame);

  /* ---------------------------------------------------------------------------
     4. LOGIC
     ------------------------------------------------------------------------- */

  const playButton = frame.querySelector("#cmb-play");
  const status = frame.querySelector("#cmb-status");
  const annotations = frame.querySelector("#cmb-annotations");
  const object = frame.querySelector("#cmb-svg");

  const audio = new Audio(AUDIO_PATH);

  ANNOTATIONS.forEach(entry => {
    const note = document.createElement("div");
    note.className = "cmb-note";
    note.innerHTML = `
      <span class="cmb-speaker">${entry.speaker}:</span>
      <span>${entry.text}</span>
    `;
    annotations.appendChild(note);
  });

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playButton.textContent = "PAUSE AUDIO";
      status.textContent = "[PLAYING]";
    } else {
      audio.pause();
      playButton.textContent = "PLAY AUDIO";
      status.textContent = "[PAUSED]";
    }
  });

  audio.addEventListener("ended", () => {
    playButton.textContent = "PLAY AUDIO";
    status.textContent = "[ENDED]";
  });

  object.addEventListener("load", () => {
    const svgRoot = object.contentDocument?.querySelector("svg");
    if (!svgRoot) return;

    // Helps prevent clipping in some mobile/browser contexts.
    svgRoot.setAttribute("overflow", "visible");
  });

})();
