/**
 * CONFIGURACIÓN DE LA FECHA DEL EVENTO
 */
const FECHA_EVENTO = new Date('December 16, 2026 18:00:00').getTime();

/**
 * 1. LÓGICA DE LA CUENTA REGRESIVA
 */
const actualizarContador = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = FECHA_EVENTO - ahora;

    if (distancia < 0) {
        clearInterval(actualizarContador);
        const contenedor = document.querySelector('.hero-countdown');
        if (contenedor) contenedor.innerHTML = "<p style='color:white; letter-spacing:2px;'>¡HOY ES EL GRAN DÍA!</p>";
        return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));

    // Aseguramos que los elementos existan antes de asignar valor
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMin = document.getElementById('minutes');

    if(elDays) elDays.innerText = dias.toString().padStart(2, '0');
    if(elHours) elHours.innerText = horas.toString().padStart(2, '0');
    if(elMin) elMin.innerText = minutos.toString().padStart(2, '0');
}, 1000);


/**
 * 2. ANIMACIONES AL HACER SCROLL (Down & Up)
 * Actualizado para detectar animaciones verticales y laterales
 */
const opcionesAnimacion = {
    threshold: 0.15 // Se activa cuando el 15% es visible
};

const observadorScroll = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            // Cuando entra en pantalla
            entrada.target.classList.add('active');
        } else {
            // Cuando sale de pantalla, removemos para que se reinicie (Efecto Up & Down)
            entrada.target.classList.remove('active');
        }
    });
}, opcionesAnimacion);

// Seleccionamos todos los tipos de revelación: normal, izquierda y derecha
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(elemento => {
    observadorScroll.observe(elemento);
});


/**
 * 3. ENVIAR CONFIRMACIÓN A WHATSAPP
 */
function sendToWhatsApp() {
    const name = document.getElementById('name').value;
    const attendance = document.getElementById('attendance').value;
    
    // VALIDACIÓN: Si el nombre está vacío
    if (name.trim() === "") {
        alert("Por favor, ingresa tu nombre completo.");
        return;
    }

    // TU NÚMERO DE TELÉFONO (Cámbialo por el tuyo, incluye código de país sin el +)
    const phoneNumber = "521234567890"; 
    
    // MENSAJE PERSONALIZADO
    const message = `¡Hola Grecia y Jonathan! 👋%0A%0AQuiero confirmar mi asistencia:%0A%0A*Nombre:* ${name}%0A*Confirmación:* ${attendance}%0A%0A¡Nos vemos pronto! ✨`;

    // ABRIR WHATSAPP
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

/**
 * LÓGICA DEL CARRUSEL INFINITO DE PADRINOS (Versión Final Optimizada)
 */
const track = document.querySelector('.carousel-track');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

if (track && nextBtn && prevBtn) {
    // 1. Clonamos los elementos para crear el efecto infinito
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    const intervaloTiempo = 3000;
    let autoPlayInterval;

    // Función para obtener el desplazamiento exacto (Ancho de card + Gap)
    const getScrollAmount = () => {
        const firstCard = track.querySelector('.padrino-card');
        const cardWidth = firstCard.offsetWidth;
        // Obtenemos el gap real configurado en CSS
        const gap = parseInt(window.getComputedStyle(track).columnGap) || 0;
        return cardWidth + gap;
    };

    // Función para mover el carrusel a la derecha
    const moverSiguiente = () => {
        const scrollAmount = getScrollAmount();

        // Si llegamos a la mitad (donde empiezan los clones), saltamos al inicio real
        if (track.scrollLeft >= (track.scrollWidth / 2) - 10) {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = 0;
            track.style.scrollBehavior = 'smooth';
        }
        
        // Pequeño timeout para que el navegador procese el cambio de comportamiento
        setTimeout(() => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }, 20);
    };

    // Función para mover el carrusel a la izquierda
    const moverAnterior = () => {
        const scrollAmount = getScrollAmount();

        // Si estamos al inicio, saltamos a la mitad (clones) para poder retroceder
        if (track.scrollLeft <= 5) {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = track.scrollWidth / 2;
            track.style.scrollBehavior = 'smooth';
        }

        setTimeout(() => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }, 20);
    };

    // Eventos de botones manuales
    nextBtn.addEventListener('click', () => {
        moverSiguiente();
        reiniciarAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        moverAnterior();
        reiniciarAutoplay();
    });

    // Lógica de Autoplay
    const iniciarAutoplay = () => {
        autoPlayInterval = setInterval(moverSiguiente, intervaloTiempo);
    };

    const reiniciarAutoplay = () => {
        clearInterval(autoPlayInterval);
        iniciarAutoplay();
    };

    // Iniciar
    iniciarAutoplay();

    // Pausa al pasar el mouse (solo en desktop)
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', iniciarAutoplay);

    // Soporte para redimensionamiento: si cambian el tamaño de la pantalla,
    // el carrusel no se desfasa.
    window.addEventListener('resize', () => {
        track.style.scrollBehavior = 'auto';
        // Ajustamos la posición para que no quede a la mitad tras el resize
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 20, // El -20 es para que no quede pegado al borde superior
                behavior: 'smooth'
            });
        }
    });
});