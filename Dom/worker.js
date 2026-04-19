/**
 * worker.js – Génération de puzzle ZIP
 * Tourne dans un Web Worker pour ne pas bloquer l'UI.
 *
 * Algorithme :
 * 1. Générer un chemin hamiltonien aléatoire (backtracking + shuffle).
 * 2. Sélectionner N indices fixes selon la difficulté.
 * 3. Vérifier que le puzzle est valide (chemin unique possible).
 */

// Taille courante de la grille utilisée dans le worker.
let GRID_SIZE = 6;
// Nombre total de cellules, recalculé quand la taille change.
let TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

/** Met à jour la taille de grille du worker. */
function setGridSize(size) {
    // Convertit l'entrée reçue depuis main.js.
    const numeric = Number(size);
    // Ignore une taille invalide.
    if (!Number.isFinite(numeric)) return;
    // Limite la grille entre 4x4 et 10x10.
    GRID_SIZE = Math.max(4, Math.min(10, Math.floor(numeric)));
    // Recalcule le nombre de cellules.
    TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
}

/* ---------- Voisins adjacents ---------- */
function getNeighbors(idx) {
    // Convertit l'index en ligne.
    const row = Math.floor(idx / GRID_SIZE);
    // Convertit l'index en colonne.
    const col = idx % GRID_SIZE;
    // Liste des voisins accessibles dans la grille.
    const neighbors = [];
    // Voisin du haut si la case n'est pas sur la première ligne.
    if (row > 0)             neighbors.push(idx - GRID_SIZE); // haut
    // Voisin du bas si la case n'est pas sur la dernière ligne.
    if (row < GRID_SIZE - 1) neighbors.push(idx + GRID_SIZE); // bas
    // Voisin de gauche si la case n'est pas sur la première colonne.
    if (col > 0)             neighbors.push(idx - 1);          // gauche
    // Voisin de droite si la case n'est pas sur la dernière colonne.
    if (col < GRID_SIZE - 1) neighbors.push(idx + 1);          // droite
    // Retourne uniquement les voisins valides.
    return neighbors;
}

/* ---------- Fisher-Yates shuffle ---------- */
function shuffle(arr) {
    // Parcourt le tableau de la fin vers le début.
    for (let i = arr.length - 1; i > 0; i--) {
        // Choisit un index aléatoire entre 0 et i.
        const j = Math.floor(Math.random() * (i + 1));
        // Échange les deux éléments.
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Retourne le tableau mélangé sur place.
    return arr;
}

/* ---------- Chemin hamiltonien aléatoire (backtracking) ---------- */
function generateHamiltonianPath() {
    // Tableau rapide pour savoir si une case est déjà visitée.
    const visited = new Uint8Array(TOTAL_CELLS);
    // Chemin en cours de construction.
    const path = [];
    // Case de départ aléatoire.
    const start = Math.floor(Math.random() * TOTAL_CELLS);

    /** Backtracking récursif pour essayer de visiter toutes les cases une fois. */
    function backtrack(current) {
        // Marque la case courante comme visitée.
        visited[current] = 1;
        // Ajoute la case au chemin.
        path.push(current);

        // Succès : le chemin contient toutes les cases.
        if (path.length === TOTAL_CELLS) return true;

        // Essaie les voisins dans un ordre aléatoire.
        const neighbors = shuffle(getNeighbors(current));
        for (const next of neighbors) {
            // Ne revisite jamais une case déjà utilisée.
            if (!visited[next]) {
                // Si la suite mène à une solution, on propage le succès.
                if (backtrack(next)) return true;
            }
        }

        // Backtrack
        // Retire la case de l'ensemble visité.
        visited[current] = 0;
        // Retire la case du chemin.
        path.pop();
        // Signale que cette branche ne marche pas.
        return false;
    }

    // Tenter depuis le départ aléatoire, retenter si pas de solution en 200 ms
    // Date limite pour éviter de bloquer le worker trop longtemps.
    const started = Date.now();
    while (Date.now() - started < 500) {
        // Réinitialise les cases visitées.
        visited.fill(0);
        // Réinitialise le chemin.
        path.length = 0;
        // Retourne le premier chemin complet trouvé.
        if (backtrack(start)) return path;
    }

    // Fallback : boustrophédon garanti
    // Si le backtracking échoue, on fabrique un chemin ligne par ligne.
    const fallback = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        // Liste des cellules de la ligne courante.
        const rowCells = [];
        // Ajoute chaque colonne de cette ligne.
        for (let col = 0; col < GRID_SIZE; col++) rowCells.push(row * GRID_SIZE + col);
        // Une ligne sur deux est inversée pour garder la continuité du chemin.
        if (row % 2 !== 0) rowCells.reverse();
        // Ajoute la ligne au chemin final.
        fallback.push(...rowCells);
    }
    // Retourne le chemin garanti.
    return fallback;
}

