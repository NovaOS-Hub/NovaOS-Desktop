document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });
    const sidebarToggle2 = document.getElementById('sidebar-toggle2');
    sidebarToggle2.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });
});
