document.addEventListener('DOMContentLoaded', () => {
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

    tabs.querySelectorAll('.plantas__tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        if (wasDragged) {
          e.preventDefault();
          return;
        }
        tabs.querySelector('.plantas__tab--active')?.classList.remove('plantas__tab--active');
        tab.classList.add('plantas__tab--active');
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
  }
});
