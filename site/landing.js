// Parallax on the landing hero. Purely decorative.
const hero = document.getElementById('lhero');
if (hero && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const layers = [...hero.querySelectorAll('.layer')];
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    for (const l of layers) l.style.transform = `translateX(${-x * l.dataset.d * 2}px)`;
  });
}
