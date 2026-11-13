/* ==========================================
   WASHPOINT - LIGHTBOX SA OZNAKOM PRE / POSLE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-wrapper">
                <button class="lightbox-close" aria-label="Zatvori">&times;</button>
                <div class="lightbox-media-box">
                    <div class="lightbox-badge"></div>
                    <button class="lightbox-arrow lightbox-prev" aria-label="Prethodna">&#10094;</button>
                    <div class="lightbox-media-container"></div>
                    <button class="lightbox-arrow lightbox-next" aria-label="Sledeća">&#10095;</button>
                    <div class="lightbox-counter"></div>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const mediaContainer = lightbox.querySelector('.lightbox-media-container');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const counterEl = lightbox.querySelector('.lightbox-counter');
    const badgeEl = lightbox.querySelector('.lightbox-badge');

    let currentAlbum = [];
    let currentIndex = 0;

    const renderMedia = (index) => {
        const src = currentAlbum[index];
        mediaContainer.innerHTML = '';

        const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

        if (isVideo) {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            mediaContainer.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Washpoint radovi';
            mediaContainer.appendChild(img);
        }

        // Ako kartica ima više od 1 slike (Pre / Posle), prikazujemo bedž u gornjem levom uglu
        if (currentAlbum.length > 1) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            counterEl.style.display = 'block';
            counterEl.textContent = `${index + 1} / ${currentAlbum.length}`;

            badgeEl.style.display = 'block';
            if (index === 0) {
                badgeEl.textContent = 'PRE';
                badgeEl.className = 'lightbox-badge badge-pre';
            } else {
                badgeEl.textContent = 'POSLE';
                badgeEl.className = 'lightbox-badge badge-posle';
            }
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            counterEl.style.display = 'none';
            badgeEl.style.display = 'none';
        }
    };

    document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', () => {
            const albumAttr = card.getAttribute('data-album') || card.getAttribute('data-src');
            if (!albumAttr) return;

            currentAlbum = albumAttr.split(',').map(item => item.trim()).filter(Boolean);
            currentIndex = 0;

            renderMedia(currentIndex);
            lightbox.classList.add('active');
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        const activeVideo = mediaContainer.querySelector('video');
        if (activeVideo) activeVideo.pause();
        mediaContainer.innerHTML = '';
    };

    const nextSlide = (e) => {
        if (e) e.stopPropagation();
        if (currentAlbum.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentAlbum.length;
        renderMedia(currentIndex);
    };

    const prevSlide = (e) => {
        if (e) e.stopPropagation();
        if (currentAlbum.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
        renderMedia(currentIndex);
    };

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
});