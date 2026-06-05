document.addEventListener('DOMContentLoaded', () => {
    function initCrossfadeCarousel(frontImageEl, backImageEl, imageList, intervalMs = 4000, fadeMs = 1500) {
        if (!frontImageEl || !backImageEl || !Array.isArray(imageList) || imageList.length < 2) return;

        let imageIndex = 0;
        backImageEl.src = imageList[1];

        setInterval(() => {
            frontImageEl.style.transition = `opacity ${fadeMs}ms ease-in-out`;
            frontImageEl.style.opacity = 0;

            setTimeout(() => {
                imageIndex = (imageIndex + 1) % imageList.length;
                const nextIndex = (imageIndex + 1) % imageList.length;
                frontImageEl.style.transition = 'none';
                frontImageEl.src = imageList[imageIndex];
                frontImageEl.style.opacity = 1;
                backImageEl.src = imageList[nextIndex];
            }, fadeMs);
        }, intervalMs);
    }

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
    initCrossfadeCarousel(
        heroImage,
        heroImageNext,
        ['./imgs/001.jpg', './imgs/005.jpg', './imgs/004.jpg'],
        4000,
        1500
    );

    const aboutFontsImage = document.getElementById('aboutFontsImage');
    const aboutFontsImageNext = document.getElementById('aboutFontsImageNext');
    initCrossfadeCarousel(
        aboutFontsImage,
        aboutFontsImageNext,
        ['./imgs/A01.jpg', './imgs/A02.jpg', './imgs/A03.jpg', './imgs/A04.jpg', './imgs/A05.jpg'],
        2200,
        1200
    );
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

    const mobileFooterMenuBtn = document.getElementById('mobileFooterMenuBtn');
    const mobileFooterLinks = document.getElementById('mobileFooterLinks');
    if (mobileFooterMenuBtn && mobileFooterLinks) {
        const closeMobileFooterMenu = () => {
            mobileFooterLinks.classList.remove('is-open');
            mobileFooterMenuBtn.setAttribute('aria-expanded', 'false');
        };

        mobileFooterMenuBtn.addEventListener('click', () => {
            const isOpen = mobileFooterLinks.classList.toggle('is-open');
            mobileFooterMenuBtn.setAttribute('aria-expanded', String(isOpen));
        });

        mobileFooterLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 870px)').matches) {
                    closeMobileFooterMenu();
                }
            });
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (
                window.matchMedia('(max-width: 870px)').matches &&
                mobileFooterLinks.classList.contains('is-open') &&
                target instanceof Node &&
                !mobileFooterLinks.contains(target) &&
                !mobileFooterMenuBtn.contains(target)
            ) {
                closeMobileFooterMenu();
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