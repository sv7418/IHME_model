/* ── Therapy Area Research Engine — frontend app ──────────────────────── */

const POPULAR_TAS = [
  "Type 2 Diabetes", "Rheumatoid Arthritis", "Non-Small Cell Lung Cancer",
  "Atopic Dermatitis", "Multiple Sclerosis", "Heart Failure",
  "Breast Cancer", "Psoriasis", "Alzheimer's Disease",
];

let allTherapyAreas = [];
let searchType = "ta";
let accumulatedText = "";
let renderTimer = null;
let isResearching = false;
let abortController = null;

// ── Helpers ──────────────────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function showToast(msg, type = "default", duration = 2800) {
  const t = document.createElement("div");
  t.className = `toast${type !== "default" ? " " + type : ""}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

function scheduleRender() {
  if (renderTimer) return;
  renderTimer = setTimeout(() => {
    renderTimer = null;
    doRender();
  }, 80);
}

function doRender(final = false) {
  const el = $("report-content");
  if (!el) return;
  const html = marked.parse(accumulatedText);
  el.innerHTML = html + (final ? "" : '<span class="cursor"></span>');
}

// ── Therapy area data ────────────────────────────────────────────────────

async function loadTherapyAreas() {
  try {
    const r = await fetch("/api/therapy-areas");
    const data = await r.json();
    allTherapyAreas = data.therapy_areas || [];
  } catch (e) {
    console.warn("Could not load therapy areas:", e);
  }
  renderPopularChips();
}

function renderPopularChips() {
  const container = $("popular-chips");
  if (!container) return;
  POPULAR_TAS.forEach(ta => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = ta;
    chip.onclick = () => {
      $("search-input").value = ta;
      updateClearBtn();
      hideSuggestions();
    };
    container.appendChild(chip);
  });
}

// ── Autocomplete ─────────────────────────────────────────────────────────

function getSuggestions(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return allTherapyAreas.filter(ta => ta.toLowerCase().includes(q)).slice(0, 8);
}

let highlightIndex = -1;

function showSuggestions(items) {
  const box = $("suggestions");
  if (!items.length) { hideSuggestions(); return; }
  highlightIndex = -1;
  box.innerHTML = "";
  items.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = item;
    div.onmousedown = (e) => {
      e.preventDefault();
      $("search-input").value = item;
      updateClearBtn();
      hideSuggestions();
    };
    box.appendChild(div);
  });
  box.classList.add("open");
}

function hideSuggestions() {
  $("suggestions").classList.remove("open");
  $("suggestions").innerHTML = "";
  highlightIndex = -1;
}

function navigateSuggestions(dir) {
  const items = $("suggestions").querySelectorAll(".suggestion-item");
  if (!items.length) return;
  items[highlightIndex]?.classList.remove("highlighted");
  highlightIndex = (highlightIndex + dir + items.length) % items.length;
  const target = items[highlightIndex];
  target.classList.add("highlighted");
  $("search-input").value = target.textContent;
}

// ── UI state updates ─────────────────────────────────────────────────────

function updateClearBtn() {
  const val = $("search-input").value.trim();
  $("clear-btn").classList.toggle("visible", val.length > 0);
}

function setSearchType(type) {
  searchType = type;
  document.querySelectorAll(".toggle-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.type === type);
  });
  $("search-input").placeholder = type === "product"
    ? "e.g., Humira, Keytruda, Ozempic"
    : "e.g., Type 2 Diabetes";
}

const STEPS = [
  { id: "step-pubmed",  name: "PubMed Literature",       icon: "📄" },
  { id: "step-trials",  name: "ClinicalTrials.gov",       icon: "🔬" },
  { id: "step-fda",     name: "FDA Drug Approvals",        icon: "💊" },
  { id: "step-claude",  name: "AI Synthesis",              icon: "✨" },
];

function buildProgressSteps() {
  const container = $("progress-steps");
  container.innerHTML = "";
  STEPS.forEach(s => {
    const div = document.createElement("div");
    div.className = "progress-step";
    div.id = s.id;
    div.innerHTML = `
      <span class="step-icon">${s.icon}</span>
      <span class="step-info">
        <span class="step-name">${s.name}</span>
        <span class="step-status">Waiting…</span>
      </span>`;
    container.appendChild(div);
  });
}

function setStep(stepId, state, statusText) {
  const el = $(stepId);
  if (!el) return;
  el.className = `progress-step ${state}`;
  const s = el.querySelector(".step-status");
  if (s) s.textContent = statusText;
}

function markSourcesDone(pubmed, trials, fda) {
  setStep("step-pubmed", pubmed ? "done" : "error", pubmed ? "Retrieved" : "No results");
  setStep("step-trials", trials ? "done" : "error", trials ? "Retrieved" : "No results");
  setStep("step-fda",    fda    ? "done" : "error", fda    ? "Retrieved" : "No results");
}

function showEmptyState()   { $("empty-state").style.display = "flex"; $("research-view").style.display = "none"; }
function showResearchView() { $("empty-state").style.display = "none"; $("research-view").style.display = "flex"; }

function setRunBtnState(loading) {
  const btn = $("run-btn");
  btn.disabled = loading;
  btn.classList.toggle("loading", loading);
  btn.querySelector(".btn-label").textContent = loading ? "Researching…" : "Run Analysis";
}

// ── SSE streaming via fetch ───────────────────────────────────────────────

async function* streamSSE(url, body, signal) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by double newlines
    const parts = buffer.split("\n\n");
    buffer = parts.pop();  // keep incomplete tail

    for (const part of parts) {
      for (const line of part.split("\n")) {
        if (line.startsWith("data: ")) {
          const raw = line.slice(6).trim();
          if (raw) {
            try { yield JSON.parse(raw); } catch {}
          }
        }
      }
    }
  }
}

// ── Main research flow ────────────────────────────────────────────────────

async function startResearch() {
  const input = $("search-input").value.trim();
  if (!input) {
    showToast("Please enter a therapy area or product name.", "error");
    $("search-input").focus();
    return;
  }
  if (isResearching) return;

  isResearching = true;
  accumulatedText = "";
  abortController = new AbortController();

  setRunBtnState(true);
  buildProgressSteps();
  showResearchView();

  $("report-title").textContent = input;
  $("report-timestamp").textContent = new Date().toLocaleString();
  $("report-content").innerHTML = "";
  $("status-msg").textContent = "Initializing…";
  $("topbar-title").textContent = input;
  $("topbar-subtitle").textContent = searchType === "product" ? "Product Research" : "Therapy Area Research";
  $("export-md-btn").disabled = true;
  $("copy-btn").disabled = true;
  $("stop-btn").style.display = "inline-block";

  try {
    const gen = streamSSE(
      "/api/research/stream",
      { therapy_area: input, search_type: searchType },
      abortController.signal,
    );

    for await (const event of gen) {
      handleEvent(event);
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      $("status-msg").textContent = "Connection error: " + err.message;
      showToast("Stream interrupted.", "error");
    }
  } finally {
    isResearching = false;
    setRunBtnState(false);
    $("stop-btn").style.display = "none";
    abortController = null;
  }
}

function stopResearch() {
  if (abortController) abortController.abort();
  showToast("Research stopped.");
}

function handleEvent(event) {
  switch (event.type) {
    case "status": {
      $("status-msg").textContent = event.message;
      const stepMap = {
        pubmed: "step-pubmed",
        trials: "step-trials",
        fda:    "step-fda",
        claude: "step-claude",
      };
      const stepId = stepMap[event.step];
      if (stepId) setStep(stepId, "active", "In progress…");
      break;
    }
    case "sources_done": {
      markSourcesDone(event.pubmed, event.trials, event.fda);
      setStep("step-claude", "active", "Generating analysis…");
      $("status-msg").textContent = event.message;
      break;
    }
    case "content": {
      accumulatedText += event.text;
      scheduleRender();
      break;
    }
    case "done": {
      if (renderTimer) { clearTimeout(renderTimer); renderTimer = null; }
      doRender(true);
      setStep("step-claude", "done", "Complete");
      $("status-msg").textContent = "Analysis complete.";
      $("export-md-btn").disabled = false;
      $("copy-btn").disabled = false;
      showToast("Research complete!", "success");
      break;
    }
    case "error": {
      $("status-msg").textContent = "Error: " + event.message;
      showToast(event.message, "error", 5000);
      STEPS.forEach(s => {
        const el = $(s.id);
        if (el && el.classList.contains("active")) setStep(s.id, "error", "Failed");
      });
      break;
    }
  }
}

// ── Export / Copy ─────────────────────────────────────────────────────────

function copyMarkdown() {
  if (!accumulatedText) return;
  navigator.clipboard.writeText(accumulatedText)
    .then(() => showToast("Copied to clipboard!", "success"))
    .catch(() => showToast("Copy failed — try manual selection.", "error"));
}

function exportMarkdown() {
  if (!accumulatedText) return;
  const ta = $("report-title").textContent || "report";
  const slug = ta.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  const blob = new Blob([accumulatedText], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ta-research-${slug}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Markdown exported.");
}

// ── Hint card quick-start ─────────────────────────────────────────────────

function quickStart(ta) {
  $("search-input").value = ta;
  updateClearBtn();
  startResearch();
}

// ── Event listeners ───────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  loadTherapyAreas();

  // Search type toggle
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => setSearchType(btn.dataset.type));
  });

  // Input
  const input = $("search-input");
  input.addEventListener("input", () => {
    updateClearBtn();
    showSuggestions(getSuggestions(input.value));
  });

  input.addEventListener("keydown", (e) => {
    const open = $("suggestions").classList.contains("open");
    if (e.key === "ArrowDown")  { e.preventDefault(); if (open) navigateSuggestions(1); }
    if (e.key === "ArrowUp")    { e.preventDefault(); if (open) navigateSuggestions(-1); }
    if (e.key === "Escape")     { hideSuggestions(); }
    if (e.key === "Enter")      { hideSuggestions(); startResearch(); }
  });

  input.addEventListener("blur", () => setTimeout(hideSuggestions, 150));
  input.addEventListener("focus", () => showSuggestions(getSuggestions(input.value)));

  // Clear button
  $("clear-btn").addEventListener("click", () => {
    input.value = "";
    updateClearBtn();
    hideSuggestions();
    input.focus();
  });

  // Run button
  $("run-btn").addEventListener("click", startResearch);

  // Stop button
  $("stop-btn").addEventListener("click", stopResearch);

  // Export / copy
  $("copy-btn").addEventListener("click", copyMarkdown);
  $("export-md-btn").addEventListener("click", exportMarkdown);
});
