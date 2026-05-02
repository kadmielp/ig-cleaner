(() => {
  document.querySelector("#ig-cleaner-root")?.remove();

  let result = [];
  let selected = new Set();

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const username = location.pathname.split("/").filter(Boolean)[0];

  const root = document.createElement("div");
  root.id = "ig-cleaner-root";

  root.innerHTML = `
    <style>
      #ig-cleaner-root {
        position: fixed;
        top: 80px;
        right: 24px;
        z-index: 9999999;
        font-family: Arial, sans-serif;
      }

      #ig-cleaner-root .igc-card {
        width: 360px;
        max-height: 82vh;
        background: #121212;
        color: #fff;
        border: 1px solid #333;
        border-radius: 16px;
        box-shadow: 0 14px 45px rgba(0,0,0,.55);
        padding: 14px;
        box-sizing: border-box;
        overflow: hidden;
      }

      #ig-cleaner-root .igc-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      #ig-cleaner-root .igc-title {
        font-size: 15px;
        font-weight: 700;
      }

      #ig-cleaner-root .igc-btn {
        border: 0;
        border-radius: 10px;
        padding: 8px 10px;
        font-weight: 700;
        cursor: pointer;
        background: #fff;
        color: #111;
        font-size: 12px;
      }

      #ig-cleaner-root .igc-btn:disabled {
        opacity: .45;
        cursor: not-allowed;
      }

      #ig-cleaner-root .igc-close {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: 0;
        background: #fff;
        color: #111;
        cursor: pointer;
        font-weight: 700;
      }

      #ig-cleaner-root .igc-run {
        width: 100%;
        margin-bottom: 10px;
      }

      #ig-cleaner-root .igc-progress-wrap {
        width: 100%;
        height: 9px;
        background: #282828;
        border-radius: 999px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      #ig-cleaner-root .igc-progress {
        height: 100%;
        width: 0%;
        background: #fff;
        border-radius: 999px;
        transition: width .25s ease;
      }

      #ig-cleaner-root .igc-status {
        font-size: 12px;
        color: #bbb;
        margin-bottom: 10px;
        line-height: 1.4;
      }

      #ig-cleaner-root .igc-controls {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-bottom: 10px;
      }

      #ig-cleaner-root .igc-search {
        width: 100%;
        box-sizing: border-box;
        background: #1c1c1c;
        color: #fff;
        border: 1px solid #333;
        border-radius: 10px;
        padding: 9px;
        outline: none;
        margin-bottom: 8px;
        font-size: 13px;
      }

      #ig-cleaner-root .igc-info {
        font-size: 12px;
        color: #aaa;
        margin-bottom: 8px;
      }

      #ig-cleaner-root .igc-list {
        max-height: 360px;
        overflow: auto;
        border-top: 1px solid #2a2a2a;
      }

      #ig-cleaner-root .igc-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 4px;
        border-bottom: 1px solid #222;
        font-size: 13px;
      }

      #ig-cleaner-root .igc-row:hover {
        background: rgba(255,255,255,.06);
      }

      #ig-cleaner-root .igc-row.igc-selected {
        background: rgba(255,255,255,.1);
      }

      #ig-cleaner-root .igc-check {
        width: 15px;
        height: 15px;
      }

      #ig-cleaner-root .igc-link {
        color: #5db3ff;
        text-decoration: none;
        flex: 1;
      }

      #ig-cleaner-root .igc-chip {
        color: #aaa;
        font-size: 11px;
      }
    </style>

    <div class="igc-card">
      <div class="igc-head">
        <div class="igc-title">IG Cleaner</div>
        <button class="igc-close" id="igc-close">×</button>
      </div>

      <button class="igc-btn igc-run" id="igc-run">Scan</button>

      <div class="igc-progress-wrap">
        <div class="igc-progress" id="igc-progress"></div>
      </div>

      <div class="igc-status" id="igc-status">Pronto.</div>

      <div class="igc-controls">
        <button class="igc-btn" id="igc-all">All</button>
        <button class="igc-btn" id="igc-none">None</button>
        <button class="igc-btn" id="igc-open">Open</button>
        <button class="igc-btn" id="igc-copy">Copy</button>
      </div>

      <input class="igc-search" id="igc-search" placeholder="Search username..." />

      <div class="igc-info" id="igc-info">0 selected / 0 total</div>
      <div class="igc-list" id="igc-list"></div>
    </div>
  `;

  document.body.appendChild(root);

  const $ = id => root.querySelector(id);

  const setProgress = (percent, text) => {
    $("#igc-progress").style.width = `${percent}%`;
    $("#igc-status").textContent = text;
  };

  const render = () => {
    const q = $("#igc-search").value.toLowerCase();
    const filtered = result.filter(u => u.toLowerCase().includes(q));

    $("#igc-info").textContent =
      `${selected.size} selected / ${filtered.length} shown / ${result.length} total`;

    $("#igc-list").innerHTML = filtered.map(u => `
      <div class="igc-row ${selected.has(u) ? "igc-selected" : ""}">
        <input class="igc-check" type="checkbox" data-user="${u}" ${selected.has(u) ? "checked" : ""}>
        <a class="igc-link" href="https://instagram.com/${u}" target="_blank">@${u}</a>
        <span class="igc-chip">not following</span>
      </div>
    `).join("");
  };

  const openList = async (label) => {
    const el = [...document.querySelectorAll("a")]
      .find(a => a.textContent.toLowerCase().includes(label));

    if (!el) throw new Error(`Não achei o link: ${label}`);

    el.click();
    await sleep(2000);
  };

  const closeModal = async () => {
    document.querySelector('div[role="dialog"] svg[aria-label="Close"]')
      ?.closest("button")
      ?.click();

    await sleep(1000);
  };

  const collect = async (type, baseProgress, expectedTotal) => {
    const dialog = document.querySelector('div[role="dialog"]');
    if (!dialog) throw new Error("Modal não encontrado");

    const scroll = [...dialog.querySelectorAll("div")]
      .filter(d => d.scrollHeight > d.clientHeight)
      .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];

    if (!scroll) throw new Error("Área de scroll não encontrada");

    const set = new Set();
    let last = 0;
    let same = 0;

    while (same < 8) {
      dialog.querySelectorAll('a[href^="/"]').forEach(a => {
        const href = a.getAttribute("href");
        const parts = href.split("/").filter(Boolean);

        if (parts.length !== 1) return;

        const u = parts[0];

        if (
          u &&
          u !== username &&
          !u.includes("?") &&
          !u.includes("#") &&
          !["accounts", "explore", "reels", "direct"].includes(u)
        ) {
          set.add(u);
        }
      });

      const estimated = expectedTotal
        ? Math.min(set.size / expectedTotal, 1)
        : Math.min(set.size / 1000, 1);

      const percent = Math.round(baseProgress + estimated * 40);

      setProgress(
        percent,
        `${type}: ${set.size}${expectedTotal ? ` / ~${expectedTotal}` : ""} coletados...`
      );

      scroll.scrollTop = scroll.scrollHeight;
      await sleep(1300);

      if (set.size === last) same++;
      else same = 0;

      last = set.size;
    }

    return set;
  };

  $("#igc-run").onclick = async () => {
    try {
      selected.clear();
      result = [];
      render();

      $("#igc-run").disabled = true;
      $("#igc-run").textContent = "Scanning...";

      const followingExpected = Number(
        document.body.innerText.match(/([\d,.]+)\s+following/i)?.[1]?.replace(/[,.]/g, "")
      ) || null;

      const followersExpected = Number(
        document.body.innerText.match(/([\d,.]+)\s+followers/i)?.[1]?.replace(/[,.]/g, "")
      ) || null;

      setProgress(5, "Abrindo following...");
      await openList("following");

      const following = await collect("Following", 10, followingExpected);
      await closeModal();

      setProgress(50, "Abrindo followers...");
      await openList("followers");

      const followers = await collect("Followers", 55, followersExpected);
      await closeModal();

      setProgress(95, "Comparando listas...");

      result = [...following]
        .filter(u => !followers.has(u))
        .sort();

      setProgress(
        100,
        `Finalizado. Following: ${following.size}. Followers: ${followers.size}. Não seguem: ${result.length}.`
      );

      render();
      console.table(result);
    } catch (err) {
      setProgress(0, `Erro: ${err.message}`);
      console.error(err);
    } finally {
      $("#igc-run").disabled = false;
      $("#igc-run").textContent = "Scan";
    }
  };

  root.addEventListener("change", e => {
    if (e.target.classList.contains("igc-check")) {
      const u = e.target.dataset.user;
      e.target.checked ? selected.add(u) : selected.delete(u);
      render();
    }
  });

  $("#igc-all").onclick = () => {
    const q = $("#igc-search").value.toLowerCase();
    result
      .filter(u => u.toLowerCase().includes(q))
      .forEach(u => selected.add(u));
    render();
  };

  $("#igc-none").onclick = () => {
    selected.clear();
    render();
  };

  $("#igc-open").onclick = () => {
    [...selected].forEach((u, i) => {
      setTimeout(() => {
        window.open(`https://instagram.com/${u}`, "_blank");
      }, i * 700);
    });
  };

  $("#igc-copy").onclick = async () => {
    await navigator.clipboard.writeText([...selected].join("\n"));
    setProgress(100, "Selecionados copiados.");
  };

  $("#igc-search").oninput = render;

  $("#igc-close").onclick = () => root.remove();
})();
