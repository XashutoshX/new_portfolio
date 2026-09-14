// Loads each independent section file into the page.
// To add a new section: create sections/yourname.html, add a
// <div id="yourname-mount"></div> in index.html, and add one line below.
const SECTIONS = [
  { mount: "hero-mount",     file: "sections/hero.html" },
  { mount: "pivot-mount",    file: "sections/pivot.html" },
  { mount: "thinking-mount", file: "sections/thinking.html" },
  { mount: "work-mount",     file: "sections/work.html" },
  { mount: "record-mount",   file: "sections/record.html" },
  { mount: "proof-mount",    file: "sections/proof.html" },
  { mount: "models-mount",   file: "sections/models.html" },
  { mount: "contact-mount",  file: "sections/contact.html" },
];

async function loadSections() {
  await Promise.all(SECTIONS.map(async ({ mount, file }) => {
    const el = document.getElementById(mount);
    if (!el) return;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(res.status);
      el.innerHTML = await res.text();
    } catch (err) {
      el.innerHTML = `<div class="mount-loading">Couldn't load ${file}. If you opened this file directly in a browser, run a local server instead (see README.md).</div>`;
      console.error(`Failed to load ${file}:`, err);
    }
  }));
  // Wait for the content as well as its containers before restoring deep links.
  await loadData();
  openExternalLinksInNewTabs();
  document.dispatchEvent(new Event("portfolio:ready"));
  let targetId = location.hash.slice(1);
  try { targetId = decodeURIComponent(targetId); } catch { /* Ignore malformed fragment encoding. */ }
  const target = document.getElementById(targetId);
  if (target) target.scrollIntoView({ behavior: "instant" });
}

function openExternalLinksInNewTabs() {
  document.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach(link => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

const menuButton = document.querySelector(".nav-toggle");
const menuLinks = document.querySelector(".nav-links");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuLinks.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(expanded));
  menuLinks.classList.toggle("is-open", expanded);
});
menuLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

loadSections();