/* ---------- Sélection des indices (hints) ---------- */
const HINT_CONFIG = {
    // Facile : plus de chiffres visibles.
    easy:   { count: 11, minManhattan: 2 },
    // Moyen : moins d'indices et un peu plus espacés.
    medium: { count: 8,  minManhattan: 3 },
    // Difficile : peu d'indices et obstacles possibles.
    hard:   { count: 6,  minManhattan: 3 },
};

/** Distance Manhattan entre deux cellules. */
function manhattanDistance(idxA, idxB) {
    // Coordonnées de la première cellule.
    const rowA = Math.floor(idxA / GRID_SIZE);
    const colA = idxA % GRID_SIZE;
    // Coordonnées de la deuxième cellule.
    const rowB = Math.floor(idxB / GRID_SIZE);
    const colB = idxB % GRID_SIZE;
    // Distance horizontale + verticale.
    return Math.abs(rowA - rowB) + Math.abs(colA - colB);
}

/** Vérifie si une définition brute bloque une cellule. */
function obstacleBlocksCell(obstacle, index) {
    return obstacle && obstacle.type === 'blocked-cell' && obstacle.index === index;
}

/** Vérifie si une définition brute bloque le passage entre deux cellules. */
function obstacleBlocksEdge(obstacle, fromIdx, toIdx) {
    // Seuls les obstacles de côté peuvent bloquer une arête.
    if (!obstacle || obstacle.type !== 'blocked-side') return false;
    // L'obstacle doit appartenir à une des deux cellules du passage.
    if (obstacle.index !== fromIdx && obstacle.index !== toIdx) return false;

    // Coordonnées de la cellule de départ.
    const fromRow = Math.floor(fromIdx / GRID_SIZE);
    const fromCol = fromIdx % GRID_SIZE;
    // Coordonnées de la cellule d'arrivée.
    const toRow = Math.floor(toIdx / GRID_SIZE);
    const toCol = toIdx % GRID_SIZE;

    // Côté utilisé depuis la cellule de départ.
    const sideFrom =
        toRow < fromRow ? 'top' :
        toRow > fromRow ? 'bottom' :
        toCol < fromCol ? 'left' :
        toCol > fromCol ? 'right' : null;

    // Si les cellules ne sont pas voisines, aucun côté n'est déterminé.
    if (!sideFrom) return false;

    // Table des côtés opposés pour vérifier le passage depuis l'autre cellule.
    const opposite = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
    };

    // Si l'obstacle est sur la cellule de départ, on compare au côté sortant.
    if (obstacle.index === fromIdx) {
        return obstacle.side === sideFrom;
    }

    // Si l'obstacle est sur la cellule d'arrivée, on compare au côté opposé.
    return obstacle.side === opposite[sideFrom];
}

function isBlockedCellByObstacles(obstacles, index) {
    // Vérifie si au moins un obstacle interdit totalement cette cellule.
    return obstacles.some((obstacle) => obstacleBlocksCell(obstacle, index));
}

