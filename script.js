// Robust images: try every likely filename, no more missing-photo errors
document.querySelectorAll('img[data-fallbacks]').forEach((img) => {
  const list = img.dataset.fallbacks.split(',').map(s => s.trim());
  img.addEventListener('error', function next() {
    const nxt = list.shift();
    if (nxt) { img.src = nxt; }
    else { img.removeEventListener('error', next); img.style.display = 'none'; }
  });
});

// Zoom reveal both directions
const io = new IntersectionObserver((es) => {
  es.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
}, { threshold: 0.12 });
document.querySelectorAll('.zoom').forEach(el => io.observe(el));

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Word animation — continuous on scroll up/down (blur + rise style)
document.querySelectorAll('header p, header h1, section h2, section h3, section p, .chips span').forEach((node) => {
  if (node.querySelector('#typing') || node.id === 'typing') return;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  texts.forEach((t) => {
    const frag = document.createDocumentFragment();
    t.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
      const s = document.createElement('span');
      s.className = 'word';
      s.textContent = part;
      frag.appendChild(s);
    });
    t.replaceWith(frag);
  });
});
const wordIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    const words = e.target.querySelectorAll('.word');
    if (e.isIntersecting) {
      words.forEach((w, i) => {
        w.classList.remove('play');
        void w.offsetWidth;
        w.style.animationDelay = Math.min(i * 0.03, 0.9) + 's';
        w.classList.add('play');
      });
    } else {
      words.forEach((w) => w.classList.remove('play'));
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('header, section').forEach((s) => wordIO.observe(s));
const words = ['strategy & finance.', 'teamwork & discipline.', 'data-driven decisions.'];
const el = document.getElementById('typing');
let wi = 0, ci = 0, del = false;
(function type() {
  const w = words[wi];
  el.textContent = w.slice(0, ci);
  if (!del && ci < w.length) ci++;
  else if (!del) { del = true; setTimeout(type, 1100); return; }
  else if (ci > 0) ci--;
  else { del = false; wi = (wi + 1) % words.length; }
  setTimeout(type, del ? 30 : 60);
})();
