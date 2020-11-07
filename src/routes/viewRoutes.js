module.exports = function(app, passport) {
    
    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/admin', isAuthenticated, (req, res) => {
        res.render('admin');
    })
}

function isAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()) next();
    else res.redirect("/login");
}