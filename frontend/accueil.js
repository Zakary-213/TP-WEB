document.addEventListener("DOMContentLoaded", () => {

    // Onglets qui changent le jeu présenté dans la section awards.
    const tabs = document.querySelectorAll(".awardsTab");
    // Grille contenant les cartes d'images.
    const grid = document.getElementById("awardsGrid");
    // Cartes animées de la grille.
    const cards = document.querySelectorAll(".awardCard");
    // Bouton qui lance le jeu sélectionné.
    const button = document.getElementById("awardsMoreBtn");
    // Bouton qui mène vers la page de détails du jeu.
    const detailsBtn = document.getElementById("awardsDetailsBtn");

    // Index du jeu actuellement affiché.
    let currentIndex = 0;
    // Verrou pour éviter deux transitions simultanées.
    let isTransitioning = false;
    // Timeouts utilisés pour faire apparaître les cartes en cascade.
    let spawnTimeouts = [];

    // Images affichées pour chaque jeu.
    const gamesData = [
        ["./assets/images/spread.png","./assets/images/split.png","./assets/images/enemy.png","./assets/images/pierce.png"],
        ["./assets/images/gowDemi.png","./assets/images/gowPOV.png","./assets/images/gowBroadcast.png","./assets/images/gowFinale.png"],
        ["./assets/images/partie5Neon1.png","./assets/images/partie5Neon2.png","./assets/images/partie5Neon3.png","./assets/images/partie5Neon4.png"]
    ];

    // Liens directs vers les jeux.
    const gameHrefs    = ["/JeuCanvas/index.html", "/GamesOnWeb/index.html", "/Dom/index.html"];
    // Liens vers les pages explicatives.
    const detailsHrefs = ["/canvas.html",          "/gow.html",              "/dom.html"];

    // Rend visibles les boutons d'action.
    function showButtons() {
        if (button)     button.classList.add("is-visible");
        if (detailsBtn) detailsBtn.classList.add("is-visible");
    }

    // Cache les boutons pendant les transitions.
    function hideButtons() {
        if (button)     button.classList.remove("is-visible");
        if (detailsBtn) detailsBtn.classList.remove("is-visible");
    }

    // Met à jour les href selon le jeu actif.
    function updateButtonHrefs(index) {
        if (button)     button.setAttribute("href", gameHrefs[index]    || "#");
        if (detailsBtn) detailsBtn.setAttribute("href", detailsHrefs[index] || "#");
    }

    // Stocke l'index actif dans un data-attribute utilisé par le CSS.
    function updateActiveGame(index) {
        if (grid) grid.dataset.activeGame = String(index);
    }

    // Charge les images des cartes avec un effet d'apparition décalé.
    function spawnCards(images, onAllLoaded) {
        // Annule les anciens timeouts pour éviter une transition en retard.
        spawnTimeouts.forEach(id => clearTimeout(id));
        spawnTimeouts = [];

        // Compteur d'images chargées.
        let loadedCount = 0;
        cards.forEach((card, i) => {
            // Image contenue dans la carte.
            const img = card.querySelector("img");

            // Remet la carte dans l'état caché.
            card.classList.remove("is-loaded");
            img.style.opacity = 0;
            img.removeAttribute('src');

            // Décale l'apparition de chaque carte.
            const t = setTimeout(() => {
                const desired = images[i];
                const withoutDot = desired.replace(/^\.\//, '');

                // Appelé quand une carte est considérée chargée et animée.
                const markLoaded = () => {
                    loadedCount++;
                    if (loadedCount >= images.length) {
                        if (typeof onAllLoaded === 'function') onAllLoaded();
                        else setTimeout(showButtons, 300);
                    }
                };

                // Quand l'image est chargée, on lance l'animation CSS.
                img.onload = () => {
                    setTimeout(() => {
                        card.classList.add("is-loaded");
                        let finished = false;
                        // Attend la fin de transition pour compter la carte comme prête.
                        const onTrans = (ev) => {
                            if (ev.target !== img) return;
                            if (ev.propertyName !== 'opacity' && ev.propertyName !== 'transform') return;
                            if (finished) return;
                            finished = true;
                            img.removeEventListener('transitionend', onTrans);
                            clearTimeout(fallback);
                            markLoaded();
                        };

                        // Fallback si transitionend ne se déclenche pas.
                        const fallback = setTimeout(() => {
                            if (finished) return;
                            finished = true;
                            img.removeEventListener('transitionend', onTrans);
                            markLoaded();
                        }, 1200);

                        img.addEventListener('transitionend', onTrans);
                    }, 100);
                };

                // En cas d'erreur, tente une variante de chemin puis révèle quand même la carte.
                img.onerror = (e) => {
                    console.error('image error for card', i, withoutDot, e);
                    if (withoutDot !== desired && (!img.src || img.src.endsWith(desired))) {
                        img.src = withoutDot;
                        return;
                    }
                    setTimeout(() => {
                        card.classList.add('is-loaded');
                        markLoaded();
                    }, 120);
                };

                // Déclenche le chargement de l'image.
                img.src = withoutDot;
            }, i * 500);
            spawnTimeouts.push(t);
        });
    }

    // Change le jeu affiché dans la section.
    function switchGame(newIndex) {
        // Ignore le clic sur l'onglet déjà actif.
        if (newIndex === currentIndex) return;
        // Évite les changements pendant une animation.
        if (isTransitioning) return;
        isTransitioning = true;

        // Direction utilisée pour l'animation de sortie.
        const direction = newIndex > currentIndex ? "left" : "right";

        hideButtons();

        // Lance l'animation de sortie de la grille.
        grid.classList.add(direction === "left" ? "is-left" : "is-right");

        setTimeout(() => {
            // Cache les anciennes cartes avant de charger les nouvelles.
            cards.forEach(card => card.classList.remove("is-loaded"));

            // Les deux conditions suivantes doivent être vraies pour finir proprement.
            let imagesLoaded = false;
            let transitionDone = false;

            // Fin de transition : on déverrouille et on montre les boutons.
            const finish = () => {
                isTransitioning = false;
                showButtons();
            };

            // Appelé quand toutes les images ont fini leur animation.
            const onAllLoaded = () => {
                imagesLoaded = true;
                if (transitionDone) finish();
            };

            // Appelé quand la grille revient en place.
            const onTransitionBack = (e) => {
                if (e.target !== grid) return;
                if (e.propertyName !== 'transform' && e.propertyName !== 'opacity') return;
                grid.removeEventListener('transitionend', onTransitionBack);
                transitionDone = true;
                if (imagesLoaded) finish();
            };

            // Met à jour l'état puis recharge les cartes.
            updateActiveGame(newIndex);
            spawnCards(gamesData[newIndex], onAllLoaded);

            // Attend la transition CSS de retour.
            grid.addEventListener('transitionend', onTransitionBack);
            grid.classList.remove("is-left", "is-right");

        }, 600);

        // Met à jour l'onglet actif.
        tabs.forEach(t => t.classList.remove("active"));
        tabs[newIndex].classList.add("active");

        // Met à jour les liens des boutons.
        updateButtonHrefs(newIndex);

        // Stocke le nouvel index courant.
        currentIndex = newIndex;
    }

    // Branche chaque onglet sur son index.
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => switchGame(index));
    });

    // Initialisation de la section au premier jeu.
    updateButtonHrefs(0);
    updateActiveGame(0);
    spawnCards(gamesData[0], () => {
        setTimeout(showButtons, 300);
    });
});
