const mongoose = require("mongoose");
require("dotenv").config();

// Connexion unique à MongoDB utilisée par l'API Express.
const connectDB = async () => {
    try {
        // MONGODB_URI est indispensable pour savoir où se connecter.
        if (!process.env.MONGODB_URI) {
            throw new Error("La variable d'environnement MONGODB_URI est manquante !");
        }
        // Lance la connexion Mongoose avec l'URL fournie par l'environnement.
        await mongoose.connect(process.env.MONGODB_URI);
        // Log de confirmation utile en local et sur Railway.
        console.log("✅ Connecté à MongoDB avec succès");
    } catch (error) {
        // Log séparé pour rendre l'erreur lisible dans les plateformes de déploiement.
        console.error("❌ Erreur de connexion à MongoDB :");
        console.error(error.message);
        // On ne quitte pas immédiatement pour laisser le temps à Railway d'afficher les logs
        setTimeout(() => process.exit(1), 2000);
    }
};

// Exporte la fonction pour qu'api/index.js puisse initialiser la base.
module.exports = connectDB;
