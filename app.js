const express = require('express');
const path = require('path');
const session = require('express-session');

const pageRouter = require('./routes/pages');

const app = express();

app.use(express.urlencoded( { extended : false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set ('view engine', 'pug');

app.use(session({
    secret:'_test',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

app.use('/', pageRouter);

// Обрабатываем ошибку 404 с редиректом на главную страницу ()
app.use((req, res, next) =>  {
    res.render('index')
    next(res);
})

// Обработка ошибок сервера
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

var serverPort = 3000;
app.listen(serverPort, () => {
    console.log('Server starting.. on ' + serverPort);
});

module.exports = app;