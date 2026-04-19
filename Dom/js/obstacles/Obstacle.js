/** Classe mère commune à tous les obstacles du jeu. */
export class Obstacle {
    /** Initialise les informations minimales partagées par tous les obstacles. */
    constructor(type, index) {
        // Type logique de l'obstacle, par exemple "blocked-cell" ou "blocked-side".
        this.type = type;
        // Index de la cellule concernée par l'obstacle.
        this.index = index;
    }

    /** Indique si l'obstacle doit être affiché sur cette cellule. */
    appliesToCell(index) {
        // Par défaut, un obstacle appartient uniquement à sa cellule d'origine.
        return this.index === index;
    }

    /** Ajoute les classes CSS nécessaires à l'affichage de l'obstacle. */
    applyToCell(_cellEl) {}

    /** Indique si l'obstacle bloque totalement une cellule. */
    blocksCell(_index) {
        // La classe mère ne bloque rien ; les classes filles redéfinissent si besoin.
        return false;
    }

    /** Indique si l'obstacle bloque un virage dans une cellule. */
    blocksTurn(_prevIdx, _cellIdx, _nextIdx, _gridSize) {
        // Comportement neutre par défaut pour garder une interface commune.
        return false;
    }

    /** Indique si l'obstacle bloque le passage entre deux cases voisines. */
    blocksEdge(_fromIdx, _toIdx, _gridSize) {
        // Comportement neutre par défaut pour les obstacles qui ne bloquent pas les côtés.
        return false;
    }
}
