const express = require('express');
const articleController = require('../controllers/articleController');
const articleRouter = express.Router();
const passport = require('passport');

articleRouter.use(express.json());
articleRouter.use(express.urlencoded({ extended: true }));

articleRouter.route('/')
    .get(passport.authenticate('jwt', { session: false }), articleController.findAll)
    .post(passport.authenticate('jwt', { session: false }), articleController.create)
    .put(passport.authenticate('jwt', { session: false }), (req, res) => {
        res.status(403).json('PUT operation not supported on /articles');
    })
    .delete(passport.authenticate('jwt', { session: false }), articleController.delete);

articleRouter.route('/:id')
    .get(passport.authenticate('jwt', { session: false }), articleController.findById)
    .post(passport.authenticate('jwt', { session: false }), (req, res) => {
        res.status(403).end('POST operation not supported on /articles/' + req.params.id);
    })
    .put(passport.authenticate('jwt', { session: false }), articleController.update)
    .delete(passport.authenticate('jwt', { session: false }), articleController.delete);

module.exports = articleRouter;
