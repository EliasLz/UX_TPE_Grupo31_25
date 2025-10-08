export function mainHamburguer(){
        const menuToggle = document.getElementById('menuToggle');
        const sideMenu = document.getElementById('sideMenu');     

        function toggleMenu() {
            sideMenu.classList.toggle('active');
        }       
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); 
            toggleMenu();
        });
        
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = sideMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (sideMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnToggle) {
                sideMenu.classList.remove('active');
            }
        });
};