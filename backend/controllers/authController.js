const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        // Récupère les champs envoyés par le formulaire d'inscription.
        const { username, email, password } = req.body;

        // Check if user exists
        // Empêche de créer deux comptes avec le même email.
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        // Le hook pre('save') du modèle User hash le mot de passe automatiquement.
        const user = await User.create({
            username,
            email,
            password
        });

        // Réponse envoyée au frontend sans jamais renvoyer le mot de passe.
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        // Erreur serveur générique, par exemple validation Mongoose ou problème DB.
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        // Récupère les identifiants envoyés par le formulaire de connexion.
        const { email, password } = req.body;

        // Check for user
        // select('+password') est nécessaire car le modèle masque le mot de passe par défaut.
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        // Compare le mot de passe saisi avec le hash stocké.
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Connexion réussie : le frontend stocke ensuite l'id et le pseudo en localStorage.
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        // Réponse d'erreur en cas de problème serveur.
        res.status(500).json({ success: false, error: error.message });
    }
};
