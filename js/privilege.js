if (sessionStorage.getItem('token') === 'null' && sessionStorage.getItem('username') === 'null') {
    window.location = 'index.html';
} else {
    var priv = sessionStorage.getItem('permission');

    if (window.location.pathname.includes('registration') && priv !== 'admin') {
        window.location = 'menu.html';
    }
}