function isBlockedEdgeByObstacles(obstacles, fromIdx, toIdx) {
    // Vérifie si au moins un obstacle interdit ce déplacement.
    return obstacles.some((obstacle) => obstacleBlocksEdge(obstacle, fromIdx, toIdx));
}

/** Calcule la plus courte distance entre deux cellules en tenant compte des obstacles. */
function shortestDistanceWithObstacles(fromIdx, toIdx, obstacles = []) {
    // Distance nulle si les deux cellules sont identiques.
    if (fromIdx === toIdx) return 0;

    // Si le départ ou l'arrivée est bloqué, le trajet est impossible.
    if (isBlockedCellByObstacles(obstacles, fromIdx) || isBlockedCellByObstacles(obstacles, toIdx)) {
        return Infinity;
    }

    // Marque les cellules déjà explorées par le BFS.
    const visited = new Uint8Array(TOTAL_CELLS);
    // Distance depuis le départ pour chaque cellule.
    const distances = new Int16Array(TOTAL_CELLS);
    // File de parcours en largeur.
    const queue = [fromIdx];

    // Le départ est déjà visité.
    visited[fromIdx] = 1;

    // BFS classique jusqu'à trouver l'arrivée ou épuiser la grille.
    while (queue.length > 0) {
        // Prend la prochaine cellule à explorer.
        const current = queue.shift();
        // Distance déjà parcourue jusqu'à cette cellule.
        const baseDistance = distances[current];

        // Explore les voisins directs.
        for (const neighbor of getNeighbors(current)) {
            // Ignore les cellules déjà vues.
            if (visited[neighbor]) continue;
            // Ignore les cellules totalement bloquées.
            if (isBlockedCellByObstacles(obstacles, neighbor)) continue;
            // Ignore les passages bloqués par un côté.
            if (isBlockedEdgeByObstacles(obstacles, current, neighbor)) continue;

            // Marque le voisin comme visité.
            visited[neighbor] = 1;
            // Sauvegarde sa distance.
            distances[neighbor] = baseDistance + 1;

            // Si on atteint la cible, on retourne la distance.
            if (neighbor === toIdx) {
                return distances[neighbor];
            }

            // Continue l'exploration depuis ce voisin.
            queue.push(neighbor);
        }
    }

    // Aucun chemin trouvé.
    return Infinity;
}

/** Vérifie qu'un nouvel indice est assez loin des indices déjà choisis. */
function isFarEnough(candidatePos, selectedPositions, path, minDistance, obstacles = []) {
    // Cellule du candidat dans le chemin solution.
    const candidateCell = path[candidatePos];
    // Le candidat doit respecter la distance minimale avec tous les indices déjà choisis.
    return selectedPositions.every((selectedPos) => {
        // Cellule d'un indice déjà sélectionné.
        const selectedCell = path[selectedPos];
        // Avec obstacles, on utilise une vraie distance de chemin ; sinon Manhattan suffit.
        const distance = obstacles.length
            ? shortestDistanceWithObstacles(candidateCell, selectedCell, obstacles)
            : manhattanDistance(candidateCell, selectedCell);
        // Valide si la distance est suffisante.
        return distance >= minDistance;
    });
}

