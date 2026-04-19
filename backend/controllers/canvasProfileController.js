const mongoose = require('mongoose');
const CanvasProfile = require('../models/CanvasProfile');

// Profil par défaut renvoyé quand un joueur n'a pas encore de sauvegarde Canvas.
const DEFAULT_PROFILE = {
    gold: 0,
    ownedShips: ['normal'],
    equippedShip: 'normal'
};

// Nettoie les données de profil pour éviter de sauvegarder un état incohérent.
function normalizeProfileInput(input = {}) {
    // Garde uniquement les noms de vaisseaux valides et non vides.
    const ships = Array.isArray(input.ownedShips) ? input.ownedShips.filter((s) => typeof s === 'string' && s.trim() !== '') : [];
    // Supprime les doublons dans la liste des vaisseaux possédés.
    const uniqueShips = Array.from(new Set(ships));

    // Le vaisseau normal doit toujours être possédé.
    if (!uniqueShips.includes('normal')) {
        uniqueShips.unshift('normal');
    }

    // Le vaisseau équipé doit forcément appartenir aux vaisseaux possédés.
    const equippedShip = typeof input.equippedShip === 'string' && uniqueShips.includes(input.equippedShip)
        ? input.equippedShip
        : 'normal';

    // L'or est converti en nombre positif.
    const safeGold = Number.isFinite(Number(input.gold)) ? Math.max(0, Number(input.gold)) : 0;

    // Profil propre prêt à être renvoyé ou sauvegardé.
    return {
        gold: safeGold,
        ownedShips: uniqueShips,
        equippedShip
    };
}

// @desc    Get Canvas profile by user
// @route   GET /api/canvas-profile?userId=...
// @access  Public (scoped by provided userId, same pattern as scores)
exports.getCanvasProfile = async (req, res) => {
    try {
        // L'id utilisateur arrive en query string.
        const { userId } = req.query;

        // Sans userId, impossible de savoir quel profil charger.
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Missing userId query param' });
        }

        // Vérifie que l'id ressemble à un ObjectId MongoDB.
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }

        // Recherche le profil existant sans document Mongoose lourd grâce à lean().
        const profile = await CanvasProfile.findOne({ user: userId }).lean();

        // Si aucun profil n'existe, le joueur part avec le profil par défaut.
        if (!profile) {
            return res.status(200).json({
                success: true,
                data: DEFAULT_PROFILE
            });
        }

        // Normalise aussi les profils déjà présents en base par sécurité.
        const normalized = normalizeProfileInput(profile);

        // Renvoie le profil prêt à être utilisé par le jeu Canvas.
        return res.status(200).json({
            success: true,
            data: normalized
        });
    } catch (error) {
        // Log serveur si MongoDB ou Mongoose échoue.
        console.error('Error fetching canvas profile:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Save or update Canvas profile
// @route   POST /api/canvas-profile
// @access  Public (scoped by provided userId, same pattern as scores)
exports.saveCanvasProfile = async (req, res) => {
    try {
        // Champs envoyés par le jeu Canvas après achat ou changement de vaisseau.
        const { userId, gold, ownedShips, equippedShip } = req.body;

        // Le profil est toujours rattaché à un utilisateur.
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Missing userId' });
        }

        // Sécurité pour éviter une requête MongoDB avec un id invalide.
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }

        // Nettoie les données avant sauvegarde.
        const normalized = normalizeProfileInput({ gold, ownedShips, equippedShip });

        // Upsert : crée le profil s'il n'existe pas, sinon le met à jour.
        const updated = await CanvasProfile.findOneAndUpdate(
            { user: userId },
            {
                user: userId,
                ...normalized
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).lean();

        // Renvoie la version normalisée du profil sauvegardé.
        return res.status(200).json({
            success: true,
            message: 'Canvas profile saved successfully',
            data: normalizeProfileInput(updated)
        });
    } catch (error) {
        // Log serveur si la sauvegarde échoue.
        console.error('Error saving canvas profile:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
