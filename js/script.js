// DETECT TOUCH DEVICE
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

// CUSTOM CURSOR (DISABLE ON MOBILE)
if (!isTouchDevice) {
  const cur = document.getElementById('cur'),
        curR = document.getElementById('curR');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });

  (function animateCursor() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    curR.style.left = rx + 'px';
    curR.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();
}


// NAV SCROLL EFFECT
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 60);
});


// MOBILE MENU
function openMob() {
  document.getElementById('mob').classList.add('open');
}
function closeMob() {
  document.getElementById('mob').classList.remove('open');
}


// PARTICLES (REDUCED LOAD ON MOBILE)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let W, H, pts = [];
let particleCount = isTouchDevice ? 25 : 60;

function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
resize();

window.addEventListener('resize', () => {
  resize();
  init();
});

function init() {
  pts = [];
  for (let i = 0; i < particleCount; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .5
    });
  }
}
init();

let animationActive = true;

document.addEventListener("visibilitychange", () => {
  animationActive = !document.hidden;
});

function draw() {
  if (!animationActive) return;

  ctx.clearRect(0, 0, W, H);

  pts.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(184,22,14,0.45)';
    ctx.fill();
  });

  pts.forEach((a, i) => {
    pts.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 140) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(184,22,14,${.12 * (1 - d / 140)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(draw);
}
draw();


// INTERSECTION OBSERVER (UNCHANGED - GOOD)
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.au, .ai').forEach(el => {
  el.style.animationPlayState = 'paused';
  obs.observe(el);
});


// SLIDER (ADD TOUCH SUPPORT)
const slides = document.querySelectorAll('.slide');
let index = 0;

function showNextSlide() {
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}

setInterval(showNextSlide, 3000);


// SWIPE SUPPORT (MOBILE UX BOOST)
let startX = 0;

document.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

document.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) {
    showNextSlide(); // swipe left
  } else if (endX - startX > 50) {
    index = (index - 1 + slides.length) % slides.length;
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
  }
});
