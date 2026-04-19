/* ========================================================
   CANVAS — Animations au scroll
   ======================================================== */

(() => {
    // Lignes de règles qui doivent apparaître progressivement au scroll.
    const rows = document.querySelectorAll(".ruleRow");
    // Si la page ne contient pas ces éléments, ce script ne fait rien.
    if (!rows.length) return;

    // IntersectionObserver est la méthode moderne pour détecter l'entrée dans l'écran.
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Quand une ligne devient visible, on ajoute la classe d'animation.
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        // Une fois révélée, on arrête de l'observer.
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                // Déclenche quand environ 15% de la ligne est visible.
                threshold: 0.15,
                // Déclenche un peu avant le bas de l'écran.
                rootMargin: "0px 0px -80px 0px",
            }
        );

        // Observe toutes les lignes de règles.
        rows.forEach((row) => observer.observe(row));
    } else {
        // Fallback pour les navigateurs sans IntersectionObserver.
        const reveal = () => {
            rows.forEach((row) => {
                // Position de la ligne dans le viewport.
                const rect = row.getBoundingClientRect();
                // Si la ligne est assez haute dans l'écran, on la révèle.
                if (rect.top < window.innerHeight - 100) {
                    row.classList.add("visible");
                }
            });
        };
        // Relance la détection au scroll.
        window.addEventListener("scroll", reveal, { passive: true });
        // Relance aussi au chargement.
        window.addEventListener("load", reveal);
        // Premier passage immédiat.
        reveal();
    }
})();
