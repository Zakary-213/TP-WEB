/** Taille actuelle de la grille carrée : 6 signifie une grille de 6 colonnes par 6 lignes. */
let currentGridSize = 6;

/** Retourne la taille active pour que tous les modules utilisent la même valeur. */
export function getGridSize() {
	return currentGridSize;
}

/** Met à jour la taille de grille en bloquant les valeurs trop petites ou trop grandes. */
export function setGridSize(nextSize) {
	// Convertit l'entrée en nombre, car elle peut venir d'un bouton HTML ou d'un dataset.
	const numeric = Number(nextSize);
	// Ignore les valeurs invalides pour éviter de casser le rendu de la grille.
	if (!Number.isFinite(numeric)) return;
	// Force une grille entre 4x4 et 10x10, puis retire les décimales.
	const clamped = Math.max(4, Math.min(10, Math.floor(numeric)));
	// Stocke la taille nettoyée comme nouvelle configuration globale.
	currentGridSize = clamped;
}

/** Retourne le nombre total de cases de la grille active. */
export function getTotalCells() {
	// Une grille carrée contient taille * taille cases.
	return currentGridSize * currentGridSize;
}
