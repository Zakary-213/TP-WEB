/**
 * main.js – Point d'entrée du jeu ZIP.
 * Orchestre l'UI, le timer, la logique et le worker.
 */

import { getGridSize, setGridSize } from './core/config.js';
import { gameState, uiState } from './core/state.js';
import { createTimer } from './game/timer.js';
import { isAdjacent, handleCellInteraction, hasWonAgainstTarget } from './game/logic.js';
import { initGrid, renderGrid, bindGridPointerEvents } from './ui/grid.js';
import { createPuzzleWorker } from './worker/worker-client.js';
import { createObstacles } from './obstacles/factory.js';

/* ---------- Éléments DOM ---------- */
// Grille principale dans laquelle les cellules sont créées dynamiquement.
const gridEl         = document.getElementById('grid');
// Texte du chronomètre affiché dans le header.
const timerTextEl    = document.getElementById('timer-text');
// Overlay affiché pendant la génération du puzzle.
const loadingEl      = document.getElementById('loading');
// Overlay de victoire.
const winOverlayEl   = document.getElementById('win-overlay');
// Zone qui affiche le temps final.
const winTimeEl      = document.getElementById('win-time');
// Zone qui affiche la difficulté ou la taille de grille en mode personnalisé.
const winDiffEl      = document.getElementById('win-difficulty');
// Libellé secondaire de la carte de victoire.
const winSecondaryLabelEl = document.getElementById('win-secondary-label');
// Bouton de la victoire pour générer un nouveau puzzle ou revenir au menu.
const overlayNewPuzzleBtnEl = document.getElementById('overlay-new-puzzle');
// Bouton de la victoire pour rejouer le puzzle courant.
const overlayResetBtnEl = document.getElementById('overlay-reset');
// Bouton de la victoire pour quitter vers le menu.
const overlayQuitBtnEl = document.getElementById('overlay-quit');
// Sélecteur de difficulté du mode classique.
const difficultyEl   = document.getElementById('difficulty');
// Affichage du plus grand chiffre à atteindre.
const maxNumEl       = document.getElementById('max-num');
// Bouton d'indice.
const hintBtnEl      = document.getElementById('hint-btn');
// Texte qui décrit l'indice proposé.
const hintTextEl     = document.getElementById('hint-text');
// Overlay du menu principal.
const modeMenuOverlayEl = document.getElementById('mode-menu-overlay');
// Bouton "Jouer" du menu principal.
const menuPlayBtnEl = document.getElementById('menu-play-btn');
// Bouton "Scores" du menu principal.
const menuScoresBtnEl = document.getElementById('menu-scores-btn');
// Bouton "Concepteur" du menu principal.
const menuDesignerBtnEl = document.getElementById('menu-designer-btn');
// Overlay de la liste des scores.
const scoresOverlayEl = document.getElementById('scores-overlay');
// Conteneur des lignes de scores.
const scoresListEl = document.getElementById('scores-list');
// Boutons de filtre des scores.
const scoresFilterBtns = Array.from(document.querySelectorAll('.scores-filter-btn[data-filter]'));
// Bouton de tri par chrono.
const scoresSortBtnEl = document.getElementById('scores-sort-btn');
// Bouton retour de l'écran scores.
const scoresBackBtnEl = document.getElementById('scores-back-btn');
// Overlay de choix de grille du concepteur.
const designerOverlayEl = document.getElementById('designer-overlay');
// Bouton retour depuis le choix du concepteur.
const designerBackBtnEl = document.getElementById('designer-back-btn');
// Bouton qui ouvre la grille vide du concepteur.
const designerPlayBtnEl = document.getElementById('designer-play-btn');
// Texte indiquant la taille sélectionnée dans le concepteur.
const designerSubtitleEl = document.getElementById('designer-subtitle');
// Boutons de taille de grille du concepteur.
const designerGridBtns = Array.from(document.querySelectorAll('.designer-grid-btn[data-grid-size]'));
// Bloc d'instructions situé au-dessus de la grille.
const instructionsEl = document.querySelector('.instructions');
// Espace de travail du concepteur de niveau.
const designerWorkspaceEl = document.getElementById('designer-workspace');
// Bouton pour quitter le concepteur.
const designerExitBtnEl = document.getElementById('designer-exit-btn');
// Palette des chiffres déplaçables dans le concepteur.
const designerNumberPaletteEl = document.getElementById('designer-number-palette');
// Bouton de validation du niveau personnalisé.
const designerValidateBtnEl = document.getElementById('designer-validate-btn');
// Message de statut de la validation personnalisée.
const designerValidateStatusEl = document.getElementById('designer-validate-status');
// Sauvegarde du texte original pour le restaurer après le mode concepteur.
const defaultInstructionsHtml = instructionsEl ? instructionsEl.innerHTML : '';

// Taille de grille choisie pour le concepteur, conservée en localStorage.
let selectedDesignerGrid = localStorage.getItem('neonzip_designer_grid') || '4x4';
// Mode courant : menu, play ou designer.
let currentMode = 'menu';
// Valeur actuellement déplacée en drag and drop.
let draggedDesignerValue = null;
// Indique si le worker est en train de vérifier un niveau personnalisé.
let isDesignerValidating = false;
// Vrai quand on joue un niveau créé dans le concepteur.
let isCustomValidatedSession = false;
// Chiffre sélectionné au clic pour le déplacer sans drag and drop.
let designerPickedValue = null;
// Cellule d'origine du chiffre sélectionné au clic.
let designerPickedFromIndex = null;
// Taille fixe des puzzles classiques.
const CLASSIC_GRID_SIZE = 6;
// Filtre courant des scores.
let activeScoresFilter = 'all';
// Sens de tri des scores : asc = meilleur temps en premier.
let scoresSortDirection = 'asc';
// Scores de l'utilisateur courant.
let userScores = [];
// Message d'erreur éventuel pour l'écran scores.
let scoresError = '';
// Indique si les scores sont en cours de chargement.
let isLoadingScores = false;
// Indique si une première tentative de chargement des scores a déjà eu lieu.
let hasLoadedScores = false;
// Empêche d'envoyer plusieurs fois le score d'une même victoire.
let hasSavedWinScore = false;
// Empêche deux sauvegardes simultanées du même score.
let isSavingWinScore = false;

/* ---------- Initialisation de la grille ---------- */
let cellsElements = initGrid(gridEl);

