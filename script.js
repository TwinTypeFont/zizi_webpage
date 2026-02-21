document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            slide.style.display = 'none';
            if (index === currentIndex) {
                slide.classList.add('active');
                slide.style.display = 'flex';
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
                slide.style.display = 'flex';
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.classList.add('next');
                slide.style.display = 'flex';
            }
        });
    }
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    }
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    }
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    updateSlides();
    const heroImage = document.getElementById('heroImage');
    const heroImageNext = document.getElementById('heroImageNext');
    if (heroImage && heroImageNext) {
        const heroImages = ['./imgs/001.jpg', './imgs/005.jpg', './imgs/004.jpg'];
        let heroImgIndex = 0;
        heroImageNext.src = heroImages[1];

        setInterval(() => {
            heroImage.style.transition = 'opacity 1.5s ease-in-out';
            heroImage.style.opacity = 0;

            setTimeout(() => {
                heroImgIndex = (heroImgIndex + 1) % heroImages.length;
                const nextNextIndex = (heroImgIndex + 1) % heroImages.length;
                heroImage.style.transition = 'none'; 
                heroImage.src = heroImages[heroImgIndex];
                heroImage.style.opacity = 1;
                heroImageNext.src = heroImages[nextNextIndex];
            }, 1500); 
        }, 4000); 
    }
    const modalOverlay = document.getElementById('pageModalOverlay');
    const modalBody = document.getElementById('pageModalBody');
    const modalCloseBtn = document.getElementById('pageModalClose');

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('visible');
    }

    function openModal(url) {
        if (!modalOverlay || !modalBody || !url) return;
        modalBody.innerHTML = '<p style="text-align:center; margin: 40px 0;">載入中⋯⋯</p>';
        modalOverlay.classList.add('visible');

        fetch(url, { cache: 'no-cache' })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then((html) => {
                modalBody.innerHTML = html;
            })
            .catch(() => {
                modalBody.innerHTML = '<p style="text-align:center; margin: 40px 0;">載入內容時發生錯誤，請稍後再試。</p>';
            });
    }

    window.openPageModal = openModal;

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    document.querySelectorAll('[data-modal]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const url = link.getAttribute('data-modal');
            openModal(url);
        });
    });
});
  const dts = document.querySelectorAll('dt');
  dts.forEach(dt => {
    dt.addEventListener('click', () => {
      const dd = dt.nextElementSibling;
      if (dd && dd.tagName === 'DD') {
        dt.classList.toggle('active');
        dd.classList.toggle('active');
      }
    });
  });