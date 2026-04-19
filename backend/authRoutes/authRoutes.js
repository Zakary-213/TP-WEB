const express = require('express');
// Router dédié aux routes d'authentification.
const router = express.Router();
// Contrôleurs qui gèrent l'inscription et la connexion.
const { signup, login } = require('../controllers/authController');

// Création d'un nouveau compte utilisateur.
router.post('/signup', signup);
// Connexion d'un utilisateur existant.
router.post('/login', login);

// Exporte le router pour api/index.js.
module.exports = router;
