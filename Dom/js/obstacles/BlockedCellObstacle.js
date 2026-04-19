// Récupère la classe mère pour profiter de l'interface commune des obstacles.
import { Obstacle } from './Obstacle.js';

/** Obstacle qui rend une case totalement interdite. */
export class BlockedCellObstacle extends Obstacle {
    /** Crée un obstacle de type cellule bloquée sur un index précis. */
    constructor(index) {
        // Appelle la classe mère avec le type utilisé par la logique et le rendu.
        super('blocked-cell', index);
    }

    /** Ajoute la classe CSS qui dessine une case bloquée. */
    applyToCell(cellEl) {
        // La feuille CSS se charge de l'apparence visuelle.
        cellEl.classList.add('obstacle-blocked-cell');
    }

    /** Bloque le passage si le joueur essaie d'utiliser cette cellule. */
    blocksCell(index) {
        // Seule la cellule portant l'obstacle est interdite.
        return this.index === index;
    }
}
