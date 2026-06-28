const username = "Zogar89";
const featuredNames = [
  "CentraldeFilamentos",
  "chalintrends",
  "silver-usage-report",
  "PriceTracker-CAC2023",
  "HenryTPIntegrador",
  "notas-tecnicas",
];

const grid = document.querySelector("#project-grid");
const filters = document.querySelectorAll(".filter");
let repositories = [];

const fallbackRepos = [
  {
    name: "CentraldeFilamentos",
    description: "Centralizador de stock de filamentos 3D para AMBA",
    html_url: "https://github.com/Zogar89/CentraldeFilamentos",
    homepage: "https://zogar89.github.io/CentraldeFilamentos/",
    language: "Python",
    updated_at: "2026-06-26T21:35:01Z",
    stargazers_count: 0,
  },
  {
    name: "chalintrends",
    description: "ChalinTrends Streamlit dashboard",
    html_url: "https://github.com/Zogar89/chalintrends",
    homepage: "",
    language: "Python",
    updated_at: "2026-06-28T15:29:04Z",
    stargazers_count: 0,
  },
  {
    name: "PriceTracker-CAC2023",
    description: "Proyecto rastreador de precios para curso Django Codo a Codo 2023",
    html_url: "https://github.com/Zogar89/PriceTracker-CAC2023",
    homepage: "",
    language: "HTML",
    updated_at: "2024-09-23T01:51:02Z",
    stargazers_count: 1,
  },
];

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

function sortRepos(items) {
  return [...items]
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) => {
      const featuredDelta = featuredNames.indexOf(a.name) - featuredNames.indexOf(b.name);
      const aFeatured = featuredNames.includes(a.name);
      const bFeatured = featuredNames.includes(b.name);

      if (aFeatured && bFeatured) return featuredDelta;
      if (aFeatured) return -1;
      if (bFeatured) return 1;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
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
  const description = escapeHtml(repo.description || "Repositorio público disponible en GitHub.");
  const language = escapeHtml(repo.language || "Repo");
  const repoUrl = safeUrl(repo.html_url);
  const homepageUrl = safeUrl(repo.homepage);
  const homepage = homepageUrl
    ? `<a href="${homepageUrl}" rel="noreferrer">Demo</a>`
    : "";

  return `
    <article class="project-card">
      <div>
        <h3>${escapeHtml(repo.name)}</h3>
        <p class="project-description">${description}</p>
        <div class="project-meta">
          <span class="pill language">${language}</span>
          <span class="pill">Actualizado ${formatDate(repo.updated_at)}</span>
          <span class="pill">${repo.stargazers_count} estrellas</span>
        </div>
      </div>
      <div class="project-actions">
        <a href="${repoUrl}" rel="noreferrer">Repositorio</a>
        ${homepage}
      </div>
    </article>
  `;
}

function renderProjects(filter = "all") {
  const visible = filter === "all"
    ? repositories
    : repositories.filter((repo) => repo.language === filter);

  grid.innerHTML = visible.length
    ? visible.map(projectCard).join("")
    : `<article class="project-card loading"><span>No hay proyectos para este filtro.</span></article>`;
}

async function loadRepositories() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!response.ok) throw new Error("GitHub API unavailable");
    repositories = sortRepos(await response.json());
  } catch (error) {
    repositories = sortRepos(fallbackRepos);
    grid.innerHTML = `
      <article class="project-card loading">
        <span>No se pudo contactar GitHub en este momento. Mostrando proyectos guardados.</span>
      </article>
    `;
  }

  renderStats(repositories);
  renderProjects();
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

loadRepositories();
