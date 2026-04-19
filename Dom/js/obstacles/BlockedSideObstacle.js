// Récupère la classe mère commune à tous les obstacles.
import { Obstacle } from './Obstacle.js';

/** Convertit un index de cellule en coordonnées ligne / colonne. */
function toRowCol(index, gridSize) {
    return {
        // La ligne se trouve avec une division entière par la largeur.
        row: Math.floor(index / gridSize),
        // La colonne correspond au reste de la division par la largeur.
        col: index % gridSize
    };
}

/** Détermine de quel côté se trouve toIdx par rapport à fromIdx. */
function getDirection(fromIdx, toIdx, gridSize) {
    // Coordonnées de la cellule de départ.
    const from = toRowCol(fromIdx, gridSize);
    // Coordonnées de la cellule d'arrivée.
    const to = toRowCol(toIdx, gridSize);

    // Même colonne, ligne au-dessus : côté haut.
    if (to.row === from.row - 1 && to.col === from.col) return 'top';
    // Même colonne, ligne en dessous : côté bas.
    if (to.row === from.row + 1 && to.col === from.col) return 'bottom';
    // Même ligne, colonne à gauche : côté gauche.
    if (to.col === from.col - 1 && to.row === from.row) return 'left';
    // Même ligne, colonne à droite : côté droit.
    if (to.col === from.col + 1 && to.row === from.row) return 'right';
    // Les cases ne sont pas voisines directes.
    return null;
}

/** Obstacle qui bloque seulement un côté d'une cellule. */
export class BlockedSideObstacle extends Obstacle {
    /** Crée un obstacle sur un côté précis : top, right, bottom ou left. */
    constructor(index, side) {
        // Appelle la classe mère avec le type logique "blocked-side".
        super('blocked-side', index);
        // Mémorise le côté bloqué.
        this.side = side;
    }

    /** Ajoute la classe CSS correspondant au côté bloqué. */
    applyToCell(cellEl) {
        // Exemple : obstacle-side-top dessine une barrière en haut.
        cellEl.classList.add(`obstacle-side-${this.side}`);
    }

    /** Indique si ce côté bloque le déplacement entre deux cellules. */
    blocksEdge(fromIdx, toIdx, gridSize) {
        // Si on part de la cellule qui porte l'obstacle, on regarde la direction sortante.
        if (fromIdx === this.index) {
            const dir = getDirection(fromIdx, toIdx, gridSize);
            return dir === this.side;
        }

        // Si on arrive sur la cellule qui porte l'obstacle, on regarde le côté depuis l'autre sens.
        if (toIdx === this.index) {
            const dir = getDirection(toIdx, fromIdx, gridSize);
            return dir === this.side;
        }

        // Si aucune des deux cellules ne porte l'obstacle, ce passage n'est pas concerné.
        return false;
    }
}
