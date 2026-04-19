// Fonction saveScoreToDB : elle regroupe le traitement de cette partie.
export async function saveScoreToDB(scoreData) {
    // Valeur mémorisée dans userId.
    const userId =
        // Instruction nécessaire au déroulement de cette partie.
        (window.CANVAS_API && typeof window.CANVAS_API.getUserId === 'function'
            // Appel de getUserId pour appliquer l'action prévue.
            ? window.CANVAS_API.getUserId()
            // Appel de getItem pour appliquer l'action prévue.
            : localStorage.getItem('tpweb_user_id'));

    // Vérification avant d'exécuter la suite.
    if (!userId) {
        // Appel de warn pour appliquer l'action prévue.
        console.warn("Utilisateur non connecté, score non sauvegardé sur le serveur.");
        // Résultat renvoyé par la fonction.
        return { success: false, message: "User not logged in" };
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans safeData.
    const safeData = scoreData || {};
    // Valeur mémorisée dans minuteButs.
    const minuteButs = Array.isArray(safeData.minuteButs) ? safeData.minuteButs : [];
    // Valeur mémorisée dans minuteButsAdversaire.
    const minuteButsAdversaire = Array.isArray(safeData.minuteButsAdversaire)
        // Instruction nécessaire au déroulement de cette partie.
        ? safeData.minuteButsAdversaire
        // Instruction nécessaire au déroulement de cette partie.
        : [];

    // Valeur mémorisée dans totalButs.
    const totalButs = Number.isFinite(Number(safeData.totalButs)) ? Number(safeData.totalButs) : 0;
    // Valeur mémorisée dans totalButsAdversaire.
    const totalButsAdversaire = Number.isFinite(Number(safeData.totalButsAdversaire))
        // Appel de Number pour appliquer l'action prévue.
        ? Number(safeData.totalButsAdversaire)
        // Instruction nécessaire au déroulement de cette partie.
        : 0;

    // Valeur mémorisée dans result.
    const result = safeData.result || safeData.Résultat || 'draw';

    // Valeur mémorisée dans payload.
    const payload = {
        // Paramètre de l'appel ou valeur de configuration.
        userId,
        // Paramètre de l'appel ou valeur de configuration.
        game: 'gamesonweb',
        // Paramètre de l'appel ou valeur de configuration.
        mode: safeData.mode || '1v1',
        // Le backend /api/scores/scorecanvas exige totalTime; on le dérive du dernier but.
        // Appel de max pour appliquer l'action prévue.
        totalTime: Math.max(
            // Paramètre de l'appel ou valeur de configuration.
            0,
            // Appel de map pour appliquer l'action prévue.
            ...minuteButs.map((m) => Number(m) || 0),
            // Appel de map pour appliquer l'action prévue.
            ...minuteButsAdversaire.map((m) => Number(m) || 0)
        // Paramètre de l'appel ou valeur de configuration.
        ) * 60000,
        // Champ requis dans Score existant, réutilisé ici pour éviter de casser l'API actuelle.
        // Paramètre de l'appel ou valeur de configuration.
        totalMeteorites: totalButs,
        // Ouverture du bloc correspondant.
        data: {
            // Paramètre de l'appel ou valeur de configuration.
            result,
            // Paramètre de l'appel ou valeur de configuration.
            totalButs,
            // Paramètre de l'appel ou valeur de configuration.
            totalButsAdversaire,
            // Paramètre de l'appel ou valeur de configuration.
            minuteButs,
            // Paramètre de l'appel ou valeur de configuration.
            minuteButsAdversaire,
            // Instruction nécessaire au déroulement de cette partie.
            ...safeData
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    };

    // Fonction toUrl : elle regroupe le traitement de cette partie.
    const toUrl = (path) => {
        // Vérification avant d'exécuter la suite.
        if (window.CANVAS_API && typeof window.CANVAS_API.toUrl === 'function') {
            // Résultat renvoyé par la fonction.
            return window.CANVAS_API.toUrl(path);
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return path;
    // Fermeture du bloc ou de l'appel.
    };


     // Partie protégée en cas d'erreur.
     try {
        // Valeur mémorisée dans response.
        const response = await fetch(toUrl('/api/scores/scoregow'), {
            // Paramètre de l'appel ou valeur de configuration.
            method: 'POST',
            // Paramètre de l'appel ou valeur de configuration.
            headers: { 'Content-Type': 'application/json' },
            // Appel de stringify pour appliquer l'action prévue.
            body: JSON.stringify(payload)
        // Fermeture du bloc ou de l'appel.
        });

        // Valeur mémorisée dans rawBody.
        const rawBody = await response.text();
        // Valeur mémorisée dans parsedBody.
        let parsedBody = null;

        // Vérification avant d'exécuter la suite.
        if (rawBody) {
            // Partie protégée en cas d'erreur.
            try {
                // Appel de parse pour appliquer l'action prévue.
                parsedBody = JSON.parse(rawBody);
            // Gestion de l'erreur si le try échoue.
            } catch (parseError) {
                // Instruction nécessaire au déroulement de cette partie.
                parsedBody = null;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!response.ok) {
            // Résultat renvoyé par la fonction.
            return {
                // Paramètre de l'appel ou valeur de configuration.
                success: false,
                // Paramètre de l'appel ou valeur de configuration.
                status: response.status,
                // Instruction nécessaire au déroulement de cette partie.
                error: parsedBody?.message || parsedBody?.error || rawBody || `HTTP ${response.status}`
            // Fermeture du bloc ou de l'appel.
            };
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return parsedBody || { success: true };
    // Gestion de l'erreur si le try échoue.
    } catch (error) {
        // Appel de error pour appliquer l'action prévue.
        console.error("Erreur lors de la sauvegarde du score sur le serveur:", error);
        // Résultat renvoyé par la fonction.
        return { success: false, error: error.message };
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
};

