const externalLinks = document.querySelectorAll('a[href^="https://"]');

externalLinks.forEach((link) => {
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});
