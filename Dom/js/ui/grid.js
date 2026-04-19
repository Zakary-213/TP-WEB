/**
 * grid.js – Création et rendu de la grille dans le DOM.
 */

// Importe la configuration centrale pour créer une grille cohérente partout.
import { getGridSize, getTotalCells } from '../core/config.js';

/* ---------- Initialisation ---------- */
/**
 * Crée les éléments DOM pour chaque cellule et les retourne.
 * @param {HTMLElement} gridEl
 * @returns {HTMLElement[]}
 */
export function initGrid(gridEl) {
    // Récupère la taille active, par exemple 6 pour une grille 6x6.
    const gridSize = getGridSize();
    // Calcule le nombre total de cases à créer.
    const totalCells = getTotalCells();

    // Vide l'ancienne grille avant d'en construire une nouvelle.
    gridEl.innerHTML = '';

    // Mettre à jour les variables CSS pour la grille
    gridEl.style.setProperty('--cols', gridSize);
    gridEl.style.setProperty('--rows', gridSize);

    // Tableau qui permettra à main.js et renderGrid de retrouver toutes les cellules.
    const cellsElements = [];

    // Crée une cellule DOM pour chaque index logique de la grille.
    for (let i = 0; i < totalCells; i++) {
        // Élément principal de la case.
        const cell = document.createElement('div');
        // Classe utilisée par le CSS et les événements.
        cell.className = 'cell';
        // Index logique stocké dans le DOM pour retrouver la case cliquée.
        cell.dataset.index = i;

        // Point central (visible quand la case est dans le chemin)
        const dot = document.createElement('div');
        dot.className = 'path-dot';

        // Connecteurs directionnels (lignes entre les cases adjacentes)
        const ct = document.createElement('div'); ct.className = 'connector connector-top';
        const cb = document.createElement('div'); cb.className = 'connector connector-bottom';
        const cl = document.createElement('div'); cl.className = 'connector connector-left';
        const cr = document.createElement('div'); cr.className = 'connector connector-right';

        // Valeur affichée (indice du puzzle)
        const valSpan = document.createElement('span');
        valSpan.className = 'val-span';
        valSpan.style.pointerEvents = 'none';

        // Ajoute tous les éléments visuels à l'intérieur de la case.
        cell.append(dot, ct, cb, cl, cr, valSpan);
        // Ajoute la case dans la grille affichée.
        gridEl.appendChild(cell);
        // Garde une référence directe pour les futurs rendus.
        cellsElements.push(cell);
    }

    // Retourne toutes les cellules créées pour éviter de refaire des querySelector partout.
    return cellsElements;
}

/* ---------- Rendu ---------- */
/**
 * Met à jour l'affichage de toutes les cellules selon l'état courant.
 *
 * @param {HTMLElement[]} cellsElements
 * @param {object} gameState
 * @param {(a:number, b:number) => boolean} isAdjacent
 */
