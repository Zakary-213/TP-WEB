// Obstacle qui bloque complètement une cellule.
import { BlockedCellObstacle } from './BlockedCellObstacle.js';
// Obstacle qui bloque un côté d'une cellule.
import { BlockedSideObstacle } from './BlockedSideObstacle.js';

/** Transforme les définitions brutes reçues du worker en vraies instances de classes. */
export function createObstacles(definitions) {
    // Si le worker n'envoie pas un tableau valide, on considère qu'il n'y a pas d'obstacle.
    if (!Array.isArray(definitions)) return [];

    // Convertit chaque définition en objet obstacle utilisable par la logique du jeu.
    return definitions
        .map((def) => {
            // Ignore les entrées vides ou mal formées.
            if (!def || typeof def !== 'object') return null;
            // Cas d'une cellule complètement bloquée.
            if (def.type === 'blocked-cell') {
                return new BlockedCellObstacle(def.index);
            }
            // Cas d'un côté de cellule bloqué.
            if (def.type === 'blocked-side') {
                return new BlockedSideObstacle(def.index, def.side);
            }
            // Ancien format "coin bloqué" conservé en compatibilité et converti en côté bloqué.
            if (def.type === 'blocked-corner' && def.corner) {
                // Associe chaque coin à un côté simple pour rester compatible avec le rendu actuel.
                const cornerToSide = {
                    'top-left': 'top',
                    'top-right': 'top',
                    'bottom-left': 'bottom',
                    'bottom-right': 'bottom'
                };
                // Crée un obstacle de côté, qui est celui réellement pris en charge dans la partie.
                return new BlockedSideObstacle(def.index, cornerToSide[def.corner] || 'top');
            }
            // Type inconnu : on l'ignore pour éviter une erreur de jeu.
            return null;
        })
        // Supprime les null générés par les définitions invalides.
        .filter(Boolean);
}
