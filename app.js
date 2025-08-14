  function searchSite() {
      const query = document.getElementById('searchInput').value;
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    }

(function () {
    const slider = document.getElementById('slider');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = 2;
    let idx = 0;
    let autoplay = true;
    const intervalMs = 15000; // 15 seconds
    let intervalId = null;

    function updateUI() {
      // each slide takes 50% of the slider width
      slider.style.transform = `translateX(-${idx * 50}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(i) {
      idx = ((i % totalSlides) + totalSlides) % totalSlides;
      updateUI();
    }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    function startAuto() {
      if (intervalId) clearInterval(intervalId);
      if (!autoplay) return;
      intervalId = setInterval(() => { next(); }, intervalMs);
    }
    function stopAuto() {
      autoplay = false;
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    nextBtn.addEventListener('click', () => { next(); stopAuto(); });
    prevBtn.addEventListener('click', () => { prev(); stopAuto(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const i = Number(dot.getAttribute('data-index'));
        goTo(i);
        stopAuto();
      });
    });

    // touch support
    let startX = 0, deltaX = 0;
    const thresh = 60; // px threshold
    slider.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        startX = e.touches[0].clientX;
        deltaX = 0;
        slider.style.transition = 'none';
      }
    }, {passive:true});
    slider.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      deltaX = e.touches[0].clientX - startX;
      const percent = (deltaX / slider.clientWidth) * 100;
      slider.style.transform = `translateX(calc(-${idx * 50}% + ${percent}%))`;
    }, {passive:true});
    slider.addEventListener('touchend', () => {
      slider.style.transition = '';
      if (Math.abs(deltaX) > thresh) {
        if (deltaX < 0) next(); else prev();
        stopAuto();
      } else {
        updateUI();
      }
      startX = 0; deltaX = 0;
    });

    // mouse drag for desktop
    let mouseDown = false, mouseStartX = 0, mouseDelta = 0;
    slider.addEventListener('mousedown', (e) => {
      mouseDown = true; mouseStartX = e.clientX; mouseDelta = 0;
      slider.style.transition = 'none';
    });
    window.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      mouseDelta = e.clientX - mouseStartX;
      const percent = (mouseDelta / slider.clientWidth) * 100;
      slider.style.transform = `translateX(calc(-${idx * 50}% + ${percent}%))`;
    });
    window.addEventListener('mouseup', () => {
      if (!mouseDown) return;
      mouseDown = false;
      slider.style.transition = '';
      if (Math.abs(mouseDelta) > thresh) {
        if (mouseDelta < 0) next(); else prev();
        stopAuto();
      } else {
        updateUI();
      }
      mouseStartX = 0; mouseDelta = 0;
    });

    // init
    updateUI();
    startAuto();

    // expose for debug
    window._ABOUT_SLIDER = { goTo, next, prev, stopAuto, startAuto };
})();

// Search Function
function searchSite() {
  const query = document.getElementById('searchInput').value;
  if (query) {
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  }
}