/** Sélectionne les chiffres visibles du puzzle à partir du chemin solution. */
function selectHints(path, difficulty, obstacles = []) {
    // Configuration selon la difficulté.
    const config = HINT_CONFIG[difficulty] ?? HINT_CONFIG.medium;
    // Nombre final d'indices, au minimum 2 et jamais plus que la longueur du chemin.
    const limit = Math.max(2, Math.min(config.count, path.length));
    // Le premier indice est toujours le début du chemin.
    const selectedPositions = [0];

    // Répartit les indices sur tout le chemin, avec une distance minimale en grille.
    for (let slot = 1; slot < limit - 1; slot++) {
        // Nombre d'emplacements à garder pour les indices suivants.
        const remainingSlots = (limit - 1) - slot;
        // Position minimale pour rester après l'indice précédent.
        const minPos = selectedPositions[selectedPositions.length - 1] + 1;
        // Position maximale pour garder assez de place jusqu'à la fin.
        const maxPos = (path.length - 1) - remainingSlots;
        // Position idéale pour répartir les indices régulièrement.
        const target = Math.round((slot * (path.length - 1)) / (limit - 1));

        // Liste des positions possibles pour ce slot.
        const candidates = [];
        for (let pos = minPos; pos <= maxPos; pos++) {
            candidates.push(pos);
        }

        // Trie les candidats par proximité avec la position idéale, avec un peu d'aléatoire.
        candidates.sort((a, b) => {
            const scoreA = Math.abs(a - target) + Math.random() * 0.25;
            const scoreB = Math.abs(b - target) + Math.random() * 0.25;
            return scoreA - scoreB;
        });

        // Position finalement choisie.
        let picked = null;
        for (const pos of candidates) {
            // Prend le premier candidat assez éloigné des autres indices.
            if (isFarEnough(pos, selectedPositions, path, config.minManhattan, obstacles)) {
                picked = pos;
                break;
            }
        }

        // Si aucun candidat n'est assez loin, on prend le meilleur candidat disponible.
        selectedPositions.push(picked ?? candidates[0]);
    }

    // Le dernier indice est toujours la fin du chemin.
    selectedPositions.push(path.length - 1);

    // Affiche toujours 1..N sans trous, même si les cases sont espacées.
    return selectedPositions.map((pathPos, i) => ({
        // Cellule où afficher le chiffre.
        index: path[pathPos],
        // Valeur affichée dans cette cellule.
        value: i + 1,
    }));
}

/** Retourne un élément aléatoire d'un tableau. */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/** Convertit un index en coordonnées. */
function toRowCol(index) {
    return {
        row: Math.floor(index / GRID_SIZE),
        col: index % GRID_SIZE,
    };
}

/** Retourne la direction de toIdx depuis fromIdx. */
function getDirection(fromIdx, toIdx) {
    // Coordonnées de départ.
    const from = toRowCol(fromIdx);
    // Coordonnées d'arrivée.
    const to = toRowCol(toIdx);

    // Tests des quatre directions possibles.
    if (to.row === from.row - 1 && to.col === from.col) return 'up';
    if (to.row === from.row + 1 && to.col === from.col) return 'down';
    if (to.col === from.col - 1 && to.row === from.row) return 'left';
    if (to.col === from.col + 1 && to.row === from.row) return 'right';
    // Les cases ne sont pas voisines.
    return null;
}

function createBlockedSideObstacle(solutionPath) {
    // Impossible de placer une barrière utile sur un chemin trop court.
    if (solutionPath.length < 2) return null;

    // Côtés possibles d'une cellule.
    const sideNames = ['top', 'right', 'bottom', 'left'];
    // Candidats qui ne coupent pas le chemin solution.
    const candidates = [];

    // Parcourt chaque cellule du chemin solution.
    for (let pos = 0; pos < solutionPath.length; pos++) {
        // Cellule courante.
        const cell = solutionPath[pos];
        // Cellule précédente, si elle existe.
        const prev = pos > 0 ? solutionPath[pos - 1] : null;
        // Cellule suivante, si elle existe.
        const next = pos < solutionPath.length - 1 ? solutionPath[pos + 1] : null;

        // Côtés déjà utilisés par le chemin pour entrer ou sortir.
        const usedSides = new Set();

        if (prev !== null) {
            // Côté utilisé pour rejoindre la cellule précédente.
            const enterSide = getDirection(cell, prev);
            if (enterSide) usedSides.add(enterSide);
        }

        if (next !== null) {
            // Côté utilisé pour rejoindre la cellule suivante.
            const exitSide = getDirection(cell, next);
            if (exitSide) usedSides.add(exitSide);
        }

        // Les côtés libres peuvent recevoir un obstacle sans casser la solution.
        const allowedSides = sideNames.filter((side) => !usedSides.has(side));
        if (allowedSides.length === 0) continue;

        // Ajoute un obstacle candidat sur un côté libre.
        candidates.push({
            index: cell,
            side: randomChoice(allowedSides),
        });
    }

    // Si aucun côté n'est disponible, aucun obstacle de côté n'est créé.
    if (candidates.length === 0) return null;
    // Choisit un candidat aléatoire.
    return randomChoice(candidates);
}

