const projects = [
  {
    name: "Stock Central",
    description: "Centralizador de stock de filamentos 3D para AMBA, publicado como experiencia web.",
    html_url: "https://github.com/Zogar89/CentraldeFilamentos",
    homepage: "https://zogar89.github.io/CentraldeFilamentos/",
    language: "Python",
    updated_at: "2026-06-26T21:35:01Z",
    kind: "Stock",
    image: "assets/projects/stock-central.png",
    image_alt: "Vista de Stock Central con catalogo de filamentos y cotizacion movil",
  },
  {
    name: "Meli Core Dumper",
    description: "Sincronizacion y descarga de informacion operativa de sellers de Mercado Libre.",
    html_url: "https://github.com/Zogar89/MeliCoreDumper",
    homepage: "",
    language: "Python",
    updated_at: "2026-06-08T22:01:27Z",
    kind: "Meli",
    image: "assets/projects/meli-core-dumper.png",
    image_alt: "Panel operativo de Meli Core Dumper con estado de sincronizacion y metricas",
  },
  {
    name: "Silver Usage Report",
    description: "Reportes de uso y consumo para seguimiento operativo con foco en claridad y trazabilidad.",
    html_url: "https://github.com/Zogar89/silver-usage-report",
    homepage: "",
    language: "Python",
    updated_at: "2026-05-05T18:16:27Z",
    kind: "Reportes",
    image: "assets/projects/silver-usage-report.png",
    image_alt: "Dashboard de Silver Usage Report con metricas de tokens y privacidad",
  },
  {
    name: "Monitor de Reviews",
    description: "Monitor para revisar, resumir y seguir senales de reviews desde un panel operativo.",
    html_url: "",
    homepage: "",
    language: "Python",
    updated_at: "2026-06-28T00:00:00Z",
    kind: "Reviews",
    image: "assets/projects/monitor-reviews.png",
    image_alt: "Panel de Monitor de Reviews con insights, reviews criticas y acciones",
  },
];

const grid = document.querySelector("#project-grid");
const filters = document.querySelectorAll(".filter");
let repositories = [...projects];

function formatDate(value) {
  return new Intl.DateTimeFormat("es-AR", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value) {
  const url = String(value || "");
  return url.startsWith("https://") ? url : "";
}

function renderStats(items) {
  const languages = new Set(items.map((repo) => repo.language).filter(Boolean));
  const recent = items.filter((repo) => {
    const updatedAt = new Date(repo.updated_at);
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 18);
    return updatedAt >= monthsAgo;
  });

  document.querySelector("#repo-count").textContent = items.length;
  document.querySelector("#language-count").textContent = languages.size;
  document.querySelector("#updated-count").textContent = recent.length;
}

function projectCard(repo) {
  const description = escapeHtml(repo.description);
  const language = escapeHtml(repo.language || "Proyecto");
  const kind = escapeHtml(repo.kind || "Proyecto");
  const image = safeUrl(repo.image) || escapeHtml(repo.image || "");
  const imageAlt = escapeHtml(repo.image_alt || `Vista de ${repo.name}`);
  const repoUrl = safeUrl(repo.html_url);
  const homepageUrl = safeUrl(repo.homepage);
  const repoLink = repoUrl
    ? `<a href="${repoUrl}" rel="noreferrer">Repositorio</a>`
    : `<span class="project-note">Repo privado</span>`;
  const homepage = homepageUrl
    ? `<a href="${homepageUrl}" rel="noreferrer">Demo</a>`
    : "";

  return `
    <article class="project-card">
      <figure class="project-media">
        <img src="${image}" alt="${imageAlt}" loading="lazy" width="1600" height="900" />
      </figure>
      <div>
        <h3>${escapeHtml(repo.name)}</h3>
        <p class="project-description">${description}</p>
        <div class="project-meta">
          <span class="pill language">${language}</span>
          <span class="pill">${kind}</span>
          <span class="pill">Actualizado ${formatDate(repo.updated_at)}</span>
        </div>
      </div>
      <div class="project-actions">
        ${repoLink}
        ${homepage}
      </div>
    </article>
  `;
}

function renderProjects(filter = "all") {
  const visible = filter === "all"
    ? repositories
    : repositories.filter((repo) => repo.kind === filter || repo.language === filter);

  grid.innerHTML = visible.length
    ? visible.map(projectCard).join("")
    : `<article class="project-card loading"><span>No hay proyectos para este filtro</span></article>`;
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

renderStats(repositories);
renderProjects();
