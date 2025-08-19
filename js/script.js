document.addEventListener('DOMContentLoaded', () => {
    /**
     * Back to top button
     */
    const backToTop = document.querySelector('.back-to-top');

    const toggleBackToTop = () => {
        if (!backToTop) return;
        if (window.scrollY > 100) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    }
    window.addEventListener('load', toggleBackToTop);
    document.addEventListener('scroll', toggleBackToTop);

    /**
     * Dynamic Year in Footer
     */
    const copyright = document.getElementById('copyright');
    if (copyright) {
        copyright.innerHTML = `&copy; ${new Date().getFullYear()} Alexandre de Paula`;
    }

    /**
     * Custom carousel (slide by slide, responsive)
     * - mostra 3 por vez >= 768px, 1 por vez < 768px
     * - avança 1 item por clique (wrap)
     */
    (function initProjectsCarousel() {
        const carousel = document.getElementById('projetosCarousel');
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const items = Array.from(track.querySelectorAll('.card-item'));
        const btnNextAll = Array.from(document.querySelectorAll('[data-action="next"]'));
        const btnPrevAll = Array.from(document.querySelectorAll('[data-action="prev"]'));

        if (!items.length) {
            carousel.classList.add('no-arrows');
            return;
        }

        let currentIndex = 0;
        let visibleCount = getVisibleCount();
        let itemWidth = computeItemWidth();
        let gap = parseInt(getComputedStyle(track).getPropertyValue('--carousel-gap')) || 20;

        function updateArrowsVisibility() {
            const noArrows = items.length <= visibleCount;
            if (noArrows) carousel.classList.add('no-arrows');
            else carousel.classList.remove('no-arrows');
        }

        updateArrowsVisibility();

        function getVisibleCount() {
            return window.innerWidth >= 768 ? 3 : 1;
        }

        function computeItemWidth() {
            const el = items[0];
            if (!el) return 0;
            const rect = el.getBoundingClientRect();
            return rect.width;
        }

        function clampIndex(index) {
            if (index < 0) return items.length - 1;
            if (index >= items.length) return 0;
            return index;
        }

        function moveToIndex(index, animate = true) {
            if (!track) return;
            currentIndex = clampIndex(index);

            if (items.length <= visibleCount) {
                currentIndex = 0;
            }

            itemWidth = computeItemWidth();
            const totalStep = itemWidth + gap;
            const translateX = -currentIndex * totalStep;

            if (!animate) {
                track.style.transition = 'none';
            } else {
                track.style.transition = '';
            }
            track.style.transform = `translateX(${translateX}px)`;
        }

        btnNextAll.forEach(b => b.addEventListener('click', (e) => {
            e.preventDefault();
            moveToIndex(currentIndex + 1);
        }));
        btnPrevAll.forEach(b => b.addEventListener('click', (e) => {
            e.preventDefault();
            moveToIndex(currentIndex - 1);
        }));

        const arrowLeft = carousel.querySelector('.arrow-left');
        const arrowRight = carousel.querySelector('.arrow-right');
        if (arrowLeft) arrowLeft.addEventListener('click', (e) => { e.preventDefault(); moveToIndex(currentIndex - 1); });
        if (arrowRight) arrowRight.addEventListener('click', (e) => { e.preventDefault(); moveToIndex(currentIndex + 1); });

        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveToIndex(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveToIndex(currentIndex + 1);
            }
        });

        // basic swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const dx = touchEndX - touchStartX;
            if (Math.abs(dx) > 40) {
                if (dx < 0) moveToIndex(currentIndex + 1);
                else moveToIndex(currentIndex - 1);
            }
        });

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newVisible = getVisibleCount();
                visibleCount = newVisible;
                itemWidth = computeItemWidth();
                updateArrowsVisibility();
                const maxStart = Math.max(0, items.length - visibleCount);
                if (currentIndex > maxStart) currentIndex = Math.min(currentIndex, maxStart);
                moveToIndex(currentIndex, false);
            }, 120);
        });

        // initial layout
        moveToIndex(0, false);
    })();

});
