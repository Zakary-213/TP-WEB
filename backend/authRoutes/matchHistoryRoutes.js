const express = require('express');
// Router historique prévu pour les matchs GamesOnWeb.
const router = express.Router();

// Ce fichier n'est pas branché dans api/index.js actuellement.
// Les scores GamesOnWeb passent par backend/authRoutes/scoreRoutes.js avec /scoregow.

// Exporte le router vide pour éviter de casser un import futur éventuel.
module.exports = router;
