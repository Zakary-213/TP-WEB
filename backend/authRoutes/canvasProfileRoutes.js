const express = require('express');
// Router dédié au profil persistant du jeu Canvas.
const router = express.Router();
// Contrôleurs de lecture et de sauvegarde du profil Canvas.
const { getCanvasProfile, saveCanvasProfile } = require('../controllers/canvasProfileController');

// Récupère le profil Canvas d'un utilisateur via ?userId=...
router.get('/', getCanvasProfile);
// Crée ou met à jour le profil Canvas.
router.post('/', saveCanvasProfile);

// Exporte le router pour api/index.js.
module.exports = router;
