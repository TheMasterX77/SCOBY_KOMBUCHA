document.addEventListener('DOMContentLoaded', function () {
    /* ------------------ RULETA / CARRUSEL ------------------ */
    const track = document.getElementById('ruleta-track');

    if (track) {
        // Desactivamos la animación CSS para que mande el JS
        track.style.animation = 'none';

        // Duplicamos contenido para lograr efecto infinito
        const originalContent = track.innerHTML;
        track.innerHTML = originalContent + originalContent;

        const totalWidth = track.scrollWidth;
        const originalWidth = totalWidth / 2;

        let position = 0;
        let speed = 30;          // píxeles por segundo (velocidad del autoplay)
        let isPlaying = true;    // si la ruleta se mueve sola o está en pausa
        let lastTime = null;

        // Datos para el movimiento suave con flechas
        let isStepping = false;
        let stepStartPos = 0;
        let stepTargetPos = 0;
        let stepStartTime = null;
        const stepDuration = 450; // ms (duración de la animación de cada “salto”)

        const prevBtn = document.querySelector('.ruleta-prev');
        const nextBtn = document.querySelector('.ruleta-next');
        const toggleBtn = document.querySelector('.ruleta-toggle');
        const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;

        const groupCount = track.children.length / 2;      // porque ahora hay 2 copias
        const stepSize = originalWidth / groupCount;       // ancho aproximado de un grupo

        function normalizePosition() {
            if (position <= -originalWidth) {
                position += originalWidth;
            } else if (position >= 0) {
                position -= originalWidth;
            }
        }

        function render() {
            track.style.transform = `translateX(${position}px)`;
        }

        function animate(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const delta = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            if (isStepping) {
                // Animación suave hacia el target
                if (stepStartTime === null) stepStartTime = timestamp;
                const t = (timestamp - stepStartTime) / stepDuration;

                if (t >= 1) {
                    position = stepTargetPos;
                    normalizePosition();
                    isStepping = false;
                    stepStartTime = null;
                } else {
                    // easing tipo easeInOutQuad
                    const tt = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                    position = stepStartPos + (stepTargetPos - stepStartPos) * tt;
                }
                render();
            } else if (isPlaying) {
                // Autoplay continuo
                position -= speed * delta;
                normalizePosition();
                render();
            }

            requestAnimationFrame(animate);
        }

        render();
        requestAnimationFrame(animate);

        // Movimiento suave por grupo cuando se pulsan las flechas
        function step(direction) {
            if (isStepping) return; // si ya está animando, ignoramos
            stepStartPos = position;
            stepTargetPos = position - direction * stepSize;
            stepStartTime = null;
            isStepping = true;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                step(1); // siguiente grupo (izquierda)
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                step(-1); // grupo anterior (derecha)
            });
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                if (toggleIcon) {
                    if (isPlaying) {
                        toggleIcon.classList.remove('fa-play');
                        toggleIcon.classList.add('fa-pause');
                    } else {
                        toggleIcon.classList.remove('fa-pause');
                        toggleIcon.classList.add('fa-play');
                    }
                }
            });
        }
    }

    /* ------------------ BANNER AL HACER SCROLL ------------------ */
    const banner = document.querySelector('.banner');

    function onScrollHeader() {
        const offset = window.scrollY || window.pageYOffset;
        if (!banner) return;

        if (offset > 20) {
            banner.classList.add('banner-scrolled');
        } else {
            banner.classList.remove('banner-scrolled');
        }
    }

    window.addEventListener('scroll', onScrollHeader);
    onScrollHeader(); // llamada inicial

    /* ------------------ BOTÓN VOLVER ARRIBA ------------------ */
    const btnTop = document.getElementById('btn-top');

    function onScrollTopButton() {
        const offset = window.scrollY || window.pageYOffset;
        if (!btnTop) return;

        if (offset > 400) {
            btnTop.classList.add('visible');
        } else {
            btnTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', onScrollTopButton);
    onScrollTopButton();

    if (btnTop) {
        btnTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ------------------ EFECTO REVEAL EN SECCIONES ------------------ */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // fallback: sin IntersectionObserver, mostramos todo
        revealElements.forEach(el => el.classList.add('visible'));
    }

    /* ------------------ AÑO AUTOMÁTICO EN EL FOOTER ------------------ */
    const footerText = document.querySelector('footer p');
    if (footerText) {
        const year = new Date().getFullYear();
        if (!footerText.textContent.includes(year.toString())) {
            footerText.innerHTML += ` • © ${year}`;
        }
    }
});
