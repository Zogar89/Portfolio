document.documentElement.classList.add("js");

const externalLinks = document.querySelectorAll('a[href^="https://"]');

externalLinks.forEach((link) => {
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

const projectRows = document.querySelectorAll("[data-project]");
const projectPreviews = document.querySelectorAll("[data-preview]");

const setActiveProject = (key) => {
  projectRows.forEach((row) => {
    row.classList.toggle("is-active", row.dataset.project === key);
  });

  projectPreviews.forEach((preview) => {
    preview.classList.toggle("is-active", preview.dataset.preview === key);
  });
};

projectRows.forEach((row) => {
  const activate = () => setActiveProject(row.dataset.project);

  row.addEventListener("pointerenter", activate);
  row.addEventListener("focus", activate);
});

const sectionLinks = document.querySelectorAll("[data-section-link]");
const pageSections = document.querySelectorAll("[data-section]");

const setActiveSection = (id) => {
  sectionLinks.forEach((link) => {
    const isActive = link.hash === `#${id}`;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if ("IntersectionObserver" in window && sectionLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) {
        setActiveSection(visibleSection.target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55%",
      threshold: [0, 0.15, 0.35, 0.6],
    },
  );

  pageSections.forEach((section) => sectionObserver.observe(section));
}

const heroOrb = document.querySelector("[data-hero-orb]");
const heroSection = heroOrb?.closest(".editorial-hero");

if (heroOrb && heroSection) {
  let heroVisible = true;

  const syncHeroOrb = () => {
    heroOrb.classList.toggle(
      "is-ambient-active",
      heroVisible && !document.hidden,
    );
  };

  syncHeroOrb();

  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        syncHeroOrb();
      },
      { threshold: 0.15 },
    );

    heroObserver.observe(heroSection);
  }

  document.addEventListener("visibilitychange", syncHeroOrb);
}

const revealNodes = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8%",
      threshold: 0.08,
    },
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}
