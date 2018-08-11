const express = require('express');
const bodyParser = require('body-parser');
const favoriteRouter = express.Router();
const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

favoriteRouter.use(bodyParser.json());
favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    var userId = req.user._id;
    Favorites.findOne({"author" : userId})
    .populate('author')
    .populate('favorites.dish')
    .then((favorite) => {
        console.log(favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    var userId = req.user._id;
    Favorites.findOne({"author" : userId})
    .then((favorite) => {
        if(favorite == null)
            return Favorites.create({"author" : userId})
        else
            return favorite;
    })
    .then((favorite) => {
        for(var j = req.body.length-1; j >= 0; j--)
        {
            var dishId = req.body[j]._id;
            var i;
            for(i = favorite.favorites.length-1; i >= 0; i--)
            {
                if(favorite.favorites[i].dish._id.equals(dishId))
                    break;
            }
            if(i >= 0)
                continue;
            favorite.favorites.push({"dish" : dishId});
        }
        favorite.save()
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite.favorites);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    var userId = req.user._id;
    Favorites.findOneAndRemove({"author" : userId})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    var userId = req.user._id;
    Favorites.findOne({"author" : userId})
    .then((favorite) => {
        if(favorite == null)
            return Favorites.create({"author" : userId})
        else
            return favorite;
    })
    .then((favorite) => {
        for(var i = favorite.favorites.length-1; i >= 0; i--)
        {
            if(favorite.favorites[i].dish._id.equals(req.params.dishId))
            {
                var err = new Error('Dish ' + req.params.dishId + ' already in the list');
                err.status = 403;
                return next(err);
            }
        }
        favorite.favorites.push({"dish" : req.params.dishId})
        favorite.save()
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite.favorites);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    var userId = req.user._id;
    Favorites.findOne({"author" : userId})
    .then((favorite) => {
        if(favorite == null)
        {
            var err = new Error('User ' + userId + ' has not added any favorites');
            err.status = 404;
            return next(err);
        }
        else
        {
            for(var i = favorite.favorites.length-1; i >= 0; i--)
            {
                if(favorite.favorites[i].dish._id.equals(req.params.dishId))
                {
                    favorite.favorites.id(favorite.favorites[i]._id).remove();
                    break;
                }
            }
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;