/** Ajoute des obstacles pour le mode difficile sans rendre la solution impossible. */
function applyHardObstacles(rawPath) {
    // Copie le chemin pour pouvoir éventuellement retirer une extrémité bloquée.
    let solutionPath = [...rawPath];
    // Liste des obstacles générés.
    const obstacles = [];

    // Choix aléatoire des types d'obstacles.
    let includeBlockedCell = Math.random() < 0.65;
    let includeBlockedSide = Math.random() < 0.65;

    // En difficile il doit y avoir au moins un obstacle.
    if (!includeBlockedCell && !includeBlockedSide) {
        // Si aucun obstacle n'a été tiré, on en force un.
        if (Math.random() < 0.5) includeBlockedCell = true;
        else includeBlockedSide = true;
    }

    // Une cellule bloquée est placée sur une extrémité, puis cette extrémité sort de la solution.
    if (includeBlockedCell && solutionPath.length > 2) {
        // Choisit aléatoirement si on coupe le début ou la fin.
        const cutStart = Math.random() < 0.5;
        // Index de la cellule à bloquer.
        const blockedIndex = cutStart ? solutionPath[0] : solutionPath[solutionPath.length - 1];

        // Ajoute la définition brute de cellule bloquée.
        obstacles.push({
            type: 'blocked-cell',
            index: blockedIndex,
        });

        // Retire la cellule bloquée du chemin solution attendu.
        solutionPath = cutStart ? solutionPath.slice(1) : solutionPath.slice(0, -1);
    }

    // Ajoute éventuellement un côté bloqué qui ne gêne pas le chemin solution.
    if (includeBlockedSide) {
        const blockedSide = createBlockedSideObstacle(solutionPath);
        if (blockedSide) {
            obstacles.push({
                type: 'blocked-side',
                index: blockedSide.index,
                side: blockedSide.side,
            });
        }
    }

    // Sécurité : si rien n'a été ajouté, on tente au moins un obstacle de côté.
    if (obstacles.length === 0 && solutionPath.length > 2) {
        const blockedSide = createBlockedSideObstacle(solutionPath);
        if (blockedSide) {
            obstacles.push({
                type: 'blocked-side',
                index: blockedSide.index,
                side: blockedSide.side,
            });
        }
    }

    // Retourne le chemin éventuellement raccourci et ses obstacles.
    return { solutionPath, obstacles };
}

/* ---------- Génération complète ---------- */
function generatePuzzle(difficulty = 'medium') {
    // Génère d'abord un chemin couvrant toute la grille.
    const rawPath = generateHamiltonianPath();

    // Par défaut, la solution est le chemin complet.
    let solutionPath = rawPath;
    // Par défaut, pas d'obstacle.
    let obstacles = [];

    // En difficile, ajoute des obstacles compatibles avec la solution.
    if (difficulty === 'hard') {
        const hardSetup = applyHardObstacles(rawPath);
        solutionPath = hardSetup.solutionPath;
        obstacles = hardSetup.obstacles;
    }

    // Sélectionne les chiffres visibles à partir de la solution.
    const numbers = selectHints(solutionPath, difficulty, obstacles);

    // Données renvoyées à main.js.
    return { solutionPath, numbers, obstacles };
}