export function renderGrid(cellsElements, gameState, uiState, isAdjacent) {
    // Taille actuelle de la grille, utilisée pour savoir si un voisin est au-dessus ou en dessous.
    const gridSize = getGridSize();
    // Récupère les données visuelles principales du jeu.
    const { path, numbers, obstacles = [] } = gameState;
    // Récupère l'indice éventuel à mettre en surbrillance.
    const { hintTargetIndex } = uiState;
    // Longueur du chemin actuellement tracé.
    const pathLen = path.length;
    // Dernière case du chemin, utilisée pour l'animation de tête.
    const headIdx = pathLen > 0 ? path[pathLen - 1] : -1;

    // Met à jour chaque case sans reconstruire toute la grille.
    cellsElements.forEach((cellEl, index) => {
        // Position de la case dans le chemin, ou -1 si elle n'est pas utilisée.
        const pathIdx = path.indexOf(index);
        // Booléen plus lisible pour le rendu.
        const isInPath = pathIdx !== -1;

        // ── Classe active ──
        cellEl.classList.toggle('active', isInPath);
        // Tête du chemin (dernière cellule posée) – pour l'animation de point
        cellEl.classList.toggle('path-head', index === headIdx);
        // Case conseillée par le bouton indice
        cellEl.classList.toggle('hint-target', index === hintTargetIndex);

        // Nettoyage puis application des styles obstacle.
        cellEl.classList.remove(
            'obstacle-blocked-cell',
            'obstacle-side-top',
            'obstacle-side-right',
            'obstacle-side-bottom',
            'obstacle-side-left'
        );
        obstacles.forEach((obstacle) => {
            // Le polymorphisme laisse chaque obstacle décider de son rendu.
            if (obstacle.appliesToCell(index)) {
                obstacle.applyToCell(cellEl);
            }
        });

        // ── Valeur / badge hint ──
        const puzzleNum = numbers.find((n) => n.index === index);
        // Span qui contient le chiffre affiché dans la case.
        const valSpan = cellEl.querySelector('.val-span');
        if (puzzleNum) {
            // Affiche le chiffre imposé par le puzzle.
            valSpan.textContent = String(puzzleNum.value);
            // Classe visuelle pour les cases contenant un chiffre.
            cellEl.classList.add('is-hint');
        } else {
            // Vide la case si aucun chiffre n'est présent.
            valSpan.textContent = '';
            // Retire l'apparence de case indice.
            cellEl.classList.remove('is-hint');
        }

        // ── Réinitialiser les connecteurs ──
        cellEl.querySelectorAll('.connector').forEach((c) => c.classList.remove('visible'));

        if (!isInPath) return;

        // ── Activer les connecteurs vers les voisins dans le chemin ──
        // Case précédente dans le chemin, si elle existe.
        const prevCellIdx = pathIdx > 0 ? path[pathIdx - 1] : null;
        // Case suivante dans le chemin, si elle existe.
        const nextCellIdx = pathIdx < pathLen - 1 ? path[pathIdx + 1] : null;

        // Active les connecteurs vers la case précédente et la case suivante.
        [prevCellIdx, nextCellIdx].forEach((neighborIdx) => {
            // Ignore les voisins absents ou non adjacents.
            if (neighborIdx === null || !isAdjacent(index, neighborIdx)) return;

            // Différence d'index : permet de savoir dans quelle direction dessiner la ligne.
            const diff = neighborIdx - index;
            // Voisin au-dessus.
            if (diff === -gridSize) cellEl.querySelector('.connector-top').classList.add('visible');
            // Voisin en dessous.
            if (diff ===  gridSize) cellEl.querySelector('.connector-bottom').classList.add('visible');
            // Voisin à gauche.
            if (diff === -1)         cellEl.querySelector('.connector-left').classList.add('visible');
            // Voisin à droite.
            if (diff ===  1)         cellEl.querySelector('.connector-right').classList.add('visible');
        });
    });
}

/* ---------- Événements pointeur ---------- */
/**
 * Branche les événements souris (+ future extension tactile) sur la grille.
 *
 * @param {HTMLElement} gridEl
 * @param {{ onCellInteraction: (i:number)=>void, onPointerStop: ()=>void, canDraw: ()=>boolean }} handlers
 */
export function bindGridPointerEvents(gridEl, handlers) {
    // Déstructure les callbacks fournis par main.js.
    const { onCellInteraction, onPointerStop, canDraw } = handlers;

    // Début d'interaction à la souris.
    gridEl.addEventListener('mousedown', (e) => {
        // Retrouve la case cliquée, même si l'utilisateur clique sur un enfant de la case.
        const cellEl = e.target.closest('.cell');
        // Si le clic n'est pas sur une case, on ignore.
        if (!cellEl) return;
        e.preventDefault(); // Évite la sélection de texte
        // Transmet l'index logique à la logique de jeu.
        onCellInteraction(Number(cellEl.dataset.index));
    });

    // Survol pendant que le joueur trace son chemin à la souris.
    gridEl.addEventListener('mouseover', (e) => {
        // Si le joueur n'est pas en train de dessiner, on ignore le survol.
        if (!canDraw()) return;
        // Retrouve la case survolée.
        const cellEl = e.target.closest('.cell');
        // Ignore les zones qui ne sont pas des cases.
        if (!cellEl) return;
        // Ajoute potentiellement cette case au chemin.
        onCellInteraction(Number(cellEl.dataset.index));
    });

    // Support tactile basique
    gridEl.addEventListener('touchstart', (e) => {
        // Empêche le scroll pendant le tracé.
        e.preventDefault();
        // Récupère le premier doigt posé sur l'écran.
        const touch = e.touches[0];
        // Trouve l'élément situé sous le doigt.
        const cellEl = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.cell');
        // Si c'est une case, on lance l'interaction.
        if (cellEl) onCellInteraction(Number(cellEl.dataset.index));
    }, { passive: false });

    gridEl.addEventListener('touchmove', (e) => {
        // Empêche le navigateur de déplacer la page pendant le geste.
        e.preventDefault();
        // Ignore le mouvement si aucun tracé n'est actif.
        if (!canDraw()) return;
        // Récupère la position du doigt.
        const touch = e.touches[0];
        // Trouve la case sous le doigt.
        const cellEl = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.cell');
        // Applique la même logique qu'à la souris.
        if (cellEl) onCellInteraction(Number(cellEl.dataset.index));
    }, { passive: false });

    // Relâcher la souris arrête le tracé.
    window.addEventListener('mouseup', onPointerStop);
    // Lever le doigt arrête aussi le tracé.
    window.addEventListener('touchend', onPointerStop);
}
