const express = require('express');
const User = require('../core/user');
const router = express.Router();
const user = new User();

var urlLogin, bName, hStyle;

router.get('/', (req, res, next) => 
{
    let user = req.session.user;
    if(user) {
        urlLogin = '/loggout';
        bName = 'Выход';
    }
    else
    {
        hStyle= 'display: none;';
        urlLogin = '/login';
        bName = 'Вход';
    }

    res.render('index', {url:urlLogin, buttonName:bName, hrefStyle:hStyle});
})

router.get('/home', (req, res, next) => {
    let user = req.session.user;
    if(user) 
    {
        hStyle= '';
        urlLogin = '/loggout';
        bName = 'Выход';

        res.render('home', {opp:req.session.opp, name:user.login, email:user.email, url:urlLogin, buttonName:bName});
        res.end();
        return;
    }

    res.redirect('/');
});

router.post('/login', (req, res, next) => 
{
    if(!req.body.login || !req.body.password)
    {
        // empty
        res.send('Не правильный логин или пароль!');
        return;
    }
        user.login(req.body.login, req.body.password, function(result) 
        {
            if(result) 
            {
                req.session.user = result;
                req.session.opp = 1;
                res.redirect('/home');
            }else {
                res.send('Не правильный логин или пароль!');
            }
        })
});

router.get('/register', (req, res, next) => {

    let user = req.session.user;
    if(user) 
    {
        urlLogin = '/loggout';
        bName = 'Выход';
    }
    else
    {
        urlLogin = '/login';
        bName = 'Вход';
        hStyle= 'display: none;';
    }

    res.render('register', { url:urlLogin, buttonName:bName, hrefStyle:hStyle })
});


router.get('/login', (req, res, next) => {

    let user = req.session.user;
    if(user) 
    {
        urlLogin = '/loggout';
        bName = 'Выход';
    }
    else
    {
        urlLogin = '/login';
        bName = 'Вход';
        hStyle= 'display: none;';
    }

    res.render('login', { url:urlLogin, buttonName:bName, hrefStyle:hStyle })
});

router.post('/home', (req, res, next) => 
{
    console.log("log-1");

    let userInput = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    };

    console.log("log0");
    if(!req.body.login || !req.body.password || !req.body.email)
    {
        // empty
        res.send('Форма заполнена не полностью.');
        return;
    }
    console.log("log1");
    user.update(userInput, function(result) {
        console.log("log2");

        if(result) 
        {
            req.session.user = result;
            req.session.opp = 1;
            console.log("result: " + result);
            res.redirect('/login');
        }else {
            res.send('Не правильный логин или пароль!');
            next();
        }
    });
});

router.post('/register', (req, res, next) => {

    let userInput = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    };

    if(!req.body.email || !req.body.password || !req.body.login)
    {
        // empty
        res.send('Форма заполнена не полностью!');
        return;
    }

    user.create(userInput, function(lastId) 
    {
        if(lastId) 
        {
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });

        }else {
            console.log('Ошибка при создании пользователя.');
        }
    });

});

router.get('/loggout', (req, res, next) => {
    if(req.session.user) {
        
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = router;