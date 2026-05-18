document.addEventListener('DOMContentLoaded', () => {
    const hasGsap = typeof gsap !== "undefined";
    
    // 1. REGISTRO DE PLUGINS GSAP
    if (hasGsap && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 2. ANIMACIÓN DE ENTRADA DEL HERO (Tiempos optimizados)
    if (hasGsap && document.querySelector('.hero')) {
    const heroTl = gsap.timeline();
    
    heroTl.fromTo(['.hero-bg-bw', '.hero-bg-color'], 
        { scale: 1.15 },
        { scale: 1, duration: 2.0, ease: 'power3.out' } // Lo bajé a 2.0s para que sea más dinámico
    )
    // Usamos "<0.2" que significa: arranca apenas 0.2s después de que empezó la imagen (casi inmediato)
    .fromTo('.hero-title', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, "<0.2" 
    )
    .fromTo('.hero-body', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "<0.2"
    )
    .fromTo('.btn-primary', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, "<0.2"
    );
    }

    // 4. NUEVO MENÚ INTERACTIVO PREMIUM
    const menuOverlay = document.getElementById('menuOverlay');
    const menuTrigger = document.getElementById('menuTrigger'); // Tu Tomate
    let menuOpen = false;

    if (menuTrigger && menuOverlay) {
        // Construimos el DOM dinámico para el menú (Fondos, números, flechas)
        const menuItems = Array.from(menuOverlay.querySelectorAll('.menu-item'));
        
        menuItems.forEach((item, idx) => {
            const firstImg = item.querySelector('.hover-tiles img');
            const bg = document.createElement('div');
            bg.className = 'menu-item-bg';
            if (firstImg) bg.style.backgroundImage = `url('${firstImg.src}')`;
            item.insertBefore(bg, item.firstChild);
            
            const content = item.querySelector('.menu-item-content');
            if (!content) return;
            
            const num = document.createElement('span');
            num.className = 'menu-num';
            num.textContent = String(idx + 1).padStart(2, '0');
            content.insertBefore(num, content.firstChild);
            
            const arrow = document.createElement('span');
            arrow.className = 'menu-arrow';
            arrow.textContent = '→';
            content.appendChild(arrow);
        });

        function openMenu() {
            menuOpen = true;
            menuOverlay.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            // Animamos el tomate para que se sepa que está activo
            if (hasGsap) gsap.to('.fruit-icon', { rotation: 90, scale: 0.8, duration: 0.4, ease: "back.out(1.5)" });
        }
        function closeMenu() {
            menuOpen = false;
            menuOverlay.classList.remove('is-active');
            document.body.style.overflow = 'auto';
            // Tomate a la normalidad
            if (hasGsap) gsap.to('.fruit-icon', { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
        }

        menuTrigger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
    }

    // 5. SCROLLTRIGGER PARA SECCIONES (Revelado al hacer scroll)
    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach((el) => {
        if (hasGsap && !el.classList.contains('hero')) {
            gsap.fromTo(el, 
                { opacity: 0, y: 80 }, 
                { 
                    opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
                }
            );
        }
    });

    // 6. ANIMACIÓN CONTINUA DE LA MARQUESINA (TICKER)
    const ticker = document.querySelector('.ticker');
    if (ticker) {
        let pos = 0;
        function animTicker() {
            pos -= 0.8; 
            if (pos < -ticker.scrollWidth / 2) pos = 0;
            ticker.style.transform = `translateX(${pos}px)`;
            requestAnimationFrame(animTicker);
        }
        animTicker();
    }
    // ============================================
    // 3. INTERACCIÓN HERO: EL LENTE DE LA MEMORIA
    // ============================================
    const heroSection = document.querySelector('.hero');
    const colorLayer = document.querySelector('.hero-bg-color');

    if(hasGsap && heroSection && colorLayer) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(colorLayer, {
                '--mask-x': `${x}px`,
                '--mask-y': `${y}px`,
                '--mask-r': '250px', 
                duration: 0.3, 
                ease: "power2.out"
            });
            
            const xPos = (x / rect.width - 0.5);
            const yPos = (y / rect.height - 0.5);
            gsap.to('.hero-title', { x: -xPos * 30, y: -yPos * 30, duration: 1 });
            gsap.to('.hero-script', { x: -xPos * 60, y: -yPos * 60, duration: 1 });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to(colorLayer, {
                '--mask-r': '0px',
                duration: 0.8, 
                ease: "power3.out"
            });
            gsap.to(['.hero-title', '.hero-script'], { x: 0, y: 0, duration: 1 });
        });
    }

    // ============================================
    // 3.5 PARALLAX TIPOGRÁFICO: SECCIÓN "RAÍCES"
    // ============================================
    const bgWord = document.querySelector('.manifesto-bg-word');
    if (hasGsap && bgWord) {
        gsap.to(bgWord, {
            x: -400, 
            ease: "none", 
            scrollTrigger: {
                trigger: ".manifesto",
                start: "top bottom", 
                end: "bottom top", 
                scrub: 1 
            }
        });
    }
    // ============================================
    // 7. EFECTO MAGNÉTICO/SINESTÉSICO EN NARRATIVAS
    // ============================================
    const narrativasVisual = document.querySelector('.narrativas-visual');
    const narrativasImg = document.querySelector('.narrativas-visual .card-img');

    if (hasGsap && narrativasVisual && narrativasImg) {
        narrativasVisual.addEventListener('mousemove', (e) => {
            const rect = narrativasVisual.getBoundingClientRect();
            // Calcula la posición del cursor de -1 a 1
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Movemos la imagen sutilmente en la dirección opuesta al ratón (efecto ventana)
            gsap.to(narrativasImg, {
                x: -x * 40, // 40px de paneo
                y: -y * 40,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        narrativasVisual.addEventListener('mouseleave', () => {
            // Regresa al centro suavemente cuando quitas el ratón
            gsap.to(narrativasImg, {
                x: 0,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        });
    }
    // ============================================
    // ANIMACIÓN DE DATOS: CONTADORES NUMÉRICOS
    // ============================================
    const metricNumbers = document.querySelectorAll('.metric-num');
    
    if (hasGsap) metricNumbers.forEach((metric) => {
        // Guardamos el número real que pusiste en el HTML (5, 480, 14)
        const targetValue = parseInt(metric.innerText);
        
        // GSAP se encarga de contar desde 0 hasta ese número
        gsap.fromTo(metric, 
            { innerText: 0 }, 
            {
                innerText: targetValue,
                duration: 2.5, // Cuánto tarda en contar
                ease: "power3.out",
                snap: { innerText: 1 }, // Fuerza a que sean números enteros (sin decimales)
                scrollTrigger: {
                    trigger: ".metrics",
                    start: "top 85%", // Arranca cuando asoma en pantalla
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // ============================================
    // 9. RASTREADOR Y PARALLAX DE MAPA
    // ============================================
    const mapaTeaser = document.querySelector('.mapa-teaser');
    const coordText = document.querySelector('.coord-text');
    const mapUiLayer = document.querySelector('.map-ui-layer'); // La nueva capa de pines

    if (mapaTeaser && coordText) {
        mapaTeaser.addEventListener('mousemove', (e) => {
            const rect = mapaTeaser.getBoundingClientRect();
            
            // 1. Cálculos para las Coordenadas (Modo radar)
            const lat = (4.8133 + ((e.clientY - rect.top) / rect.height) * 0.0500).toFixed(4);
            const lon = (-75.6961 + ((e.clientX - rect.left) / rect.width) * 0.0500).toFixed(4);
            coordText.textContent = `LAT: ${lat} / LON: ${lon}`;

            // 2. Parallax de la capa de mapa (Para que los pines floten)
            if(hasGsap && mapUiLayer) {
                const xPos = (e.clientX - rect.left) / rect.width - 0.5;
                const yPos = (e.clientY - rect.top) / rect.height - 0.5;
                
                // Movemos los pines en la dirección del mouse para crear profundidad
                gsap.to(mapUiLayer, {
                    x: xPos * 40,
                    y: yPos * 40,
                    duration: 1,
                    ease: "power2.out"
                });
            }
        });

        // Al sacar el mouse, todo vuelve a su sitio suavemente
        mapaTeaser.addEventListener('mouseleave', () => {
            if(hasGsap && mapUiLayer) {
                gsap.to(mapUiLayer, { x: 0, y: 0, duration: 1.5, ease: "power3.out" });
            }
        });
    }

    
});

// ============================================
    // 14. INICIALIZACIÓN DE MAPA LEAFLET
    // ============================================
    const mapContainer = document.getElementById('mapaPlazas');
    
    // Verificamos si estamos en la página del mapa y si Leaflet (L) está cargado
    if (mapContainer && typeof L !== 'undefined') {
        
        // 1. Crear el mapa centrado en el Eje Cafetero
        const mapa = L.map('mapaPlazas', {
            zoomControl: false // Ocultamos el zoom para reposicionarlo
        }).setView([4.8133, -75.6961], 12);

        // Ubicar botones de zoom abajo a la derecha
        L.control.zoom({ position: 'bottomright' }).addTo(mapa);

        // 2. Capa de mapa base (Dark Matter de CartoDB - Gratis y sin recargas visuales)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(mapa);

        // 3. Crear un Icono Brutalista (Un punto rojo intenso con borde hueso)
        // Opcional: Podrías cambiar el html por una imagen dentro de imagenes/.
        const plazaIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="background-color: var(--red); width: 24px; height: 24px; border-radius: 50%; border: 3px solid var(--bone); box-shadow: 4px 4px 0px var(--carbon);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],   // Centra el punto
            popupAnchor: [0, -10]   // Hace que el popup salga un poco más arriba
        });


        // 4. Base de datos de Plazas
        const plazasDB = [
            {
                nombre: "Minorista Impala",
                ciudad: "PEREIRA",
                lat: 4.8105,
                lon: -75.6980, 
                desc: "El trato bacano, el fiado y el mercado tradicional en pleno centro de la ciudad.",
                img: "imagenes/Papa y canasta (Grande).JPG",
                link: "plazas.html" // Esto los llevará al directorio que hicimos
            },
            {
                nombre: "Mercasa Mayorista",
                ciudad: "PEREIRA",
                lat: 4.7950,
                lon: -75.7200,
                desc: "El gigante de la madrugada. Donde se mueven las toneladas que alimentan la región.",
                img: "imagenes/cajas moradas (Grande).JPG",
                link: "plazas.html"
            },
            {
                nombre: "Galería Santa Rosa",
                ciudad: "SANTA ROSA DE CABAL",
                lat: 4.8667,
                lon: -75.6167,
                desc: "Sabor a campo, embutidos y la tradición campesina intacta.",
                img: "imagenes/Hojas (Grande).JPG",
                link: "plazas.html"
            },
            {
                nombre: "Plaza de Mercado Cartago",
                ciudad: "CARTAGO",
                lat: 4.7469,
                lon: -75.9119,
                desc: "Corazón comercial e histórico del norte del Valle. Un espacio de tradición y resistencia campesina.",
                img: "imagenes/Tomate (Grande).JPG", // Pon la aquí la foto de Cartago cuando la tengas
                link: "plazas.html"
            }
            
    
        ];

        // 5. Pintar los marcadores en el mapa
        plazasDB.forEach(plaza => {
            const marker = L.marker([plaza.lat, plaza.lon], { icon: plazaIcon }).addTo(mapa);

            // Plantilla HTML del Popup (Con nuestras clases CSS)
            const popupHTML = `
                <div class="popup-brutal">
                    <img src="${plaza.img}" alt="${plaza.nombre}" class="popup-img">
                    <div class="popup-info">
                        <h3 class="popup-title">${plaza.nombre}</h3>
                        <div class="popup-city">${plaza.ciudad}</div>
                        <p class="popup-desc">${plaza.desc}</p>
                        <a href="${plaza.link}" class="btn-popup">VER EXPEDIENTE →</a>
                    </div>
                </div>
            `;

            // Vincular el popup al marcador
            marker.bindPopup(popupHTML);
        });
    }

    // ============================================
    // 15. LÓGICA DEL CARRUSEL DE DOCUMENTALES
    // ============================================
    const track = document.getElementById('carruselTrack');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const dots = document.querySelectorAll('.carrusel-dots .dot');
    
    if (track && btnPrev && btnNext) {
        let currentIndex = 0;
        const totalSlides = 3; // Tenemos 3 documentales

        // Función para mover el carrusel
        const updateCarrusel = () => {
            // Mueve la pista en porcentajes (-0%, -100%, -200%)
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Actualizar botones (Desactivar si llegas al límite)
            btnPrev.disabled = currentIndex === 0;
            btnNext.disabled = currentIndex === totalSlides - 1;

            // Actualizar los puntitos de abajo
            dots.forEach((dot, index) => {
                if(index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // Eventos de click
        btnNext.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarrusel();
            }
        });

        btnPrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarrusel();
            }
        });

        // Inicializar el estado de los botones al cargar
        updateCarrusel();
    }

    // ==========================================================================
    // 17. MOTOR INTERACTIVO TRANSMEDIA: LIENZO 3D Y ÁLBUM COLECTIVO (ACTUALIZADO)
    // ==========================================================================
    const lienzoMuro = document.getElementById('lienzoMuro');
    const muroContenido = document.getElementById('muroContenido');
    const proyector3D = document.getElementById('proyector3D');
    
    if (lienzoMuro && muroContenido) {
        let isDraggingCanvas = false;
        let startX, startY, scrollLeft, scrollTop;
        let scaleFactor = 1;
        let mouseStartClickX, mouseStartClickY;

        // 1. Centrar la cámara
        lienzoMuro.scrollLeft = (muroContenido.scrollWidth - lienzoMuro.clientWidth) / 2;
        lienzoMuro.scrollTop = (muroContenido.scrollHeight - lienzoMuro.clientHeight) / 2;

        // 2. LÓGICA DE AGARRAR Y ARRASTRAR EL LIENZO (DRAG & PAN)
        lienzoMuro.addEventListener('mousedown', (e) => {
            // Si le dimos clic al botón de subir, o estamos arrastrando una foto personal, NO muevas el canvas
            if (e.target.closest('#btnAbrirUpload') || e.target.closest('.foto-personal')) return;
            
            isDraggingCanvas = true;
            mouseStartClickX = e.pageX;
            mouseStartClickY = e.pageY;
            
            startX = e.pageX - lienzoMuro.offsetLeft;
            startY = e.pageY - lienzoMuro.offsetTop;
            scrollLeft = lienzoMuro.scrollLeft;
            scrollTop = lienzoMuro.scrollTop;
        });

        window.addEventListener('mouseup', () => { isDraggingCanvas = false; });
        
        lienzoMuro.addEventListener('mousemove', (e) => {
            if (!isDraggingCanvas) return;
            e.preventDefault();
            const x = e.pageX - lienzoMuro.offsetLeft;
            const y = e.pageY - lienzoMuro.offsetTop;
            const moveX = (x - startX) * 1.5;
            const moveY = (y - startY) * 1.5;
            lienzoMuro.scrollLeft = scrollLeft - moveX;
            lienzoMuro.scrollTop = scrollTop - moveY;
        });

        // 3. LÓGICA DE ZOOM CON LA RUEDA DEL RATÓN
        lienzoMuro.addEventListener('wheel', (e) => {
            e.preventDefault();
            scaleFactor += e.deltaY * -0.0015;
            scaleFactor = Math.min(Math.max(0.45, scaleFactor), 1.8);
            muroContenido.style.transform = `scale(${scaleFactor})`;
        }, { passive: false });

        // 4. LÓGICA DEL PROYECTOR MULTIMEDIA 3D PARA FOTOS EXISTENTES
        const fotosMuro = document.querySelectorAll('.item-click-3d');
        
        fotosMuro.forEach(tarjeta => {
            tarjeta.addEventListener('click', (e) => {
                let diffX = Math.abs(e.pageX - mouseStartClickX);
                let diffY = Math.abs(e.pageY - mouseStartClickY);
                if (diffX > 5 || diffY > 5) return; // Validación de drag
                
                const srcImagen = tarjeta.getAttribute('data-img');
                const autor = tarjeta.getAttribute('data-autor');
                const nota = tarjeta.getAttribute('data-nota');
                const bgClase = tarjeta.getAttribute('data-bg');
                const textoClase = tarjeta.getAttribute('data-text-color');

                document.getElementById('p3dImg').setAttribute('src', srcImagen);
                document.getElementById('p3dAutor').innerText = autor.toUpperCase();
                document.getElementById('p3dNota').innerText = `"${nota}"`;

                const dorso = document.getElementById('p3dBgColor');
                dorso.className = `proyector-face face-back ${bgClase} ${textoClase}`;

                proyector3D.classList.add('activo');
            });
        });

        proyector3D.addEventListener('click', () => { proyector3D.classList.remove('activo'); });

        // --- SISTEMA DE ARRASTRE PARA FOTOS PERSONALES ---
        function HacerArrastrable(elemento) {
            let isDraggingFoto = false;
            let startX, startY, initialLeft, initialTop;

            // Prevenimos que el clic 3D se dispare mientras arrastramos
            let wasDragged = false;

            elemento.addEventListener('mousedown', (e) => {
                isDraggingFoto = true;
                wasDragged = false;
                
                // Calculamos las coordenadas iniciales teniendo en cuenta el Zoom
                startX = e.clientX;
                startY = e.clientY;
                
                // Leemos el porcentaje actual del elemento
                initialLeft = parseFloat(elemento.style.left);
                initialTop = parseFloat(elemento.style.top);
                
                // Lo ponemos por encima de todas para arrastrarlo cómodo
                elemento.style.zIndex = 3000;
                elemento.style.cursor = "grabbing";
                e.stopPropagation(); // Evitamos que el lienzo reciba el clic
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDraggingFoto) return;
                wasDragged = true;
                e.preventDefault();

                // Calculamos cuánto se movió el mouse, ajustado por el nivel de zoom actual
                const deltaX = (e.clientX - startX) / scaleFactor;
                const deltaY = (e.clientY - startY) / scaleFactor;

                // Convertimos esos píxeles a porcentaje del muro (500vw / 500vh)
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                const percentX = (deltaX / (viewportWidth * 5)) * 100;
                const percentY = (deltaY / (viewportHeight * 5)) * 100;

                // Aplicamos la nueva posición
                elemento.style.left = `${initialLeft + percentX}%`;
                elemento.style.top = `${initialTop + percentY}%`;
            });

            window.addEventListener('mouseup', () => {
                if (isDraggingFoto) {
                    isDraggingFoto = false;
                    elemento.style.zIndex = 999;
                    elemento.style.cursor = "url('imagenes/limon-cursor.png') 16 16, pointer";
                }
            });

            // Re-vinculamos el evento de clic al elemento personal
            elemento.addEventListener('click', (e) => {
                if (wasDragged) return; // Si lo soltó después de arrastrar, no abras el 3D

                const srcImagen = elemento.getAttribute('data-img');
                const autor = elemento.getAttribute('data-autor');
                const nota = elemento.getAttribute('data-nota');
                
                document.getElementById('p3dImg').setAttribute('src', srcImagen);
                document.getElementById('p3dAutor').innerText = autor.toUpperCase();
                document.getElementById('p3dNota').innerText = `"${nota}"`;
                document.getElementById('p3dBgColor').className = "proyector-face face-back bg-yellow text-carbon";
                proyector3D.classList.add('activo');
            });
        }


        // 5. LÓGICA DE CONTROL DEL MODAL DE SUBIDA REAL (DRAG & DROP)
        const btnAbrir = document.getElementById('btnAbrirUpload');
        const modalUpload = document.getElementById('uploadModal');
        const btnCerrar = document.getElementById('btnCerrarUpload');
        const btnPublicar = document.getElementById('btnPublicarSimulado');

        const dropzoneContainer = document.getElementById('dropzoneContainer');
        const fileInputReal = document.getElementById('fileInputReal');
        const btnExplorarReal = document.getElementById('btnExplorarReal');
        const dropzoneContent = document.getElementById('dropzoneContent');
        const imagePreview = document.getElementById('imagePreview');
        
        let uploadedImageUrl = null;

        if (btnAbrir && modalUpload && btnCerrar) {
            btnAbrir.addEventListener('click', () => modalUpload.classList.add('is-open'));
            btnCerrar.addEventListener('click', () => modalUpload.classList.remove('is-open'));

            const triggerFileInput = (e) => { e.preventDefault(); fileInputReal.click(); };
            
            dropzoneContainer.addEventListener('click', triggerFileInput);
            btnExplorarReal.addEventListener('click', (e) => { e.stopPropagation(); fileInputReal.click(); });

            fileInputReal.addEventListener('change', function() {
                if (this.files && this.files[0]) procesarArchivo(this.files[0]);
            });

            dropzoneContainer.addEventListener('dragover', (e) => { e.preventDefault(); dropzoneContainer.classList.add('dragover'); });
            dropzoneContainer.addEventListener('dragleave', (e) => { e.preventDefault(); dropzoneContainer.classList.remove('dragover'); });
            dropzoneContainer.addEventListener('drop', (e) => {
                e.preventDefault(); dropzoneContainer.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) procesarArchivo(e.dataTransfer.files[0]);
            });

            function procesarArchivo(file) {
                if (!file.type.startsWith('image/')) { alert("Solo aceptamos imágenes."); return; }
                uploadedImageUrl = URL.createObjectURL(file);
                imagePreview.src = uploadedImageUrl;
                imagePreview.style.display = 'block';
                dropzoneContent.style.display = 'none';
            }

            btnPublicar.addEventListener('click', () => {
                if (!uploadedImageUrl) { alert("¡Arrastra una imagen primero!"); return; }

                const autorVal = document.getElementById('formAutor').value || "Vecino Anónimo";
                const notaVal = document.getElementById('formNota').value || "Sin palabras, solo la memoria viva de nuestra plaza.";

                const nuevaFoto = document.createElement('div');
                // Le agregamos la clase "foto-personal" para que el JS sepa que esta SÍ se puede mover
                nuevaFoto.className = "card-foto-fanzine item-click-3d polaroid-style foto-personal";
                
                const randTop = Math.floor(Math.random() * (56 - 44 + 1) + 44);
                const randLeft = Math.floor(Math.random() * (56 - 44 + 1) + 44);
                const randRot = Math.floor(Math.random() * (15 - (-15) + 1) + (-15));
                
                nuevaFoto.style = `top: ${randTop}%; left: ${randLeft}%; transform: rotate(${randRot}deg); z-index: 999;`;
                
                nuevaFoto.setAttribute('data-img', uploadedImageUrl); 
                nuevaFoto.setAttribute('data-autor', autorVal);
                nuevaFoto.setAttribute('data-nota', notaVal);
                nuevaFoto.setAttribute('data-bg', 'bg-yellow');
                nuevaFoto.setAttribute('data-text-color', 'text-carbon');

                nuevaFoto.innerHTML = `
                    <div class="card-frame">
                        <img src="${uploadedImageUrl}" alt="Aporte" style="pointer-events: none; user-select: none;">
                    </div>
                    <span class="card-author accent-script">${autorVal}</span>
                `;

                // Aquí le aplicamos el poder de ser arrastrada por todo el muro
                HacerArrastrable(nuevaFoto);

                muroContenido.appendChild(nuevaFoto);

                document.getElementById('formAutor').value = '';
                document.getElementById('formNota').value = '';
                uploadedImageUrl = null;
                imagePreview.src = '';
                imagePreview.style.display = 'none';
                dropzoneContent.style.display = 'flex';
                fileInputReal.value = ''; 
                modalUpload.classList.remove('is-open');
            });
        }
    }
