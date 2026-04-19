document.addEventListener('DOMContentLoaded', () => {

    // Empêche le navigateur de restaurer automatiquement l'ancienne position de scroll.
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Après connexion/déconnexion, on force le retour en haut de page.
    if (sessionStorage.getItem('tpweb_force_scroll_top') === 'true') {
        sessionStorage.removeItem('tpweb_force_scroll_top');

        window.scrollTo(0, 0);

        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
        });

        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }

    // Boutons et éléments principaux de navigation.
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const navMenuToggle = document.getElementById('navMenuToggle');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const navbar = document.querySelector('.navbar');

    // Ferme le menu mobile et remet les attributs d'accessibilité à jour.
    const closeMobileMenu = () => {
        if (!navbar || !navMenuToggle || !mobileNavMenu) return;

        navbar.classList.remove('menu-open');
        navMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNavMenu.setAttribute('aria-hidden', 'true');
    };

    // Déconnecte l'utilisateur et recharge la page dans un état propre.
    const handleLogout = () => {
        localStorage.removeItem('tpweb_is_authenticated');
        localStorage.removeItem('tpweb_user_id');
        localStorage.removeItem('tpweb_username');
        setGamesLocked(true);
        syncAuthUi();
        closeMobileMenu();
        sessionStorage.setItem('tpweb_force_scroll_top', 'true');
        window.location.reload();
    };

    // Boutons de déconnexion desktop et mobile.
    logoutBtn?.addEventListener('click', handleLogout);
    mobileLogoutBtn?.addEventListener('click', handleLogout);

    // Ouvre ou ferme le menu mobile.
    navMenuToggle?.addEventListener('click', () => {
        if (!navbar || !mobileNavMenu) return;

        const isOpen = navbar.classList.toggle('menu-open');
        navMenuToggle.setAttribute('aria-expanded', String(isOpen));
        mobileNavMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Ferme le menu mobile quand un lien est sélectionné.
    mobileNavMenu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Échap ferme aussi le menu mobile.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMobileMenu();
    });


    // Clé localStorage qui représente l'état connecté/déconnecté.
    const AUTH_STATE_KEY = 'tpweb_is_authenticated';
    // Liens qui doivent être verrouillés tant que l'utilisateur n'est pas connecté.
    const gameLinks = document.querySelectorAll('.gamePlayButton, #playNowBtn, #awardsMoreBtn, .requiresAuthPlay');
    const openLoginModalBtn = document.getElementById('openLoginModal');
    const registerNowBtn = document.getElementById('openRegisterNowModal');
    const featuredGamesSection = document.querySelector('.featuredGamesSection');
    const playNowBtn = document.getElementById('playNowBtn');

    // Active/désactive les liens de jeu selon l'état d'authentification.
    const setGamesLocked = (locked) => {
        gameLinks.forEach((link) => {
            link.classList.toggle('is-locked', locked);
            link.setAttribute('aria-disabled', String(locked));

            if (locked) {
                link.setAttribute('tabindex', '-1');
            } else {
                link.removeAttribute('tabindex');
            }
        });
    };

    // Vérifie si l'utilisateur est considéré comme connecté côté frontend.
    const isAuthenticated = () => localStorage.getItem(AUTH_STATE_KEY) === 'true';

    // URL API configurée au build, surtout utile en production.
    const configuredApiBaseUrl = (window.__APP_CONFIG__ && window.__APP_CONFIG__.API_BASE_URL)
        ? window.__APP_CONFIG__.API_BASE_URL.replace(/\/$/, '')
        : '';

    // En local, on appelle la même origine ; en production, l'API Railway.
    const isLocalRuntime = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const apiBaseUrl = isLocalRuntime ? '' : configuredApiBaseUrl;

    // Construit une URL API propre, avec ou sans slash au début.
    const toApiUrl = (path) => {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${apiBaseUrl}${normalizedPath}`;
    };

    // Éléments du formulaire d'authentification.
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const messageDiv = document.getElementById('message');

    // Ouvre la popup d'authentification directement sur l'onglet connexion.
    const openLoginPopup = () => {
        if (openLoginModalBtn) {
            openLoginModalBtn.click();
        }

        if (loginToggle && signupToggle && loginForm && signupForm) {
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        }
    };

    // Met à jour l'interface selon l'état connecté/déconnecté.
    const syncAuthUi = () => {
        const loggedIn = isAuthenticated();
        const username = localStorage.getItem('tpweb_username') || 'Joueur';

        // Éléments desktop et mobile à synchroniser.
        const navAuthButtons = document.querySelectorAll('.navAuthButtons');
        const navUserPanel   = document.getElementById('navUserPanel');
        const navUserText    = document.getElementById('navUserText');
        const mobileNavUserPanel = document.getElementById('mobileNavUserPanel');
        const mobileNavUserText = document.getElementById('mobileNavUserText');

        navAuthButtons.forEach((buttons) => {
            buttons.style.display = loggedIn ? 'none' : 'flex';
        });
        if (navUserPanel)   navUserPanel.style.display   = loggedIn ? 'flex' : 'none';
        if (navUserText)    navUserText.textContent = `Bonjour, ${username}`;
        if (mobileNavUserPanel) mobileNavUserPanel.style.display = loggedIn ? 'flex' : 'none';
        if (mobileNavUserText) mobileNavUserText.textContent = `Bonjour, ${username}`;

        if (registerNowBtn) {
            registerNowBtn.textContent = loggedIn ? 'VOIR LES JEUX' : "S'INSCRIRE MAINTENANT";
        }
    };

    // Initialise les liens et la navigation au chargement.
    setGamesLocked(!isAuthenticated());
    syncAuthUi();

    // Bloque tous les liens de jeu si l'utilisateur n'est pas connecté.
    gameLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (!isAuthenticated()) {
                event.preventDefault();
                event.stopImmediatePropagation();
                openLoginPopup();
                showMessage('Connecte-toi d\'abord pour accéder au jeu.', 'error');
            }
        }, true);
    });

    // Gestion spéciale du bouton hero "Jouer", dont le href change selon le slide.
    if (playNowBtn) {
        playNowBtn.addEventListener('click', (event) => {
            const targetHref = playNowBtn.getAttribute('href');

            if (!isAuthenticated()) {
                event.preventDefault();
                event.stopImmediatePropagation();
                openLoginPopup();
                showMessage('Connecte-toi d\'abord pour accéder au jeu.', 'error');
                return;
            }

            if (targetHref && targetHref !== '#') {
                event.preventDefault();
                event.stopImmediatePropagation();
                window.location.href = targetHref;
            }
        }, true);
    }

    // Si l'utilisateur est connecté, le CTA d'inscription descend vers les jeux.
    if (registerNowBtn) {
        registerNowBtn.addEventListener('click', (event) => {
            if (!isAuthenticated()) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            if (featuredGamesSection) {
                featuredGamesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, true);
    }

    // Toggle between Login and Signup
    loginToggle.addEventListener('click', () => {
        loginToggle.classList.add('active');
        signupToggle.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        clearMessage();
    });

    signupToggle.addEventListener('click', () => {
        signupToggle.classList.add('active');
        loginToggle.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        clearMessage();
    });
    // Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        // Empêche le rechargement classique du formulaire.
        e.preventDefault();
        // Récupère les champs de création de compte.
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        try {
            // Envoie la demande d'inscription au backend.
            const response = await fetch(toApiUrl('/api/auth/signup'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            // Si l'inscription réussit, on connecte directement l'utilisateur côté frontend.
            if (data.success) {
                localStorage.setItem(AUTH_STATE_KEY, 'true');
                localStorage.setItem('tpweb_user_id', data.data.id);
                localStorage.setItem('tpweb_username', data.data.username);
                showMessage(`Bienvenue ${data.data.username} !`, 'success');

                loginForm.reset();
                setGamesLocked(false);

                // Affiche une animation de chargement avant fermeture de la modale.
                const loadingOverlay = document.getElementById('authLoadingOverlay');
                if (loadingOverlay) loadingOverlay.classList.add('is-active');

                setTimeout(() => {
                    // Ferme la modale, synchronise l'UI, puis recharge la page.
                    if (loadingOverlay) loadingOverlay.classList.remove('is-active');
                    window.authModalController?.closeModal();
                    syncAuthUi();

                    setTimeout(() => {
                        sessionStorage.setItem('tpweb_force_scroll_top', 'true');
                        window.location.reload();
                    }, 150);
                }, 3000);
            } else {
                // Message métier renvoyé par le backend.
                showMessage(data.message || 'Erreur lors de l\'inscription', 'error');
            }
        } catch (error) {
            // Erreur réseau ou serveur indisponible.
            showMessage('Erreur de connexion au serveur', 'error');
        }
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        // Empêche le rechargement de page.
        e.preventDefault();
        // Récupère les identifiants.
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            // Envoie la demande de connexion au backend.
            const response = await fetch(toApiUrl('/api/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // Connexion réussie : on stocke les informations nécessaires localement.
            if (data.success) {
                localStorage.setItem(AUTH_STATE_KEY, 'true');
                localStorage.setItem('tpweb_user_id', data.data.id);
                localStorage.setItem('tpweb_username', data.data.username);
                showMessage(`Bienvenue ${data.data.username} !`, 'success');

                loginForm.reset();
                setGamesLocked(false);

                // Overlay de chargement pour rendre la transition plus propre.
                const loadingOverlay = document.getElementById('authLoadingOverlay');
                if (loadingOverlay) loadingOverlay.classList.add('is-active');

                setTimeout(() => {
                    // Ferme la modale et recharge pour mettre toute la page à jour.
                    if (loadingOverlay) loadingOverlay.classList.remove('is-active');
                    window.authModalController?.closeModal();
                    syncAuthUi();

                    setTimeout(() => {
                        sessionStorage.setItem('tpweb_force_scroll_top', 'true');
                        window.location.reload();
                    }, 150);
                }, 3000);
            } else {
                // Identifiants refusés ou message backend.
                showMessage(data.message || 'Identifiants invalides', 'error');
            }
        } catch (error) {
            // Erreur réseau ou serveur inaccessible.
            showMessage('Erreur de connexion au serveur', 'error');
        }
    });

    // Affiche un message dans la modale d'authentification.
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }

    // Cache et vide le message d'authentification.
    function clearMessage() {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
    }
});
