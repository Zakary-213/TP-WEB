/* ========================================================
   GAMES ON WEB — Animations & interactions
   ======================================================== */
(() => {
    // Animations au scroll sur les rangées règles
    // Sélectionne toutes les lignes de contenu GamesOnWeb.
    const rows = document.querySelectorAll(".gowRow");
    if (rows.length) {
        // Utilise IntersectionObserver si disponible.
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        // Rend la ligne visible quand elle entre dans le viewport.
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    // Déclenche quand 15% de l'élément est visible.
                    threshold: 0.15,
                    // Anticipe l'animation avant le bas de l'écran.
                    rootMargin: "0px 0px -80px 0px",
                }
            );
            // Observe toutes les lignes de règles.
            rows.forEach((row) => observer.observe(row));
        } else {
            // Fallback basé sur le scroll pour les anciens navigateurs.
            const reveal = () => {
                rows.forEach((row) => {
                    // Mesure la position de la ligne dans l'écran.
                    const rect = row.getBoundingClientRect();
                    // Ajoute la classe visible quand la ligne arrive assez haut.
                    if (rect.top < window.innerHeight - 100) {
                        row.classList.add("visible");
                    }
                });
            };
            // Écoute le scroll sans bloquer la fluidité de la page.
            window.addEventListener("scroll", reveal, { passive: true });
            // Vérifie aussi au chargement.
            window.addEventListener("load", reveal);
            // Lance une première vérification.
            reveal();
        }
    }

    // Onglets Clavier / Manette
    // Boutons d'onglet des contrôles.
    const tabs = document.querySelectorAll(".gowControlsTab");
    // Panneaux associés aux onglets.
    const panels = document.querySelectorAll(".gowControlsPanel");

    // Chaque clic active l'onglet choisi et masque les autres panneaux.
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            // Id du panneau cible stocké dans data-target.
            const target = tab.getAttribute("data-target");

            // Réinitialise l'état actif.
            tabs.forEach((t) => t.classList.remove("active"));
            panels.forEach((p) => p.classList.remove("active"));

            // Active l'onglet cliqué.
            tab.classList.add("active");
            // Affiche le panneau correspondant s'il existe.
            const panel = document.getElementById(target);
            if (panel) panel.classList.add("active");
        });
    });
})();
