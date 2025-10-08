export function mainHamburguer(){
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Obtener los elementos del DOM usando los IDs
        const menuToggle = document.getElementById('menuToggle'); // El ícono de la hamburguesa
        const sideMenu = document.getElementById('sideMenu');     // El contenedor <aside class="menu">

        console.log("anddaaaa");

        // 2. Función para alternar la visibilidad del menú
        function toggleMenu() {
            // Añade o quita la clase 'active' del elemento 'sideMenu'
            sideMenu.classList.toggle('active');
        }

        // 3. Agregar el Event Listener al botón de hamburguesa
        menuToggle.addEventListener('click', (event) => {
            // Evita que el clic se propague al documento inmediatamente
            event.stopPropagation(); 
            toggleMenu();
            console.log("Toco boton");
        });

        // 4. (Opcional) Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', (event) => {
            // Verifica si el menú está abierto Y si el clic NO fue dentro del menú Y el clic NO fue en el botón
            const isClickInsideMenu = sideMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (sideMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnToggle) {
                sideMenu.classList.remove('active');
            }
        });
    });
}