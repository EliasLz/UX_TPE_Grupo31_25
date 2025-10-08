export function mainHamburguer(){
        const menuToggle = document.getElementById('menuToggle'); // El ícono de la hamburguesa
        const sideMenu = document.getElementById('sideMenu');     // El contenedor <aside class="menu">     

        function toggleMenu() {
            sideMenu.classList.toggle('active');
        }       
        // 3. Agregar el Event Listener al botón de hamburguesa
        menuToggle.addEventListener('click', (event) => {
            // Evita que el clic se propague al documento inmediatamente
            event.stopPropagation(); 
            toggleMenu();
        });
        
        document.addEventListener('click', (event) => {
            // Verifica si el menú está abierto Y si el clic NO fue dentro del menú Y el clic NO fue en el botón
            const isClickInsideMenu = sideMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (sideMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnToggle) {
                sideMenu.classList.remove('active');
            }
        });
};