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
