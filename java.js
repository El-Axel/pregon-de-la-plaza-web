// ============================================
// 0. CONFIGURACIÓN DE FIREBASE (NUBE)
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbsU57BGdJjnOV2hwMM74LAQelQL2oV9A",
  authDomain: "pregon-plaza-db.firebaseapp.com",
  databaseURL: "https://pregon-plaza-db-default-rtdb.firebaseio.com",
  projectId: "pregon-plaza-db",
  storageBucket: "pregon-plaza-db.firebasestorage.app",
  messagingSenderId: "375292888813",
  appId: "1:375292888813:web:8c23d988b51b1371b5aee4",
  measurementId: "G-7HS26NBRBZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// AQUÍ SIGUE TU CÓDIGO NORMAL:
// document.addEventListener('DOMContentLoaded', () => { ...

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REGISTRO DE PLUGINS GSAP
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 2. ANIMACIÓN DE ENTRADA DEL HERO (Tiempos optimizados)
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
            gsap.to('.fruit-icon', { rotation: 90, scale: 0.8, duration: 0.4, ease: "back.out(1.5)" });
        }
        function closeMenu() {
            menuOpen = false;
            menuOverlay.classList.remove('is-active');
            document.body.style.overflow = 'auto';
            // Tomate a la normalidad
            gsap.to('.fruit-icon', { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
        }

        menuTrigger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
    }

    // 5. SCROLLTRIGGER PARA SECCIONES (Revelado al hacer scroll)
    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach((el) => {
        if (!el.classList.contains('hero')) {
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

    if(heroSection && colorLayer) {
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
    if (bgWord) {
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

    if (narrativasVisual && narrativasImg) {
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
    
    metricNumbers.forEach((metric) => {
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
            if(mapUiLayer) {
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
            if(mapUiLayer) {
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
        // Opcional: Podrías cambiar el html por <img src="IMAGENES/Tomate.JPG" width="30">
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
                img: "imagenes/fotos editadas/impala.jpeg",
                link: "plazas.html"
            },
            {
                nombre: "Mercasa Mayorista",
                ciudad: "PEREIRA",
                lat: 4.7950,
                lon: -75.7200,
                desc: "El gigante de la madrugada. Donde se mueven las toneladas que alimentan la región.",
                img: "imagenes/fotos editadas/mercasa.jpg",
                link: "plazas.html"
            },
            {
                nombre: "Galería Santa Rosa",
                ciudad: "SANTA ROSA DE CABAL",
                lat: 4.8667,
                lon: -75.6167,
                desc: "Sabor a campo, embutidos y la tradición campesina intacta.",
                img: "imagenes/fotos editadas/santarosa.jpeg",
                link: "plazas.html"
            },
            {
                nombre: "Plaza de Cartago",
                ciudad: "CARTAGO",
                lat: 4.7469,
                lon: -75.9119,
                desc: "Corazón comercial e histórico del norte del Valle. Un espacio de tradición y resistencia campesina.",
                img: "imagenes/fotos editadas/cartago.jpeg",
                link: "plazas.html"
            }
        ];

        // 5. Pintar los marcadores en el mapa con NOMBRES DINÁMICOS
        plazasDB.forEach(plaza => {
            // Creamos un icono único para cada plaza que incluye su nombre en HTML
            const iconoDinamico = L.divIcon({
                className: 'custom-map-marker',
                html: `
                    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                        <div style="background-color: var(--red); width: 24px; height: 24px; border-radius: 50%; border: 3px solid var(--bone); box-shadow: 4px 4px 0px var(--carbon);"></div>
                        <div class="pin-nombre-plaza">${plaza.nombre}</div>
                    </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],   
                popupAnchor: [0, -10]   
            });

            const marker = L.marker([plaza.lat, plaza.lon], { icon: iconoDinamico }).addTo(mapa);

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

            // El botón específico abre el explorador
btnExplorarReal.addEventListener('click', (e) => { 
    e.stopPropagation(); // Evita que el clic suba a la caja y cause estragos
    fileInputReal.click(); 
});

// Toda la caja también abre el explorador (sin hacer bucle infinito)
dropzoneContainer.addEventListener('click', (e) => { 
    // Si el clic vino del input o del botón, frenamos para no causar un bucle
    if (e.target === fileInputReal || e.target === btnExplorarReal) return;
    fileInputReal.click(); 
});

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

            // ==========================================
            // NUEVO BOTÓN: SUBIR A LA NUBE Y DIBUJAR FOTO
            // ==========================================
            btnPublicar.addEventListener('click', async () => {
                const file = fileInputReal.files[0];
                if (!file) { alert("¡Arrastra una imagen primero!"); return; }

                // Cambiamos el texto para que el usuario sepa que está cargando
                const textoOriginal = btnPublicar.innerText;
                btnPublicar.innerText = "SUBIENDO A LA NUBE... ⏳";
                btnPublicar.disabled = true;

                try {
                    const autorVal = document.getElementById('formAutor').value || "Vecino Anónimo";
                    const notaVal = document.getElementById('formNota').value || "Sin palabras, solo la memoria viva de nuestra plaza.";
                    
                    // 1. COMPRIMIR Y SUBIR FOTO A STORAGE
                    const opcionesCompresion = {
                        maxSizeMB: 0.3, // Forzamos a que no pase de 300 KB
                        maxWidthOrHeight: 1200,
                        useWebWorker: true
                    };
                    
                    // La librería exprime la foto antes de enviarla
                    const archivoComprimido = await imageCompression(file, opcionesCompresion);
                    
                    const nombreUnico = 'muro/' + Date.now() + '_' + archivoComprimido.name;
                    const archivoRef = ref(storage, nombreUnico);
                    
                    // Subimos el archivo ligero
                    await uploadBytes(archivoRef, archivoComprimido);
                    const urlDescarga = await getDownloadURL(archivoRef); // Obtenemos el link público

                    // 2. GENERAR COORDENADAS ALEATORIAS
                    const randTop = Math.floor(Math.random() * (56 - 44 + 1) + 44);
                    const randLeft = Math.floor(Math.random() * (56 - 44 + 1) + 44);
                    const randRot = Math.floor(Math.random() * (15 - (-15) + 1) + (-15));

                    // 3. GUARDAR LOS DATOS EN LA BASE DE DATOS (FIRESTORE)
                    await addDoc(collection(db, "fotos-muro"), {
                        url: urlDescarga,
                        autor: autorVal,
                        nota: notaVal,
                        top: randTop,
                        left: randLeft,
                        rot: randRot,
                        timestamp: Date.now()
                    });

                    // 4. DIBUJARLA EN LA PANTALLA INMEDIATAMENTE
                    crearTarjetaEnMuro(urlDescarga, autorVal, notaVal, randTop, randLeft, randRot);

                    // 5. LIMPIAR EL FORMULARIO
                    document.getElementById('formAutor').value = '';
                    document.getElementById('formNota').value = '';
                    uploadedImageUrl = null;
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                    dropzoneContent.style.display = 'flex';
                    fileInputReal.value = ''; 
                    modalUpload.classList.remove('is-open');

                } catch (error) {
                    console.error("Error en la nube:", error);
                    alert("Hubo un error subiendo la foto. Revisa tu conexión.");
                } finally {
                    btnPublicar.innerText = textoOriginal;
                    btnPublicar.disabled = false;
                }
            });

            // ==========================================
            // FUNCIÓN QUE CONSTRUYE LAS TARJETAS (USADA AL SUBIR Y AL CARGAR)
            // ==========================================
            function crearTarjetaEnMuro(imgUrl, autor, nota, top, left, rot) {
                const nuevaFoto = document.createElement('div');
                nuevaFoto.className = "card-foto-fanzine item-click-3d polaroid-style foto-personal";
                nuevaFoto.style = `top: ${top}%; left: ${left}%; transform: rotate(${rot}deg); z-index: 999;`;
                
                nuevaFoto.setAttribute('data-img', imgUrl); 
                nuevaFoto.setAttribute('data-autor', autor);
                nuevaFoto.setAttribute('data-nota', nota);
                nuevaFoto.setAttribute('data-bg', 'bg-yellow');
                nuevaFoto.setAttribute('data-text-color', 'text-carbon');

                nuevaFoto.innerHTML = `
                    <div class="card-frame">
                        <img src="${imgUrl}" alt="Aporte" style="pointer-events: none; user-select: none;">
                    </div>
                    <span class="card-author accent-script">${autor}</span>
                `;

                HacerArrastrable(nuevaFoto);
                muroContenido.appendChild(nuevaFoto);
            }

            // ==========================================
            // DESCARGAR LAS FOTOS VIEJAS AL ABRIR LA PÁGINA
            // ==========================================
            async function cargarFotosDeLaNube() {
                const querySnapshot = await getDocs(collection(db, "fotos-muro"));
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    crearTarjetaEnMuro(data.url, data.autor, data.nota, data.top, data.left, data.rot);
                });
            }
            // Llamamos a la función inmediatamente para que traiga el historial
            cargarFotosDeLaNube();
        }
    }

    // ==========================================================================
    // 14. LÓGICA POPUPS PLAZAS (EXPEDIENTES)
    // ==========================================================================
    const tarjetasPlaza = document.querySelectorAll('.item-plaza-popup');
    const plazaModal = document.getElementById('plazaModal');
    const btnCerrarPlaza = document.getElementById('btnCerrarPlazaModal');

    if (tarjetasPlaza.length > 0 && plazaModal && btnCerrarPlaza) {
        tarjetasPlaza.forEach(tarjeta => {
            tarjeta.addEventListener('click', () => {
                const name = tarjeta.getAttribute('data-name');
                const city = tarjeta.getAttribute('data-city');
                const img = tarjeta.getAttribute('data-img');
                const link = tarjeta.getAttribute('data-link');
                const desc = tarjeta.getAttribute('data-desc');

                document.getElementById('plazaPopupImg').setAttribute('src', img);
                document.getElementById('plazaPopupTitle').innerText = name.toUpperCase();
                document.getElementById('plazaPopupCity').innerText = city.toUpperCase();
                document.getElementById('plazaPopupDesc').innerText = desc;
                document.getElementById('plazaPopupLink').setAttribute('href', link);

                plazaModal.classList.add('is-open');
            });
        });

        btnCerrarPlaza.addEventListener('click', () => {
            plazaModal.classList.remove('is-open');
        });
    }

    // ==========================================================================
    // 15. CALCULADORA DE MERCADO (FACTURA INTERACTIVA)
    // ==========================================================================
    const btnAgregarFactura = document.getElementById('btnAgregarFactura');
    const btnLimpiarTicket = document.getElementById('btnLimpiarTicket');
    const ticketItemsContainer = document.getElementById('ticketItemsContainer');
    const ticketTotalAcumulado = document.getElementById('ticketTotalAcumulado');
    const ticketVacioMsg = document.getElementById('ticketVacioMsg');
    const napaStamp = document.getElementById('napaStamp');

    // Usamos window.totalCuenta para evitar conflictos de variables globales si recargas
    window.totalCuenta = window.totalCuenta || 0;

    if (btnAgregarFactura && ticketItemsContainer) {
        btnAgregarFactura.addEventListener('click', () => {
            const selectProd = document.getElementById('calcProducto');
            const inputKilos = document.getElementById('calcKilos');
            
            const precioPorKilo = parseInt(selectProd.value);
            const kilos = parseFloat(inputKilos.value) || 1;
            
            const selectedOption = selectProd.options[selectProd.selectedIndex];
            const nombreProducto = selectedOption.getAttribute('data-name');
            const costoFila = precioPorKilo * kilos;
            
            if (ticketVacioMsg) ticketVacioMsg.style.display = 'none';

            const nuevaFila = document.createElement('div');
            nuevaFila.className = 'ticket-row';
            
            const subtotalFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency', currency: 'COP', minimumFractionDigits: 0
            }).format(costoFila);

            nuevaFila.innerHTML = `
                <span class="ticket-row-name">${nombreProducto} (${kilos})</span>
                <span class="ticket-row-price">${subtotalFormateado}</span>
            `;

            ticketItemsContainer.appendChild(nuevaFila);
            window.totalCuenta += costoFila;
            
            ticketTotalAcumulado.innerText = new Intl.NumberFormat('es-CO', {
                style: 'currency', currency: 'COP', minimumFractionDigits: 0
            }).format(window.totalCuenta);

            if (window.totalCuenta >= 20000 && napaStamp) napaStamp.style.display = 'block';

            if (typeof gsap !== 'undefined') {
                gsap.fromTo('.calc-factura-ticket', 
                    { backgroundColor: 'var(--yellow)' }, 
                    { backgroundColor: '#fffdeb', duration: 0.4 }
                );
            }
        });

        if (btnLimpiarTicket) {
            btnLimpiarTicket.addEventListener('click', () => {
                ticketItemsContainer.innerHTML = '';
                if (ticketVacioMsg) {
                    ticketItemsContainer.appendChild(ticketVacioMsg);
                    ticketVacioMsg.style.display = 'block';
                }
                if (napaStamp) napaStamp.style.display = 'none';
                window.totalCuenta = 0;
                ticketTotalAcumulado.innerText = '$0';
            });
        }
    }

    // ==========================================================================
    // 16. CARRITO MERCADO (EL MOTOR FINAL)
    // ==========================================================================
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartCount = document.getElementById('cartCount');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotal = document.getElementById('cartTotal');

    let cart = [];

    function updateCart() {
        if(!cartCount) return; // Validación de seguridad
        cartCount.innerText = cart.length;
        cartItemsList.innerHTML = ''; 
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p style="font-family: var(--font-body);">El canasto está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.precio;
                cartItemsList.innerHTML += `
                    <div class="cart-item">
                        <span>${item.nombre}</span>
                        <span>$${item.precio.toLocaleString()}</span>
                    </div>`;
            });
        }
        
        cartTotal.innerText = `$${total.toLocaleString()}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(nombre, precio) {
        cart.push({ nombre, precio });
        updateCart();
        if(typeof gsap !== 'undefined' && cartBtn) gsap.fromTo(cartBtn, { scale: 1.2 }, { scale: 1, duration: 0.3 });
    }
    
    // 👇 ESTA LÍNEA NUEVA ES LA QUE ARREGLA EL PROBLEMA 👇
    window.addToCart = addToCart;

    if(cartBtn) cartBtn.addEventListener('click', () => cartModal.classList.toggle('open'));
    const closeCart = document.getElementById('closeCart');
    if(closeCart) closeCart.addEventListener('click', () => cartModal.classList.remove('open'));

    // ============================================
    // 18. REPRODUCTOR SENSORIAL (HOVER DE VIDEO Y AUDIO)
    // ============================================
    const cajaVideo = document.getElementById('cajaVideoPlaza');
    const videoSensorial = document.getElementById('videoPlaza');

    if (cajaVideo && videoSensorial) {
        // Cuando el mouse ENTRA
        cajaVideo.addEventListener('mouseenter', () => {
            videoSensorial.muted = false; // Le devolvemos la voz a la plaza
            videoSensorial.play();        // Arranca el video
        });

        // Cuando el mouse SALE
        cajaVideo.addEventListener('mouseleave', () => {
            videoSensorial.pause();       // Congelamos la imagen
            videoSensorial.muted = true;  // Volvemos a silenciar por si acaso
        });
    }

    // ============================================
    // 19. POPUP DE VIDEO PARA DOCUMENTALES
    // ============================================
    const videoModalOverlay = document.getElementById('videoModalOverlay');
    const btnCerrarVideo = document.getElementById('btnCerrarVideo');
    const videoModalIframe = document.getElementById('videoModalIframe');
    const videoThumbs = document.querySelectorAll('.video-thumb-container');

    if (videoModalOverlay && btnCerrarVideo && videoModalIframe) {
        
        // Al hacer clic en cualquier miniatura
        videoThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const videoId = thumb.getAttribute('data-video-id');
                // Inyectamos el ID y forzamos el autoplay
                videoModalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                videoModalOverlay.classList.add('is-open');
            });
        });

        // Función para apagar y cerrar
        const cerrarVideo = () => {
            videoModalOverlay.classList.remove('is-open');
            // Quitamos el src después de la animación para que el audio no siga sonando de fondo
            setTimeout(() => { videoModalIframe.src = ""; }, 400); 
        };

        btnCerrarVideo.addEventListener('click', cerrarVideo);
        
        // Si hacen clic en lo oscuro (afuera del video), también se cierra
        videoModalOverlay.addEventListener('click', (e) => {
            if(e.target === videoModalOverlay) cerrarVideo();
        });
    }

// ¡AQUÍ SE ACABA TU ARCHIVO JAVA.JS! NO PONGAS ABSOLUTAMENTE NADA MÁS ABAJO.