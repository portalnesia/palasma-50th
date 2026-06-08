export function setupHeroParallax(_section: HTMLElement, _bg: HTMLElement, _content: HTMLElement) {
  function init() {
    document.body.classList.add("js-ready");
  }
  window.addEventListener("splash:gsap-ready", init);
  return () => {
    window.removeEventListener("splash:gsap-ready", init);
  };
}
