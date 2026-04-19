document.addEventListener('DOMContentLoaded', () => {
    // Overlay de la modale d'authentification.
    const authOverlay = document.getElementById('authModalOverlay');
    // Bouton de fermeture de la modale.
    const closeAuthModalBtn = document.getElementById('closeAuthModal');

    // Boutons qui ouvrent la modale en mode inscription.
    const openSignupModalBtn = document.getElementById('openSignupModal');
    const openSignupModalMobileBtn = document.getElementById('openSignupModalMobile');
    const openRegisterNowModalBtn = document.getElementById('openRegisterNowModal');
    // Bouton hero qui ouvre plutôt la connexion.
    const playNowBtn = document.getElementById('playNowBtn');

    // Onglets connexion / inscription.
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    // Formulaires correspondants.
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Textes dynamiques dans la partie descriptive de la modale.
    const authEyebrow = document.getElementById('authEyebrow');
    const authTitle = document.getElementById('authModalTitle');
    const authText = document.getElementById('authModalText');

    // Affiche l'onglet inscription et adapte les textes.
    function setSignupVisualState() {
        signupToggle?.classList.add('active');
        loginToggle?.classList.remove('active');
        signupForm?.classList.add('active');
        loginForm?.classList.remove('active');

        if (authEyebrow) authEyebrow.textContent = 'ENTRE DANS L\'ARÈNE';
        if (authTitle) authTitle.textContent = 'REJOINS LES JEUX';
        if (authText) {
            authText.textContent = 'Crée ton compte, suis ta progression, sauvegarde tes scores et accède à l\'expérience GamesOnWeb complète.';
        }
    }

    // Affiche l'onglet connexion et adapte les textes.
    function setLoginVisualState() {
        loginToggle?.classList.add('active');
        signupToggle?.classList.remove('active');
        loginForm?.classList.add('active');
        signupForm?.classList.remove('active');

        if (authEyebrow) authEyebrow.textContent = 'BON RETOUR';
        if (authTitle) authTitle.textContent = 'CONNEXION';
        if (authText) {
            authText.textContent = 'Accède à ton compte, continue ton parcours et replonge dans l\'expérience GamesOnWeb.';
        }
    }

    // Ouvre la modale dans le mode demandé.
    function openModal(mode = 'signup') {
        if (!authOverlay) return;

        // display:flex rend l'overlay présent avant la transition CSS.
        authOverlay.style.display = 'flex';
        authOverlay.offsetHeight; // force reflow pour activer la transition
        authOverlay.classList.add('is-open');
        // Accessibilité : l'overlay n'est plus caché.
        authOverlay.setAttribute('aria-hidden', 'false');
        // Bloque le scroll derrière la modale.
        document.body.style.overflow = 'hidden';

        // Choisit l'onglet initial.
        if (mode === 'login') {
            setLoginVisualState();
        } else {
            setSignupVisualState();
        }
    }

    // Ferme la modale d'authentification.
    function closeModal() {
        if (!authOverlay) return;

        // Lance la transition de fermeture.
        authOverlay.classList.remove('is-open');
        authOverlay.setAttribute('aria-hidden', 'true');
        // Réactive le scroll de la page.
        document.body.style.overflow = '';

        // Retire l'overlay du stacking context après la transition
        // pour ne plus perturber les événements souris (mouseleave, hover)
        setTimeout(() => {
            // Si la modale n'a pas été rouverte entre-temps, on la masque vraiment.
            if (!authOverlay.classList.contains('is-open')) {
                authOverlay.style.display = 'none';
            }
        }, 420);
    }

    // Boutons qui ouvrent la modale en mode connexion.
    const openLoginModalBtn = document.getElementById('openLoginModal');
    const openLoginModalMobileBtn = document.getElementById('openLoginModalMobile');

    // Ouverture inscription desktop.
    openSignupModalBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signup');
    });

    // Ouverture inscription mobile.
    openSignupModalMobileBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signup');
    });

    // Ouverture connexion desktop.
    openLoginModalBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
    });

    // Ouverture connexion mobile.
    openLoginModalMobileBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
    });

    // CTA d'inscription dans la page.
    openRegisterNowModalBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signup');
    });

    // CTA de jeu : si l'utilisateur n'est pas connecté, on montre la connexion.
    playNowBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
    });

    // Fermeture via le bouton X.
    closeAuthModalBtn?.addEventListener('click', closeModal);

    // Clic sur le fond de l'overlay pour fermer.
    authOverlay?.addEventListener('click', (e) => {
        if (e.target === authOverlay) {
            closeModal();
        }
    });

    // Touche Échap pour fermer la modale.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authOverlay?.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Bascule manuelle vers inscription.
    signupToggle?.addEventListener('click', () => {
        setSignupVisualState();
    });

    // Bascule manuelle vers connexion.
    loginToggle?.addEventListener('click', () => {
        setLoginVisualState();
    });

    // API globale utilisée par app.js et score.js pour ouvrir/fermer la modale.
    window.authModalController = {
        openModal,
        closeModal,
        setSignupVisualState,
        setLoginVisualState
    };
});
