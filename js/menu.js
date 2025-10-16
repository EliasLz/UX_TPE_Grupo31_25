export function mainHamburguer(){
        const menuToggle = document.getElementById('menuToggle');
        const sideMenu = document.getElementById('sideMenu');     
        const userToggle = document.getElementById('userToggle');
        const sideUser = document.getElementById('sideUser');

        function toggleMenu() {
            sideMenu.classList.toggle('active');
        }
        
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); 
            toggleMenu();
        });
        
        function toggleUser() {
            sideUser.classList.toggle('active');
        }

        userToggle.addEventListener('click', (event) => {
            event.stopPropagation(); 
            toggleUser();
        });
        
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = sideMenu.contains(event.target);
            const isClickOnMenuToggle = menuToggle.contains(event.target);
            const isClickOnUserToggle = userToggle.contains(event.target);
            const isClickInsideUser = sideUser.contains(event.target);
            
            if (sideMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnMenuToggle) {
                sideMenu.classList.remove('active');
            } else {
                if (sideUser.classList.contains('active') && !isClickInsideUser && !isClickOnUserToggle){
                    sideUser.classList.remove('active');
                }
            }
        });
};