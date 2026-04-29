/**
 * CONFIGURACIÓN DE LA FECHA DEL EVENTO
 * Formato: Mes Día, Año Hora:Minuto:Segundo
 */
const FECHA_EVENTO = new Date('July 11, 2026 18:00:00').getTime();

const actualizarContador = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = FECHA_EVENTO - ahora;

    // Si la fecha ya pasó
    if (distancia < 0) {
        clearInterval(actualizarContador);
        const contenedor = document.getElementById('countdown');
        if (contenedor) {
            contenedor.innerHTML = "<p style='color:white; letter-spacing:5px; font-family:Cormorant Garamond, serif; font-size:2rem;'>¡LLEGÓ EL MOMENTO!</p>";
        }
        return;
    }

    // Cálculos de tiempo
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Asignación a los elementos HTML con formato de dos dígitos
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMin = document.getElementById('minutes');
    const elSec = document.getElementById('seconds');

    if(elDays) elDays.innerText = dias.toString().padStart(2, '0');
    if(elHours) elHours.innerText = horas.toString().padStart(2, '0');
    if(elMin) elMin.innerText = minutos.toString().padStart(2, '0');
    if(elSec) elSec.innerText = segundos.toString().padStart(2, '0');

}, 1000);


/**
 * LÓGICA DE ANIMACIÓN AL HACER SCROLL (UP & DOWN)
 */
const observerOptions = {
    root: null, // usa el viewport
    threshold: 0.15, // se activa cuando el 15% del elemento es visible
    rootMargin: "0px 0px -50px 0px" // margen inferior para anticipar la entrada
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Cuando entra en el campo de visión
            entry.target.classList.add('active');
        } else {
            // EFECTO UP: Al salir del campo de visión se vuelve a ocultar
            // Quita esta línea si prefieres que una vez que aparezca se quede fija
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

// Seleccionamos todos los elementos que queremos animar
document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
    scrollObserver.observe(el);
});

/* Función para copiar la CLABE al portapapeles */
function copiarClabe() {
    const clabeText = document.getElementById("clabe-valor").innerText;
    const btn = document.getElementById("btn-copy");
    const btnText = document.getElementById("copy-text");

    navigator.clipboard.writeText(clabeText).then(() => {
        // Feedback visual
        const originalText = btnText.innerText;
        btnText.innerText = "¡Copiado!";
        btn.classList.add("success");

        setTimeout(() => {
            btnText.innerText = originalText;
            btn.classList.remove("success");
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Captura de datos
    const nombre = document.getElementById('nombre').value;
    const asistencia = document.querySelector('input[name="asistencia"]:checked').value;
    const invitados = document.getElementById('invitados').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Número de teléfono (incluye código de país, ej: 521...)
    const telefono = "5215512345678"; 
    
    const texto = `¡Hola! Confirmo mi asistencia:
Nombre: ${nombre}
Asistencia: ${asistencia === 'si' ? 'Sí asistiré' : 'No podré asistir'}
Invitados: ${invitados}
Notas: ${mensaje}`;

    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(texto)}`;
    
    window.open(url, '_blank');
});
