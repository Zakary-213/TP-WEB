// js/utils/audioManager.js
// Charge et joue les sons de match via BABYLON.AssetsManager.
// Appel de function pour appliquer l'action prévue.
(function () {
    // Valeur mémorisée dans state.
    const state = {
        // Paramètre de l'appel ou valeur de configuration.
        scene: null,
        // Paramètre de l'appel ou valeur de configuration.
        assetsManager: null,
        // Paramètre de l'appel ou valeur de configuration.
        whistleData: null,
        // Paramètre de l'appel ou valeur de configuration.
        whistleSound: null,
        // Paramètre de l'appel ou valeur de configuration.
        whistleHtmlAudio: null,
        // Paramètre de l'appel ou valeur de configuration.
        whistleBlobUrl: null,
        // Paramètre de l'appel ou valeur de configuration.
        kickData: null,
        // Paramètre de l'appel ou valeur de configuration.
        kickSound: null,
        // Paramètre de l'appel ou valeur de configuration.
        kickHtmlAudio: null,
        // Paramètre de l'appel ou valeur de configuration.
        kickBlobUrl: null,
        // Paramètre de l'appel ou valeur de configuration.
        goalData: null,
        // Paramètre de l'appel ou valeur de configuration.
        goalSound: null,
        // Paramètre de l'appel ou valeur de configuration.
        goalHtmlAudio: null,
        // Paramètre de l'appel ou valeur de configuration.
        goalBlobUrl: null,
        // Paramètre de l'appel ou valeur de configuration.
        isLoaded: false,
        // Paramètre de l'appel ou valeur de configuration.
        isLoading: false,
        // Paramètre de l'appel ou valeur de configuration.
        pendingPlay: false,
        // Paramètre de l'appel ou valeur de configuration.
        kickLoaded: false,
        // Paramètre de l'appel ou valeur de configuration.
        kickLoading: false,
        // Paramètre de l'appel ou valeur de configuration.
        pendingKickPlay: false,
        // Paramètre de l'appel ou valeur de configuration.
        goalLoaded: false,
        // Paramètre de l'appel ou valeur de configuration.
        goalLoading: false,
        // Paramètre de l'appel ou valeur de configuration.
        pendingGoalPlay: false,
        // Paramètre de l'appel ou valeur de configuration.
        whistleUrl: "./assets/Sifflet.mp3",
        // Paramètre de l'appel ou valeur de configuration.
        kickUrl: "./assets/Kick.mp3",
        // Paramètre de l'appel ou valeur de configuration.
        goalUrl: "./assets/Goal.mp3",
        // Paramètre de l'appel ou valeur de configuration.
        debug: false,
        // Paramètre de l'appel ou valeur de configuration.
        unlockHandlersInstalled: false,
        // Paramètre de l'appel ou valeur de configuration.
        htmlAudioPrimed: false,
        // Paramètre de l'appel ou valeur de configuration.
        soundVolume: 1,
        // Instruction nécessaire au déroulement de cette partie.
        musicVolume: 1
    // Fermeture du bloc ou de l'appel.
    };

    // Valeur mémorisée dans BASE_VOLUMES.
    const BASE_VOLUMES = {
        // Paramètre de l'appel ou valeur de configuration.
        whistle: 0.9,
        // Paramètre de l'appel ou valeur de configuration.
        kick: 0.85,
        // Instruction nécessaire au déroulement de cette partie.
        goal: 0.8
    // Fermeture du bloc ou de l'appel.
    };

    // Fonction clamp01 : elle regroupe le traitement de cette partie.
    function clamp01(value) {
        // Valeur mémorisée dans num.
        const num = Number(value);
        // Vérification avant d'exécuter la suite.
        if (Number.isNaN(num)) return 1;
        // Résultat renvoyé par la fonction.
        return Math.min(1, Math.max(0, num));
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getSoundVolume : elle regroupe le traitement de cette partie.
    function getSoundVolume(base) {
        // Résultat renvoyé par la fonction.
        return clamp01(base) * clamp01(state.soundVolume);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction applySoundVolumes : elle regroupe le traitement de cette partie.
    function applySoundVolumes() {
        // Valeur mémorisée dans whistleVol.
        const whistleVol = getSoundVolume(BASE_VOLUMES.whistle);
        // Valeur mémorisée dans kickVol.
        const kickVol = getSoundVolume(BASE_VOLUMES.kick);
        // Valeur mémorisée dans goalVol.
        const goalVol = getSoundVolume(BASE_VOLUMES.goal);

        // Vérification avant d'exécuter la suite.
        if (state.whistleSound) state.whistleSound.setVolume(whistleVol);
        // Vérification avant d'exécuter la suite.
        if (state.kickSound) state.kickSound.setVolume(kickVol);
        // Vérification avant d'exécuter la suite.
        if (state.goalSound) state.goalSound.setVolume(goalVol);

        // Vérification avant d'exécuter la suite.
        if (state.whistleHtmlAudio) state.whistleHtmlAudio.volume = whistleVol;
        // Vérification avant d'exécuter la suite.
        if (state.kickHtmlAudio) state.kickHtmlAudio.volume = kickVol;
        // Vérification avant d'exécuter la suite.
        if (state.goalHtmlAudio) state.goalHtmlAudio.volume = goalVol;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction uniqueUrls : elle regroupe le traitement de cette partie.
    function uniqueUrls(urls) {
        // Création de seen.
        const seen = new Set();
        // Valeur mémorisée dans out.
        const out = [];

        // Appel de forEach pour appliquer l'action prévue.
        urls.forEach(function (u) {
            // Vérification avant d'exécuter la suite.
            if (typeof u !== "string") return;
            // Valeur mémorisée dans value.
            const value = u.trim();
            // Vérification avant d'exécuter la suite.
            if (!value) return;
            // Vérification avant d'exécuter la suite.
            if (seen.has(value)) return;
            // Appel de add pour appliquer l'action prévue.
            seen.add(value);
            // Appel de push pour appliquer l'action prévue.
            out.push(value);
        // Fermeture du bloc ou de l'appel.
        });

        // Résultat renvoyé par la fonction.
        return out;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildWhistleCandidates : elle regroupe le traitement de cette partie.
    function buildWhistleCandidates(config) {
        // Valeur mémorisée dans preferred.
        const preferred = (config && typeof config.whistleUrl === "string")
            // Instruction nécessaire au déroulement de cette partie.
            ? config.whistleUrl
            // Instruction nécessaire au déroulement de cette partie.
            : state.whistleUrl;

        // Résultat renvoyé par la fonction.
        return uniqueUrls([
            // Paramètre de l'appel ou valeur de configuration.
            preferred,
            // Paramètre de l'appel ou valeur de configuration.
            "./assets/Sifflet.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "assets/Sifflet.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "../assets/Sifflet.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "../../assets/Sifflet.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "/assets/Sifflet.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "/TP-WEB/GamesOnWeb/assets/Sifflet.mp3",
            // Instruction nécessaire au déroulement de cette partie.
            "/TP-WEB/assets/Sifflet.mp3"
        // Fermeture du bloc ou de l'appel.
        ]);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildKickCandidates : elle regroupe le traitement de cette partie.
    function buildKickCandidates(config) {
        // Valeur mémorisée dans preferred.
        const preferred = (config && typeof config.kickUrl === "string")
            // Instruction nécessaire au déroulement de cette partie.
            ? config.kickUrl
            // Instruction nécessaire au déroulement de cette partie.
            : state.kickUrl;

        // Résultat renvoyé par la fonction.
        return uniqueUrls([
            // Paramètre de l'appel ou valeur de configuration.
            preferred,
            // Paramètre de l'appel ou valeur de configuration.
            "./assets/Kick.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "assets/Kick.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "../assets/Kick.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "../../assets/Kick.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "/assets/Kick.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "/TP-WEB/GamesOnWeb/assets/Kick.mp3",
            // Instruction nécessaire au déroulement de cette partie.
            "/TP-WEB/assets/Kick.mp3"
        // Fermeture du bloc ou de l'appel.
        ]);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildGoalCandidates : elle regroupe le traitement de cette partie.
    function buildGoalCandidates(config) {
        // Valeur mémorisée dans preferred.
        const preferred = (config && typeof config.goalUrl === "string")
            // Instruction nécessaire au déroulement de cette partie.
            ? config.goalUrl
            // Instruction nécessaire au déroulement de cette partie.
            : state.goalUrl;

        // Résultat renvoyé par la fonction.
        return uniqueUrls([
            // Paramètre de l'appel ou valeur de configuration.
            preferred,
            // Paramètre de l'appel ou valeur de configuration.
            "./assets/Goal.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "assets/Goal.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "../assets/Goal.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "../../assets/Goal.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "/assets/Goal.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            "/TP-WEB/GamesOnWeb/assets/Goal.mp3",
            // Instruction nécessaire au déroulement de cette partie.
            "/TP-WEB/assets/Goal.mp3"
        // Fermeture du bloc ou de l'appel.
        ]);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction log : elle regroupe le traitement de cette partie.
    function log() {
        // Vérification avant d'exécuter la suite.
        if (!state.debug) return;
        // Valeur mémorisée dans args.
        const args = Array.prototype.slice.call(arguments);
        // Appel de apply pour appliquer l'action prévue.
        console.log.apply(console, ["[matchAudio]"].concat(args));
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction warn : elle regroupe le traitement de cette partie.
    function warn() {
        // Valeur mémorisée dans args.
        const args = Array.prototype.slice.call(arguments);
        // Appel de apply pour appliquer l'action prévue.
        console.warn.apply(console, ["[matchAudio]"].concat(args));
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction disposeWhistleSound : elle regroupe le traitement de cette partie.
    function disposeWhistleSound() {
        // Vérification avant d'exécuter la suite.
        if (state.whistleSound) {
            // Appel de dispose pour appliquer l'action prévue.
            state.whistleSound.dispose();
            // Mise à jour de whistleSound.
            state.whistleSound = null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.whistleHtmlAudio) {
            // Appel de pause pour appliquer l'action prévue.
            state.whistleHtmlAudio.pause();
            // Mise à jour de src.
            state.whistleHtmlAudio.src = "";
            // Mise à jour de whistleHtmlAudio.
            state.whistleHtmlAudio = null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.whistleBlobUrl) {
            // Appel de revokeObjectURL pour appliquer l'action prévue.
            URL.revokeObjectURL(state.whistleBlobUrl);
            // Mise à jour de whistleBlobUrl.
            state.whistleBlobUrl = null;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction disposeKickSound : elle regroupe le traitement de cette partie.
    function disposeKickSound() {
        // Vérification avant d'exécuter la suite.
        if (state.kickSound) {
            // Appel de dispose pour appliquer l'action prévue.
            state.kickSound.dispose();
            // Mise à jour de kickSound.
            state.kickSound = null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.kickHtmlAudio) {
            // Appel de pause pour appliquer l'action prévue.
            state.kickHtmlAudio.pause();
            // Mise à jour de src.
            state.kickHtmlAudio.src = "";
            // Mise à jour de kickHtmlAudio.
            state.kickHtmlAudio = null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.kickBlobUrl) {
            // Appel de revokeObjectURL pour appliquer l'action prévue.
            URL.revokeObjectURL(state.kickBlobUrl);
            // Mise à jour de kickBlobUrl.
            state.kickBlobUrl = null;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction disposeGoalSound : elle regroupe le traitement de cette partie.
    function disposeGoalSound() {
        // Vérification avant d'exécuter la suite.
        if (state.goalSound) {
            // Appel de dispose pour appliquer l'action prévue.
            state.goalSound.dispose();
            // Mise à jour de goalSound.
            state.goalSound = null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.goalHtmlAudio) {
            // Appel de pause pour appliquer l'action prévue.
            state.goalHtmlAudio.pause();
            // Mise à jour de src.
            state.goalHtmlAudio.src = "";
            // Mise à jour de goalHtmlAudio.
            state.goalHtmlAudio = null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.goalBlobUrl) {
            // Appel de revokeObjectURL pour appliquer l'action prévue.
            URL.revokeObjectURL(state.goalBlobUrl);
            // Mise à jour de goalBlobUrl.
            state.goalBlobUrl = null;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildHtmlAudioFallback : elle regroupe le traitement de cette partie.
    function buildHtmlAudioFallback() {
        // Valeur mémorisée dans src.
        const src = state.whistleBlobUrl || state.whistleUrl;
        // Vérification avant d'exécuter la suite.
        if (!src) return;

        // Création de audio.
        const audio = new Audio(src);
        // Mise à jour de preload.
        audio.preload = "auto";
        // Mise à jour de volume.
        audio.volume = getSoundVolume(BASE_VOLUMES.whistle);
        // Appel de load pour appliquer l'action prévue.
        audio.load();
        // Mise à jour de whistleHtmlAudio.
        state.whistleHtmlAudio = audio;
        // Appel de log pour appliquer l'action prévue.
        log("HTMLAudio fallback ready", { src });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildKickHtmlAudioFallback : elle regroupe le traitement de cette partie.
    function buildKickHtmlAudioFallback() {
        // Valeur mémorisée dans src.
        const src = state.kickBlobUrl || state.kickUrl;
        // Vérification avant d'exécuter la suite.
        if (!src) return;

        // Création de audio.
        const audio = new Audio(src);
        // Mise à jour de preload.
        audio.preload = "auto";
        // Mise à jour de volume.
        audio.volume = getSoundVolume(BASE_VOLUMES.kick);
        // Appel de load pour appliquer l'action prévue.
        audio.load();
        // Mise à jour de kickHtmlAudio.
        state.kickHtmlAudio = audio;
        // Appel de log pour appliquer l'action prévue.
        log("Kick HTMLAudio fallback ready", { src });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildGoalHtmlAudioFallback : elle regroupe le traitement de cette partie.
    function buildGoalHtmlAudioFallback() {
        // Valeur mémorisée dans src.
        const src = state.goalBlobUrl || state.goalUrl;
        // Vérification avant d'exécuter la suite.
        if (!src) return;

        // Création de audio.
        const audio = new Audio(src);
        // Mise à jour de preload.
        audio.preload = "auto";
        // Mise à jour de volume.
        audio.volume = getSoundVolume(BASE_VOLUMES.goal);
        // Mise à jour de loop.
        audio.loop = true;
        // Appel de load pour appliquer l'action prévue.
        audio.load();
        // Mise à jour de goalHtmlAudio.
        state.goalHtmlAudio = audio;
        // Appel de log pour appliquer l'action prévue.
        log("Goal HTMLAudio fallback ready", { src });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction primeSingleHtmlAudio : elle regroupe le traitement de cette partie.
    function primeSingleHtmlAudio(audio, label) {
        // Vérification avant d'exécuter la suite.
        if (!audio) return;

        // Valeur mémorisée dans previousMuted.
        const previousMuted = audio.muted;
        // Mise à jour de muted.
        audio.muted = true;

        // Valeur mémorisée dans playPromise.
        const playPromise = audio.play();
        // Vérification avant d'exécuter la suite.
        if (playPromise && typeof playPromise.then === "function") {
            // Instruction nécessaire au déroulement de cette partie.
            playPromise
                // Appel de then pour appliquer l'action prévue.
                .then(function () {
                    // Appel de pause pour appliquer l'action prévue.
                    audio.pause();
                    // Mise à jour de currentTime.
                    audio.currentTime = 0;
                    // Mise à jour de muted.
                    audio.muted = previousMuted;
                    // Appel de log pour appliquer l'action prévue.
                    log("HTMLAudio primed", label);
                // Fermeture du bloc ou de l'appel.
                })
                // Ouverture du bloc correspondant.
                .catch(function (err) {
                    // Mise à jour de muted.
                    audio.muted = previousMuted;
                    // Appel de log pour appliquer l'action prévue.
                    log("HTMLAudio prime skipped", label, err);
                // Fermeture du bloc ou de l'appel.
                });
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de pause pour appliquer l'action prévue.
            audio.pause();
            // Mise à jour de currentTime.
            audio.currentTime = 0;
            // Mise à jour de muted.
            audio.muted = previousMuted;
            // Appel de log pour appliquer l'action prévue.
            log("HTMLAudio primed", label);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction primeHtmlAudioIfNeeded : elle regroupe le traitement de cette partie.
    function primeHtmlAudioIfNeeded() {
        // Vérification avant d'exécuter la suite.
        if (state.htmlAudioPrimed) return;
        // Mise à jour de htmlAudioPrimed.
        state.htmlAudioPrimed = true;

        // Vérification avant d'exécuter la suite.
        if (!state.whistleHtmlAudio) buildHtmlAudioFallback();
        // Vérification avant d'exécuter la suite.
        if (!state.kickHtmlAudio) buildKickHtmlAudioFallback();

        // Appel de primeSingleHtmlAudio pour appliquer l'action prévue.
        primeSingleHtmlAudio(state.whistleHtmlAudio, "whistle");
        // Appel de primeSingleHtmlAudio pour appliquer l'action prévue.
        primeSingleHtmlAudio(state.kickHtmlAudio, "kick");
        // Appel de primeSingleHtmlAudio pour appliquer l'action prévue.
        primeSingleHtmlAudio(state.goalHtmlAudio, "goal");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildWhistleSound : elle regroupe le traitement de cette partie.
    function buildWhistleSound() {
        // Vérification avant d'exécuter la suite.
        if (!state.scene || !state.whistleData) return;

        // Appel de disposeWhistleSound pour appliquer l'action prévue.
        disposeWhistleSound();

        // Création de whistleBlob.
        const whistleBlob = new Blob([state.whistleData], { type: "audio/mpeg" });
        // Mise à jour de whistleBlobUrl.
        state.whistleBlobUrl = URL.createObjectURL(whistleBlob);
        // Appel de buildHtmlAudioFallback pour appliquer l'action prévue.
        buildHtmlAudioFallback();

        // Partie protégée en cas d'erreur.
        try {
            // Mise à jour de whistleSound.
            state.whistleSound = new BABYLON.Sound(
                // Paramètre de l'appel ou valeur de configuration.
                "matchWhistle",
                // Paramètre de l'appel ou valeur de configuration.
                state.whistleBlobUrl,
                // Paramètre de l'appel ou valeur de configuration.
                state.scene,
                // Fonction function : elle regroupe le traitement de cette partie.
                function () {
                    // Appel de log pour appliquer l'action prévue.
                    log("Whistle sound ready from blob URL");
                // Fermeture du bloc ou de l'appel.
                },
                // Ouverture d'un bloc.
                {
                    // Paramètre de l'appel ou valeur de configuration.
                    autoplay: false,
                    // Paramètre de l'appel ou valeur de configuration.
                    loop: false,
                    // Appel de getSoundVolume pour appliquer l'action prévue.
                    volume: getSoundVolume(BASE_VOLUMES.whistle)
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            );
            // Résultat renvoyé par la fonction.
            return;
        // Gestion de l'erreur si le try échoue.
        } catch (e) {
            // Appel de warn pour appliquer l'action prévue.
            warn("Blob sound creation failed, fallback to direct URL", e);
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de whistleSound.
        state.whistleSound = new BABYLON.Sound(
            // Paramètre de l'appel ou valeur de configuration.
            "matchWhistle",
            // Paramètre de l'appel ou valeur de configuration.
            state.whistleUrl,
            // Paramètre de l'appel ou valeur de configuration.
            state.scene,
            // Fonction function : elle regroupe le traitement de cette partie.
            function () {
                // Appel de log pour appliquer l'action prévue.
                log("Whistle sound ready from direct URL");
            // Fermeture du bloc ou de l'appel.
            },
            // Ouverture d'un bloc.
            {
                // Paramètre de l'appel ou valeur de configuration.
                autoplay: false,
                // Paramètre de l'appel ou valeur de configuration.
                loop: false,
                // Appel de getSoundVolume pour appliquer l'action prévue.
                volume: getSoundVolume(BASE_VOLUMES.whistle)
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        );
        // Appel de buildHtmlAudioFallback pour appliquer l'action prévue.
        buildHtmlAudioFallback();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildKickSound : elle regroupe le traitement de cette partie.
    function buildKickSound() {
        // Vérification avant d'exécuter la suite.
        if (!state.scene || !state.kickData) return;

        // Appel de disposeKickSound pour appliquer l'action prévue.
        disposeKickSound();

        // Création de kickBlob.
        const kickBlob = new Blob([state.kickData], { type: "audio/mpeg" });
        // Mise à jour de kickBlobUrl.
        state.kickBlobUrl = URL.createObjectURL(kickBlob);
        // Appel de buildKickHtmlAudioFallback pour appliquer l'action prévue.
        buildKickHtmlAudioFallback();

        // Partie protégée en cas d'erreur.
        try {
            // Mise à jour de kickSound.
            state.kickSound = new BABYLON.Sound(
                // Paramètre de l'appel ou valeur de configuration.
                "matchKick",
                // Paramètre de l'appel ou valeur de configuration.
                state.kickBlobUrl,
                // Paramètre de l'appel ou valeur de configuration.
                state.scene,
                // Fonction function : elle regroupe le traitement de cette partie.
                function () {
                    // Appel de log pour appliquer l'action prévue.
                    log("Kick sound ready from blob URL");
                // Fermeture du bloc ou de l'appel.
                },
                // Ouverture d'un bloc.
                {
                    // Paramètre de l'appel ou valeur de configuration.
                    autoplay: false,
                    // Paramètre de l'appel ou valeur de configuration.
                    loop: false,
                    // Appel de getSoundVolume pour appliquer l'action prévue.
                    volume: getSoundVolume(BASE_VOLUMES.kick)
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            );
            // Résultat renvoyé par la fonction.
            return;
        // Gestion de l'erreur si le try échoue.
        } catch (e) {
            // Appel de warn pour appliquer l'action prévue.
            warn("Kick blob sound creation failed, fallback to direct URL", e);
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de kickSound.
        state.kickSound = new BABYLON.Sound(
            // Paramètre de l'appel ou valeur de configuration.
            "matchKick",
            // Paramètre de l'appel ou valeur de configuration.
            state.kickUrl,
            // Paramètre de l'appel ou valeur de configuration.
            state.scene,
            // Fonction function : elle regroupe le traitement de cette partie.
            function () {
                // Appel de log pour appliquer l'action prévue.
                log("Kick sound ready from direct URL");
            // Fermeture du bloc ou de l'appel.
            },
            // Ouverture d'un bloc.
            {
                // Paramètre de l'appel ou valeur de configuration.
                autoplay: false,
                // Paramètre de l'appel ou valeur de configuration.
                loop: false,
                // Appel de getSoundVolume pour appliquer l'action prévue.
                volume: getSoundVolume(BASE_VOLUMES.kick)
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        );
        // Appel de buildKickHtmlAudioFallback pour appliquer l'action prévue.
        buildKickHtmlAudioFallback();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction buildGoalSound : elle regroupe le traitement de cette partie.
    function buildGoalSound() {
        // Vérification avant d'exécuter la suite.
        if (!state.scene || !state.goalData) return;

        // Appel de disposeGoalSound pour appliquer l'action prévue.
        disposeGoalSound();

        // Création de goalBlob.
        const goalBlob = new Blob([state.goalData], { type: "audio/mpeg" });
        // Mise à jour de goalBlobUrl.
        state.goalBlobUrl = URL.createObjectURL(goalBlob);
        // Appel de buildGoalHtmlAudioFallback pour appliquer l'action prévue.
        buildGoalHtmlAudioFallback();

        // Partie protégée en cas d'erreur.
        try {
            // Mise à jour de goalSound.
            state.goalSound = new BABYLON.Sound(
                // Paramètre de l'appel ou valeur de configuration.
                "matchGoal",
                // Paramètre de l'appel ou valeur de configuration.
                state.goalBlobUrl,
                // Paramètre de l'appel ou valeur de configuration.
                state.scene,
                // Fonction function : elle regroupe le traitement de cette partie.
                function () {
                    // Appel de log pour appliquer l'action prévue.
                    log("Goal sound ready from blob URL");
                // Fermeture du bloc ou de l'appel.
                },
                // Ouverture d'un bloc.
                {
                    // Paramètre de l'appel ou valeur de configuration.
                    autoplay: false,
                    // Paramètre de l'appel ou valeur de configuration.
                    loop: true,
                    // Appel de getSoundVolume pour appliquer l'action prévue.
                    volume: getSoundVolume(BASE_VOLUMES.goal)
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            );
            // Résultat renvoyé par la fonction.
            return;
        // Gestion de l'erreur si le try échoue.
        } catch (e) {
            // Appel de warn pour appliquer l'action prévue.
            warn("Goal blob sound creation failed, fallback to direct URL", e);
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de goalSound.
        state.goalSound = new BABYLON.Sound(
            // Paramètre de l'appel ou valeur de configuration.
            "matchGoal",
            // Paramètre de l'appel ou valeur de configuration.
            state.goalUrl,
            // Paramètre de l'appel ou valeur de configuration.
            state.scene,
            // Fonction function : elle regroupe le traitement de cette partie.
            function () {
                // Appel de log pour appliquer l'action prévue.
                log("Goal sound ready from direct URL");
            // Fermeture du bloc ou de l'appel.
            },
            // Ouverture d'un bloc.
            {
                // Paramètre de l'appel ou valeur de configuration.
                autoplay: false,
                // Paramètre de l'appel ou valeur de configuration.
                loop: true,
                // Appel de getSoundVolume pour appliquer l'action prévue.
                volume: getSoundVolume(BASE_VOLUMES.goal)
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        );
        // Appel de buildGoalHtmlAudioFallback pour appliquer l'action prévue.
        buildGoalHtmlAudioFallback();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction resumeAudioContextIfNeeded : elle regroupe le traitement de cette partie.
    function resumeAudioContextIfNeeded() {
        // Préparation de audioContext avec Babylon.js.
        const audioContext = BABYLON.Engine.audioEngine && BABYLON.Engine.audioEngine.audioContext;
        // Vérification avant d'exécuter la suite.
        if (!audioContext) {
            // Appel de log pour appliquer l'action prévue.
            log("No AudioContext available yet");
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de log pour appliquer l'action prévue.
        log("AudioContext state:", audioContext.state);

        // Vérification avant d'exécuter la suite.
        if (audioContext.state === "suspended") {
            // Appel de resume pour appliquer l'action prévue.
            audioContext.resume()
                // Appel de then pour appliquer l'action prévue.
                .then(function () {
                    // Appel de log pour appliquer l'action prévue.
                    log("AudioContext resumed");
                // Fermeture du bloc ou de l'appel.
                })
                // Ouverture du bloc correspondant.
                .catch(function (err) {
                    // Appel de warn pour appliquer l'action prévue.
                    warn("AudioContext resume failed", err);
                // Fermeture du bloc ou de l'appel.
                });
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction playWhistleWithHtmlAudio : elle regroupe le traitement de cette partie.
    function playWhistleWithHtmlAudio() {
        // Vérification avant d'exécuter la suite.
        if (!state.whistleHtmlAudio) {
            // Appel de buildHtmlAudioFallback pour appliquer l'action prévue.
            buildHtmlAudioFallback();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!state.whistleHtmlAudio) {
            // Appel de warn pour appliquer l'action prévue.
            warn("HTMLAudio fallback unavailable");
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Partie protégée en cas d'erreur.
        try {
            // Appel de pause pour appliquer l'action prévue.
            state.whistleHtmlAudio.pause();
            // Mise à jour de currentTime.
            state.whistleHtmlAudio.currentTime = 0;
        // Gestion de l'erreur si le try échoue.
        } catch (e) {
            // Appel de log pour appliquer l'action prévue.
            log("HTMLAudio reset skipped", e);
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans playPromise.
        const playPromise = state.whistleHtmlAudio.play();
        // Vérification avant d'exécuter la suite.
        if (playPromise && typeof playPromise.then === "function") {
            // Instruction nécessaire au déroulement de cette partie.
            playPromise
                // Appel de then pour appliquer l'action prévue.
                .then(function () {
                    // Appel de log pour appliquer l'action prévue.
                    log("Whistle played with HTMLAudio fallback");
                // Fermeture du bloc ou de l'appel.
                })
                // Ouverture du bloc correspondant.
                .catch(function (err) {
                    // Appel de warn pour appliquer l'action prévue.
                    warn("HTMLAudio play failed", err);
                    // Création de fallback.
                    const fallback = new Audio(state.whistleBlobUrl || state.whistleUrl);
                    // Mise à jour de volume.
                    fallback.volume = getSoundVolume(BASE_VOLUMES.whistle);
                    // Appel de play pour appliquer l'action prévue.
                    fallback.play().catch(function (e) {
                        // Appel de warn pour appliquer l'action prévue.
                        warn("HTMLAudio one-shot fallback failed", e);
                    // Fermeture du bloc ou de l'appel.
                    });
                // Fermeture du bloc ou de l'appel.
                });
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de log pour appliquer l'action prévue.
            log("Whistle played with HTMLAudio fallback");
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction playKickWithHtmlAudio : elle regroupe le traitement de cette partie.
    function playKickWithHtmlAudio() {
        // Vérification avant d'exécuter la suite.
        if (!state.kickHtmlAudio) {
            // Appel de buildKickHtmlAudioFallback pour appliquer l'action prévue.
            buildKickHtmlAudioFallback();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!state.kickHtmlAudio) {
            // Appel de warn pour appliquer l'action prévue.
            warn("Kick HTMLAudio fallback unavailable");
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Partie protégée en cas d'erreur.
        try {
            // Appel de pause pour appliquer l'action prévue.
            state.kickHtmlAudio.pause();
            // Mise à jour de currentTime.
            state.kickHtmlAudio.currentTime = 0;
        // Gestion de l'erreur si le try échoue.
        } catch (e) {
            // Appel de log pour appliquer l'action prévue.
            log("Kick HTMLAudio reset skipped", e);
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans playPromise.
        const playPromise = state.kickHtmlAudio.play();
        // Vérification avant d'exécuter la suite.
        if (playPromise && typeof playPromise.then === "function") {
            // Instruction nécessaire au déroulement de cette partie.
            playPromise
                // Appel de then pour appliquer l'action prévue.
                .then(function () {
                    // Appel de log pour appliquer l'action prévue.
                    log("Kick played with HTMLAudio fallback");
                // Fermeture du bloc ou de l'appel.
                })
                // Ouverture du bloc correspondant.
                .catch(function (err) {
                    // Appel de warn pour appliquer l'action prévue.
                    warn("Kick HTMLAudio play failed", err);
                    // Création de fallback.
                    const fallback = new Audio(state.kickBlobUrl || state.kickUrl);
                    // Mise à jour de volume.
                    fallback.volume = getSoundVolume(BASE_VOLUMES.kick);
                    // Appel de play pour appliquer l'action prévue.
                    fallback.play().catch(function (e) {
                        // Appel de warn pour appliquer l'action prévue.
                        warn("Kick HTMLAudio one-shot fallback failed", e);
                    // Fermeture du bloc ou de l'appel.
                    });
                // Fermeture du bloc ou de l'appel.
                });
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de log pour appliquer l'action prévue.
            log("Kick played with HTMLAudio fallback");
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction playGoalWithHtmlAudio : elle regroupe le traitement de cette partie.
    function playGoalWithHtmlAudio() {
        // Vérification avant d'exécuter la suite.
        if (!state.goalHtmlAudio) {
            // Appel de buildGoalHtmlAudioFallback pour appliquer l'action prévue.
            buildGoalHtmlAudioFallback();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!state.goalHtmlAudio) {
            // Appel de warn pour appliquer l'action prévue.
            warn("Goal HTMLAudio fallback unavailable");
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Partie protégée en cas d'erreur.
        try {
            // Appel de pause pour appliquer l'action prévue.
            state.goalHtmlAudio.pause();
            // Mise à jour de currentTime.
            state.goalHtmlAudio.currentTime = 0;
            // Mise à jour de loop.
            state.goalHtmlAudio.loop = true;
        // Gestion de l'erreur si le try échoue.
        } catch (e) {
            // Appel de log pour appliquer l'action prévue.
            log("Goal HTMLAudio reset skipped", e);
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans playPromise.
        const playPromise = state.goalHtmlAudio.play();
        // Vérification avant d'exécuter la suite.
        if (playPromise && typeof playPromise.then === "function") {
            // Instruction nécessaire au déroulement de cette partie.
            playPromise
                // Appel de then pour appliquer l'action prévue.
                .then(function () {
                    // Appel de log pour appliquer l'action prévue.
                    log("Goal played with HTMLAudio fallback");
                // Fermeture du bloc ou de l'appel.
                })
                // Ouverture du bloc correspondant.
                .catch(function (err) {
                    // Appel de warn pour appliquer l'action prévue.
                    warn("Goal HTMLAudio play failed", err);
                // Fermeture du bloc ou de l'appel.
                });
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de log pour appliquer l'action prévue.
            log("Goal played with HTMLAudio fallback");
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction stopGoalWithHtmlAudio : elle regroupe le traitement de cette partie.
    function stopGoalWithHtmlAudio() {
        // Vérification avant d'exécuter la suite.
        if (!state.goalHtmlAudio) return;
        // Partie protégée en cas d'erreur.
        try {
            // Appel de pause pour appliquer l'action prévue.
            state.goalHtmlAudio.pause();
            // Mise à jour de currentTime.
            state.goalHtmlAudio.currentTime = 0;
        // Gestion de l'erreur si le try échoue.
        } catch (e) {
            // Appel de log pour appliquer l'action prévue.
            log("Goal HTMLAudio stop skipped", e);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction installAudioUnlockHandlers : elle regroupe le traitement de cette partie.
    function installAudioUnlockHandlers() {
        // Vérification avant d'exécuter la suite.
        if (state.unlockHandlersInstalled) return;
        // Mise à jour de unlockHandlersInstalled.
        state.unlockHandlersInstalled = true;

        // Valeur mémorisée dans unlock.
        const unlock = function () {
            // Appel de resumeAudioContextIfNeeded pour appliquer l'action prévue.
            resumeAudioContextIfNeeded();
            // Appel de primeHtmlAudioIfNeeded pour appliquer l'action prévue.
            primeHtmlAudioIfNeeded();
        // Fermeture du bloc ou de l'appel.
        };

        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("pointerdown", unlock, { passive: true });
        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("keydown", unlock, { passive: true });
        // Appel de log pour appliquer l'action prévue.
        log("Audio unlock handlers installed");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction playWhistle : elle regroupe le traitement de cette partie.
    function playWhistle() {
        // Vérification avant d'exécuter la suite.
        if (!state.scene) return false;

        // Appel de log pour appliquer l'action prévue.
        log("playWhistle called", {
            // Paramètre de l'appel ou valeur de configuration.
            isLoaded: state.isLoaded,
            // Paramètre de l'appel ou valeur de configuration.
            isLoading: state.isLoading,
            // Paramètre de l'appel ou valeur de configuration.
            hasSound: !!state.whistleSound,
            // Paramètre de l'appel ou valeur de configuration.
            hasHtmlAudio: !!state.whistleHtmlAudio,
            // Instruction nécessaire au déroulement de cette partie.
            pendingPlay: state.pendingPlay
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de resumeAudioContextIfNeeded pour appliquer l'action prévue.
        resumeAudioContextIfNeeded();

        // Vérification avant d'exécuter la suite.
        if (!state.isLoaded) {
            // Mise à jour de pendingPlay.
            state.pendingPlay = true;
            // Appel de log pour appliquer l'action prévue.
            log("Whistle not loaded yet, pendingPlay=true");
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!state.whistleSound) {
            // Appel de buildWhistleSound pour appliquer l'action prévue.
            buildWhistleSound();
        // Fermeture du bloc ou de l'appel.
        }

        // Préparation de audioContext avec Babylon.js.
        const audioContext = BABYLON.Engine.audioEngine && BABYLON.Engine.audioEngine.audioContext;
        // Valeur mémorisée dans canUseBabylonSound.
        const canUseBabylonSound = !!(audioContext && state.whistleSound);

        // Vérification avant d'exécuter la suite.
        if (!canUseBabylonSound) {
            // Appel de log pour appliquer l'action prévue.
            log("Using HTMLAudio fallback because Babylon AudioContext is unavailable");
            // Résultat renvoyé par la fonction.
            return playWhistleWithHtmlAudio();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.whistleSound.isPlaying) {
            // Appel de stop pour appliquer l'action prévue.
            state.whistleSound.stop();
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de play pour appliquer l'action prévue.
        state.whistleSound.play();
        // Appel de log pour appliquer l'action prévue.
        log("Whistle play requested");
        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction playKick : elle regroupe le traitement de cette partie.
    function playKick() {
        // Vérification avant d'exécuter la suite.
        if (!state.scene) return false;

        // Appel de log pour appliquer l'action prévue.
        log("playKick called", {
            // Paramètre de l'appel ou valeur de configuration.
            kickLoaded: state.kickLoaded,
            // Paramètre de l'appel ou valeur de configuration.
            kickLoading: state.kickLoading,
            // Paramètre de l'appel ou valeur de configuration.
            hasKickSound: !!state.kickSound,
            // Paramètre de l'appel ou valeur de configuration.
            hasKickHtmlAudio: !!state.kickHtmlAudio,
            // Instruction nécessaire au déroulement de cette partie.
            pendingKickPlay: state.pendingKickPlay
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de resumeAudioContextIfNeeded pour appliquer l'action prévue.
        resumeAudioContextIfNeeded();

        // Vérification avant d'exécuter la suite.
        if (!state.kickLoaded) {
            // Mise à jour de pendingKickPlay.
            state.pendingKickPlay = true;
            // Appel de log pour appliquer l'action prévue.
            log("Kick not loaded yet, pendingKickPlay=true");
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!state.kickSound) {
            // Appel de buildKickSound pour appliquer l'action prévue.
            buildKickSound();
        // Fermeture du bloc ou de l'appel.
        }

        // Préparation de audioContext avec Babylon.js.
        const audioContext = BABYLON.Engine.audioEngine && BABYLON.Engine.audioEngine.audioContext;
        // Valeur mémorisée dans canUseBabylonSound.
        const canUseBabylonSound = !!(audioContext && state.kickSound);

        // Vérification avant d'exécuter la suite.
        if (!canUseBabylonSound) {
            // Appel de log pour appliquer l'action prévue.
            log("Using Kick HTMLAudio fallback because Babylon AudioContext is unavailable");
            // Résultat renvoyé par la fonction.
            return playKickWithHtmlAudio();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.kickSound.isPlaying) {
            // Appel de stop pour appliquer l'action prévue.
            state.kickSound.stop();
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de play pour appliquer l'action prévue.
        state.kickSound.play();
        // Appel de log pour appliquer l'action prévue.
        log("Kick play requested");
        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction playGoalLoop : elle regroupe le traitement de cette partie.
    function playGoalLoop() {
        // Vérification avant d'exécuter la suite.
        if (!state.scene) return false;

        // Appel de log pour appliquer l'action prévue.
        log("playGoalLoop called", {
            // Paramètre de l'appel ou valeur de configuration.
            goalLoaded: state.goalLoaded,
            // Paramètre de l'appel ou valeur de configuration.
            goalLoading: state.goalLoading,
            // Paramètre de l'appel ou valeur de configuration.
            hasGoalSound: !!state.goalSound,
            // Paramètre de l'appel ou valeur de configuration.
            hasGoalHtmlAudio: !!state.goalHtmlAudio,
            // Instruction nécessaire au déroulement de cette partie.
            pendingGoalPlay: state.pendingGoalPlay
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de resumeAudioContextIfNeeded pour appliquer l'action prévue.
        resumeAudioContextIfNeeded();

        // Vérification avant d'exécuter la suite.
        if (!state.goalLoaded) {
            // Mise à jour de pendingGoalPlay.
            state.pendingGoalPlay = true;
            // Appel de log pour appliquer l'action prévue.
            log("Goal not loaded yet, pendingGoalPlay=true");
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!state.goalSound) {
            // Appel de buildGoalSound pour appliquer l'action prévue.
            buildGoalSound();
        // Fermeture du bloc ou de l'appel.
        }

        // Préparation de audioContext avec Babylon.js.
        const audioContext = BABYLON.Engine.audioEngine && BABYLON.Engine.audioEngine.audioContext;
        // Valeur mémorisée dans canUseBabylonSound.
        const canUseBabylonSound = !!(audioContext && state.goalSound);

        // Vérification avant d'exécuter la suite.
        if (!canUseBabylonSound) {
            // Appel de log pour appliquer l'action prévue.
            log("Using Goal HTMLAudio fallback because Babylon AudioContext is unavailable");
            // Résultat renvoyé par la fonction.
            return playGoalWithHtmlAudio();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (state.goalSound.isPlaying) {
            // Appel de stop pour appliquer l'action prévue.
            state.goalSound.stop();
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de play pour appliquer l'action prévue.
        state.goalSound.play();
        // Appel de log pour appliquer l'action prévue.
        log("Goal loop play requested");
        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction stopGoal : elle regroupe le traitement de cette partie.
    function stopGoal() {
        // Vérification avant d'exécuter la suite.
        if (state.goalSound && state.goalSound.isPlaying) {
            // Appel de stop pour appliquer l'action prévue.
            state.goalSound.stop();
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de stopGoalWithHtmlAudio pour appliquer l'action prévue.
        stopGoalWithHtmlAudio();
        // Appel de log pour appliquer l'action prévue.
        log("Goal loop stopped");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction stopAll : elle regroupe le traitement de cette partie.
    function stopAll() {
        // Arrêter tous les sons Babylon
        // Vérification avant d'exécuter la suite.
        if (state.whistleSound && state.whistleSound.isPlaying) {
            // Appel de stop pour appliquer l'action prévue.
            state.whistleSound.stop();
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (state.kickSound && state.kickSound.isPlaying) {
            // Appel de stop pour appliquer l'action prévue.
            state.kickSound.stop();
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (state.goalSound && state.goalSound.isPlaying) {
            // Appel de stop pour appliquer l'action prévue.
            state.goalSound.stop();
        // Fermeture du bloc ou de l'appel.
        }

        // Arrêter tous les HTMLAudio fallbacks
        // Vérification avant d'exécuter la suite.
        if (state.whistleHtmlAudio) {
            // Partie protégée en cas d'erreur.
            try {
                // Appel de pause pour appliquer l'action prévue.
                state.whistleHtmlAudio.pause();
                // Mise à jour de currentTime.
                state.whistleHtmlAudio.currentTime = 0;
            // Gestion de l'erreur si le try échoue.
            } catch (e) {
                // Appel de log pour appliquer l'action prévue.
                log("Whistle HTMLAudio pause skipped", e);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (state.kickHtmlAudio) {
            // Partie protégée en cas d'erreur.
            try {
                // Appel de pause pour appliquer l'action prévue.
                state.kickHtmlAudio.pause();
                // Mise à jour de currentTime.
                state.kickHtmlAudio.currentTime = 0;
            // Gestion de l'erreur si le try échoue.
            } catch (e) {
                // Appel de log pour appliquer l'action prévue.
                log("Kick HTMLAudio pause skipped", e);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (state.goalHtmlAudio) {
            // Partie protégée en cas d'erreur.
            try {
                // Appel de pause pour appliquer l'action prévue.
                state.goalHtmlAudio.pause();
                // Mise à jour de currentTime.
                state.goalHtmlAudio.currentTime = 0;
            // Gestion de l'erreur si le try échoue.
            } catch (e) {
                // Appel de log pour appliquer l'action prévue.
                log("Goal HTMLAudio pause skipped", e);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de log pour appliquer l'action prévue.
        log("All sounds stopped");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setVolume : elle regroupe le traitement de cette partie.
    function setVolume(value) {
        // Mise à jour de soundVolume.
        state.soundVolume = clamp01(value);
        // Appel de applySoundVolumes pour appliquer l'action prévue.
        applySoundVolumes();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setMusicVolume : elle regroupe le traitement de cette partie.
    function setMusicVolume(value) {
        // Mise à jour de musicVolume.
        state.musicVolume = clamp01(value);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction init : elle regroupe le traitement de cette partie.
    function init(scene, options) {
        // Vérification avant d'exécuter la suite.
        if (!scene || state.isLoading || state.isLoaded) return;

        // Valeur mémorisée dans config.
        const config = options || {};
        // Valeur mémorisée dans whistleCandidates.
        const whistleCandidates = buildWhistleCandidates(config);
        // Valeur mémorisée dans kickCandidates.
        const kickCandidates = buildKickCandidates(config);
        // Valeur mémorisée dans goalCandidates.
        const goalCandidates = buildGoalCandidates(config);
        // Vérification avant d'exécuter la suite.
        if (whistleCandidates.length > 0) {
            // Mise à jour de whistleUrl.
            state.whistleUrl = whistleCandidates[0];
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (kickCandidates.length > 0) {
            // Mise à jour de kickUrl.
            state.kickUrl = kickCandidates[0];
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (goalCandidates.length > 0) {
            // Mise à jour de goalUrl.
            state.goalUrl = goalCandidates[0];
        // Fermeture du bloc ou de l'appel.
        }
        // Mise à jour de debug.
        state.debug = !!config.debug;
        // Mise à jour de kickLoading.
        state.kickLoading = true;
        // Mise à jour de goalLoading.
        state.goalLoading = true;

        // Appel de log pour appliquer l'action prévue.
        log("init called", {
            // Paramètre de l'appel ou valeur de configuration.
            whistleUrl: state.whistleUrl,
            // Paramètre de l'appel ou valeur de configuration.
            whistleCandidates,
            // Paramètre de l'appel ou valeur de configuration.
            kickUrl: state.kickUrl,
            // Paramètre de l'appel ou valeur de configuration.
            kickCandidates,
            // Paramètre de l'appel ou valeur de configuration.
            goalUrl: state.goalUrl,
            // Paramètre de l'appel ou valeur de configuration.
            goalCandidates,
            // Instruction nécessaire au déroulement de cette partie.
            debug: state.debug
        // Fermeture du bloc ou de l'appel.
        });

        // Mise à jour de scene.
        state.scene = scene;
        // Mise à jour de isLoading.
        state.isLoading = true;

        // Appel de installAudioUnlockHandlers pour appliquer l'action prévue.
        installAudioUnlockHandlers();

        // Fonction tryLoadCandidate : elle regroupe le traitement de cette partie.
        function tryLoadCandidate(index) {
            // Vérification avant d'exécuter la suite.
            if (index >= whistleCandidates.length) {
                // Mise à jour de isLoading.
                state.isLoading = false;
                // Appel de warn pour appliquer l'action prévue.
                warn("Impossible de charger le son de sifflet: aucun chemin valide", whistleCandidates);
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans candidateUrl.
            const candidateUrl = whistleCandidates[index];
            // Mise à jour de whistleUrl.
            state.whistleUrl = candidateUrl;
            // Mise à jour de assetsManager.
            state.assetsManager = new BABYLON.AssetsManager(scene);

            // Valeur mémorisée dans whistleTask.
            const whistleTask = state.assetsManager.addBinaryFileTask("whistleSoundTask", candidateUrl);
            // Appel de log pour appliquer l'action prévue.
            log("AssetsManager task created", { candidateUrl, attempt: index + 1 });

            // Mise à jour de onSuccess.
            whistleTask.onSuccess = function (task) {
                // Mise à jour de whistleData.
                state.whistleData = task.data;
                // Mise à jour de isLoaded.
                state.isLoaded = true;
                // Mise à jour de isLoading.
                state.isLoading = false;
                // Appel de log pour appliquer l'action prévue.
                log("Whistle binary loaded", {
                    // Paramètre de l'appel ou valeur de configuration.
                    candidateUrl,
                    // Instruction nécessaire au déroulement de cette partie.
                    bytes: state.whistleData ? state.whistleData.byteLength : 0
                // Fermeture du bloc ou de l'appel.
                });
                // Appel de buildWhistleSound pour appliquer l'action prévue.
                buildWhistleSound();

                // Vérification avant d'exécuter la suite.
                if (state.pendingPlay) {
                    // Mise à jour de pendingPlay.
                    state.pendingPlay = false;
                    // Appel de log pour appliquer l'action prévue.
                    log("Running deferred whistle play");
                    // Appel de playWhistle pour appliquer l'action prévue.
                    playWhistle();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            };

            // Mise à jour de onError.
            whistleTask.onError = function (task, message, exception) {
                // Appel de warn pour appliquer l'action prévue.
                warn("Chargement sifflet échoué", {
                    // Paramètre de l'appel ou valeur de configuration.
                    candidateUrl,
                    // Paramètre de l'appel ou valeur de configuration.
                    message,
                    // Paramètre de l'appel ou valeur de configuration.
                    exception,
                    // Instruction nécessaire au déroulement de cette partie.
                    task
                // Fermeture du bloc ou de l'appel.
                });
                // Appel de tryLoadCandidate pour appliquer l'action prévue.
                tryLoadCandidate(index + 1);
            // Fermeture du bloc ou de l'appel.
            };

            // Mise à jour de onFinish.
            state.assetsManager.onFinish = function () {
                // Appel de log pour appliquer l'action prévue.
                log("AssetsManager load finished", { candidateUrl });
            // Fermeture du bloc ou de l'appel.
            };

            // Appel de add pour appliquer l'action prévue.
            state.assetsManager.onTaskErrorObservable.add(function (task) {
                // Appel de warn pour appliquer l'action prévue.
                warn("AssetsManager task error", task && task.name, candidateUrl);
            // Fermeture du bloc ou de l'appel.
            });

            // Appel de log pour appliquer l'action prévue.
            log("AssetsManager load start", { candidateUrl });
            // Appel de load pour appliquer l'action prévue.
            state.assetsManager.load();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction tryLoadKickCandidate : elle regroupe le traitement de cette partie.
        function tryLoadKickCandidate(index) {
            // Vérification avant d'exécuter la suite.
            if (index >= kickCandidates.length) {
                // Mise à jour de kickLoading.
                state.kickLoading = false;
                // Appel de warn pour appliquer l'action prévue.
                warn("Impossible de charger le son de kick: aucun chemin valide", kickCandidates);
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans candidateUrl.
            const candidateUrl = kickCandidates[index];
            // Mise à jour de kickUrl.
            state.kickUrl = candidateUrl;
            // Création de kickAssetsManager.
            const kickAssetsManager = new BABYLON.AssetsManager(scene);

            // Valeur mémorisée dans kickTask.
            const kickTask = kickAssetsManager.addBinaryFileTask("kickSoundTask", candidateUrl);
            // Appel de log pour appliquer l'action prévue.
            log("Kick task created", { candidateUrl, attempt: index + 1 });

            // Mise à jour de onSuccess.
            kickTask.onSuccess = function (task) {
                // Mise à jour de kickData.
                state.kickData = task.data;
                // Mise à jour de kickLoaded.
                state.kickLoaded = true;
                // Mise à jour de kickLoading.
                state.kickLoading = false;
                // Appel de log pour appliquer l'action prévue.
                log("Kick binary loaded", {
                    // Paramètre de l'appel ou valeur de configuration.
                    candidateUrl,
                    // Instruction nécessaire au déroulement de cette partie.
                    bytes: state.kickData ? state.kickData.byteLength : 0
                // Fermeture du bloc ou de l'appel.
                });
                // Appel de buildKickSound pour appliquer l'action prévue.
                buildKickSound();

                // Vérification avant d'exécuter la suite.
                if (state.pendingKickPlay) {
                    // Mise à jour de pendingKickPlay.
                    state.pendingKickPlay = false;
                    // Appel de log pour appliquer l'action prévue.
                    log("Running deferred kick play");
                    // Appel de playKick pour appliquer l'action prévue.
                    playKick();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            };

            // Mise à jour de onError.
            kickTask.onError = function (task, message, exception) {
                // Appel de warn pour appliquer l'action prévue.
                warn("Chargement kick échoué", {
                    // Paramètre de l'appel ou valeur de configuration.
                    candidateUrl,
                    // Paramètre de l'appel ou valeur de configuration.
                    message,
                    // Paramètre de l'appel ou valeur de configuration.
                    exception,
                    // Instruction nécessaire au déroulement de cette partie.
                    task
                // Fermeture du bloc ou de l'appel.
                });
                // Appel de tryLoadKickCandidate pour appliquer l'action prévue.
                tryLoadKickCandidate(index + 1);
            // Fermeture du bloc ou de l'appel.
            };

            // Mise à jour de onFinish.
            kickAssetsManager.onFinish = function () {
                // Appel de log pour appliquer l'action prévue.
                log("Kick assets load finished", { candidateUrl });
            // Fermeture du bloc ou de l'appel.
            };

            // Appel de add pour appliquer l'action prévue.
            kickAssetsManager.onTaskErrorObservable.add(function (task) {
                // Appel de warn pour appliquer l'action prévue.
                warn("Kick task error", task && task.name, candidateUrl);
            // Fermeture du bloc ou de l'appel.
            });

            // Appel de log pour appliquer l'action prévue.
            log("Kick assets load start", { candidateUrl });
            // Appel de load pour appliquer l'action prévue.
            kickAssetsManager.load();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction tryLoadGoalCandidate : elle regroupe le traitement de cette partie.
        function tryLoadGoalCandidate(index) {
            // Vérification avant d'exécuter la suite.
            if (index >= goalCandidates.length) {
                // Mise à jour de goalLoading.
                state.goalLoading = false;
                // Appel de warn pour appliquer l'action prévue.
                warn("Impossible de charger le son de goal: aucun chemin valide", goalCandidates);
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans candidateUrl.
            const candidateUrl = goalCandidates[index];
            // Mise à jour de goalUrl.
            state.goalUrl = candidateUrl;
            // Création de goalAssetsManager.
            const goalAssetsManager = new BABYLON.AssetsManager(scene);

            // Valeur mémorisée dans goalTask.
            const goalTask = goalAssetsManager.addBinaryFileTask("goalSoundTask", candidateUrl);
            // Appel de log pour appliquer l'action prévue.
            log("Goal task created", { candidateUrl, attempt: index + 1 });

            // Mise à jour de onSuccess.
            goalTask.onSuccess = function (task) {
                // Mise à jour de goalData.
                state.goalData = task.data;
                // Mise à jour de goalLoaded.
                state.goalLoaded = true;
                // Mise à jour de goalLoading.
                state.goalLoading = false;
                // Appel de log pour appliquer l'action prévue.
                log("Goal binary loaded", {
                    // Paramètre de l'appel ou valeur de configuration.
                    candidateUrl,
                    // Instruction nécessaire au déroulement de cette partie.
                    bytes: state.goalData ? state.goalData.byteLength : 0
                // Fermeture du bloc ou de l'appel.
                });
                // Appel de buildGoalSound pour appliquer l'action prévue.
                buildGoalSound();

                // Vérification avant d'exécuter la suite.
                if (state.pendingGoalPlay) {
                    // Mise à jour de pendingGoalPlay.
                    state.pendingGoalPlay = false;
                    // Appel de log pour appliquer l'action prévue.
                    log("Running deferred goal play");
                    // Appel de playGoalLoop pour appliquer l'action prévue.
                    playGoalLoop();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            };

            // Mise à jour de onError.
            goalTask.onError = function (task, message, exception) {
                // Appel de warn pour appliquer l'action prévue.
                warn("Chargement goal échoué", {
                    // Paramètre de l'appel ou valeur de configuration.
                    candidateUrl,
                    // Paramètre de l'appel ou valeur de configuration.
                    message,
                    // Paramètre de l'appel ou valeur de configuration.
                    exception,
                    // Instruction nécessaire au déroulement de cette partie.
                    task
                // Fermeture du bloc ou de l'appel.
                });
                // Appel de tryLoadGoalCandidate pour appliquer l'action prévue.
                tryLoadGoalCandidate(index + 1);
            // Fermeture du bloc ou de l'appel.
            };

            // Mise à jour de onFinish.
            goalAssetsManager.onFinish = function () {
                // Appel de log pour appliquer l'action prévue.
                log("Goal assets load finished", { candidateUrl });
            // Fermeture du bloc ou de l'appel.
            };

            // Appel de add pour appliquer l'action prévue.
            goalAssetsManager.onTaskErrorObservable.add(function (task) {
                // Appel de warn pour appliquer l'action prévue.
                warn("Goal task error", task && task.name, candidateUrl);
            // Fermeture du bloc ou de l'appel.
            });

            // Appel de log pour appliquer l'action prévue.
            log("Goal assets load start", { candidateUrl });
            // Appel de load pour appliquer l'action prévue.
            goalAssetsManager.load();
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de tryLoadCandidate pour appliquer l'action prévue.
        tryLoadCandidate(0);
        // Appel de tryLoadKickCandidate pour appliquer l'action prévue.
        tryLoadKickCandidate(0);
        // Appel de tryLoadGoalCandidate pour appliquer l'action prévue.
        tryLoadGoalCandidate(0);
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de matchAudio.
    window.matchAudio = {
        // Paramètre de l'appel ou valeur de configuration.
        init,
        // Paramètre de l'appel ou valeur de configuration.
        playWhistle,
        // Paramètre de l'appel ou valeur de configuration.
        playKick,
        // Paramètre de l'appel ou valeur de configuration.
        playGoalLoop,
        // Paramètre de l'appel ou valeur de configuration.
        stopGoal,
        // Paramètre de l'appel ou valeur de configuration.
        stopAll,
        // Paramètre de l'appel ou valeur de configuration.
        setVolume,
        // Paramètre de l'appel ou valeur de configuration.
        setMusicVolume,
        // Paramètre de l'appel ou valeur de configuration.
        debugPlayWhistle: playWhistle,
        // Paramètre de l'appel ou valeur de configuration.
        debugPlayKick: playKick,
        // Instruction nécessaire au déroulement de cette partie.
        debugPlayGoal: playGoalLoop
    // Fermeture du bloc ou de l'appel.
    };
// Instruction nécessaire au déroulement de cette partie.
})();
