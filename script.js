// Duplica el contenido de la ruleta para que el scroll sea infinito suave
document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('ruleta-track');
    if (!track) return;

    const originalContent = track.innerHTML;
    // agregamos una copia exacta al final para que al llegar al -50% enganche perfecto
    track.innerHTML += originalContent;
});