function parseGridSizeLabel(label) {
    // Normalise la valeur HTML, par exemple "4x4".
    const raw = String(label || '').toLowerCase();
    // Accepte uniquement les formats carrés : 4x4, 6x6, etc.
    const match = raw.match(/^(\d+)x\1$/);
    // Retourne la taille classique si le format est invalide.
    if (!match) return 6;
    // Convertit la taille extraite en nombre.
    const size = Number(match[1]);
    // Sécurité contre les valeurs non numériques.
    if (!Number.isFinite(size)) return 6;
    // Limite la taille entre 4 et 10 comme le reste du jeu.
    return Math.max(4, Math.min(10, Math.floor(size)));
}

/* ---------- Timer ---------- */
function formatTime(seconds) {
    // Calcule les minutes entières.
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    // Calcule les secondes restantes.
    const s = (seconds % 60).toString().padStart(2, '0');
    // Retourne le format lisible MM:SS.
    return `${m}:${s}`;
}

/** Met à jour le texte du chrono à chaque tick. */
function onTimerTick(seconds) {
    timerTextEl.textContent = formatTime(seconds);
}

// Chronomètre partagé par tous les modes de jeu.
const timer = createTimer(onTimerTick);

/** Traduit la valeur technique de difficulté en libellé français. */
function difficultyLabel(d) {
    return { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' }[d] ?? d;
}

/** Verrouille la difficulté quand elle ne doit pas être modifiée. */
function syncDifficultyControlState() {
    if (!difficultyEl) return;
    // Le mode concepteur et les niveaux personnalisés ne dépendent pas de la difficulté.
    const isLocked = currentMode === 'designer' || isCustomValidatedSession;
    difficultyEl.disabled = isLocked;
}

/** Récupère l'utilisateur connecté via l'API globale ou le localStorage. */
function getCurrentUserId() {
    if (window.CANVAS_API && typeof window.CANVAS_API.getUserId === 'function') {
        return window.CANVAS_API.getUserId();
    }
    return localStorage.getItem('tpweb_user_id');
}

/** Convertit une route API en URL complète si l'environnement le demande. */
function toApiUrl(path) {
    if (window.CANVAS_API && typeof window.CANVAS_API.toUrl === 'function') {
        return window.CANVAS_API.toUrl(path);
    }
    return path;
}

/** Libellé affiché dans la liste des scores selon le mode. */
function scoresModeLabel(mode) {
    return mode === 'designer' ? 'Concepteur' : 'Solo';
}

/** Transforme un score API en objet simple pour l'interface. */
function mapScoreRecordToUi(record) {
    // Normalise le mode reçu.
    const rawMode = String((record && record.mode) || 'solo').toLowerCase();
    // Limite les modes connus à solo ou designer.
    const mode = rawMode === 'designer' ? 'designer' : 'solo';
    // Données additionnelles stockées avec le score.
    const data = record && record.data ? record.data : {};

    // Récupère la taille de grille, quel que soit le nom utilisé côté API.
    const rawGridSize = Number(data.gridSize || data.size || data.grid || 0);
    // Valide la taille ou utilise la taille classique.
    const gridSize = Number.isFinite(rawGridSize) && rawGridSize >= 4 && rawGridSize <= 10
        ? Math.floor(rawGridSize)
        : CLASSIC_GRID_SIZE;

    // L'API stocke le temps en millisecondes.
    const totalTimeMs = Number(record && record.totalTime);
    // Convertit le temps en secondes pour réutiliser formatTime.
    const seconds = Number.isFinite(totalTimeMs) && totalTimeMs >= 0
        ? Math.round(totalTimeMs / 1000)
        : 0;

    // Objet final utilisé par renderScoresList.
    return {
        mode,
        grid: mode === 'designer' ? 'Personnalisee' : 'Classique',
        size: `${gridSize}x${gridSize}`,
        time: seconds,
        difficulty: mode === 'solo' ? String(data.difficulty || 'medium') : null,
    };
}

async function loadUserScores() {
    // Évite de relancer plusieurs fetch pendant qu'un chargement est déjà actif.
    if (isLoadingScores) return;

    // Récupère l'utilisateur courant pour charger uniquement ses scores.
    const userId = getCurrentUserId();
    if (!userId) {
        // Sans utilisateur, on affiche un état vide avec un message explicite.
        userScores = [];
        hasLoadedScores = true;
        scoresError = 'Connecte-toi pour voir tes scores.';
        renderScoresList();
        return;
    }

    // Marque le chargement en cours et rafraîchit l'UI.
    isLoadingScores = true;
    scoresError = '';
    renderScoresList();

    try {
        // Charge en parallèle les scores solo et concepteur.
        const [soloRes, designerRes] = await Promise.all([
            fetch(toApiUrl(`/api/scores/top?game=dom&mode=solo&userId=${encodeURIComponent(userId)}&limit=100`)),
            fetch(toApiUrl(`/api/scores/top?game=dom&mode=designer&userId=${encodeURIComponent(userId)}&limit=100`)),
        ]);

        // Si une des deux requêtes échoue, on affiche une erreur unique.
        if (!soloRes.ok || !designerRes.ok) {
            throw new Error('Impossible de charger les scores.');
        }

        // Parse les deux réponses JSON.
        const [soloBody, designerBody] = await Promise.all([soloRes.json(), designerRes.json()]);
        // Fusionne les scores puis les convertit au format utilisé par l'UI.
        userScores = [...(soloBody?.data || []), ...(designerBody?.data || [])]
            .map(mapScoreRecordToUi)
            .filter((entry) => Number.isFinite(entry.time));
        // Mémorise que le chargement a réussi.
        hasLoadedScores = true;
        scoresError = '';
    } catch (error) {
        // En cas d'erreur, on vide la liste pour éviter d'afficher d'anciennes données.
        userScores = [];
        hasLoadedScores = true;
        scoresError = error && error.message ? error.message : 'Erreur de chargement des scores.';
    } finally {
        // Le chargement est terminé dans tous les cas.
        isLoadingScores = false;
        // Rafraîchit l'écran des scores avec succès ou erreur.
        renderScoresList();
    }
}

/** Sauvegarde le score de victoire une seule fois par partie. */
async function persistWinScoreIfNeeded() {
    // Bloque les doublons, notamment parce que render peut être rappelé plusieurs fois.
    if (hasSavedWinScore || isSavingWinScore) return;

    // Sans utilisateur connecté, on ne peut pas sauvegarder.
    const userId = getCurrentUserId();
    // On passe immédiatement à true pour éviter les doubles clics ou doubles rendus.
    hasSavedWinScore = true;
    if (!userId) return;

    // Le mode dépend de l'origine du puzzle joué.
    const mode = isCustomValidatedSession ? 'designer' : 'solo';
    // Payload attendu par l'API des scores.
    const payload = {
        userId,
        game: 'dom',
        mode,
        totalTime: Math.max(0, Math.round(gameState.elapsedSeconds * 1000)),
        totalMeteorites: Number(gameState.solutionPath.length || 0),
        data: {
            gridSize: getGridSize(),
            difficulty: mode === 'solo' ? gameState.difficulty : null,
            mode,
        },
    };

    // Marque l'envoi en cours.
    isSavingWinScore = true;
    try {
        // Envoie le score au backend.
        await fetch(toApiUrl('/api/scores/scorecanvas'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        // Force un rechargement des scores la prochaine fois qu'on ouvre l'écran.
        hasLoadedScores = false;
    } catch (error) {
        // La sauvegarde ne bloque pas la victoire, mais on garde l'erreur en console.
        console.error('Erreur lors de la sauvegarde du score Dom:', error);
    } finally {
        // Libère le verrou d'envoi.
        isSavingWinScore = false;
    }
}

/* ---------- Rendu ---------- */
function render() {
    // Met à jour l'affichage de la grille à partir des états courants.
    renderGrid(cellsElements, gameState, uiState, isAdjacent);

    // En mode concepteur, la palette doit refléter les chiffres déjà placés.
    if (currentMode === 'designer') {
        syncDesignerPaletteState();
    }

    // Vérifie la victoire uniquement en mode partie.
    if (currentMode === 'play' && gameState.solutionPath.length > 0 && hasWonAgainstTarget(gameState.path, gameState.solutionPath.length)) {
        // Adapte le bouton principal selon le type de partie.
        if (overlayNewPuzzleBtnEl) {
            overlayNewPuzzleBtnEl.textContent = isCustomValidatedSession ? 'Retour au menu' : 'Nouveau Puzzle';
        }
        // Le bouton secondaire rejoue toujours le niveau terminé.
        if (overlayResetBtnEl) {
            overlayResetBtnEl.textContent = 'Rejouer';
        }

        // Stoppe le timer dès que la condition de victoire est atteinte.
        timer.stop();
        // Sauvegarde le score si possible.
        persistWinScoreIfNeeded();
        // Affiche le temps final.
        winTimeEl.textContent  = formatTime(gameState.elapsedSeconds);
        if (isCustomValidatedSession) {
            // Pour un niveau créé, la statistique utile est la taille de grille.
            if (winSecondaryLabelEl) winSecondaryLabelEl.textContent = 'Grille';
            const size = getGridSize();
            winDiffEl.textContent = `${size}x${size}`;
        } else {
            // Pour un puzzle classique, on affiche la difficulté.
            if (winSecondaryLabelEl) winSecondaryLabelEl.textContent = 'Difficulté';
            winDiffEl.textContent = difficultyLabel(gameState.difficulty);
        }
        // Petit délai pour laisser le rendu de la dernière case se voir avant l'overlay.
        setTimeout(() => winOverlayEl.classList.remove('hidden'), 250);
    }
}

function renderScoresList() {
    // Si l'écran des scores n'existe pas, on sort sans erreur.
    if (!scoresListEl) return;

    // Affiche directement le message d'erreur si un chargement a échoué.
    if (scoresError) {
        scoresListEl.innerHTML = `<div class="scores-empty">${scoresError}</div>`;
        return;
    }

    // Affiche l'état de chargement avant la première réponse.
    if (isLoadingScores && !hasLoadedScores) {
        scoresListEl.innerHTML = '<div class="scores-empty">Chargement des scores...</div>';
        return;
    }

    // Filtre puis trie les scores selon les contrôles actifs.
    const entries = userScores.filter((entry) => {
        if (activeScoresFilter === 'all') return true;
        return entry.mode === activeScoresFilter;
    }).sort((a, b) => {
        return scoresSortDirection === 'asc' ? a.time - b.time : b.time - a.time;
    });

    // Message affiché quand aucun score ne correspond au filtre.
    if (!entries.length) {
        scoresListEl.innerHTML = '<div class="scores-empty">Aucune partie pour ce filtre.</div>';
        return;
    }

    // Crée les lignes HTML de scores.
    const html = entries.map((entry) => {
        // La difficulté n'existe que pour les parties solo classiques.
        const difficulty = entry.mode === 'solo'
            ? difficultyLabel(entry.difficulty)
            : '<span class="score-difficulty-muted">-</span>';
        return `
            <div class="score-line ${entry.mode}">
                <span>${scoresModeLabel(entry.mode)}</span>
                <span>${entry.grid}</span>
                <span>${entry.size}</span>
                <span class="score-time">${formatTime(entry.time)}</span>
                <span>${difficulty}</span>
            </div>
        `;
    }).join('');

    scoresListEl.innerHTML = html;
}

/** Met à jour le texte du bouton de tri des scores. */
function updateScoresSortButton() {
    if (!scoresSortBtnEl) return;
    scoresSortBtnEl.textContent = scoresSortDirection === 'asc' ? 'Chrono ↑' : 'Chrono ↓';
}

/** Inverse le tri des scores entre croissant et décroissant. */
function toggleScoresSortDirection() {
    scoresSortDirection = scoresSortDirection === 'asc' ? 'desc' : 'asc';
    updateScoresSortButton();
    renderScoresList();
}

/** Change le filtre actif de l'écran des scores. */
function setScoresFilter(nextFilter) {
    activeScoresFilter = nextFilter;
    // Met à jour l'apparence des boutons de filtre.
    scoresFilterBtns.forEach((btn) => {
        const isActive = btn.dataset.filter === nextFilter;
        btn.classList.toggle('is-active', isActive);
    });
    // Recalcule la liste visible.
    renderScoresList();
}

/* ---------- Reset / Nouveau puzzle ---------- */
function resetGame() {
    // Vide le chemin tracé par le joueur.
    gameState.path = [];
    // Arrête le tracé en cours.
    uiState.isDrawing = false;
    // Retire l'éventuelle case d'indice surlignée.
    uiState.hintTargetIndex = null;
    // Autorise une nouvelle sauvegarde de score après une vraie nouvelle victoire.
    hasSavedWinScore = false;
    // Réinitialise le texte d'indice.
    hintTextEl.textContent = 'Indice: clique pour voir le premier déplacement conseillé.';
    // Remet le chrono à zéro dans l'état de jeu.
    timer.reset((v) => { gameState.elapsedSeconds = v; });
    // Cache l'overlay de victoire.
    winOverlayEl.classList.add('hidden');
    // Rafraîchit la grille.
    render();
}

/** Lance le chronomètre au premier vrai mouvement. */
function startTimerIfNeeded() {
    // Ne relance pas le timer s'il tourne déjà.
    if (timer.isRunning()) return;
    // Lie le timer à gameState.elapsedSeconds.
    timer.start(
        () => gameState.elapsedSeconds,
        (v) => { gameState.elapsedSeconds = v; }
    );
}

/* ---------- Worker ---------- */
const puzzleWorker = createPuzzleWorker(
    (result) => {
        // Chemin complet à reproduire pour gagner.
        gameState.solutionPath = result.solutionPath;
        // Chiffres visibles dans la grille.
        gameState.numbers      = result.numbers ?? [];
        // Définitions brutes converties en instances d'obstacles.
        gameState.obstacles    = createObstacles(result.obstacles ?? []);
        // Difficulté retenue au moment de la génération.
        gameState.difficulty   = difficultyEl.value;

        // Afficher la valeur maximale (= taille du chemin solution)
        maxNumEl.textContent = result.solutionPath.length;

        // Cache le chargement puis réinitialise la partie.
        loadingEl.classList.add('hidden');
        resetGame();
    },
    (message) => {
        // Cache le chargement si le worker signale une erreur.
        loadingEl.classList.add('hidden');
        // Affiche un message simple à l'utilisateur.
        alert(`Erreur : ${message}`);
    }
);

/** Demande un nouveau puzzle classique au worker. */
function loadNewPuzzle(gridSizeOverride = CLASSIC_GRID_SIZE) {
    // Lit la difficulté sélectionnée.
    const difficulty = difficultyEl.value;
    // Stocke la difficulté dans l'état pour l'écran de victoire.
    gameState.difficulty = difficulty;

    // Convertit la taille demandée ou revient à la taille classique.
    const targetSize = Number(gridSizeOverride) || CLASSIC_GRID_SIZE;
    // Reconstruit la grille seulement si la taille change.
    if (targetSize !== getGridSize()) {
        setGridSize(targetSize);
        cellsElements = initGrid(gridEl);
    }

    // Affiche le chargement pendant que le worker calcule.
    loadingEl.classList.remove('hidden');
    // Cache l'overlay de victoire d'une partie précédente.
    winOverlayEl.classList.add('hidden');
    // Envoie la demande au worker.
    puzzleWorker.loadPuzzle(difficulty, getGridSize());
}

function openModeMenu() {
    // Le menu principal devient le mode actif.
    currentMode = 'menu';
    // On quitte une éventuelle session personnalisée.
    isCustomValidatedSession = false;
    // Retire les styles spécifiques au concepteur.
    document.body.classList.remove('designer-mode');

    // Affiche le menu principal.
    if (modeMenuOverlayEl) modeMenuOverlayEl.classList.remove('hidden');
    if (scoresOverlayEl) {
        // Cache les scores.
        scoresOverlayEl.classList.add('hidden');
        scoresOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (designerOverlayEl) {
        // Cache le choix de grille.
        designerOverlayEl.classList.add('hidden');
        designerOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (designerWorkspaceEl) {
        // Cache l'espace de création.
        designerWorkspaceEl.classList.add('hidden');
        designerWorkspaceEl.setAttribute('aria-hidden', 'true');
    }
    if (instructionsEl) {
        // Restaure les instructions normales.
        instructionsEl.innerHTML = defaultInstructionsHtml;
    }
    // Réactive la difficulté si nécessaire.
    syncDifficultyControlState();
}

/** Lance une partie classique depuis le menu. */
function startGameFromMenu() {
    // Passe en mode jeu.
    currentMode = 'play';
    // Retire les styles du concepteur.
    document.body.classList.remove('designer-mode');
    // Le puzzle généré n'est pas un niveau personnalisé.
    isCustomValidatedSession = false;

    // Cache tous les overlays de menu.
    if (modeMenuOverlayEl) modeMenuOverlayEl.classList.add('hidden');
    if (scoresOverlayEl) {
        scoresOverlayEl.classList.add('hidden');
        scoresOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (designerOverlayEl) {
        designerOverlayEl.classList.add('hidden');
        designerOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (designerWorkspaceEl) {
        designerWorkspaceEl.classList.add('hidden');
        designerWorkspaceEl.setAttribute('aria-hidden', 'true');
    }
    if (instructionsEl) {
        instructionsEl.innerHTML = defaultInstructionsHtml;
    }
    // La prochaine victoire pourra être sauvegardée.
    hasSavedWinScore = false;
    // La difficulté est modifiable en mode classique.
    syncDifficultyControlState();
    // Charge un puzzle classique en 6x6.
    loadNewPuzzle(CLASSIC_GRID_SIZE);
}

/** Ouvre l'écran de choix du concepteur. */
function openDesignerPlaceholder() {
    if (designerOverlayEl) {
        designerOverlayEl.classList.remove('hidden');
        designerOverlayEl.setAttribute('aria-hidden', 'false');
    }
    if (scoresOverlayEl) {
        scoresOverlayEl.classList.add('hidden');
        scoresOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (modeMenuOverlayEl) modeMenuOverlayEl.classList.add('hidden');
}

/** Ouvre l'overlay des scores. */
function openScoresOverlay() {
    // Les scores sont consultés depuis le menu.
    currentMode = 'menu';
    // Réinitialise le filtre à "tous".
    setScoresFilter('all');
    // Met le bouton de tri dans le bon état visuel.
    updateScoresSortButton();
    // Charge les scores seulement si on ne les a pas déjà.
    if (!hasLoadedScores) {
        loadUserScores();
    }

    // Affiche les scores et cache les autres overlays.
    if (scoresOverlayEl) {
        scoresOverlayEl.classList.remove('hidden');
        scoresOverlayEl.setAttribute('aria-hidden', 'false');
    }
    if (designerOverlayEl) {
        designerOverlayEl.classList.add('hidden');
        designerOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (modeMenuOverlayEl) modeMenuOverlayEl.classList.add('hidden');
}

/** Met à jour la taille choisie pour la prochaine grille du concepteur. */
function updateDesignerGridSelection(nextGrid) {
    // Garde une valeur par défaut si rien n'est fourni.
    selectedDesignerGrid = nextGrid || '4x4';
    // Mémorise le choix pour la prochaine visite.
    localStorage.setItem('neonzip_designer_grid', selectedDesignerGrid);

    // Met à jour le bouton actif.
    designerGridBtns.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.gridSize === selectedDesignerGrid);
    });

    // Met à jour le sous-titre explicatif.
    if (designerSubtitleEl) {
        designerSubtitleEl.textContent = `Choisis ta grille pour commencer la creation du niveau. Taille selectionnee: ${selectedDesignerGrid}.`;
    }
}

/** Active ou désactive le bouton de validation du concepteur. */
function updateDesignerValidateControls() {
    if (!designerValidateBtnEl || !designerValidateStatusEl) return;

    // Il faut au minimum deux chiffres pour construire une contrainte.
    const canValidate = gameState.numbers.length >= 2;
    // Bloque le bouton pendant la validation ou si le niveau est incomplet.
    designerValidateBtnEl.disabled = !canValidate || isDesignerValidating;

    if (isDesignerValidating) {
        // Message affiché pendant que le worker cherche une solution.
        designerValidateStatusEl.classList.remove('is-error', 'is-success');
        designerValidateStatusEl.textContent = 'Validation en cours...';
        return;
    }

    if (!canValidate) {
        // Message de départ quand il manque des chiffres.
        designerValidateStatusEl.classList.remove('is-error', 'is-success');
        designerValidateStatusEl.textContent = 'Place au moins 2 chiffres pour valider.';
    }
}

/** Affiche un message de statut dans le concepteur. */
function setDesignerStatus(message, kind = 'neutral') {
    if (!designerValidateStatusEl) return;
    // Nettoie les anciens états visuels.
    designerValidateStatusEl.classList.remove('is-error', 'is-success');
    // Applique éventuellement l'état erreur.
    if (kind === 'error') designerValidateStatusEl.classList.add('is-error');
    // Applique éventuellement l'état succès.
    if (kind === 'success') designerValidateStatusEl.classList.add('is-success');
    // Affiche le message demandé.
    designerValidateStatusEl.textContent = message;
}

function placeDesignerNumber(value, cellIndex) {
    // Convertit la valeur déposée ou sélectionnée en nombre.
    const numeric = Number(value);
    // Le concepteur autorise uniquement les chiffres de 1 à 10.
    if (!Number.isFinite(numeric) || numeric < 1 || numeric > 10) return;

    // Retire l'ancien emplacement du même chiffre et libère la cellule cible.
    gameState.numbers = gameState.numbers.filter((entry) => {
        return entry.value !== numeric && entry.index !== cellIndex;
    });

    // Ajoute le chiffre à son nouvel emplacement.
    gameState.numbers.push({ index: cellIndex, value: numeric });
    // Trie les chiffres pour garder un ordre logique 1, 2, 3...
    gameState.numbers.sort((a, b) => a.value - b.value);
    // Rafraîchit la grille et la palette.
    render();
}

/** Retire un chiffre du niveau personnalisé. */
function removeDesignerNumber(value) {
    // Convertit la valeur reçue depuis le DOM.
    const numeric = Number(value);
    // Ignore les valeurs invalides.
    if (!Number.isFinite(numeric)) return;
    // Supprime le chiffre correspondant.
    gameState.numbers = gameState.numbers.filter((entry) => entry.value !== numeric);
    // Rafraîchit l'affichage.
    render();
}

/** Retourne le chiffre placé dans une cellule du concepteur, s'il existe. */
function getDesignerNumberAtCell(cellIndex) {
    return gameState.numbers.find((entry) => entry.index === cellIndex) || null;
}

/** Synchronise la palette et les cellules déplaçables du concepteur. */
function syncDesignerPaletteState() {
    if (!designerNumberPaletteEl) return;

    // Récupère tous les boutons de chiffres.
    const chips = Array.from(designerNumberPaletteEl.querySelectorAll('.designer-number-chip[data-value]'));
    chips.forEach((chip) => {
        // Valeur numérique du bouton.
        const numeric = Number(chip.dataset.value);
        // Un chiffre déjà posé ne doit plus être repris depuis la palette.
        const isUsed = gameState.numbers.some((entry) => entry.value === numeric);
        // Classe visuelle pour montrer qu'il est utilisé.
        chip.classList.toggle('is-used', isUsed);
        // Désactive le drag depuis la palette quand le chiffre est déjà posé.
        chip.draggable = !isUsed;
        // Cache aux lecteurs d'écran les chiffres indisponibles.
        chip.setAttribute('aria-hidden', isUsed ? 'true' : 'false');
    });

    // Rend les cellules contenant un chiffre déplaçables.
    cellsElements.forEach((cellEl) => {
        const idx = Number(cellEl.dataset.index);
        const entry = getDesignerNumberAtCell(idx);
        cellEl.draggable = !!entry;
    });

    // Met à jour le bouton de validation selon le nombre de chiffres.
    updateDesignerValidateControls();
}

/** Retire l'effet visuel de cible de dépôt sur toutes les cellules. */
function clearDesignerDropTarget() {
    gridEl.querySelectorAll('.cell.designer-drop-target').forEach((cell) => {
        cell.classList.remove('designer-drop-target');
    });
}

/** Initialise l'espace de création d'un niveau personnalisé. */
function startDesignerMode() {
    // Passe en mode concepteur.
    currentMode = 'designer';
    // Ajoute une classe body pour adapter l'interface.
    document.body.classList.add('designer-mode');

    // Cache les overlays et affiche l'espace de travail.
    if (modeMenuOverlayEl) modeMenuOverlayEl.classList.add('hidden');
    if (designerOverlayEl) {
        designerOverlayEl.classList.add('hidden');
        designerOverlayEl.setAttribute('aria-hidden', 'true');
    }
    if (designerWorkspaceEl) {
        designerWorkspaceEl.classList.remove('hidden');
        designerWorkspaceEl.setAttribute('aria-hidden', 'false');
    }

    // Transforme "4x4" en taille numérique.
    const targetSize = parseGridSizeLabel(selectedDesignerGrid);
    // Applique cette taille à la configuration globale.
    setGridSize(targetSize);
    // Reconstruit la grille à la bonne taille.
    cellsElements = initGrid(gridEl);

    // Réinitialise toutes les données de jeu pour partir d'une grille vide.
    gameState.path = [];
    gameState.numbers = [];
    gameState.solutionPath = [];
    gameState.obstacles = [];
    uiState.isDrawing = false;
    uiState.hintTargetIndex = null;
    gameState.elapsedSeconds = 0;
    draggedDesignerValue = null;
    isDesignerValidating = false;
    isCustomValidatedSession = false;
    hasSavedWinScore = false;
    designerPickedValue = null;
    designerPickedFromIndex = null;

    // Stoppe et remet le chrono à zéro pour le concepteur.
    timer.stop();
    timer.reset((v) => { gameState.elapsedSeconds = v; });
    timerTextEl.textContent = '00:00';

    // Nettoie les overlays qui ne doivent pas apparaître dans le concepteur.
    if (loadingEl) loadingEl.classList.add('hidden');
    if (winOverlayEl) winOverlayEl.classList.add('hidden');

    // Affiche le nombre maximum de chiffres disponibles.
    if (maxNumEl) maxNumEl.textContent = String(Math.min(10, targetSize * targetSize));
    if (instructionsEl) {
        instructionsEl.innerHTML = `Mode concepteur: grille vide <strong>${targetSize}x${targetSize}</strong>. Glisse les chiffres de <strong>1</strong> a <strong>10</strong> dans les cases.`;
    }

    // Verrouille la difficulté et affiche la grille vide.
    syncDifficultyControlState();
    render();
}

function launchValidatedCustomLevel(solutionPath) {
    // Passe du concepteur au mode jeu.
    currentMode = 'play';
    // Retire l'apparence propre au concepteur.
    document.body.classList.remove('designer-mode');
    // Marque la partie comme issue d'un niveau personnalisé.
    isCustomValidatedSession = true;
    // Autorise la sauvegarde du score de cette nouvelle partie.
    hasSavedWinScore = false;

    // Cache l'espace de création.
    if (designerWorkspaceEl) {
        designerWorkspaceEl.classList.add('hidden');
        designerWorkspaceEl.setAttribute('aria-hidden', 'true');
    }

    // Restaure les instructions normales de jeu.
    if (instructionsEl) {
        instructionsEl.innerHTML = defaultInstructionsHtml;
    }

    // Prépare la partie avec la solution trouvée par le worker.
    gameState.path = [];
    gameState.solutionPath = Array.isArray(solutionPath) ? [...solutionPath] : [];
    gameState.obstacles = [];
    uiState.isDrawing = false;
    uiState.hintTargetIndex = null;
    gameState.elapsedSeconds = 0;

    // Remet le chrono à zéro avant que le joueur commence.
    timer.stop();
    timer.reset((v) => { gameState.elapsedSeconds = v; });
    timerTextEl.textContent = '00:00';
    // Cache les overlays inutiles.
    winOverlayEl.classList.add('hidden');
    loadingEl.classList.add('hidden');

    // Met à jour le maximum affiché.
    if (maxNumEl) {
        maxNumEl.textContent = String(gameState.solutionPath.length || Math.min(10, getGridSize() * getGridSize()));
    }

    // Verrouille la difficulté et affiche la partie.
    syncDifficultyControlState();
    render();
}

/** Demande au worker de vérifier si le niveau personnalisé est jouable. */
async function validateDesignerLevel() {
    // Sécurité : la validation n'a de sens qu'en mode concepteur avec un worker compatible.
    if (currentMode !== 'designer' || !puzzleWorker || typeof puzzleWorker.validateCustomLevel !== 'function') return;
    // Il faut au moins deux chiffres pour créer une contrainte.
    if (gameState.numbers.length < 2) return;

    // Affiche l'état de validation.
    isDesignerValidating = true;
    updateDesignerValidateControls();

    // Envoie les chiffres posés et la taille de grille au worker.
    const response = await puzzleWorker.validateCustomLevel(gameState.numbers, getGridSize());

    // La réponse est arrivée : on libère le bouton.
    isDesignerValidating = false;
    updateDesignerValidateControls();

    // Si le message de statut n'existe pas, on arrête proprement.
    if (!designerValidateStatusEl) return;

    // Niveau impossible : on affiche la raison donnée par le worker.
    if (!response || !response.feasible) {
        designerValidateStatusEl.classList.add('is-error');
        designerValidateStatusEl.classList.remove('is-success');
        designerValidateStatusEl.textContent = (response && response.reason) ? response.reason : 'Reessayer: le niveau est pas faisable.';
        return;
    }

    // Niveau possible : message de succès puis lancement.
    designerValidateStatusEl.classList.remove('is-error');
    designerValidateStatusEl.classList.add('is-success');
    designerValidateStatusEl.textContent = 'Niveau jouable ! Lancement de la partie...';

    // Lance la partie avec le chemin solution calculé.
    launchValidatedCustomLevel(response.solutionPath || []);
}

/* ---------- Interaction cellule ---------- */
function onCellInteraction(index) {
    // En mode concepteur, un clic sert à sélectionner, déplacer ou retirer un chiffre.
    if (currentMode === 'designer') {
        // Vérifie si la cellule cliquée contient déjà un chiffre.
        const existing = getDesignerNumberAtCell(index);

        if (existing) {
            // Cliquer deux fois sur le même chiffre le retire.
            if (designerPickedValue === existing.value && designerPickedFromIndex === index) {
                removeDesignerNumber(existing.value);
                setDesignerStatus(`Chiffre ${existing.value} retire de la grille.`);
                designerPickedValue = null;
                designerPickedFromIndex = null;
                updateDesignerValidateControls();
                return;
            }

            // Premier clic : sélection du chiffre à déplacer.
            designerPickedValue = existing.value;
            designerPickedFromIndex = index;
            setDesignerStatus(`Chiffre ${existing.value} selectionne. Clique sur une case pour le deplacer.`);
            return;
        }

        // Si un chiffre est sélectionné, un clic sur une case vide le déplace.
        if (designerPickedValue !== null) {
            placeDesignerNumber(designerPickedValue, index);
            setDesignerStatus(`Chiffre ${designerPickedValue} deplace.`);
            designerPickedValue = null;
            designerPickedFromIndex = null;
        }

        return;
    }

    // En mode jeu, chaque interaction annule l'indice visuel précédent.
    uiState.hintTargetIndex = null;
    hintTextEl.textContent = 'Indice: clique pour voir le premier déplacement conseillé.';
    // Délègue les règles de tracé au module de logique pure.
    handleCellInteraction(index, gameState, uiState, startTimerIfNeeded);
    // Rafraîchit la grille après la tentative de mouvement.
    render();
}

/** Donne une direction lisible entre deux cellules voisines. */
function directionLabel(fromIdx, toIdx) {
    // Taille nécessaire pour détecter haut/bas.
    const gridSize = getGridSize();
    // Différence d'index entre les deux cases.
    const diff = toIdx - fromIdx;
    // Même colonne, ligne précédente.
    if (diff === -gridSize) return 'haut';
    // Même colonne, ligne suivante.
    if (diff === gridSize) return 'bas';
    // Même ligne, colonne précédente.
    if (diff === -1) return 'gauche';
    // Même ligne, colonne suivante.
    if (diff === 1) return 'droite';
    // Fallback si les cases ne sont pas voisines.
    return 'case voisine';
}

/** Affiche le prochain déplacement conseillé au joueur. */
function showHint() {
    // L'indice n'est pas utile en mode création.
    if (currentMode === 'designer') {
        return;
    }

    // Récupère le chemin solution.
    const solution = gameState.solutionPath;
    // Sans solution complète, aucun indice fiable n'est possible.
    if (!Array.isArray(solution) || solution.length < 2) {
        hintTextEl.textContent = 'Indice indisponible: puzzle non chargé.';
        return;
    }

    // Case de départ de l'indice.
    let fromIdx = null;
    // Case cible de l'indice.
    let toIdx = null;

    // Si le joueur n'a pas commencé, on conseille le premier mouvement.
    if (gameState.path.length === 0) {
        fromIdx = solution[0];
        toIdx = solution[1];
        hintTextEl.textContent = `Commence par la case 1 puis va vers ${directionLabel(fromIdx, toIdx)}.`;
    } else {
        // Sinon on part de la tête actuelle du chemin.
        const head = gameState.path[gameState.path.length - 1];
        // Retrouve cette tête dans la solution.
        const pos = solution.indexOf(head);
        if (pos < 0 || pos >= solution.length - 1) {
            // Si la position n'est pas dans la solution ou déjà à la fin, aucun indice.
            hintTextEl.textContent = 'Indice indisponible depuis cette position.';
            uiState.hintTargetIndex = null;
            render();
            return;
        }

        fromIdx = head;
        toIdx = solution[pos + 1];
        hintTextEl.textContent = `Prochain déplacement conseillé: ${directionLabel(fromIdx, toIdx)}.`;
    }

    // Surligne la case cible de l'indice.
    uiState.hintTargetIndex = toIdx;
    // Rafraîchit la grille pour afficher la surbrillance.
    render();
}

/* ---------- Événements ---------- */
bindGridPointerEvents(gridEl, {
    // Callback appelé quand une cellule est cliquée, survolée ou touchée.
    onCellInteraction,
    // À la fin d'un geste, on arrête le dessin.
    onPointerStop: () => { uiState.isDrawing = false; },
    // Le module grille demande à main.js si le joueur est en train de dessiner.
    canDraw: () => uiState.isDrawing,
});

// Active le drag and drop depuis la palette du concepteur.
if (designerNumberPaletteEl) {
    designerNumberPaletteEl.addEventListener('dragstart', (event) => {
        // Vérifie que la cible est un élément DOM.
        const target = event.target instanceof Element ? event.target : null;
        // Cherche le bouton chiffre le plus proche.
        const chip = target ? target.closest('.designer-number-chip[data-value]') : null;
        // Si ce n'est pas un chiffre, on ignore.
        if (!chip) return;
        // Mémorise la valeur déplacée.
        draggedDesignerValue = chip.dataset.value;
        // Annule une éventuelle sélection au clic.
        designerPickedValue = null;
        designerPickedFromIndex = null;
        // Configure les données de drag pour le navigateur.
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', chip.dataset.value);
            event.dataTransfer.effectAllowed = 'copy';
        }
    });

    designerNumberPaletteEl.addEventListener('dragover', (event) => {
        // La palette accepte les dépôts seulement en mode concepteur.
        if (currentMode !== 'designer') return;
        // Autorise le drop.
        event.preventDefault();
        // Ajoute un style visuel de cible.
        designerNumberPaletteEl.classList.add('is-drop-target');
    });

    designerNumberPaletteEl.addEventListener('dragleave', () => {
        // Retire le style quand on sort de la palette.
        designerNumberPaletteEl.classList.remove('is-drop-target');
    });

    designerNumberPaletteEl.addEventListener('drop', (event) => {
        // La palette sert à retirer un chiffre seulement en mode concepteur.
        if (currentMode !== 'designer') return;
        event.preventDefault();

        // Récupère la valeur depuis dataTransfer ou depuis la variable de secours.
        const transferValue = event.dataTransfer ? event.dataTransfer.getData('text/plain') : '';
        const value = transferValue || draggedDesignerValue;
        if (value) {
            // Déposer un chiffre sur la palette le supprime de la grille.
            removeDesignerNumber(value);
        }

        // Nettoie l'état visuel et logique du drag.
        designerNumberPaletteEl.classList.remove('is-drop-target');
        draggedDesignerValue = null;
    });

    designerNumberPaletteEl.addEventListener('dragend', () => {
        // Nettoyage systématique à la fin du drag, même si aucun drop n'a eu lieu.
        draggedDesignerValue = null;
        clearDesignerDropTarget();
        designerNumberPaletteEl.classList.remove('is-drop-target');
    });
}

// Active le drag and drop depuis les cellules déjà remplies.
gridEl.addEventListener('dragstart', (event) => {
    // Déplacer une cellule n'a de sens qu'en mode concepteur.
    if (currentMode !== 'designer') return;
    // Vérifie la cible DOM.
    const target = event.target instanceof Element ? event.target : null;
    // Récupère la cellule concernée.
    const cell = target ? target.closest('.cell[data-index]') : null;
    if (!cell) return;

    // Convertit l'index de cellule.
    const index = Number(cell.dataset.index);
    // Cherche le chiffre présent dans cette cellule.
    const numberEntry = getDesignerNumberAtCell(index);
    if (!numberEntry) {
        // Une cellule vide ne doit pas être déplacée.
        event.preventDefault();
        return;
    }

    // Mémorise la valeur déplacée.
    draggedDesignerValue = String(numberEntry.value);
    // Annule une éventuelle sélection au clic.
    designerPickedValue = null;
    designerPickedFromIndex = null;

    // Configure le déplacement pour le navigateur.
    if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', draggedDesignerValue);
        event.dataTransfer.effectAllowed = 'move';
    }
});

gridEl.addEventListener('dragover', (event) => {
    // Seul le concepteur accepte les dépôts sur la grille.
    if (currentMode !== 'designer') return;
    // Récupère la cellule sous le curseur.
    const target = event.target instanceof Element ? event.target : null;
    const cell = target ? target.closest('.cell[data-index]') : null;
    if (!cell) return;
    // Autorise le dépôt.
    event.preventDefault();
    // Garde une seule cible visuelle à la fois.
    clearDesignerDropTarget();
    cell.classList.add('designer-drop-target');
});

gridEl.addEventListener('dragleave', (event) => {
    // Retire le style de cible quand le curseur quitte une cellule.
    const target = event.target instanceof Element ? event.target : null;
    const cell = target ? target.closest('.cell[data-index]') : null;
    if (!cell) return;
    cell.classList.remove('designer-drop-target');
});

gridEl.addEventListener('drop', (event) => {
    // Le dépôt sur grille est réservé au mode concepteur.
    if (currentMode !== 'designer') return;
    // Récupère la cellule cible.
    const target = event.target instanceof Element ? event.target : null;
    const cell = target ? target.closest('.cell[data-index]') : null;
    if (!cell) return;

    // Empêche le comportement par défaut du navigateur.
    event.preventDefault();

    // Récupère la valeur déposée.
    const transferValue = event.dataTransfer ? event.dataTransfer.getData('text/plain') : '';
    const value = transferValue || draggedDesignerValue;
    // Convertit la cellule cible en index numérique.
    const index = Number(cell.dataset.index);

    // Place le chiffre sur la cellule cible.
    placeDesignerNumber(value, index);
    // Retire le style de cible.
    cell.classList.remove('designer-drop-target');
    // Informe l'utilisateur.
    setDesignerStatus(`Chiffre ${value} place.`);
    // Nettoie la valeur temporaire.
    draggedDesignerValue = null;
});

// Bouton "Recommencer" de la barre d'action.
document.getElementById('reset').addEventListener('click', () => {
    timer.stop();
    resetGame();
});

// Bouton "Nouveau Puzzle".
document.getElementById('new-puzzle').addEventListener('click', loadNewPuzzle);
// Bouton d'indice.
hintBtnEl.addEventListener('click', showHint);
if (overlayNewPuzzleBtnEl) {
    overlayNewPuzzleBtnEl.addEventListener('click', () => {
        // Après un niveau personnalisé, ce bouton ramène au menu.
        if (isCustomValidatedSession) {
            winOverlayEl.classList.add('hidden');
            openModeMenu();
            return;
        }
        // En mode classique, il génère un autre puzzle.
        loadNewPuzzle();
    });
}

if (overlayResetBtnEl) {
    overlayResetBtnEl.addEventListener('click', () => {
        // Cache la victoire.
        winOverlayEl.classList.add('hidden');
        // Arrête le chrono.
        timer.stop();
        // Vide uniquement le tracé, sans changer le puzzle.
        gameState.path = [];
        // Arrête le mode dessin.
        uiState.isDrawing = false;
        // Retire l'indice visuel.
        uiState.hintTargetIndex = null;
        // Restaure le texte d'indice.
        hintTextEl.textContent = 'Indice: clique pour voir le premier déplacement conseillé.';
        // Remet le chrono à zéro.
        timer.reset((v) => { gameState.elapsedSeconds = v; });
        // Rafraîchit la grille.
        render();
    });
}

if (overlayQuitBtnEl) {
    overlayQuitBtnEl.addEventListener('click', () => {
        // Quitter ferme l'overlay, stoppe le chrono et revient au menu.
        winOverlayEl.classList.add('hidden');
        timer.stop();
        openModeMenu();
    });
}

difficultyEl.addEventListener('change', () => {
    // La difficulté ne peut pas changer pendant un niveau personnalisé.
    if (currentMode === 'designer' || isCustomValidatedSession) {
        difficultyEl.value = gameState.difficulty || 'medium';
        return;
    }
    // En mode classique, un changement de difficulté régénère un puzzle.
    loadNewPuzzle();
});

if (menuPlayBtnEl) {
    // Lance une partie classique.
    menuPlayBtnEl.addEventListener('click', startGameFromMenu);
}

if (menuScoresBtnEl) {
    // Ouvre l'historique des scores.
    menuScoresBtnEl.addEventListener('click', openScoresOverlay);
}

if (menuDesignerBtnEl) {
    // Ouvre le choix de taille du concepteur.
    menuDesignerBtnEl.addEventListener('click', openDesignerPlaceholder);
}

if (scoresBackBtnEl) {
    // Retour au menu depuis l'écran scores.
    scoresBackBtnEl.addEventListener('click', openModeMenu);
}

scoresFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // Applique le filtre stocké dans data-filter.
        setScoresFilter(btn.dataset.filter || 'all');
    });
});