/** Nettoie les chiffres posés par l'utilisateur dans le concepteur. */
function sanitizeCustomNumbers(rawNumbers) {
    // Accepte uniquement un tableau.
    const source = Array.isArray(rawNumbers) ? rawNumbers : [];
    // Empêche deux chiffres identiques.
    const byValue = new Map();
    // Empêche deux chiffres sur la même cellule.
    const byIndex = new Map();

    // Parcourt les entrées brutes venues de l'interface.
    for (const item of source) {
        // Convertit la valeur du chiffre.
        const value = Number(item && item.value);
        // Convertit l'index de cellule.
        const index = Number(item && item.index);

        // Ignore les entrées non numériques.
        if (!Number.isFinite(value) || !Number.isFinite(index)) continue;
        // Les chiffres disponibles vont de 1 à 10.
        if (value < 1 || value > 10) continue;
        // L'index doit appartenir à la grille courante.
        if (index < 0 || index >= TOTAL_CELLS) continue;
        // Ignore les doublons de valeur ou de cellule.
        if (byValue.has(value) || byIndex.has(index)) continue;

        // Entrée nettoyée avec des entiers.
        const entry = { value: Math.floor(value), index: Math.floor(index) };
        // Indexation par valeur.
        byValue.set(entry.value, entry);
        // Indexation par cellule.
        byIndex.set(entry.index, entry);
    }

    // Liste finale triée par ordre de chiffre.
    const numbers = Array.from(byValue.values()).sort((a, b) => a.value - b.value);

    // Il faut au minimum un début et une étape suivante.
    if (numbers.length < 2) {
        return { valid: false, reason: 'Place au moins 2 chiffres.' };
    }

    // Le chiffre 1 doit exister pour savoir où commencer.
    if (numbers[0].value !== 1) {
        return { valid: false, reason: 'Le chiffre 1 est obligatoire.' };
    }

    // Les chiffres doivent être consécutifs : 1, 2, 3...
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i].value !== i + 1) {
            return { valid: false, reason: 'Les chiffres doivent se suivre: 1, 2, 3...' };
        }
    }

    // Les chiffres sont valides et prêts pour la recherche de chemin.
    return { valid: true, numbers };
}

function findConstrainedHamiltonianPath(numbers, timeLimitMs = 1200) {
    // Map cellule -> valeur imposée pour tester rapidement les contraintes.
    const constraintByIndex = new Map(numbers.map((n) => [n.index, n.value]));
    // Liste des valeurs attendues dans l'ordre.
    const expectedValues = numbers.map((n) => n.value);
    // Le chemin doit commencer sur la cellule du chiffre 1.
    const startIndex = numbers[0].index;
    // Date limite pour éviter une recherche infinie.
    const deadline = Date.now() + timeLimitMs;

    // Cellules déjà utilisées dans le chemin.
    const visited = new Uint8Array(TOTAL_CELLS);
    // Chemin en cours.
    const path = [];

    /** Trie les candidats pour explorer d'abord les cases les plus contraintes. */
    function sortCandidates(candidates) {
        return candidates.sort((a, b) => {
            // Degré = nombre de voisins encore libres.
            const degreeA = getNeighbors(a).filter((n) => !visited[n]).length;
            const degreeB = getNeighbors(b).filter((n) => !visited[n]).length;
            // On teste d'abord les cases avec moins de sorties.
            if (degreeA !== degreeB) return degreeA - degreeB;
            // En cas d'égalité, on garde une part d'aléatoire.
            return Math.random() - 0.5;
        });
    }

    /** Recherche récursive d'un chemin qui visite toute la grille et respecte les chiffres. */
    function backtrack(current, nextConstraintPos) {
        // Stoppe la recherche si elle dépasse le temps autorisé.
        if (Date.now() > deadline) return false;

        // Valeur imposée sur la cellule courante, si elle existe.
        const currentConstraintValue = constraintByIndex.get(current);
        // Position du prochain chiffre attendu.
        let nextPos = nextConstraintPos;

        // Si la cellule porte un chiffre, il doit être celui attendu.
        if (typeof currentConstraintValue === 'number') {
            const expected = expectedValues[nextPos];
            if (currentConstraintValue !== expected) return false;
            nextPos += 1;
        }

        // Si toute la grille est couverte, tous les chiffres imposés doivent avoir été rencontrés.
        if (path.length === TOTAL_CELLS) {
            return nextPos === expectedValues.length;
        }

        // Voisins libres, triés pour améliorer les chances de trouver vite.
        const candidates = sortCandidates(
            getNeighbors(current).filter((n) => !visited[n])
        );

        // Essaie chaque voisin possible.
        for (const next of candidates) {
            // Vérifie les contraintes avant d'entrer dans une case numérotée.
            const nextConstraintValue = constraintByIndex.get(next);
            if (typeof nextConstraintValue === 'number') {
                const expected = expectedValues[nextPos];
                if (nextConstraintValue !== expected) {
                    continue;
                }
            }

            // Marque le voisin comme utilisé.
            visited[next] = 1;
            // L'ajoute au chemin.
            path.push(next);

            // Succès si la suite mène à un chemin complet.
            if (backtrack(next, nextPos)) return true;

            // Backtrack : retire le voisin.
            path.pop();
            // Backtrack : libère la cellule.
            visited[next] = 0;
        }

        // Aucun voisin ne permet de compléter le chemin.
        return false;
    }

    // Initialise la recherche depuis le chiffre 1.
    visited[startIndex] = 1;
    path.push(startIndex);

    // Lance la recherche.
    const found = backtrack(startIndex, 0);
    // Si aucun chemin complet n'est trouvé, le niveau n'est pas faisable.
    if (!found) return null;

    // Retourne une copie du chemin trouvé.
    return [...path];
}

