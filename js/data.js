// Fetches data/*.json and renders it into the containers that
// sections/work.html, record.html, and proof.html provide.
// Edit the JSON files to change content — this file shouldn't need touching.

async function getJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

// JSON content stays text, including when an editor uses HTML-like characters.
function escapeContent(value) {
  if (Array.isArray(value)) return value.map(escapeContent);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, escapeContent(item)]));
  }
  return escapeHTML(value);
}

function renderWork(projects) {
  const el = document.getElementById("work-list");
  if (!el) return;
  el.innerHTML = projects.map(p => `
    <article class="case">
      <div class="case-top">
        <h3>${p.title}</h3>
        <span class="case-industry">${p.industry}</span>
      </div>
      <div class="case-grid">
        <div><h4>Situation</h4><p>${p.situation}</p></div>
        <div><h4>Approach</h4><p>${p.approach}</p></div>
        <div><h4>Outcome</h4><p>${p.outcome}</p></div>
      </div>
      <div class="case-metrics">
        ${p.metrics.map(m => `<div class="metric"><strong>${m.value}</strong><span>${m.label}</span></div>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderRecord(roles) {
  const el = document.getElementById("record-list");
  if (!el) return;
  el.innerHTML = roles.map(r => `
    <div class="trole">
      <span class="when">${r.when}</span>
      <h3>${r.role}</h3>
      <div class="translate"><strong>Translation:</strong> ${r.translation}</div>
    </div>
  `).join("");
}

function renderProof(quotes) {
  const el = document.getElementById("proof-list");
  if (!el) return;
  el.innerHTML = quotes.map(q => `
    <blockquote class="quote">
      <p>"${q.quote}"</p>
      <footer>${q.name}, ${q.role}</footer>
    </blockquote>
  `).join("");
}

async function loadData() {
  const sources = [
    { path: "data/projects.json", mount: "work-list", render: renderWork, label: "case studies" },
    { path: "data/experience.json", mount: "record-list", render: renderRecord, label: "timeline" },
    { path: "data/testimonials.json", mount: "proof-list", render: renderProof, label: "testimonials" },
  ];
  await Promise.all(sources.map(async ({ path, mount, render, label }) => {
    const element = document.getElementById(mount);
    if (!element) return;
    try {
      const items = await getJSON(path);
      if (!Array.isArray(items)) throw new Error(`${path} must contain an array`);
      if (items.length) render(escapeContent(items));
      else element.innerHTML = `<p class="mount-loading">More ${label} coming soon.</p>`;
    } catch (err) {
      element.innerHTML = `<p class="mount-loading" role="status">The ${label} couldn't load. Please refresh the page to try again.</p>`;
      console.error(`Failed to load ${path}:`, err);
    }
  }));
}
