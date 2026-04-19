// Charge les variables d'environnement depuis .env en local.
const dotenv = require("dotenv");
dotenv.config();

// Dépendances principales du serveur.
const express = require("express");
const cors = require("cors");
// Instance Express exportée ensuite pour Vercel.
const app = express();

// Connexion MongoDB partagée avec le backend.
const connectDB = require("../backend/connectDB/connectDB");
const path = require("path");
// Port local ou port fourni par la plateforme d'hébergement.
const PORT = process.env.PORT || 4000;

// Liste blanche des origines autorisées à appeler l'API.
const ALLOWED_ORIGINS = new Set([
  "https://tp-web-hamadouche-ozdoev.vercel.app",
  "https://tp-web-hamadouche-ozdoev-git-dev-zakarys-projects-853ed3d8.vercel.app",
  "https://tp-web-hamadouche-ozdoev-a0fxz66z4-zakarys-projects-853ed3d8.vercel.app",
  "http://localhost:4000",
  "http://127.0.0.1:4000",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5500"
]);

// Configuration CORS utilisée par Express.
const corsOptions = {
  origin: (origin, callback) => {
    // Autorise les requêtes sans origin, comme Postman ou certains appels serveur.
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      return callback(null, true);
    }

    // Autorise aussi les previews Vercel du même projet.
    const isProjectPreview = /^https:\/\/tp-web-hamadouche-ozdoev-[a-z0-9-]+-zakarys-projects-853ed3d8\.vercel\.app$/i.test(origin);
    if (isProjectPreview) {
      return callback(null, true);
    }

    // Toute autre origine est refusée.
    console.warn(`⚠️ Origine bloquée par CORS : ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  // Méthodes HTTP acceptées par l'API.
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // Headers autorisés côté frontend.
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Gestion globale des erreurs pour le débogage Railway
process.on('uncaughtException', (err) => {
  console.error('❌ ERREUR CRITIQUE (Exception non gérée) :');
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ ERREUR CRITIQUE (Promesse non gérée) :');
  console.error(reason);
});

console.log('🎬 Démarrage du serveur...');

// Initialise la connexion MongoDB au démarrage.
connectDB().then(() => {
  console.log('📡 Base de données initialisée');
}).catch(err => {
  console.error('❌ Échec de l\'initialisation de la DB :', err);
});

// Active CORS avec la configuration ci-dessus.
app.use(cors(corsOptions));

// Page d'accueil servie par le backend en local/Railway.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Ancienne URL de règles Canvas redirigée vers la page actuelle.
app.get('/rules/canvas.html', (req, res) => {
  res.redirect('/canvas.html');
});

// Support legacy/alternate path for GamesOnWeb page (serve frontend/gow.html)
// Ancienne URL de règles GamesOnWeb redirigée vers la page actuelle.
app.get('/rules/gow.html', (req, res) => {
  res.redirect('/gow.html');
});

// Route de test supplémentaire
// Permet de vérifier rapidement que l'API répond.
app.get("/api/ping", (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

// Parse les bodies JSON envoyés par le frontend.
app.use(express.json());
// Parse les formulaires encodés en URL si besoin.
app.use(express.urlencoded({ extended: false }));


// Middleware de log pour débugger les 404 sur Vercel
app.use((req, res, next) => {
  // Log uniquement les appels API pour ne pas polluer les assets statiques.
  if (req.url.startsWith('/api')) {
    console.log(`🔍 API Route hit: ${req.method} ${req.url}`);
  }
  next();
});

// Routes d'authentification, disponibles avec ou sans préfixe /api.
app.use(['/api/auth', '/auth'], require('../backend/authRoutes/authRoutes'));
// Routes de scores communes aux jeux.
app.use(['/api/scores', '/scores'], require('../backend/authRoutes/scoreRoutes'));
// Routes du profil persistant Canvas.
app.use(['/api/canvas-profile', '/canvas-profile'], require('../backend/authRoutes/canvasProfileRoutes'));

// Expose game folders for local navigation from the frontend homepage.
// Sert le dossier du jeu football.
app.use('/GamesOnWeb', express.static(path.join(__dirname, '..', 'GamesOnWeb')));
// Sert le dossier du jeu Canvas.
app.use('/JeuCanvas', express.static(path.join(__dirname, '..', 'JeuCanvas')));
// Sert le dossier du jeu Dom.
app.use('/Dom', express.static(path.join(__dirname, '..', 'Dom')));

// On déplace le static APRÈS les routes API pour éviter qu'il n'intercepte les requêtes API
// Sert les pages frontend classiques.
app.use(express.static(path.join(__dirname, "..", "frontend")));
// Permettre l'accès via /rules/... (ex: /rules/canvas.html)
// Sert aussi frontend depuis la racine.
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));


// Démarrage du serveur si ce n'est pas sur Vercel (Vercel gère l'invocation lui-même)
if (require.main === module || process.env.RAILWAY_STATIC_URL || process.env.PORT) {
  // En local/Railway, Express écoute directement sur le port configuré.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
    console.log(`🔗 URL: 0.0.0.0:${PORT}`);
    console.log(`📡 Prêt à recevoir des requêtes`);
  });
}

// Export nécessaire pour que Vercel utilise l'application comme serverless function.
module.exports = app;
