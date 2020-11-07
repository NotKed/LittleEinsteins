module.exports = function (app, passport) {
    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );
}