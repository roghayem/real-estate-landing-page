/* ==============================
   MOBILE MENU
============================== */
(function () {
  const menuToggle = document.getElementById('menuToggle');
  const navRight   = document.getElementById('navRight');
  let isOpen = false;

  function close() {
    navRight.classList.remove('open');
    isOpen = false;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('i').className = 'fas fa-bars';
  }

  function toggle() {
    if (isOpen) { close(); return; }
    navRight.classList.add('open');
    isOpen = true;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.querySelector('i').className = 'fas fa-times';
  }

  menuToggle.addEventListener('click', e => { e.stopPropagation(); toggle(); });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth <= 860) close();
      const id = a.getAttribute('href');
      if (id && id.startsWith('#')) {
        e.preventDefault();
        const el = document.getElementById(id.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.getElementById('contactBtn').addEventListener('click', () => {
    if (window.innerWidth <= 860) close();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('click', e => {
    if (isOpen && !navRight.contains(e.target) && !menuToggle.contains(e.target)) close();
  });
  navRight.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) close();
  });
})();


/* ==============================
   SCROLL REVEAL
============================== */
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 })
.observe = (() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ==============================
   CONTACT FORM
============================== */
function handleSubmit(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('.form-btn');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    e.target.reset();
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 4000);
  }, 1200);
}

/* ==============================
   PROPERTIES DATA (همان)
============================== */
const properties = {
 buy: [
    { city: "Chicago", image: "p6.jpg", area: "250 m²", bedroom: "2 Bedrooms", price: "$1,200 / mo" },
    { city: "Dallas",  image: "p5.jpg", area: "300 m²", bedroom: "1 Bedroom",  price: "$900 / mo"   },
    { city: "Seattle", image: "p4.jpg", area: "350 m²", bedroom: "2 Bedrooms", price: "$1,500 / mo" },
  ],
  rent: [
    { city: "Chicago", image: "p4.jpg", area: "250 m²", bedroom: "2 Bedrooms", price: "$1,200 / mo" },
    { city: "Dallas",  image: "p5.jpg", area: "300 m²", bedroom: "1 Bedroom",  price: "$900 / mo"   },
    { city: "Seattle", image: "p6.jpg", area: "350 m²", bedroom: "2 Bedrooms", price: "$1,500 / mo" },
  ],
   sell: [
    { city: "Chicago", image: "p6.jpg", area: "250 m²", bedroom: "2 Bedrooms", price: "$1,200 / mo" },
    { city: "Dallas",  image: "p4.jpg", area: "300 m²", bedroom: "1 Bedroom",  price: "$900 / mo"   },
    { city: "Seattle", image: "p5.jpg", area: "350 m²", bedroom: "2 Bedrooms", price: "$1,500 / mo" },
  ]
};

/* ==============================
   SLIDER - نسخه بهبود یافته
============================== */
(function () {
  const GAP      = 20;
  const viewport = document.querySelector('.slider-viewport');
  const wrapper  = document.getElementById('cardsContainer');
  const dotsEl   = document.getElementById('sliderDots');
  const prevBtn  = document.querySelector('.slider-arrow.prev');
  const nextBtn  = document.querySelector('.slider-arrow.next');
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const searchEl = document.getElementById('searchInput');

  let tab     = 'buy';
  let idx     = 0;
  let data    = [];
  let autoTmr = null;
  let isTransitioning = false;

  /* ── helpers ── */
  function perPage() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 600)  return 2;
    return 1;
  }

  function cardPx() {
    const cols = perPage();
    const vw   = viewport.getBoundingClientRect().width;
    return Math.floor((vw - GAP * (cols - 1)) / cols);
  }

  function maxIdx() { return Math.max(0, data.length - perPage()); }
  function clamp(v) { return Math.min(Math.max(v, 0), maxIdx()); }

  function setWidths() {
    const w = cardPx();
    wrapper.querySelectorAll('.property-card').forEach(c => {
      c.style.width = w + 'px';
      c.style.minWidth = w + 'px';
    });
  }

  function move(i, animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    idx = clamp(i);
    const offset = idx * (cardPx() + GAP);
    
    if (!animate) {
      wrapper.style.transition = 'none';
      wrapper.style.transform  = `translateX(-${offset}px)`;
      requestAnimationFrame(() => {
        wrapper.style.transition = '';
        isTransitioning = false;
      });
    } else {
      wrapper.style.transform = `translateX(-${offset}px)`;
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
    
    syncDots();
    syncArrows();
  }

  function syncDots() {
    dotsEl.innerHTML = '';
    const pages = Math.ceil(data.length / perPage());
    const cur   = Math.floor(idx / perPage());
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'slider-dot' + (i === cur ? ' active' : '');
      d.setAttribute('aria-label', `Page ${i + 1}`);
      d.addEventListener('click', () => { move(i * perPage()); resetAuto(); });
      dotsEl.appendChild(d);
    }
  }

  function syncArrows() {
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx >= maxIdx();
  }

  function render() {
    idx = clamp(idx);
    wrapper.innerHTML = '';
    wrapper.style.transform = 'translateX(0)';

    if (data.length === 0) {
      wrapper.innerHTML = `
        <div class="no-results">
          <i class="fas fa-home"></i>
          <p>No properties found</p>
        </div>`;
      dotsEl.innerHTML = '';
      prevBtn.disabled = nextBtn.disabled = true;
      return;
    }

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${item.city}" loading="lazy">
          <span class="card-badge">${tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          <button class="card-fav" aria-label="Save property">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <div class="card-content">
          <div class="card-city">
            <i class="fas fa-map-marker-alt"></i>${item.city}
          </div>
          <div class="card-details">
            <span><i class="fas fa-vector-square"></i>${item.area}</span>
            <span><i class="fas fa-bed"></i>${item.bedroom}</span>
          </div>
          <div class="card-footer">
            <div class="card-price">${item.price}</div>
            <button class="card-btn">View</button>
          </div>
        </div>`;

      card.querySelector('.card-fav').addEventListener('click', e => {
        e.stopPropagation();
        const btn = e.currentTarget;
        btn.classList.toggle('active');
        btn.querySelector('i').className = btn.classList.contains('active')
          ? 'fas fa-heart'
          : 'far fa-heart';
      });

      wrapper.appendChild(card);
    });

    requestAnimationFrame(() => {
      setWidths();
      move(idx, false);
    });
  }

  function filter() {
    const q = (searchEl.value || '').toLowerCase();
    data    = (properties[tab] || []).filter(p =>
      p.city.toLowerCase().includes(q)    ||
      p.bedroom.toLowerCase().includes(q) ||
      p.price.toLowerCase().includes(q)
    );
    idx = 0;
    render();
  }

  function startAuto() {
    clearInterval(autoTmr);
    autoTmr = setInterval(() => {
      if (data.length === 0) return;
      move(idx >= maxIdx() ? 0 : idx + 1);
    }, 3600);
  }
  function resetAuto() { clearInterval(autoTmr); startAuto(); }

  /* events */
  prevBtn.addEventListener('click', () => { move(idx - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { move(idx + 1); resetAuto(); });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tab = btn.dataset.tab;
      idx = 0;
      filter();
      resetAuto();
    });
  });

  searchEl.addEventListener('input', filter);

  /* swipe */
  let tx = 0;
  wrapper.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend',   e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) { move(idx + (diff > 0 ? 1 : -1)); resetAuto(); }
  });

  /* resize */
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      setWidths();
      move(clamp(idx), false);
      syncDots();
    }, 120);
  });

  filter();
  startAuto();
})();
