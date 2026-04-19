document.addEventListener("DOMContentLoaded", () => {
    // Lignes de la page Dom à révéler au scroll.
    const rows = document.querySelectorAll(".domRow");
    // Si la page ne contient pas ces lignes, on arrête le script.
    if (!rows.length) return;

    // Méthode moderne pour lancer l'animation quand une ligne entre dans l'écran.
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Une ligne visible reçoit la classe CSS qui déclenche l'animation.
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        // On observe une seule fois chaque ligne.
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                // Une petite partie visible suffit à déclencher l'effet.
                threshold: 0.15,
                // Décale le déclenchement avant le bas exact de l'écran.
                rootMargin: "0px 0px -80px 0px",
            }
        );

        // Branche l'observer sur toutes les lignes.
        rows.forEach((row) => observer.observe(row));
    } else {
        // Fallback pour les navigateurs plus anciens.
        const reveal = () => {
            rows.forEach((row) => {
                // Calcule la position de la ligne dans le viewport.
                const rect = row.getBoundingClientRect();
                // Révèle la ligne quand elle approche du centre visuel.
                if (rect.top < window.innerHeight - 100) {
                    row.classList.add("visible");
                }
            });
        };

        // Détection au scroll et au chargement.
        window.addEventListener("scroll", reveal, { passive: true });
        window.addEventListener("load", reveal);
        // Premier passage immédiat.
        reveal();
    }
});
