document.addEventListener('DOMContentLoaded', () => {
  const navBurger = document.getElementById('navBurger');
  const navMobileList = document.getElementById('navMobileList');

  if (navBurger && navMobileList) {
    navBurger.addEventListener('click', () => {
      const isOpen = navMobileList.classList.toggle('is-open');
      navBurger.setAttribute('aria-expanded', String(isOpen));
    });

    navMobileList.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        navMobileList.classList.remove('is-open');
        navBurger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const heroCard = document.querySelector('.hero__card');
  const heroTitle = document.querySelector('.hero__title');
  const heroHighlight = document.querySelector('.hero__highlight');
  const heroStats = document.querySelector('.hero__stats');
  const heroContent = document.querySelector('.hero__content');

  if (heroCard && heroTitle && heroHighlight && heroStats && heroContent) {
    const mq = window.matchMedia('(max-width: 900px)');

    const layoutHero = (isMobile) => {
      if (isMobile) {
        heroCard.insertBefore(heroStats, heroHighlight);
      } else {
        heroContent.appendChild(heroStats);
      }
    };

    layoutHero(mq.matches);
    mq.addEventListener('change', (e) => layoutHero(e.matches));
  }

  const tabs = document.getElementById('plantasTabs');
  const prevBtn = document.querySelector('.plantas__tabs-arrow--prev');
  const nextBtn = document.querySelector('.plantas__tabs-arrow--next');

  if (tabs && prevBtn && nextBtn) {
    const scrollAmount = () => tabs.clientWidth * 0.8;

    prevBtn.addEventListener('click', () => {
      tabs.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      tabs.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    let isDragging = false;
    let wasDragged = false;
    let startX = 0;
    let startScrollLeft = 0;

    const dragStart = (clientX) => {
      isDragging = true;
      wasDragged = false;
      startX = clientX;
      startScrollLeft = tabs.scrollLeft;
      tabs.classList.add('is-dragging');
    };

    const dragMove = (clientX) => {
      if (!isDragging) return;
      const delta = clientX - startX;
      if (Math.abs(delta) > 5) wasDragged = true;
      tabs.scrollLeft = startScrollLeft - delta;
    };

    const dragEnd = () => {
      isDragging = false;
      tabs.classList.remove('is-dragging');
    };

    tabs.addEventListener('mousedown', (e) => {
      dragStart(e.clientX);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => dragMove(e.clientX));
    window.addEventListener('mouseup', dragEnd);

    tabs.addEventListener('touchstart', (e) => dragStart(e.touches[0].clientX), { passive: true });
    tabs.addEventListener('touchmove', (e) => dragMove(e.touches[0].clientX), { passive: true });
    tabs.addEventListener('touchend', dragEnd);

    const plantasPlan = document.getElementById('plantasPlan');
    const img1 = document.getElementById('plantasImg1');
    const img2 = document.getElementById('plantasImg2');
    const areaEl = document.getElementById('plantasArea');
    const floorEl = document.getElementById('plantasFloor');
    const unitsEl = document.getElementById('plantasUnits');

    const renderPlanta = (tab) => {
      const images = (tab.dataset.images || '').split(',').filter(Boolean);
      img1.src = images[0] || '';
      img1.alt = `Planta baixa apartamento ${tab.dataset.area || ''}`;
      if (images[1]) {
        img2.src = images[1];
        img2.hidden = false;
        plantasPlan.classList.add('plantas__plan--double');
      } else {
        img2.hidden = true;
        plantasPlan.classList.remove('plantas__plan--double');
      }
      areaEl.textContent = tab.dataset.area || '';
      floorEl.textContent = tab.dataset.floor || '';
      if (tab.dataset.units) {
        unitsEl.innerHTML = `Unidades:<br>${tab.dataset.units}`;
        unitsEl.hidden = false;
      } else {
        unitsEl.hidden = true;
      }
    };

    tabs.querySelectorAll('.plantas__tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        if (wasDragged) {
          e.preventDefault();
          return;
        }
        tabs.querySelector('.plantas__tab--active')?.classList.remove('plantas__tab--active');
        tab.classList.add('plantas__tab--active');
        renderPlanta(tab);
      });
    });
  }

  const slides = Array.from({ length: 18 }, (_, i) => ({
    src: `assets/img/carrossel/carrossel-${String(i + 1).padStart(2, '0')}.avif`,
    caption: 'Perspectiva ilustrada do empreendimento',
  }));
  let currentSlide = 0;

  const mainImg = document.getElementById('estruturaMainImg');
  const sidePrev = document.getElementById('estruturaSidePrev');
  const sideNext = document.getElementById('estruturaSideNext');
  const caption = document.getElementById('estruturaCaption');
  const estruturaPrevBtn = document.getElementById('estruturaPrevBtn');
  const estruturaNextBtn = document.getElementById('estruturaNextBtn');

  const renderSlide = () => {
    const total = slides.length;
    const prevIndex = (currentSlide - 1 + total) % total;
    const nextIndex = (currentSlide + 1) % total;

    mainImg.src = slides[currentSlide].src;
    mainImg.alt = slides[currentSlide].caption;
    caption.textContent = slides[currentSlide].caption;
    sidePrev.src = slides[prevIndex].src;
    sideNext.src = slides[nextIndex].src;
  };

  if (mainImg && sidePrev && sideNext && caption && estruturaPrevBtn && estruturaNextBtn) {
    estruturaPrevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      renderSlide();
    });

    estruturaNextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      renderSlide();
    });

    sidePrev.style.cursor = 'pointer';
    sideNext.style.cursor = 'pointer';
    sidePrev.addEventListener('click', () => estruturaPrevBtn.click());
    sideNext.addEventListener('click', () => estruturaNextBtn.click());

    renderSlide();

    mainImg.addEventListener('click', () => openLightbox(mainImg.src, mainImg.alt));
  }

  const mapImg = document.querySelector('.localizacao__map img');
  if (mapImg) {
    mapImg.style.cursor = 'pointer';
    mapImg.addEventListener('click', () => openLightbox(mapImg.src, mapImg.alt));
  }
});

function openLightbox(src, alt) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightbox || !lightboxClose) return;

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