/** Valide un niveau créé par l'utilisateur. */
function validateCustomLevel(rawNumbers) {
    // Nettoie d'abord les données reçues.
    const sanitized = sanitizeCustomNumbers(rawNumbers);
    if (!sanitized.valid) {
        // Renvoie directement la raison si les chiffres sont invalides.
        return {
            feasible: false,
            reason: sanitized.reason,
        };
    }

    // Cherche un chemin complet qui passe par les chiffres dans le bon ordre.
    const solutionPath = findConstrainedHamiltonianPath(sanitized.numbers, 1400);
    if (!solutionPath) {
        // Aucun chemin trouvé dans le temps imparti.
        return {
            feasible: false,
            reason: 'Reessayer: le niveau est pas faisable.',
        };
    }

    // Niveau jouable : renvoie la solution et les chiffres nettoyés.
    return {
        feasible: true,
        solutionPath,
        numbers: sanitized.numbers,
    };
}

/* ---------- Interface Web Worker ---------- */
self.onmessage = function (e) {
    // Génération d'un puzzle classique.
    if (e.data.type === 'GENERATE_PUZZLE') {
        // Difficulté demandée, medium par défaut.
        const difficulty = e.data.difficulty ?? 'medium';
        // Synchronise la taille de grille avec le message reçu.
        setGridSize(e.data.gridSize ?? 6);
        // Génère le puzzle complet.
        const result = generatePuzzle(difficulty);
        // Renvoie le résultat au thread principal.
        self.postMessage({ type: 'PUZZLE_RESULT', payload: result });
        return;
    }

    // Validation d'un niveau personnalisé.
    if (e.data.type === 'VALIDATE_CUSTOM_LEVEL') {
        // Synchronise la taille de grille avant la validation.
        setGridSize(e.data.gridSize ?? 6);
        // Vérifie si les chiffres posés permettent un chemin complet.
        const validation = validateCustomLevel(e.data.numbers);
        // Renvoie la réponse avec le requestId pour résoudre la bonne Promise côté main.js.
        self.postMessage({
            type: 'CUSTOM_LEVEL_VALIDATION_RESULT',
            payload: {
                requestId: e.data.requestId,
                ...validation,
            }
        });
    }
};
