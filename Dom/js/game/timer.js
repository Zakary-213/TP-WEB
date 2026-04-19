/**
 * timer.js – Chronomètre découplé de l'UI.
 * Retourne un objet avec start / stop / reset / isRunning.
 */

/**
 * @param {(seconds: number) => void} onTick – Appelé chaque seconde avec la valeur courante.
 */
export function createTimer(onTick) {
    // Identifiant retourné par setInterval ; null signifie que le chrono est arrêté.
    let intervalId = null;

    /**
     * Démarre le chrono.
     * @param {() => number} getSeconds – Getter de la valeur courante.
     * @param {(v: number) => void} setSeconds – Setter.
     */
    function start(getSeconds, setSeconds) {
        // Empêche de lancer plusieurs intervalles en parallèle.
        if (intervalId) return;
        // Incrémente le temps toutes les secondes.
        intervalId = setInterval(() => {
            // Lit la valeur depuis l'état du jeu pour rester synchronisé avec main.js.
            const next = getSeconds() + 1;
            // Sauvegarde la nouvelle valeur dans l'état partagé.
            setSeconds(next);
            // Préviens l'interface pour mettre à jour l'affichage du chrono.
            onTick(next);
        }, 1000);
    }

    /** Arrête le chrono (conserve la valeur). */
    function stop() {
        // Si aucun intervalle n'existe, il n'y a rien à arrêter.
        if (!intervalId) return;
        // Coupe l'intervalle JavaScript.
        clearInterval(intervalId);
        // Repasse à null pour indiquer que le timer n'est plus actif.
        intervalId = null;
    }

    /**
     * Remet à zéro et arrête.
     * @param {(v: number) => void} setSeconds
     */
    function reset(setSeconds) {
        // Stoppe d'abord le timer pour éviter qu'il reparte pendant la remise à zéro.
        stop();
        // Réinitialise la valeur stockée dans l'état du jeu.
        setSeconds(0);
        // Force l'interface à afficher immédiatement 00:00.
        onTick(0);
    }

    /** Indique si le chrono tourne actuellement. */
    function isRunning() {
        // intervalId vaut null uniquement quand aucun setInterval n'est actif.
        return intervalId !== null;
    }

    // Expose uniquement les actions utiles au reste du jeu.
    return { start, stop, reset, isRunning };
}
