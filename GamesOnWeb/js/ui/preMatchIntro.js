// js/ui/preMatchIntro.js
// Intro caméra simple: vue large du stade puis transition vers la caméra de match.

// Appel de function pour appliquer l'action prévue.
(function () {
    // Valeur mémorisée dans hideTextTimer.
    let hideTextTimer = null;
    // Valeur mémorisée dans removeTextTimer.
    let removeTextTimer = null;
    // Valeur mémorisée dans introSkipBtn.
    let introSkipBtn = null;
    // Valeur mémorisée dans introState.
    let introState = null;

    // Fonction ensureIntroSkipButton : elle regroupe le traitement de cette partie.
    function ensureIntroSkipButton() {
        // Vérification avant d'exécuter la suite.
        if (introSkipBtn) return;
        // Appel de getElementById pour appliquer l'action prévue.
        introSkipBtn = document.getElementById("intro-skip-btn");
        // Vérification avant d'exécuter la suite.
        if (!introSkipBtn) {
            // Appel de createElement pour appliquer l'action prévue.
            introSkipBtn = document.createElement("button");
            // Mise à jour de id.
            introSkipBtn.id   = "intro-skip-btn";
            // Mise à jour de type.
            introSkipBtn.type = "button";
            // Mise à jour de textContent.
            introSkipBtn.textContent = "Passer l'intro";
            // Appel de appendChild pour appliquer l'action prévue.
            document.body.appendChild(introSkipBtn);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setIntroSkipVisible : elle regroupe le traitement de cette partie.
    function setIntroSkipVisible(visible) {
        // Vérification avant d'exécuter la suite.
        if (!introSkipBtn) return;
        // Appel de toggle pour appliquer l'action prévue.
        introSkipBtn.classList.toggle("replay-skip-btn--show", !!visible);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction clearTournamentOverlayTimers : elle regroupe le traitement de cette partie.
    function clearTournamentOverlayTimers() {
        // Vérification avant d'exécuter la suite.
        if (hideTextTimer) {
            // Appel de clearTimeout pour appliquer l'action prévue.
            window.clearTimeout(hideTextTimer);
            // Instruction nécessaire au déroulement de cette partie.
            hideTextTimer = null;
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (removeTextTimer) {
            // Appel de clearTimeout pour appliquer l'action prévue.
            window.clearTimeout(removeTextTimer);
            // Instruction nécessaire au déroulement de cette partie.
            removeTextTimer = null;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction hideTournamentOverlayImmediate : elle regroupe le traitement de cette partie.
    function hideTournamentOverlayImmediate() {
        // Récupération de l'élément HTML tournamentOverlay.
        const tournamentOverlay = document.getElementById("pre-match-tournament-overlay");
        // Vérification avant d'exécuter la suite.
        if (!tournamentOverlay) return;

        // Appel de remove pour appliquer l'action prévue.
        tournamentOverlay.classList.remove("pre-match-tournament--show", "pre-match-tournament--hide");
        // Mise à jour de display.
        tournamentOverlay.style.display = "none";
        // Mise à jour de opacity.
        tournamentOverlay.style.opacity = "0";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction showTournamentOverlayBanner : elle regroupe le traitement de cette partie.
    function showTournamentOverlayBanner(tournamentLabel, options) {
        // Valeur mémorisée dans config.
        const config = options || {};
        // Valeur mémorisée dans durationMs.
        const durationMs = Number.isFinite(config.durationMs) ? config.durationMs : 1400;
        // Valeur mémorisée dans showDelayMs.
        const showDelayMs = Number.isFinite(config.showDelayMs) ? config.showDelayMs : 0;
        // Valeur mémorisée dans textAnimationDurationMs.
        const textAnimationDurationMs = Number.isFinite(config.textAnimationDurationMs)
            // Instruction nécessaire au déroulement de cette partie.
            ? config.textAnimationDurationMs
            // Instruction nécessaire au déroulement de cette partie.
            : 3600;
        // Valeur mémorisée dans forceFinaleLike.
        const forceFinaleLike = !!config.forceFinaleLike;
        // Valeur mémorisée dans visibleWindow.
        const visibleWindow = Number.isFinite(config.visibleWindowMs)
            // Instruction nécessaire au déroulement de cette partie.
            ? config.visibleWindowMs
            // Appel de max pour appliquer l'action prévue.
            : Math.max(800, durationMs - showDelayMs - 900);

        // Récupération de l'élément HTML tournamentOverlay.
        const tournamentOverlay = document.getElementById("pre-match-tournament-overlay");
        // Récupération de l'élément HTML tournamentHead.
        const tournamentHead = document.getElementById("pre-match-tournament-head");
        // Récupération de l'élément HTML tournamentTail.
        const tournamentTail = document.getElementById("pre-match-tournament-tail");
        // Récupération de l'élément HTML tournamentTailText.
        const tournamentTailText = document.getElementById("pre-match-tournament-tail-text");

        // Vérification avant d'exécuter la suite.
        if (!tournamentOverlay || !tournamentHead || !tournamentTail || !tournamentTailText) {
            // Vérification avant d'exécuter la suite.
            if (typeof config.onComplete === "function") config.onComplete();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de clearTournamentOverlayTimers pour appliquer l'action prévue.
        clearTournamentOverlayTimers();

        // Valeur mémorisée dans normalizedLabel.
        const normalizedLabel = String(tournamentLabel || "Replay")
            // Appel de toUpperCase pour appliquer l'action prévue.
            .toUpperCase()
            // Appel de replace pour appliquer l'action prévue.
            .replace(/-/g, " ")
            // Appel de replace pour appliquer l'action prévue.
            .replace(/\s+/g, " ")
            // Appel de trim pour appliquer l'action prévue.
            .trim();

        // Valeur mémorisée dans headText.
        let headText = "";
        // Valeur mémorisée dans tailText.
        let tailText = "";

        // Vérification avant d'exécuter la suite.
        if (forceFinaleLike || normalizedLabel === "FINALE" || normalizedLabel === "REPLAY") {
            // Instruction nécessaire au déroulement de cette partie.
            headText = "";
            // Instruction nécessaire au déroulement de cette partie.
            tailText = normalizedLabel;
        // Deuxième possibilité à tester.
        } else if (normalizedLabel.includes("DEMI") && normalizedLabel.includes("FINALE")) {
            // Instruction nécessaire au déroulement de cette partie.
            headText = "DEMI";
            // Instruction nécessaire au déroulement de cette partie.
            tailText = "FINALE";
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Valeur mémorisée dans words.
            const words = normalizedLabel.split(" ").filter(Boolean);
            // Instruction nécessaire au déroulement de cette partie.
            headText = words[0] || "HUITIEME";
            // Appel de slice pour appliquer l'action prévue.
            tailText = words.slice(1).join(" ") || "DE FINALE";
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de textContent.
        tournamentHead.textContent = headText;
        // Mise à jour de textContent.
        tournamentTailText.textContent = tailText;
        // Mise à jour de display.
        tournamentHead.style.display = headText ? "inline-block" : "none";
        // Mise à jour de marginLeft.
        tournamentTail.style.marginLeft = headText ? "10px" : "0";

        // Appel de setTimeout pour appliquer l'action prévue.
        hideTextTimer = window.setTimeout(function () {
            // Mise à jour de display.
            tournamentOverlay.style.display = "block";
            // Mise à jour de visibility.
            tournamentOverlay.style.visibility = "hidden";
            // Appel de setProperty pour appliquer l'action prévue.
            tournamentOverlay.style.setProperty("--pre-match-text-duration", `${textAnimationDurationMs}ms`);
            // Valeur mémorisée dans revealWidth.
            const revealWidth = Math.max(1, Math.ceil(tournamentTailText.getBoundingClientRect().width));
            // Appel de setProperty pour appliquer l'action prévue.
            tournamentTail.style.setProperty("--reveal-width", `${revealWidth}px`);
            // Appel de setProperty pour appliquer l'action prévue.
            tournamentTail.style.setProperty("--slide-start", `${-revealWidth}px`);
            // Mise à jour de visibility.
            tournamentOverlay.style.visibility = "visible";

            // Appel de remove pour appliquer l'action prévue.
            tournamentOverlay.classList.remove("pre-match-tournament--show", "pre-match-tournament--hide");
            // Instruction nécessaire au déroulement de cette partie.
            void tournamentOverlay.offsetWidth;
            // Appel de add pour appliquer l'action prévue.
            tournamentOverlay.classList.add("pre-match-tournament--show");

            // Appel de setTimeout pour appliquer l'action prévue.
            removeTextTimer = window.setTimeout(function () {
                // Appel de remove pour appliquer l'action prévue.
                tournamentOverlay.classList.remove("pre-match-tournament--show");
                // Appel de add pour appliquer l'action prévue.
                tournamentOverlay.classList.add("pre-match-tournament--hide");

                // Appel de setTimeout pour appliquer l'action prévue.
                window.setTimeout(function () {
                    // Appel de hideTournamentOverlayImmediate pour appliquer l'action prévue.
                    hideTournamentOverlayImmediate();
                    // Appel de clearTournamentOverlayTimers pour appliquer l'action prévue.
                    clearTournamentOverlayTimers();
                    // Vérification avant d'exécuter la suite.
                    if (typeof config.onComplete === "function") config.onComplete();
                // Instruction nécessaire au déroulement de cette partie.
                }, 560);
            // Instruction nécessaire au déroulement de cette partie.
            }, visibleWindow);
        // Instruction nécessaire au déroulement de cette partie.
        }, showDelayMs);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction startPreMatchIntro : elle regroupe le traitement de cette partie.
    function startPreMatchIntro(scene, cameras, enabledOrOptions, maybeOptions) {
        // Valeur mémorisée dans enabled.
        const enabled = typeof enabledOrOptions === "boolean" ? enabledOrOptions : true;
        // Valeur mémorisée dans config.
        const config = (typeof enabledOrOptions === "object" && enabledOrOptions !== null)
            // Instruction nécessaire au déroulement de cette partie.
            ? enabledOrOptions
            // Instruction nécessaire au déroulement de cette partie.
            : (maybeOptions || {});
        // Valeur mémorisée dans durationMs.
        const durationMs = Number.isFinite(config.durationMs) ? config.durationMs : 5000;
        // Valeur mémorisée dans rotationTurns.
        const rotationTurns = Number.isFinite(config.rotationTurns) ? config.rotationTurns : 1;
        // Valeur mémorisée dans tournamentLabel.
        const tournamentLabel = typeof config.tournamentLabel === "string" && config.tournamentLabel.trim().length > 0
            // Appel de trim pour appliquer l'action prévue.
            ? config.tournamentLabel.trim()
            // Instruction nécessaire au déroulement de cette partie.
            : "Huitieme de finale";

        // Vérification avant d'exécuter la suite.
        if (!scene || !cameras) {
            // Appel de clearTournamentOverlayTimers pour appliquer l'action prévue.
            clearTournamentOverlayTimers();
            // Appel de hideTournamentOverlayImmediate pour appliquer l'action prévue.
            hideTournamentOverlayImmediate();
            // Vérification avant d'exécuter la suite.
            if (typeof config.onComplete === "function") config.onComplete();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans introCamera.
        const introCamera = cameras.broadcastCamera || cameras.tpsCamera;
        // Valeur mémorisée dans finalCamera.
        const finalCamera = cameras.broadcastCamera || cameras.tpsCamera || introCamera;

        // Vérification avant d'exécuter la suite.
        if (!introCamera) {
            // Appel de clearTournamentOverlayTimers pour appliquer l'action prévue.
            clearTournamentOverlayTimers();
            // Appel de hideTournamentOverlayImmediate pour appliquer l'action prévue.
            hideTournamentOverlayImmediate();
            // Vérification avant d'exécuter la suite.
            if (typeof config.onComplete === "function") config.onComplete();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!enabled) {
            // Mise à jour de activeCamera.
            scene.activeCamera = finalCamera;
            // Appel de clearTournamentOverlayTimers pour appliquer l'action prévue.
            clearTournamentOverlayTimers();
            // Appel de hideTournamentOverlayImmediate pour appliquer l'action prévue.
            hideTournamentOverlayImmediate();
            // Instruction nécessaire au déroulement de cette partie.
            introState = null;
            // Vérification avant d'exécuter la suite.
            if (typeof config.onComplete === "function") config.onComplete();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans fps.
        const fps = 60;
        // Valeur mémorisée dans totalFrames.
        const totalFrames = Math.max(1, Math.round((durationMs / 1000) * fps));

        // Valeur mémorisée dans fromAlpha.
        const fromAlpha = Number.isFinite(config.fromAlpha) ? config.fromAlpha : (-Math.PI / 2 - 0.4);
        // Valeur mémorisée dans toAlpha.
        const toAlpha = fromAlpha + (Math.PI * 2 * rotationTurns);
        // Valeur mémorisée dans fromBeta.
        const fromBeta = Number.isFinite(config.fromBeta) ? config.fromBeta : 0.45;
        // Valeur mémorisée dans toBeta.
        const toBeta = Number.isFinite(config.toBeta) ? config.toBeta : 0.75;
        // Valeur mémorisée dans fromRadius.
        const fromRadius = Number.isFinite(config.fromRadius) ? config.fromRadius : 210;
        // Valeur mémorisée dans toRadius.
        const toRadius = Number.isFinite(config.toRadius) ? config.toRadius : 95;

        // Mise à jour de alpha.
        introCamera.alpha = fromAlpha;
        // Mise à jour de beta.
        introCamera.beta = fromBeta;
        // Mise à jour de radius.
        introCamera.radius = fromRadius;

        // Vérification avant d'exécuter la suite.
        if (cameras.cameraTargetNode) {
            // Appel de set pour appliquer l'action prévue.
            cameras.cameraTargetNode.position.set(0, 0, 0);
            // Mise à jour de lockedTarget.
            introCamera.lockedTarget = cameras.cameraTargetNode;
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de setTarget pour appliquer l'action prévue.
            introCamera.setTarget(BABYLON.Vector3.Zero());
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de activeCamera.
        scene.activeCamera = introCamera;
        // Valeur mémorisée dans showDelay.
        const showDelay = Math.min(2000, Math.max(0, durationMs - 900));
        // Appel de showTournamentOverlayBanner pour appliquer l'action prévue.
        showTournamentOverlayBanner(tournamentLabel, {
            // Paramètre de l'appel ou valeur de configuration.
            durationMs,
            // Paramètre de l'appel ou valeur de configuration.
            showDelayMs: showDelay,
            // Appel de max pour appliquer l'action prévue.
            visibleWindowMs: Math.max(800, durationMs - showDelay - 900)
        // Fermeture du bloc ou de l'appel.
        });

        // Création de easing.
        const easing = new BABYLON.CubicEase();
        // Appel de setEasingMode pour appliquer l'action prévue.
        easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        // Fonction buildAnim : elle regroupe le traitement de cette partie.
        function buildAnim(name, property, from, to) {
            // Création de anim.
            const anim = new BABYLON.Animation(
                // Paramètre de l'appel ou valeur de configuration.
                name,
                // Paramètre de l'appel ou valeur de configuration.
                property,
                // Paramètre de l'appel ou valeur de configuration.
                fps,
                // Paramètre de l'appel ou valeur de configuration.
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                // Instruction nécessaire au déroulement de cette partie.
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            // Fermeture du bloc ou de l'appel.
            );
            // Appel de setKeys pour appliquer l'action prévue.
            anim.setKeys([
                // Paramètre de l'appel ou valeur de configuration.
                { frame: 0, value: from },
                // Instruction nécessaire au déroulement de cette partie.
                { frame: totalFrames, value: to }
            // Fermeture du bloc ou de l'appel.
            ]);
            // Appel de setEasingFunction pour appliquer l'action prévue.
            anim.setEasingFunction(easing);
            // Résultat renvoyé par la fonction.
            return anim;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans animations.
        const animations = [
            // Appel de buildAnim pour appliquer l'action prévue.
            buildAnim("preMatchAlpha", "alpha", fromAlpha, toAlpha),
            // Appel de buildAnim pour appliquer l'action prévue.
            buildAnim("preMatchBeta", "beta", fromBeta, toBeta),
            // Appel de buildAnim pour appliquer l'action prévue.
            buildAnim("preMatchRadius", "radius", fromRadius, toRadius)
        // Fermeture du bloc ou de l'appel.
        ];

        // Appel de beginDirectAnimation pour appliquer l'action prévue.
        scene.beginDirectAnimation(introCamera, animations, 0, totalFrames, false, 1, function () {
            // Normalise l'alpha à -π/2 pour éviter que cameraRuntime lerpe à travers un tour complet
            // Mise à jour de alpha.
            introCamera.alpha  = -Math.PI / 2;
            // Mise à jour de beta.
            introCamera.beta   = toBeta;
            // Mise à jour de radius.
            introCamera.radius = toRadius;
            // Mise à jour de activeCamera.
            scene.activeCamera = finalCamera;
            // Appel de clearTournamentOverlayTimers pour appliquer l'action prévue.
            clearTournamentOverlayTimers();
            // Appel de hideTournamentOverlayImmediate pour appliquer l'action prévue.
            hideTournamentOverlayImmediate();
            // Appel de setIntroSkipVisible pour appliquer l'action prévue.
            setIntroSkipVisible(false);
            // Instruction nécessaire au déroulement de cette partie.
            introState = null;
            // Vérification avant d'exécuter la suite.
            if (typeof config.onComplete === "function") {
                // Appel de onComplete pour appliquer l'action prévue.
                config.onComplete();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // ─── Bouton SKIP INTRO (même style que skip replay) ─────────
        // Appel de ensureIntroSkipButton pour appliquer l'action prévue.
        ensureIntroSkipButton();

        // Remplace le listener précédent (clone = nouveau élément sans listener parasite)
        // Valeur mémorisée dans fresh.
        const fresh = introSkipBtn.cloneNode(true);
        // Appel de replaceChild pour appliquer l'action prévue.
        introSkipBtn.parentNode.replaceChild(fresh, introSkipBtn);
        // Instruction nécessaire au déroulement de cette partie.
        introSkipBtn = fresh;

        // Appel de addEventListener pour appliquer l'action prévue.
        introSkipBtn.addEventListener("click", function () {
            // Vérification avant d'exécuter la suite.
            if (introState && typeof introState.skip === "function") {
                // Appel de skip pour appliquer l'action prévue.
                introState.skip();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de setIntroSkipVisible pour appliquer l'action prévue.
        setIntroSkipVisible(true);

        // Ouverture du bloc correspondant.
        introState = {
            // Appel de function pour appliquer l'action prévue.
            skip: function () {
                // Vérification avant d'exécuter la suite.
                if (!scene || !introCamera) return;
                // Appel de stopAnimation pour appliquer l'action prévue.
                scene.stopAnimation(introCamera);
                // Normalise l'alpha à -π/2 (valeur de référence de cameraRuntime) — évite le tour parasite
                // Mise à jour de alpha.
                introCamera.alpha  = -Math.PI / 2;
                // Mise à jour de beta.
                introCamera.beta   = toBeta;
                // Mise à jour de radius.
                introCamera.radius = toRadius;
                // Mise à jour de activeCamera.
                scene.activeCamera = finalCamera;
                // Appel de clearTournamentOverlayTimers pour appliquer l'action prévue.
                clearTournamentOverlayTimers();
                // Appel de hideTournamentOverlayImmediate pour appliquer l'action prévue.
                hideTournamentOverlayImmediate();
                // Appel de setIntroSkipVisible pour appliquer l'action prévue.
                setIntroSkipVisible(false);
                // Instruction nécessaire au déroulement de cette partie.
                introState = null;
                // Vérification avant d'exécuter la suite.
                if (typeof config.onComplete === "function") {
                    // Appel de onComplete pour appliquer l'action prévue.
                    config.onComplete();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de startPreMatchIntro.
    window.startPreMatchIntro = startPreMatchIntro;
    // Mise à jour de showTournamentOverlayBanner.
    window.showTournamentOverlayBanner = showTournamentOverlayBanner;
    // Mise à jour de hideTournamentOverlayBanner.
    window.hideTournamentOverlayBanner = hideTournamentOverlayImmediate;
    // Mise à jour de skipPreMatchIntro.
    window.skipPreMatchIntro = function () {
        // Vérification avant d'exécuter la suite.
        if (introState && typeof introState.skip === "function") {
            // Appel de skip pour appliquer l'action prévue.
            introState.skip();
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return false;
    // Fermeture du bloc ou de l'appel.
    };
// Instruction nécessaire au déroulement de cette partie.
})();

// Valeur mémorisée dans ENABLE_PRE_MATCH_INTRO.
const ENABLE_PRE_MATCH_INTRO = true;
// Valeur mémorisée dans PRE_MATCH_INTRO_DURATION_MS.
const PRE_MATCH_INTRO_DURATION_MS = 10000;
// Valeur mémorisée dans PRE_MATCH_INTRO_TURNS.
const PRE_MATCH_INTRO_TURNS = 1; // 0.5 tour = 180°
// Valeur mémorisée dans TOURNAMENT_INTRO_LABEL_BY_STAGE.
const TOURNAMENT_INTRO_LABEL_BY_STAGE = {
    // Paramètre de l'appel ou valeur de configuration.
    huitieme: "Huitieme de finale",
    // Paramètre de l'appel ou valeur de configuration.
    quart: "Quart de finale",
    // Paramètre de l'appel ou valeur de configuration.
    demi: "Demi-finale",
    // Instruction nécessaire au déroulement de cette partie.
    finale: "Finale"
// Fermeture du bloc ou de l'appel.
};

// Fonction launchPreMatchIntro : elle regroupe le traitement de cette partie.
export function launchPreMatchIntro(params) {
    // Valeur mémorisée dans scene.
    const scene = params.scene;
    // Valeur mémorisée dans cameras.
    const cameras = params.cameras;
    // Valeur mémorisée dans mode.
    const mode = params.mode;
    // Valeur mémorisée dans tournamentStage.
    const tournamentStage = params.tournamentStage;
    // Valeur mémorisée dans cameraRuntime.
    const cameraRuntime = params.cameraRuntime;
    // Valeur mémorisée dans getActivePlayer.
    const getActivePlayer = params.getActivePlayer;
    // Valeur mémorisée dans setIntroPlaying.
    const setIntroPlaying = params.setIntroPlaying;
    // Valeur mémorisée dans onIntroComplete.
    const onIntroComplete = params.onIntroComplete;

    // Valeur mémorisée dans tournamentIntroLabel.
    const tournamentIntroLabel = mode === "versus"
        // Instruction nécessaire au déroulement de cette partie.
        ? "MODE 1VS1"
        // Instruction nécessaire au déroulement de cette partie.
        : (TOURNAMENT_INTRO_LABEL_BY_STAGE[tournamentStage] || "Huitieme de finale");

    // Fonction finishIntro : elle regroupe le traitement de cette partie.
    const finishIntro = () => {
        // Valeur mémorisée dans activePlayer.
        const activePlayer = typeof getActivePlayer === "function" ? getActivePlayer() : null;
        // Vérification avant d'exécuter la suite.
        if (cameraRuntime && typeof cameraRuntime.syncTargetToActivePlayer === "function") {
            // Appel de syncTargetToActivePlayer pour appliquer l'action prévue.
            cameraRuntime.syncTargetToActivePlayer(activePlayer);
        // Deuxième possibilité à tester.
        } else if (cameras && cameras.cameraTargetNode && activePlayer && activePlayer.position) {
            // Appel de copyFrom pour appliquer l'action prévue.
            cameras.cameraTargetNode.position.copyFrom(activePlayer.position);
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (typeof setIntroPlaying === "function") {
            // Appel de setIntroPlaying pour appliquer l'action prévue.
            setIntroPlaying(false);
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (cameras) cameras.allowManualSwitch = true;

        // Vérification avant d'exécuter la suite.
        if (window.matchAudio && typeof window.matchAudio.playWhistle === "function") {
            // Appel de playWhistle pour appliquer l'action prévue.
            window.matchAudio.playWhistle();
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (window.gameScoreboard && typeof window.gameScoreboard.startTimer === "function") {
            // Appel de startTimer pour appliquer l'action prévue.
            window.gameScoreboard.startTimer();
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (typeof onIntroComplete === "function") {
            // Appel de onIntroComplete pour appliquer l'action prévue.
            onIntroComplete();
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    };

    // Vérification avant d'exécuter la suite.
    if (typeof window.startPreMatchIntro === "function") {
        // Appel de startPreMatchIntro pour appliquer l'action prévue.
        window.startPreMatchIntro(scene, cameras, ENABLE_PRE_MATCH_INTRO, {
            // Paramètre de l'appel ou valeur de configuration.
            durationMs: PRE_MATCH_INTRO_DURATION_MS,
            // Paramètre de l'appel ou valeur de configuration.
            rotationTurns: PRE_MATCH_INTRO_TURNS,
            // Paramètre de l'appel ou valeur de configuration.
            tournamentLabel: tournamentIntroLabel,
            // Paramètre de l'appel ou valeur de configuration.
            fromBeta: 0.45,
            // Paramètre de l'appel ou valeur de configuration.
            toBeta: 0.75,
            // Paramètre de l'appel ou valeur de configuration.
            fromRadius: 220,
            // Paramètre de l'appel ou valeur de configuration.
            toRadius: 100,
            // Instruction nécessaire au déroulement de cette partie.
            onComplete: finishIntro
        // Fermeture du bloc ou de l'appel.
        });
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Appel de finishIntro pour appliquer l'action prévue.
        finishIntro();
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}
