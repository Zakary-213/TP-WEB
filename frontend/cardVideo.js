document.addEventListener("DOMContentLoaded", () => {
    // Conteneur média du hero.
    const media = document.getElementById("screenMedia");
    // Élément vidéo principal.
    const video = document.getElementById("heroVideo");
    // Bloc texte superposé à la vidéo.
    const content = document.getElementById("screenContent");
    // Petit texte au-dessus du titre.
    const kicker = document.getElementById("screenKicker");
    // Titre du slide.
    const heading = document.getElementById("screenHeading");
    // Description du slide.
    const text = document.getElementById("screenText");
    // Bouton pour jouer au jeu du slide.
    const playNowBtn = document.getElementById("playNowBtn");
    // Bouton pour regarder la bande-annonce.
    const watchTrailerBtn = document.getElementById("watchTrailerBtn");
    // Conteneur des points de navigation.
    const dotsContainer = document.getElementById("screenDots");

    // Si un élément essentiel manque, on évite toute erreur JavaScript.
    if (!media || !video || !content || !kicker || !heading || !text || !playNowBtn || !watchTrailerBtn || !dotsContainer) {
        return;
    }

    // Données des trois slides du hero.
    const slides = [
        {
            video: "./assets/videos/canvasBO.mp4",
            kicker: "RÉFLEXES • SURVIE • SCORE",
            heading: "ESQUIVE LES MÉTÉORES<br>ET BATS<br>TON RECORD",
            text: "Jeu d'arcade pur : pilote ton vaisseau à travers un champ d'astéroïdes. Plus tu dures, plus le score grimpe. Simple, intense, addictif.",
            playLabel: "Jouer",
            playHref: "/JeuCanvas/index.html"
        },
        {
            video: "./assets/videos/gowBO.mp4",
            kicker: "FOOTBALL • ARCADE • TOURNOI",
            heading: "CHOISIS TON ÉQUIPE<br>ET AFFRONTE<br>L'IA",
            text: "10 équipes françaises, 4 stades, 2 modes de jeu. Lance un tournoi à élimination directe ou défie un ami en 1vs1. Plus tu avances, plus l'IA devient redoutable.",
            playLabel: "Jouer",
            playHref: "/GamesOnWeb/index.html"
        },
        {
            video: "./assets/videos/domBO.mp4",
            kicker: "PUZZLE • LOGIQUE • NÉON",
            heading: "TRACE TON CHEMIN<br>ET BATS<br>LE CHRONO",
            text: "Relie les chiffres dans l'ordre, couvre toute la grille et crée tes propres puzzles dans Neon Zip.",
            playLabel: "Jouer",
            playHref: "/Dom/index.html"
        }
    ];

    // Durée avant changement automatique de slide.
    const AUTO_SWITCH_DELAY = 5000;
    // Durée de lecture courte avant de figer l'aperçu vidéo.
    const FREEZE_PREVIEW_DELAY = 180;
    // Durée du fondu pendant le changement de slide.
    const SWITCH_FADE_DELAY = 420;

    // Index du slide courant.
    let currentIndex = 0;
    // Timeout du changement automatique.
    let autoSwitchTimeout = null;
    // Timeout qui fige l'aperçu vidéo.
    let freezeTimeout = null;
    // Timeout utilisé pendant le fondu de changement.
    let switchTimeout = null;
    // Verrou pour éviter deux changements simultanés.
    let isTransitioning = false;
    // Indique si la vidéo courante est suffisamment chargée.
    let isVideoReady = false;
    // Jeton anti-course pour ignorer les anciens chargements vidéo.
    let currentLoadToken = 0;
    // Mode demandé : aperçu figé ou bande-annonce complète.
    let requestedMode = "frozen"; // "frozen" | "trailer"

    // Annule le timeout de gel vidéo.
    function clearFreezeTimeout() {
        if (freezeTimeout) {
            clearTimeout(freezeTimeout);
            freezeTimeout = null;
        }
    }

    // Annule le timeout de transition.
    function clearSwitchTimeout() {
        if (switchTimeout) {
            clearTimeout(switchTimeout);
            switchTimeout = null;
        }
    }

    // Annule le changement automatique.
    function clearAutoSwitchTimeout() {
        if (autoSwitchTimeout) {
            clearTimeout(autoSwitchTimeout);
            autoSwitchTimeout = null;
        }
    }

    // Programme le passage automatique au slide suivant.
    function scheduleAutoSwitch() {
        clearAutoSwitchTimeout();

        // Pas d'auto-switch pendant une transition ou une bande-annonce.
        if (isTransitioning || requestedMode === "trailer") {
            return;
        }

        autoSwitchTimeout = setTimeout(() => {
            nextSlide();
        }, AUTO_SWITCH_DELAY);
    }

    // Réinitialise le timer d'auto-switch.
    function resetAutoSwitch() {
        scheduleAutoSwitch();
    }

    // Met à jour les textes et le lien du bouton du slide.
    function updateContent(index) {
        const slide = slides[index];

        kicker.textContent = slide.kicker;
        heading.innerHTML = slide.heading;
        text.textContent = slide.text;

        const label = playNowBtn.querySelector("span");
        if (label) {
            label.textContent = slide.playLabel;
        }

        playNowBtn.setAttribute("href", slide.playHref);
    }

    // Crée les points de navigation sous le hero.
    function renderDots() {
        dotsContainer.innerHTML = "";

        slides.forEach((_, index) => {
            // Un bouton par slide.
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "screenDot";
            dot.setAttribute("aria-label", `Vidéo ${index + 1}`);
            dot.dataset.index = index;

            if (index === currentIndex) {
                dot.classList.add("active");
            }

            // Cliquer un point affiche le slide correspondant.
            dot.addEventListener("click", () => {
                requestedMode = "frozen";
                resetAutoSwitch();

                if (index === currentIndex) {
                    applyFrozenState();
                    return;
                }

                if (isTransitioning) {
                    return;
                }

                showSlide(index);
            });

            dotsContainer.appendChild(dot);
        });
    }

    // Met à jour le point actif sans recréer toute la liste.
    function updateDots() {
        const dots = dotsContainer.querySelectorAll(".screenDot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    // Lance la lecture vidéo en gérant les refus navigateur.
    async function safePlay() {
        try {
            await video.play();
            return true;
        } catch (err) {
            console.warn("Video play failed:", err);
            return false;
        }
    }

    // Applique l'état visuel de l'aperçu figé.
    function setFrozenUI() {
        media.classList.remove("trailer-active");
        content.classList.remove("is-hidden");
        video.classList.remove("is-playing");
        video.classList.add("is-frozen");
    }

    // Applique l'état visuel de la bande-annonce.
    function setTrailerUI() {
        media.classList.add("trailer-active");
        content.classList.add("is-hidden");
        video.classList.remove("is-frozen");
        video.classList.add("is-playing");
    }

    // Joue un court instant la vidéo puis la met en pause pour créer un aperçu vivant.
    async function applyFrozenState() {
        requestedMode = "frozen";
        clearFreezeTimeout();
        setFrozenUI();

        if (!isVideoReady) {
            return;
        }

        const played = await safePlay();
        if (!played) {
            return;
        }

        freezeTimeout = setTimeout(() => {
            video.pause();
        }, FREEZE_PREVIEW_DELAY);

        scheduleAutoSwitch();
    }

    // Lance la bande-annonce complète du slide courant.
    async function applyTrailerState() {
        requestedMode = "trailer";
        clearFreezeTimeout();
        clearAutoSwitchTimeout();

        if (!isVideoReady) {
            return;
        }

        setTrailerUI();

        video.pause();
        video.currentTime = 0;

        const played = await safePlay();

        if (!played) {
            requestedMode = "frozen";
            await applyFrozenState();
        }
    }

    // Applique le mode demandé après le chargement d'une vidéo.
    async function applyRequestedMode() {
        if (requestedMode === "trailer") {
            await applyTrailerState();
        } else {
            await applyFrozenState();
        }
    }

    // Charge la source vidéo du slide demandé.
    function loadVideoSource(index) {
        return new Promise((resolve) => {
            // Jeton unique pour ignorer les réponses d'un ancien chargement.
            const loadToken = ++currentLoadToken;
            isVideoReady = false;

            // Stoppe l'ancienne vidéo.
            video.pause();
            clearFreezeTimeout();

            // Succès de chargement vidéo.
            const onLoaded = () => {
                if (loadToken !== currentLoadToken) {
                    return;
                }

                cleanup();
                isVideoReady = true;
                resolve(true);
            };

            // Échec de chargement vidéo.
            const onError = () => {
                if (loadToken !== currentLoadToken) {
                    return;
                }

                cleanup();
                console.warn("Failed to load video:", slides[index].video);
                resolve(false);
            };

            // Nettoie les écouteurs après réussite ou erreur.
            function cleanup() {
                video.removeEventListener("loadeddata", onLoaded);
                video.removeEventListener("canplay", onLoaded);
                video.removeEventListener("error", onError);
            }

            // Plusieurs événements peuvent signaler que la vidéo est prête.
            video.addEventListener("loadeddata", onLoaded);
            video.addEventListener("canplay", onLoaded);
            video.addEventListener("error", onError);

            // Change la source et déclenche le chargement.
            video.src = slides[index].video;
            video.load();
        });
    }

    // Affiche un slide avec transition et chargement vidéo.
    async function showSlide(index) {
        if (isTransitioning) return;

        // Verrouille les changements pendant la transition.
        isTransitioning = true;
        clearFreezeTimeout();
        clearAutoSwitchTimeout();
        clearSwitchTimeout();

        // Ajoute la classe CSS de fondu.
        media.classList.add("is-switching");

        switchTimeout = setTimeout(async () => {
            // Met à jour l'index puis recharge la vidéo.
            currentIndex = index;
            updateDots();

            const loaded = await loadVideoSource(index);
            updateContent(index);

            // Si la vidéo échoue, on restaure un état stable.
            if (!loaded) {
                media.classList.remove("is-switching");
                isTransitioning = false;
                requestedMode = "frozen";
                scheduleAutoSwitch();
                return;
            }

            // Double requestAnimationFrame pour laisser le navigateur appliquer les styles.
            requestAnimationFrame(() => {
                requestAnimationFrame(async () => {
                    media.classList.remove("is-switching");
                    isTransitioning = false;
                    await applyRequestedMode();
                });
            });
        }, SWITCH_FADE_DELAY);
    }

    // Passe au slide suivant en boucle.
    function nextSlide() {
        requestedMode = "frozen";
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Bouton de bande-annonce.
    watchTrailerBtn.addEventListener("click", async () => {
        requestedMode = "trailer";
        clearAutoSwitchTimeout();

        if (isTransitioning) {
            return;
        }

        if (!isVideoReady) {
            return;
        }

        await applyTrailerState();
    });

    // Quand la souris quitte le hero, on revient à l'aperçu figé.
    media.addEventListener("mouseleave", async () => {
        if (requestedMode === "trailer") {
            requestedMode = "frozen";
            await applyFrozenState();
        }
    });

    // À la fin d'une bande-annonce, retour à l'aperçu.
    video.addEventListener("ended", async () => {
        requestedMode = "frozen";
        await applyFrozenState();
    });

    // Initialisation du hero.
    renderDots();
    updateContent(0);
    showSlide(0);
});
