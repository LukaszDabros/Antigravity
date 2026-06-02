document.addEventListener('DOMContentLoaded', () => {
    // Gallery Logic
    const mainImage = document.getElementById('featureImage');
    const thumbnails = document.querySelectorAll('.thumb');
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');

    let currentIndex = 0;
    const images = Array.from(thumbnails).map(thumb => {
        return thumb.querySelector('img').src;
    });

    function updateGallery(index) {
        // Handle wrapping
        if (index >= images.length) index = 0;
        if (index < 0) index = images.length - 1;

        currentIndex = index;

        // Add fade effect
        mainImage.style.opacity = '0';

        setTimeout(() => {
            mainImage.src = images[currentIndex];
            mainImage.style.opacity = '1';
        }, 150); // Small delay to match CSS transition

        // Update active class on thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[currentIndex].classList.add('active');

        // Ensure thumbnail is visible in scroll area
        thumbnails[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    // Click on thumbnail
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateGallery(index);
        });
    });

    // Navigation buttons
    btnNext.addEventListener('click', () => {
        updateGallery(currentIndex + 1);
    });

    btnPrev.addEventListener('click', () => {
        updateGallery(currentIndex - 1);
    });

    // Add keyboard support for gallery if it's in view
    document.addEventListener('keydown', (e) => {
        const gallerySection = document.getElementById('galeria');
        const rect = gallerySection.getBoundingClientRect();
        const isInView = (rect.top <= window.innerHeight && rect.bottom >= 0);

        if (isInView) {
            if (e.key === 'ArrowRight') updateGallery(currentIndex + 1);
            if (e.key === 'ArrowLeft') updateGallery(currentIndex - 1);
        }
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
