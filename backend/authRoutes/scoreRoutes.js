const express = require('express');
// Router dédié aux scores des jeux.
const router = express.Router();
// Contrôleurs de sauvegarde et de lecture des scores.
const { scoreCanvas, scoreGow, getTopScores } = require('../controllers/scoreController');

// Sauvegarde des scores Canvas et Dom.
router.post('/scorecanvas', scoreCanvas);
// Sauvegarde des résultats GamesOnWeb.
router.post('/scoregow', scoreGow);
// Lecture des meilleurs scores filtrés par jeu, mode et éventuellement userId.
router.get('/top', getTopScores);


// Exporte le router pour api/index.js.
module.exports = router;
