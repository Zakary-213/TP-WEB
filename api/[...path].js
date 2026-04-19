// Point d'entrée catch-all utilisé par Vercel pour rediriger les routes API vers Express.
const app = require('./index');

// Exporte la même application Express que api/index.js.
module.exports = app;
