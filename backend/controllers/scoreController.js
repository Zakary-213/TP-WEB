const Score = require('../models/Score');

// Petit helper commun pour éviter de dupliquer la création d'un score.
const createScoreRecord = async ({ userId, game, mode, totalTime, totalValue, data }) => {
    // Crée un document Score avec les champs communs à tous les jeux.
    return Score.create({
        // Référence vers l'utilisateur propriétaire du score.
        user: userId,
        game,
        mode,
        totalTime,
        // Le schema historique utilise ce champ pour une métrique totale.
        totalMeteorites: totalValue,
        data
    });
};

// @desc    Save Canvas Score
// @route   POST /api/scores/scorecanvas
// @access  Private (should be, but here we'll handle based on body user)
exports.scoreCanvas = async (req, res) => {
    try {
        // Récupère les données envoyées par Canvas ou Dom.
        const { userId, game, mode, totalTime, totalMeteorites, data } = req.body;

        // Champs minimum nécessaires pour sauvegarder un score exploitable.
        if (!userId || !game || !mode || totalTime === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Sauvegarde le score dans MongoDB.
        const newScore = await createScoreRecord({
            userId,
            game,
            mode,
            totalTime,
            totalValue: totalMeteorites,
            data
        });

        // Réponse de succès avec le score créé.
        res.status(201).json({
            success: true,
            message: 'Score saved successfully',
            data: newScore
        });
    } catch (error) {
        // Log serveur pour faciliter le debug sans exposer trop de détails côté client.
        console.error('Error saving score:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Save GamesOnWeb Match Result
// @route   POST /api/scores/scoregow
// @access  Private (should be, but here we'll handle based on body user)
exports.scoreGow = async (req, res) => {
    try {
        // Récupère les champs propres à GamesOnWeb.
        const {
            userId,
            game = 'gamesonweb',
            mode = '1v1',
            totalTime,
            totalButs,
            data
        } = req.body;

        // Un score GamesOnWeb nécessite au minimum un utilisateur et une durée.
        if (!userId || totalTime === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Sauvegarde le résultat du match avec le nombre total de buts comme métrique.
        const newScore = await createScoreRecord({
            userId,
            game,
            mode,
            totalTime,
            totalValue: Number(totalButs || data?.totalButs || 0),
            data: data || {}
        });

        // Réponse de succès envoyée au jeu.
        res.status(201).json({
            success: true,
            message: 'GamesOnWeb score saved successfully',
            data: newScore
        });
    } catch (error) {
        // Log serveur en cas d'échec de sauvegarde.
        console.error('Error saving gamesonweb score:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get Top Scores
// @route   GET /api/scores/top?game=canvas&mode=solo
// @access  Public
exports.getTopScores = async (req, res) => {
    try {
        // game et mode servent à filtrer le tableau des scores.
        const { game, mode, userId } = req.query;

        // Ces deux paramètres sont obligatoires pour éviter de renvoyer toute la collection.
        if (!game || !mode) {
            return res.status(400).json({ success: false, message: 'Missing game or mode query param' });
        }

        // Limite entre 1 et 100 pour éviter les requêtes trop lourdes.
        const limit = Math.max(1, Math.min(parseInt(req.query.limit || '10', 10), 100));
        // Filtre MongoDB de base.
        const query = { game, mode };

        // Si un userId est fourni, on affiche uniquement ses scores.
        if (userId) {
            query.user = userId;
        }

        // Get top scores, sorted by totalTime ascending (faster is better)
        // Tri croissant : plus le temps est faible, meilleur est le score.
        const scores = await Score.find(query)
            .sort({ totalTime: 1 })
            .limit(limit)
            .populate('user', 'username');

        // Réponse standardisée pour le frontend.
        res.status(200).json({
            success: true,
            count: scores.length,
            data: scores
        });
    } catch (error) {
        // Log serveur en cas d'erreur de lecture.
        console.error('Error fetching scores:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
