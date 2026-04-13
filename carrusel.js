document.addEventListener('DOMContentLoaded', function () {
    const slide = document.querySelector('.carousel-slide');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    const dots = document.querySelectorAll('.dot');
    
    // NUEVO: Variables del botón
    const playPauseBtn = document.getElementById('play-pause-btn');
    let isPlaying = false; // Comienza pausado por defecto

    let currentIndex = 0;
    const totalItems = items.length;
    
    let autoPlayInterval;
    const tiempoCambio = 3500; // 3.5 segundos

    // --- Funciones Principales ---

    function updateCarousel() {
        const translateX = -currentIndex * 100;
        slide.style.transform = `translateX(${translateX}%)`;

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function avanzarSiguiente() {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; 
        }
        updateCarousel();
    }

    function retrocederAnterior() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalItems - 1; 
        }
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // --- Lógica de Autoplay con Botón ---
    
    function iniciarAutoPlay() {
        autoPlayInterval = setInterval(avanzarSiguiente, tiempoCambio);
    }

    function toggleAutoPlay() {
        if (isPlaying) {
            // Pausar
            clearInterval(autoPlayInterval);
            playPauseBtn.innerHTML = '▶ Auto';
            isPlaying = false;
        } else {
            // Reproducir
            avanzarSiguiente(); // Avanza una al instante para que se sienta reactivo
            iniciarAutoPlay();
            playPauseBtn.innerHTML = '⏸ Pausar';
            isPlaying = true;
        }
    }

    function reiniciarAutoPlaySiEstaActivo() {
        // Si el usuario toca la pantalla o las flechas, reiniciamos el contador 
        // SOLO si el autoplay estaba encendido, para que no brinque la imagen de golpe.
        if (isPlaying) {
            clearInterval(autoPlayInterval);
            iniciarAutoPlay();
        }
    }

    // --- Event Listeners ---

    // Evento del botón nuevo
    playPauseBtn.addEventListener('click', toggleAutoPlay);

    prevBtn.addEventListener('click', () => {
        retrocederAnterior();
        reiniciarAutoPlaySiEstaActivo();
    });

    nextBtn.addEventListener('click', () => {
        avanzarSiguiente();
        reiniciarAutoPlaySiEstaActivo();
    });

    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            goToSlide(index);
            reiniciarAutoPlaySiEstaActivo();
        }
    });

    // --- Soporte para Swipe ---
    let touchStartX = 0;
    let touchEndX = 0;

    slide.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        if(isPlaying) clearInterval(autoPlayInterval); 
    });

    slide.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        if(isPlaying) iniciarAutoPlay(); 
    });

    function handleSwipe() {
        const swipeThreshold = 50; 
        if (touchEndX < touchStartX - swipeThreshold) {
            avanzarSiguiente();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            retrocederAnterior();
        }
    }

    // --- Inicialización ---
    updateCarousel(); 
    // Ya no iniciamos el autoplay automático, el usuario debe dar clic al botón.
});
