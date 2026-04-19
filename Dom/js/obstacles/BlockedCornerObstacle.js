// Récupère la classe mère commune à tous les obstacles.
import { Obstacle } from './Obstacle.js';

/** Convertit un index de cellule en coordonnées ligne / colonne. */
function toRowCol(index, gridSize) {
    return {
        // Ligne calculée par division entière.
        row: Math.floor(index / gridSize),
        // Colonne calculée avec le reste de la division.
        col: index % gridSize
    };
}

/** Détermine la direction de toIdx par rapport à fromIdx. */
function getDirection(fromIdx, toIdx, gridSize) {
    // Coordonnées de départ.
    const from = toRowCol(fromIdx, gridSize);
    // Coordonnées d'arrivée.
    const to = toRowCol(toIdx, gridSize);

    // La case d'arrivée est au-dessus.
    if (to.row === from.row - 1 && to.col === from.col) return 'up';
    // La case d'arrivée est en dessous.
    if (to.row === from.row + 1 && to.col === from.col) return 'down';
    // La case d'arrivée est à gauche.
    if (to.col === from.col - 1 && to.row === from.row) return 'left';
    // La case d'arrivée est à droite.
    if (to.col === from.col + 1 && to.row === from.row) return 'right';
    // Les cases ne sont pas adjacentes.
    return null;
}

/** Traduit deux directions en coin utilisé dans la cellule. */
function resolveTurnCorner(enterDir, exitDir) {
    // Un Set simplifie les tests, car l'ordre entrée/sortie ne change pas le coin.
    const dirs = new Set([enterDir, exitDir]);

    // Virage entre haut et gauche.
    if (dirs.has('up') && dirs.has('left')) return 'top-left';
    // Virage entre haut et droite.
    if (dirs.has('up') && dirs.has('right')) return 'top-right';
    // Virage entre bas et gauche.
    if (dirs.has('down') && dirs.has('left')) return 'bottom-left';
    // Virage entre bas et droite.
    if (dirs.has('down') && dirs.has('right')) return 'bottom-right';

    // Aucun coin n'est utilisé si le chemin va tout droit.
    return null;
}

/** Variante d'obstacle prévue pour bloquer un virage dans un coin de cellule. */
export class BlockedCornerObstacle extends Obstacle {
    /** Crée un obstacle sur un coin précis de la cellule. */
    constructor(index, corner) {
        // Appelle la classe mère avec le type logique de coin bloqué.
        super('blocked-corner', index);
        // Mémorise le coin bloqué, par exemple "top-left".
        this.corner = corner;
    }

    /** Ajoute la classe CSS du coin bloqué. */
    applyToCell(cellEl) {
        // Exemple : obstacle-corner-top-left.
        cellEl.classList.add(`obstacle-corner-${this.corner}`);
    }

    /** Indique si le virage du joueur passe par le coin bloqué. */
    blocksTurn(prevIdx, cellIdx, nextIdx, gridSize) {
        // L'obstacle ne concerne que sa propre cellule et nécessite un vrai virage.
        if (cellIdx !== this.index || prevIdx === null || nextIdx === null) {
            return false;
        }

        // Direction par laquelle le chemin entre dans la cellule.
        const enterDir = getDirection(cellIdx, prevIdx, gridSize);
        // Direction par laquelle le chemin sort de la cellule.
        const exitDir = getDirection(cellIdx, nextIdx, gridSize);
        // Si une direction est invalide, il n'y a pas de virage exploitable.
        if (!enterDir || !exitDir) return false;

        // Calcule le coin réellement utilisé par ce virage.
        const usedCorner = resolveTurnCorner(enterDir, exitDir);
        // Bloque uniquement si le coin utilisé est celui de l'obstacle.
        return usedCorner === this.corner;
    }
}
