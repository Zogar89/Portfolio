const projects = [
  {
    name: "Stock Central",
    description: "Centralizador de stock de filamentos 3D para AMBA, publicado como experiencia web.",
    objective: "Ayudar a usuarios de impresion 3D a encontrar rapido proveedor, material, color, marca y formato disponible.",
    technologies: ["Python", "Svelte", "Vite", "GitHub Actions", "GitHub Pages", "BeautifulSoup", "httpx", "Pillow"],
    challenges: [
      "Normalizar catalogos de distintos proveedores sin perder variantes utiles.",
      "Bloquear publicaciones cuando una fuente falla o los conteos caen de forma sospechosa.",
      "Separar captura de datos, UI y miniaturas para que cada workflow pueda evolucionar solo.",
    ],
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
    objective: "Construir un core multitenant para conectar cuentas de Mercado Libre y alimentar modulos internos con datos confiables.",
    technologies: ["FastAPI", "SQLAlchemy", "Alembic", "PostgreSQL", "Redis", "ARQ", "Jinja2", "Tailwind CSS", "Docker"],
    challenges: [
      "Resolver OAuth, webhooks y callbacks publicos sin mezclar entornos locales y productivos.",
      "Mantener checkpoints, reintentos y runs auditables para ingestas largas.",
      "Diseñar vistas admin y usuario sobre la misma plataforma sin romper permisos operativos.",
    ],
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
    objective: "Permitir reportar uso agregado de IA sin exponer prompts, respuestas, codigo fuente, logs crudos ni claves.",
    technologies: ["FastAPI", "Jinja2", "HTMX", "SQLAlchemy", "Alembic", "PostgreSQL", "SQLite", "PowerShell", "pytest"],
    challenges: [
      "Diseñar un collector one-shot que muestre preview local antes de enviar datos.",
      "Firmar envios privados con HMAC y conservar sesiones privadas con token.",
      "Hacer comparables los reportes sin convertirlo en un tracker permanente de gasto.",
    ],
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
    objective: "Dar a vendedores de Mercado Libre un panel para detectar reviews criticas, patrones y acciones prioritarias.",
    technologies: ["Django", "Django-Q2", "Redis", "PostgreSQL", "django-htmx", "django-allauth", "Mercado Libre API", "Ruff"],
    challenges: [
      "Centralizar llamadas a Mercado Libre y mantener sincronizaciones en background.",
      "Convertir reviews dispersas en etiquetas, alertas y metricas accionables.",
      "Preparar una base solida para produccion con settings separados, worker y seguridad OAuth.",
    ],
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

function renderList(items) {
  return items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
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
        <div class="project-details">
          <section>
            <h4>Tecnologias</h4>
            <div class="tech-list">
              ${repo.technologies.map((tech) => `<span>${escapeHtml(tech)}</span>`).join("")}
            </div>
          </section>
          <section>
            <h4>Objetivo</h4>
            <p>${escapeHtml(repo.objective)}</p>
          </section>
          <section>
            <h4>Desafios</h4>
            <ul>
              ${renderList(repo.challenges)}
            </ul>
          </section>
        </div>
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
