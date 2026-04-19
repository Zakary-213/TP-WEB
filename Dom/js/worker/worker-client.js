/**
 * worker-client.js – Interface entre main.js et le Web Worker de génération.
 * Le chemin vers worker.js est relatif à index.html (pas à ce module).
 */

/**
 * @param {(result: {solutionPath: number[], numbers: {index:number,value:number}[]}) => void} onPuzzleReady
 * @param {(msg: string) => void} onError
 */
export function createPuzzleWorker(onPuzzleReady, onError) {
    // Le Worker est chargé depuis le contexte de la page (Dom/) – pas du module.
    const worker = new Worker('worker.js');
    // Map des validations de niveaux personnalisés en attente de réponse.
    const pendingValidations = new Map();
    // Compteur unique pour relier chaque réponse de validation à sa requête.
    let requestId = 0;

    // Reçoit tous les messages envoyés par worker.js.
    worker.onmessage = (e) => {
        // Réponse à une demande de génération de puzzle classique.
        if (e.data.type === 'PUZZLE_RESULT') {
            // Récupère les données générées : solution, chiffres et obstacles.
            const result = e.data.payload;
            // Sécurité : un puzzle sans solution n'est pas jouable.
            if (!result || !result.solutionPath || result.solutionPath.length === 0) {
                onError('Impossible de générer un puzzle. Veuillez réessayer.');
                return;
            }
            // Transmet le puzzle complet à main.js.
            onPuzzleReady(result);
            return;
        }

        // Réponse à une validation de niveau créé par l'utilisateur.
        if (e.data.type === 'CUSTOM_LEVEL_VALIDATION_RESULT') {
            // Charge le payload, même s'il est absent, pour éviter une erreur JavaScript.
            const payload = e.data.payload || {};
            // Retrouve la Promise qui attend cette réponse.
            const pending = pendingValidations.get(payload.requestId);
            if (pending) {
                // Nettoie la Map pour éviter d'accumuler des callbacks inutiles.
                pendingValidations.delete(payload.requestId);
                // Résout la Promise avec le résultat de validation.
                pending(payload);
            }
        }
    };

    // Gestion des erreurs non interceptées dans le worker.
    worker.onerror = (err) => {
        // Log complet pour le développeur.
        console.error('[Worker Error]', err);
        // Message simple pour l'interface utilisateur.
        onError('Erreur dans le Worker. Vérifiez la console.');
    };

    /**
     * Demande la génération d'un nouveau puzzle.
     * @param {'easy'|'medium'|'hard'} difficulty
     * @param {number} gridSize
     */
    function loadPuzzle(difficulty = 'medium', gridSize = 6) {
        // Envoie la demande au worker pour ne pas bloquer l'interface.
        worker.postMessage({ type: 'GENERATE_PUZZLE', difficulty, gridSize });
    }

    /** Demande au worker si un niveau personnalisé est faisable. */
    function validateCustomLevel(numbers = [], gridSize = 6) {
        // La validation est asynchrone : on retourne une Promise.
        return new Promise((resolve) => {
            // Crée un identifiant unique pour cette validation.
            requestId += 1;
            // Stocke l'id dans une variable lisible.
            const id = requestId;
            // Enregistre le resolve pour l'appeler quand le worker répondra.
            pendingValidations.set(id, resolve);

            // Envoie les chiffres placés et la taille de grille au worker.
            worker.postMessage({
                type: 'VALIDATE_CUSTOM_LEVEL',
                requestId: id,
                numbers,
                gridSize,
            });
        });
    }

    // API minimale exposée à main.js.
    return { loadPuzzle, validateCustomLevel };
}
