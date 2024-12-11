function toggleMenu() {
    const sidePanel = document.getElementById('side-menu');
    const menuIcon = document.getElementById('menu-icon');

    // Toggle the sidebar open/close
    sidePanel.classList.toggle('open');

    // Toggle the sidebar icon between hamburger and cross
    menuIcon.classList.toggle('open');
}

// Automatically close the sidebar when the screen is resized to a larger width
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        const sidePanel = document.getElementById('side-menu');
        const menuIcon = document.getElementById('menu-icon');

        sidePanel.classList.remove('open');
        menuIcon.innerHTML = '&#9776';
    }
});