if (scoresSortBtnEl) {
    // Inverse le tri des scores.
    scoresSortBtnEl.addEventListener('click', toggleScoresSortDirection);
}

if (designerBackBtnEl) {
    // Retour au menu depuis l'écran de choix du concepteur.
    designerBackBtnEl.addEventListener('click', openModeMenu);
}

if (designerPlayBtnEl) {
    // Ouvre la grille vide du concepteur.
    designerPlayBtnEl.addEventListener('click', startDesignerMode);
}

if (designerExitBtnEl) {
    // Quitte l'espace de création.
    designerExitBtnEl.addEventListener('click', openModeMenu);
}

if (designerValidateBtnEl) {
    // Valide le niveau personnalisé.
    designerValidateBtnEl.addEventListener('click', validateDesignerLevel);
}

designerGridBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // Met à jour la taille choisie à partir de data-grid-size.
        updateDesignerGridSelection(btn.dataset.gridSize || '4x4');
    });
});

/* ---------- Démarrage ---------- */
// Initialise le texte du chrono au chargement de la page.
timerTextEl.textContent = '00:00';
// Applique la sélection de grille sauvegardée du concepteur.
updateDesignerGridSelection(selectedDesignerGrid);
// Initialise l'état du bouton de validation.
updateDesignerValidateControls();
// Synchronise l'état du select de difficulté.
syncDifficultyControlState();
// Affiche le menu principal au démarrage.
openModeMenu();
