// js/ui/mainMenu.js
// Menu principal: preview video on hover/focus, with optional close action.

// Appel de function pour appliquer l'action prévue.
(function () {
    // Instruction nécessaire au déroulement de cette partie.
    "use strict";

    // Récupération de l'élément HTML menu.
    var menu = document.getElementById("main-menu");
    // Vérification avant d'exécuter la suite.
    if (!menu) return;

    // Valeur mémorisée dans tiles.
    var tiles = menu.querySelectorAll(".menu-tile[data-preview]");
    // Valeur mémorisée dans tournamentTile.
    var tournamentTile = menu.querySelector(".menu-tile[data-preview='tournament']");
    // Valeur mémorisée dans versusTile.
    var versusTile = menu.querySelector(".menu-tile[data-preview='versus']");
    // Valeur mémorisée dans scoreTile.
    var scoreTile = menu.querySelector(".menu-tile[data-preview='score']");
    // Valeur mémorisée dans settingsTile.
    var settingsTile = menu.querySelector(".menu-tile--settings");
    // Valeur mémorisée dans previewFrames.
    var previewFrames = menu.querySelectorAll(".menu-preview-frame");
    // Valeur mémorisée dans closeButtons.
    var closeButtons = menu.querySelectorAll("[data-menu-action='close']");
    // Valeur mémorisée dans focusable.
    var focusable = Array.prototype.slice.call(menu.querySelectorAll(".menu-tile"));
    // Valeur mémorisée dans lastNavAt.
    var lastNavAt = 0;
    // Valeur mémorisée dans lastSubmitPressed.
    var lastSubmitPressed = false;

    // Récupération de l'élément HTML versusOverlay.
    var versusOverlay = document.getElementById("versus-controls-overlay");
    // Récupération de l'élément HTML versusCloseBtn.
    var versusCloseBtn = document.getElementById("versus-controls-close-btn");
    // Récupération de l'élément HTML versusConfirmBtn.
    var versusConfirmBtn = document.getElementById("versus-controls-confirm-btn");
    // Récupération de l'élément HTML versusKeyBtns.
    var versusKeyBtns = document.querySelectorAll(".settings-keybind-btn[data-action-p2]");
    // Récupération de l'élément HTML versusSkinOverlay.
    var versusSkinOverlay = document.getElementById("versus-skin-overlay");
    // Récupération de l'élément HTML versusSkinCloseBtn.
    var versusSkinCloseBtn = document.getElementById("versus-skin-close-btn");
    // Récupération de l'élément HTML versusSkinPrevBtn.
    var versusSkinPrevBtn = document.getElementById("versus-skin-prev-btn");
    // Récupération de l'élément HTML versusSkinNextBtn.
    var versusSkinNextBtn = document.getElementById("versus-skin-next-btn");
    // Récupération de l'élément HTML versusSkinConfirmBtn.
    var versusSkinConfirmBtn = document.getElementById("versus-skin-confirm-btn");
    // Récupération de l'élément HTML versusSkinCanvas.
    var versusSkinCanvas = document.getElementById("versus-skin-canvas");
    // Récupération de l'élément HTML versusSkinIndicators.
    var versusSkinIndicators = document.getElementById("versus-skin-indicators");
    // Récupération de l'élément HTML versusSkinBackBtn.
    var versusSkinBackBtn = document.getElementById("versus-skin-back-btn");
    // Récupération de l'élément HTML skinList.
    var skinList = document.getElementById("skinList");
    // Récupération de l'élément HTML stageBg.
    var stageBg = document.getElementById("stageBg");
    // Récupération de l'élément HTML stageGlow.
    var stageGlow = document.getElementById("stageGlow");
    // Récupération de l'élément HTML skinHeaderMode.
    var skinHeaderMode = document.getElementById("skinHeaderMode");
    // Récupération de l'élément HTML skinHeaderStep.
    var skinHeaderStep = document.getElementById("skinHeaderStep");
    // Récupération de l'élément HTML skinPlayerBadge.
    var skinPlayerBadge = document.getElementById("skinPlayerBadge");
    // Récupération de l'élément HTML playerNum.
    var playerNum = document.getElementById("playerNum");
    // Récupération de l'élément HTML ratingVal.
    var ratingVal = document.getElementById("ratingVal");
    // Récupération de l'élément HTML playerName.
    var playerName = document.getElementById("playerName");
    // Récupération de l'élément HTML playerPos.
    var playerPos = document.getElementById("playerPos");
    // Récupération de l'élément HTML statBars.
    var statBars = document.getElementById("statBars");
    // Récupération de l'élément HTML skinDescText.
    var skinDescText = document.getElementById("skinDescText");
    // Récupération de l'élément HTML unlockPill.
    var unlockPill = document.getElementById("unlockPill");
    // Valeur mémorisée dans statMini.
    var statMini = {
        // Appel de getElementById pour appliquer l'action prévue.
        s1: document.getElementById("s1"),
        // Appel de getElementById pour appliquer l'action prévue.
        s2: document.getElementById("s2"),
        // Appel de getElementById pour appliquer l'action prévue.
        s3: document.getElementById("s3"),
        // Appel de getElementById pour appliquer l'action prévue.
        s4: document.getElementById("s4")
    // Fermeture du bloc ou de l'appel.
    };
    // Valeur mémorisée dans listeningP2Action.
    var listeningP2Action = null;
    // Valeur mémorisée dans p2Binds.
    var p2Binds = {};
    // Valeur mémorisée dans p1SkinIndex.
    var p1SkinIndex = 0;
    // Valeur mémorisée dans p2SkinIndex.
    var p2SkinIndex = 0;
    // Valeur mémorisée dans currentSkinPlayer.
    var currentSkinPlayer = 2;
    // Valeur mémorisée dans lastSkinNavAt.
    var lastSkinNavAt = 0;
    // Valeur mémorisée dans lastSkinSubmitPressed.
    var lastSkinSubmitPressed = false;
    // Valeur mémorisée dans lastSkinBackPressed.
    var lastSkinBackPressed = false;
    // Valeur mémorisée dans P1_SKIN_STORAGE_KEY.
    var P1_SKIN_STORAGE_KEY = "gow-player1-skin-ui";
    // Valeur mémorisée dans P1_SKIN_MESH_STORAGE_KEY.
    var P1_SKIN_MESH_STORAGE_KEY = "gow-player1-skin-mesh-index";
    // Valeur mémorisée dans P2_SKIN_STORAGE_KEY.
    var P2_SKIN_STORAGE_KEY = "gow-player2-skin-ui";
    // Valeur mémorisée dans P2_SKIN_MESH_STORAGE_KEY.
    var P2_SKIN_MESH_STORAGE_KEY = "gow-player2-skin-mesh-index";
    // Valeur mémorisée dans VERSUS_STAGE_STORAGE_KEY.
    var VERSUS_STAGE_STORAGE_KEY = "gow-versus-stage-ui";

    // Valeur mémorisée dans skinPreviewEngine.
    var skinPreviewEngine = null;
    // Valeur mémorisée dans skinPreviewScene.
    var skinPreviewScene = null;
    // Valeur mémorisée dans skinPreviewCamera.
    var skinPreviewCamera = null;
    // Valeur mémorisée dans skinPreviewSpinRoot.
    var skinPreviewSpinRoot = null;
    // Valeur mémorisée dans skinPreviewPoseRoot.
    var skinPreviewPoseRoot = null;
    // Valeur mémorisée dans skinPreviewMeshes.
    var skinPreviewMeshes = [];
    // Valeur mémorisée dans skinPreviewLoaded.
    var skinPreviewLoaded = false;
    // Valeur mémorisée dans skinPreviewLoading.
    var skinPreviewLoading = false;
    // Valeur mémorisée dans skinPreviewRenderLoopStarted.
    var skinPreviewRenderLoopStarted = false;
    // Valeur mémorisée dans versusFlowStep.
    var versusFlowStep = "controls";
    // Valeur mémorisée dans selectedVersusStageIndex.
    var selectedVersusStageIndex = 0;
    // Valeur mémorisée dans versusStageOptions.
    var versusStageOptions = [
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "huitieme",
            // Paramètre de l'appel ou valeur de configuration.
            order: "01",
            // Paramètre de l'appel ou valeur de configuration.
            name: "HUITIEME",
            // Paramètre de l'appel ou valeur de configuration.
            sub: "DE FINALE",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Entrée de tournoi",
            // Paramètre de l'appel ou valeur de configuration.
            color: "#00aaff",
            // Paramètre de l'appel ou valeur de configuration.
            color2: "#0066cc",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(0,140,255,0.12)",
            // Appel de rgba pour appliquer l'action prévue.
            bgTo: "rgba(0,60,140,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(0,170,255,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Le point de départ du tournoi. Ambiance ouverte, lecture claire et rythme immédiat.",
            // Paramètre de l'appel ou valeur de configuration.
            tier: "HUITIEME",
            // Appel de rgba pour appliquer l'action prévue.
            tierBg: "rgba(0,170,255,0.12)",
            // Paramètre de l'appel ou valeur de configuration.
            tierCol: "#00aaff",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(0,170,255,0.12)",
            // Paramètre de l'appel ou valeur de configuration.
            unlockCol: "#00aaff",
            // Instruction nécessaire au déroulement de cette partie.
            unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "quart",
            // Paramètre de l'appel ou valeur de configuration.
            order: "02",
            // Paramètre de l'appel ou valeur de configuration.
            name: "QUART",
            // Paramètre de l'appel ou valeur de configuration.
            sub: "DE FINALE",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Montée en intensité",
            // Paramètre de l'appel ou valeur de configuration.
            color: "#7fff00",
            // Paramètre de l'appel ou valeur de configuration.
            color2: "#4db800",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(100,255,0,0.10)",
            // Appel de rgba pour appliquer l'action prévue.
            bgTo: "rgba(40,100,0,0.04)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(127,255,0,0.32)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Les tribunes se resserrent, chaque duel compte et le tempo devient plus tendu.",
            // Paramètre de l'appel ou valeur de configuration.
            tier: "QUART",
            // Appel de rgba pour appliquer l'action prévue.
            tierBg: "rgba(127,255,0,0.12)",
            // Paramètre de l'appel ou valeur de configuration.
            tierCol: "#7fff00",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(127,255,0,0.12)",
            // Paramètre de l'appel ou valeur de configuration.
            unlockCol: "#7fff00",
            // Instruction nécessaire au déroulement de cette partie.
            unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "demi",
            // Paramètre de l'appel ou valeur de configuration.
            order: "03",
            // Paramètre de l'appel ou valeur de configuration.
            name: "DEMI",
            // Paramètre de l'appel ou valeur de configuration.
            sub: "FINALE",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Atmosphere maximale",
            // Paramètre de l'appel ou valeur de configuration.
            color: "#ff6b35",
            // Paramètre de l'appel ou valeur de configuration.
            color2: "#cc4400",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(255,90,30,0.12)",
            // Appel de rgba pour appliquer l'action prévue.
            bgTo: "rgba(100,30,0,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(255,100,40,0.38)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "La pression monte, le stade devient plus serré et la moindre erreur se paie cher.",
            // Paramètre de l'appel ou valeur de configuration.
            tier: "DEMI",
            // Appel de rgba pour appliquer l'action prévue.
            tierBg: "rgba(255,107,53,0.12)",
            // Paramètre de l'appel ou valeur de configuration.
            tierCol: "#ff6b35",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(255,107,53,0.12)",
            // Paramètre de l'appel ou valeur de configuration.
            unlockCol: "#ff6b35",
            // Instruction nécessaire au déroulement de cette partie.
            unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "finale",
            // Paramètre de l'appel ou valeur de configuration.
            order: "04",
            // Paramètre de l'appel ou valeur de configuration.
            name: "FINALE",
            // Paramètre de l'appel ou valeur de configuration.
            sub: "GRAND MATCH",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Ultime rendez-vous",
            // Paramètre de l'appel ou valeur de configuration.
            color: "#f5c842",
            // Paramètre de l'appel ou valeur de configuration.
            color2: "#c49a00",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(245,200,66,0.14)",
            // Appel de rgba pour appliquer l'action prévue.
            bgTo: "rgba(120,90,0,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(245,200,66,0.45)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Le cadre le plus spectaculaire: lumière, tension et style grand final.",
            // Paramètre de l'appel ou valeur de configuration.
            tier: "FINALE",
            // Appel de rgba pour appliquer l'action prévue.
            tierBg: "rgba(245,200,66,0.15)",
            // Paramètre de l'appel ou valeur de configuration.
            tierCol: "#f5c842",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(245,200,66,0.14)",
            // Paramètre de l'appel ou valeur de configuration.
            unlockCol: "#f5c842",
            // Instruction nécessaire au déroulement de cette partie.
            unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    ];

    // Mise à jour de selectedVersusStage.
    window.selectedVersusStage = window.selectedVersusStage || "huitieme";
    // Valeur mémorisée dans p2Skins.
    var p2Skins = [
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "skin0", meshIndex: 1, name: "PARIS", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Joueur du dimanche", num: "1", color: "#b3b3b3", color2: "#808080",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(179,179,179,0.12)", bgTo: "rgba(60,60,60,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(179,179,179,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Paris, capitale du foot moderne : ambitions europeennes et style offensif.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "DEBUTANT", tierBg: "rgba(179,179,179,0.12)", tierCol: "#b3b3b3",
            // Instruction nécessaire au déroulement de cette partie.
            unlockBg: "transparent", unlockCol: "#b3b3b3", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "skin1", meshIndex: 2, name: "LYON", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Ailier prometteur", num: "2", color: "#42f5aa", color2: "#20bd7d",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(66,245,170,0.12)", bgTo: "rgba(20,90,50,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(66,245,170,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Lyon, formateur historique : jeu propre, talents maison, rigueur.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "AMATEUR", tierBg: "rgba(66,245,170,0.12)", tierCol: "#42f5aa",
            // Instruction nécessaire au déroulement de cette partie.
            unlockBg: "transparent", unlockCol: "#42f5aa", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "huitieme", meshIndex: 9, name: "MARSEILLE", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Milieu central", num: "3", color: "#00aaff", color2: "#0066cc",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(0,140,255,0.12)", bgTo: "rgba(0,60,140,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(0,170,255,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Marseille, ferveur populaire : intensite, volume de jeu et passion.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "CLASSIQUE", tierBg: "rgba(0,170,255,0.12)", tierCol: "#00aaff",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(0,170,255,0.12)", unlockCol: "#00aaff", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "finale", meshIndex: 4, name: "BORDEAUX", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Icone du tournoi", num: "4", color: "#f5c842", color2: "#c49a00",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(245,200,66,0.14)", bgTo: "rgba(120,90,0,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(245,200,66,0.45)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Bordeaux, tradition technique : patience, maitrise et jeu a plat.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "LEGENDE", tierBg: "rgba(245,200,66,0.15)", tierCol: "#f5c842",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(245,200,66,0.14)", unlockCol: "#f5c842", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "demi", meshIndex: 5, name: "LILLE", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Attaquant centre", num: "5", color: "#ff6b35", color2: "#cc4400",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(255,90,30,0.12)", bgTo: "rgba(100,30,0,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(255,100,40,0.38)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Lille, collectif solide : pressing, transitions rapides et audace.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "ELITE", tierBg: "rgba(255,107,53,0.12)", tierCol: "#ff6b35",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(255,107,53,0.12)", unlockCol: "#ff6b35", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "quart", meshIndex: 6, name: "NANTES", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "La pieuvre", num: "6", color: "#7fff00", color2: "#4db800",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(100,255,0,0.10)", bgTo: "rgba(40,100,0,0.04)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(127,255,0,0.32)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Nantes, identite de jeu : passes courtes et mouvement permanent.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "AVANCE", tierBg: "rgba(127,255,0,0.12)", tierCol: "#7fff00",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(127,255,0,0.12)", unlockCol: "#7fff00", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "skin6", meshIndex: 7, name: "TOULOUSE", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Capitaine", num: "7", color: "#d942f5", color2: "#951fb0",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(217,66,245,0.12)", bgTo: "rgba(100,20,130,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(217,66,245,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Toulouse, club combatif : intensite, cohesion et jeu direct.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "RARE", tierBg: "rgba(217,66,245,0.12)", tierCol: "#d942f5",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(217,66,245,0.12)", unlockCol: "#d942f5", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "skin7", meshIndex: 8, name: "RENNES", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Machine à buts", num: "8", color: "#42dcf5", color2: "#199ec2",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(66,220,245,0.12)", bgTo: "rgba(20,100,120,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(66,220,245,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Rennes, jeunesse ambitieuse : rythme, percussions et creation.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "EPIC", tierBg: "rgba(66,220,245,0.12)", tierCol: "#42dcf5",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(66,220,245,0.12)", unlockCol: "#42dcf5", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "skin8", meshIndex: 3, name: "NICE", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Dieu du stade", num: "9", color: "#e8b01e", color2: "#ba8b11",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(232,176,30,0.12)", bgTo: "rgba(120,90,10,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(232,176,30,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Nice, bloc compact : discipline, transitions propres et efficacite.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "MYTHIQUE", tierBg: "rgba(232,176,30,0.12)", tierCol: "#e8b01e",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(232,176,30,0.12)", unlockCol: "#e8b01e", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        },
        // Ouverture d'un bloc.
        {
            // Paramètre de l'appel ou valeur de configuration.
            id: "skin9", meshIndex: 10, name: "STRASBOURG", sub: "",
            // Paramètre de l'appel ou valeur de configuration.
            pos: "Furtif", num: "10", color: "#ed4245", color2: "#b01f21",
            // Appel de rgba pour appliquer l'action prévue.
            bgFrom: "rgba(237,66,69,0.12)", bgTo: "rgba(120,20,20,0.05)",
            // Appel de rgba pour appliquer l'action prévue.
            glowColor: "rgba(237,66,69,0.35)",
            // Paramètre de l'appel ou valeur de configuration.
            desc: "Strasbourg, energie populaire : intensite, rythme et impact.",
            // Appel de rgba pour appliquer l'action prévue.
            tier: "SOMBRE", tierBg: "rgba(237,66,69,0.12)", tierCol: "#ed4245",
            // Appel de rgba pour appliquer l'action prévue.
            unlockBg: "rgba(237,66,69,0.12)", unlockCol: "#ed4245", unlockText: "Disponible"
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    ];

    // Fonction findP2SkinIndexById : elle regroupe le traitement de cette partie.
    function findP2SkinIndexById(id) {
        // Vérification avant d'exécuter la suite.
        if (!id) return -1;
        // Résultat renvoyé par la fonction.
        return p2Skins.findIndex(function (s) { return s.id === id; });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction loadSavedP1SkinSelection : elle regroupe le traitement de cette partie.
    function loadSavedP1SkinSelection() {
        // Valeur mémorisée dans savedId.
        var savedId = window.localStorage.getItem(P1_SKIN_STORAGE_KEY);
        // Valeur mémorisée dans found.
        var found = findP2SkinIndexById(savedId);
        // Instruction nécessaire au déroulement de cette partie.
        p1SkinIndex = found >= 0 ? found : 0;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction loadSavedP2SkinSelection : elle regroupe le traitement de cette partie.
    function loadSavedP2SkinSelection() {
        // Valeur mémorisée dans savedId.
        var savedId = window.localStorage.getItem(P2_SKIN_STORAGE_KEY);
        // Valeur mémorisée dans found.
        var found = findP2SkinIndexById(savedId);
        // Instruction nécessaire au déroulement de cette partie.
        p2SkinIndex = found >= 0 ? found : 0;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction findStageIndexById : elle regroupe le traitement de cette partie.
    function findStageIndexById(id) {
        // Vérification avant d'exécuter la suite.
        if (!id) return -1;
        // Résultat renvoyé par la fonction.
        return versusStageOptions.findIndex(function (stage) { return stage.id === id; });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction loadSavedVersusStageSelection : elle regroupe le traitement de cette partie.
    function loadSavedVersusStageSelection() {
        // Valeur mémorisée dans savedId.
        var savedId = window.localStorage.getItem(VERSUS_STAGE_STORAGE_KEY) || window.selectedVersusStage;
        // Valeur mémorisée dans found.
        var found = findStageIndexById(savedId);
        // Instruction nécessaire au déroulement de cette partie.
        selectedVersusStageIndex = found >= 0 ? found : 0;
        // Mise à jour de selectedVersusStage.
        window.selectedVersusStage = versusStageOptions[selectedVersusStageIndex].id;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getActiveVersusStage : elle regroupe le traitement de cette partie.
    function getActiveVersusStage() {
        // Résultat renvoyé par la fonction.
        return versusStageOptions[selectedVersusStageIndex] || versusStageOptions[0];
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setActiveVersusStageIndex : elle regroupe le traitement de cette partie.
    function setActiveVersusStageIndex(nextIndex) {
        // Vérification avant d'exécuter la suite.
        if (!versusStageOptions.length) return;
        // Valeur mémorisée dans clamped.
        var clamped = (nextIndex + versusStageOptions.length) % versusStageOptions.length;
        // Instruction nécessaire au déroulement de cette partie.
        selectedVersusStageIndex = clamped;
        // Mise à jour de selectedVersusStage.
        window.selectedVersusStage = getActiveVersusStage().id;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getActiveSkinIndex : elle regroupe le traitement de cette partie.
    function getActiveSkinIndex() {
        // Résultat renvoyé par la fonction.
        return currentSkinPlayer === 1 ? p1SkinIndex : p2SkinIndex;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setActiveSkinIndex : elle regroupe le traitement de cette partie.
    function setActiveSkinIndex(nextIndex) {
        // Vérification avant d'exécuter la suite.
        if (currentSkinPlayer === 1) {
            // Instruction nécessaire au déroulement de cette partie.
            p1SkinIndex = nextIndex;
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Instruction nécessaire au déroulement de cette partie.
            p2SkinIndex = nextIndex;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateSkinHeader : elle regroupe le traitement de cette partie.
    function updateSkinHeader() {
        // Vérification avant d'exécuter la suite.
        if (versusFlowStep === "stage") {
            // Valeur mémorisée dans stage.
            var stage = getActiveVersusStage();
            // Vérification avant d'exécuter la suite.
            if (skinHeaderMode) skinHeaderMode.textContent = "Selection du stade";
            // Vérification avant d'exécuter la suite.
            if (skinHeaderStep) skinHeaderStep.textContent = "ETAPE 4 / 4";
            // Vérification avant d'exécuter la suite.
            if (skinPlayerBadge) skinPlayerBadge.textContent = stage.order;
            // Vérification avant d'exécuter la suite.
            if (versusSkinCanvas) versusSkinCanvas.style.display = "none";
            // Vérification avant d'exécuter la suite.
            if (versusSkinConfirmBtn) versusSkinConfirmBtn.textContent = "Lancer le match";
            // Vérification avant d'exécuter la suite.
            if (versusSkinBackBtn) versusSkinBackBtn.textContent = "← Retour au skin joueur 2";
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans isP1.
        var isP1 = currentSkinPlayer === 1;
        // Vérification avant d'exécuter la suite.
        if (skinHeaderMode) skinHeaderMode.textContent = isP1 ? "Selection du skin joueur 1" : "Selection du skin joueur 2";
        // Vérification avant d'exécuter la suite.
        if (skinHeaderStep) skinHeaderStep.textContent = isP1 ? "ETAPE 2 / 3" : "ETAPE 3 / 3";
        // Vérification avant d'exécuter la suite.
        if (skinPlayerBadge) skinPlayerBadge.textContent = isP1 ? "P1" : "P2";
        // Vérification avant d'exécuter la suite.
        if (versusSkinCanvas) versusSkinCanvas.style.display = "";
        // Vérification avant d'exécuter la suite.
        if (versusSkinCanvas) {
            // Appel de setAttribute pour appliquer l'action prévue.
            versusSkinCanvas.setAttribute("aria-label", isP1 ? "Apercu 3D du skin joueur 1" : "Apercu 3D du skin joueur 2");
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (versusSkinBackBtn) {
            // Mise à jour de textContent.
            versusSkinBackBtn.textContent = isP1 ? "← Retour aux controles" : "← Retour au skin joueur 1";
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (versusSkinConfirmBtn) versusSkinConfirmBtn.textContent = "Choisir ce skin";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isSkinBlockedForPlayer : elle regroupe le traitement de cette partie.
    function isSkinBlockedForPlayer(index) {
        // Résultat renvoyé par la fonction.
        return currentSkinPlayer === 2 && index === p1SkinIndex;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction findNextAvailableIndex : elle regroupe le traitement de cette partie.
    function findNextAvailableIndex(startIndex, direction) {
        // Vérification avant d'exécuter la suite.
        if (!p2Skins.length) return -1;
        // Valeur mémorisée dans dir.
        var dir = direction >= 0 ? 1 : -1;
        // Parcours de plusieurs valeurs.
        for (var i = 0; i < p2Skins.length; i += 1) {
            // Valeur mémorisée dans candidate.
            var candidate = (startIndex + dir * i + p2Skins.length) % p2Skins.length;
            // Vérification avant d'exécuter la suite.
            if (!isSkinBlockedForPlayer(candidate)) return candidate;
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return -1;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction ensureSkinPreviewReady : elle regroupe le traitement de cette partie.
    function ensureSkinPreviewReady() {
        // Vérification avant d'exécuter la suite.
        if (!versusSkinCanvas || !window.BABYLON) return;
        // Vérification avant d'exécuter la suite.
        if (skinPreviewScene) return;

        // Appel de Engine pour appliquer l'action prévue.
        skinPreviewEngine = new BABYLON.Engine(versusSkinCanvas, true, {
            // Paramètre de l'appel ou valeur de configuration.
            preserveDrawingBuffer: true,
            // Paramètre de l'appel ou valeur de configuration.
            stencil: true,
            // Instruction nécessaire au déroulement de cette partie.
            antialias: true
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de Scene pour appliquer l'action prévue.
        skinPreviewScene = new BABYLON.Scene(skinPreviewEngine);
        // Mise à jour de clearColor.
        skinPreviewScene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        // Lumière ambiante principale — douce et légèrement froide
        // Création de ambientLight.
        var ambientLight = new BABYLON.HemisphericLight("p2SkinAmbient", new BABYLON.Vector3(0, 1, 0), skinPreviewScene);
        // Mise à jour de intensity.
        ambientLight.intensity = 0.55;
        // Mise à jour de groundColor.
        ambientLight.groundColor = new BABYLON.Color3(0.05, 0.08, 0.18);
        // Mise à jour de diffuse.
        ambientLight.diffuse = new BABYLON.Color3(0.95, 0.92, 1.0);

        // Lumière principale frontale — éclaire le corps de face
        // Création de frontLight.
        var frontLight = new BABYLON.DirectionalLight("p2SkinFront", new BABYLON.Vector3(0.3, -0.6, 1), skinPreviewScene);
        // Mise à jour de position.
        frontLight.position = new BABYLON.Vector3(0, 12, -12);
        // Mise à jour de intensity.
        frontLight.intensity = 1.1;
        // Mise à jour de diffuse.
        frontLight.diffuse = new BABYLON.Color3(1.0, 0.97, 0.92);

        // Rim light latérale — donne du volume
        // Création de rimLight.
        var rimLight = new BABYLON.DirectionalLight("p2SkinRim", new BABYLON.Vector3(-1, -0.2, 0.2), skinPreviewScene);
        // Mise à jour de position.
        rimLight.position = new BABYLON.Vector3(-10, 6, 0);
        // Mise à jour de intensity.
        rimLight.intensity = 0.7;
        // Mise à jour de diffuse.
        rimLight.diffuse = new BABYLON.Color3(0.5, 0.72, 1.0);

        // Lumière de sol bleutée — ambiance stade
        // Création de groundLight.
        var groundLight = new BABYLON.PointLight("p2SkinGround", new BABYLON.Vector3(0, -2, 0), skinPreviewScene);
        // Mise à jour de intensity.
        groundLight.intensity = 0.18;
        // Mise à jour de diffuse.
        groundLight.diffuse = new BABYLON.Color3(0.3, 0.5, 1.0);

        // Caméra — distance augmentée pour bien voir le personnage dans le cadre
            // Appel de ArcRotateCamera pour appliquer l'action prévue.
            skinPreviewCamera = new BABYLON.ArcRotateCamera(
            // Paramètre de l'appel ou valeur de configuration.
            "p2SkinPreviewCamera",
            // Paramètre de l'appel ou valeur de configuration.
            -Math.PI / 2,
            // Paramètre de l'appel ou valeur de configuration.
            1.4,
            // Paramètre de l'appel ou valeur de configuration.
            3.9,
            // Appel de Vector3 pour appliquer l'action prévue.
            new BABYLON.Vector3(0, 2.8, 0),
            // Instruction nécessaire au déroulement de cette partie.
            skinPreviewScene
        // Fermeture du bloc ou de l'appel.
        );
        // Appel de attachControl pour appliquer l'action prévue.
        skinPreviewCamera.attachControl(versusSkinCanvas, false);
        // Mise à jour de lowerRadiusLimit.
        skinPreviewCamera.lowerRadiusLimit = 1.4;
        // Mise à jour de upperRadiusLimit.
        skinPreviewCamera.upperRadiusLimit = 12;
        // Mise à jour de lowerBetaLimit.
        skinPreviewCamera.lowerBetaLimit = 0.95;
        // Mise à jour de upperBetaLimit.
        skinPreviewCamera.upperBetaLimit = 1.55;
        // Mise à jour de panningSensibility.
        skinPreviewCamera.panningSensibility = 0;
        // Mise à jour de wheelPrecision.
        skinPreviewCamera.wheelPrecision = 20;
        // Mise à jour de minZ.
        skinPreviewCamera.minZ = 0.1;

        // Appel de TransformNode pour appliquer l'action prévue.
        skinPreviewSpinRoot = new BABYLON.TransformNode("p2SkinPreviewSpinRoot", skinPreviewScene);
        // Appel de TransformNode pour appliquer l'action prévue.
        skinPreviewPoseRoot = new BABYLON.TransformNode("p2SkinPreviewPoseRoot", skinPreviewScene);
        // Mise à jour de parent.
        skinPreviewPoseRoot.parent = skinPreviewSpinRoot;
        // Mise à jour de x.
        skinPreviewPoseRoot.rotation.x = -Math.PI / 2;

        // Vérification avant d'exécuter la suite.
        if (!skinPreviewRenderLoopStarted) {
            // Instruction nécessaire au déroulement de cette partie.
            skinPreviewRenderLoopStarted = true;
            // Appel de runRenderLoop pour appliquer l'action prévue.
            skinPreviewEngine.runRenderLoop(function () {
                // Vérification avant d'exécuter la suite.
                if (skinPreviewScene && isVersusSkinOpen()) {
                    // Vérification avant d'exécuter la suite.
                    if (skinPreviewSpinRoot) {
                        // Instruction nécessaire au déroulement de cette partie.
                        skinPreviewSpinRoot.rotation.y += 0.009;
                    // Fermeture du bloc ou de l'appel.
                    }
                    // Appel de render pour appliquer l'action prévue.
                    skinPreviewScene.render();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("resize", function () {
            // Vérification avant d'exécuter la suite.
            if (skinPreviewEngine) skinPreviewEngine.resize();
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }


    // Fonction loadSkinPreviewMeshes : elle regroupe le traitement de cette partie.
    function loadSkinPreviewMeshes() {
        // Vérification avant d'exécuter la suite.
        if (!skinPreviewScene || skinPreviewLoaded || skinPreviewLoading || !window.BABYLON) return;
        // Instruction nécessaire au déroulement de cette partie.
        skinPreviewLoading = true;

        // Appel de ImportMesh pour appliquer l'action prévue.
        BABYLON.SceneLoader.ImportMesh(
            // Paramètre de l'appel ou valeur de configuration.
            "",
            // Paramètre de l'appel ou valeur de configuration.
            "textures/",
            // Paramètre de l'appel ou valeur de configuration.
            "cricketers_pack_low_poly.glb",
            // Paramètre de l'appel ou valeur de configuration.
            skinPreviewScene,
            // Fonction function : elle regroupe le traitement de cette partie.
            function (meshes) {
                // Instruction nécessaire au déroulement de cette partie.
                skinPreviewLoading = false;
                // Instruction nécessaire au déroulement de cette partie.
                skinPreviewLoaded = true;

                // Instruction nécessaire au déroulement de cette partie.
                skinPreviewMeshes = meshes
                    // Appel de map pour appliquer l'action prévue.
                    .map(function (m, idx) { return { mesh: m, sourceIndex: idx }; })
                    // Appel de filter pour appliquer l'action prévue.
                    .filter(function (entry) {
                        // Résultat renvoyé par la fonction.
                        return entry.mesh && entry.mesh.getTotalVertices && entry.mesh.getTotalVertices() > 0;
                    // Fermeture du bloc ou de l'appel.
                    });

                // Vérification avant d'exécuter la suite.
                if (!skinPreviewMeshes.length) return;

                // Appel de forEach pour appliquer l'action prévue.
                skinPreviewMeshes.forEach(function (entry, index) {
                    // Valeur mémorisée dans mesh.
                    var mesh = entry.mesh;
                    // Mise à jour de parent.
                    mesh.parent = skinPreviewPoseRoot;
                    // Mise à jour de scaling.
                    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
                    // Mise à jour de position.
                    mesh.position = BABYLON.Vector3.Zero();
                    // Mise à jour de rotation.
                    mesh.rotation = BABYLON.Vector3.Zero();
                    // Appel de setEnabled pour appliquer l'action prévue.
                    mesh.setEnabled(index === 0);
                // Fermeture du bloc ou de l'appel.
                });

                // Centrage X/Z en espace local du mesh (identique à createPlayer)
                // IMPORTANT : poseRoot.rotation.x = -PI/2 donc son axe Y local = axe Z monde.
                // On NE TOUCHE PAS mesh.position.y ici (ça déplacerait selon Z monde).
                // On centre uniquement X et Z locaux sous poseRoot.
                // Appel de forEach pour appliquer l'action prévue.
                skinPreviewMeshes.forEach(function (entry) {
                    // Valeur mémorisée dans mesh.
                    var mesh = entry.mesh;
                    // Appel de computeWorldMatrix pour appliquer l'action prévue.
                    mesh.computeWorldMatrix(true);
                    // Valeur mémorisée dans centerWorld.
                    var centerWorld = mesh.getBoundingInfo().boundingBox.centerWorld.clone();
                    // Valeur mémorisée dans invPose.
                    var invPose = skinPreviewPoseRoot.getWorldMatrix().clone();
                    // Appel de invert pour appliquer l'action prévue.
                    invPose.invert();
                    // Préparation de centerLocal avec Babylon.js.
                    var centerLocal = BABYLON.Vector3.TransformCoordinates(centerWorld, invPose);
                    // Mise à jour de x.
                    mesh.position.x = -centerLocal.x;
                    // Mise à jour de z.
                    mesh.position.z = -centerLocal.z;
                // Fermeture du bloc ou de l'appel.
                });

                // Décalage vertical : on relève poseRoot en espace monde (spinRoot ne fait que
                // tourner autour de Y donc poseRoot.position.y = Y monde).
                // On prend le premier mesh pour calculer le bas du personnage en Y monde.
                // Valeur mémorisée dans refMesh.
                var refMesh = skinPreviewMeshes[0] && skinPreviewMeshes[0].mesh;
                // Vérification avant d'exécuter la suite.
                if (refMesh) {
                    // Appel de computeWorldMatrix pour appliquer l'action prévue.
                    refMesh.computeWorldMatrix(true);
                    // Valeur mémorisée dans wBbox.
                    var wBbox = refMesh.getBoundingInfo().boundingBox;
                    // Valeur mémorisée dans minYWorld.
                    var minYWorld = wBbox.minimumWorld.y;
                    // Remonter poseRoot pour que les pieds touchent y=0
                    // Mise à jour de y.
                    skinPreviewPoseRoot.position.y = -minYWorld;
                // Fermeture du bloc ou de l'appel.
                }

                // Appel de renderP2Skin pour appliquer l'action prévue.
                renderP2Skin();
            // Fermeture du bloc ou de l'appel.
            },
            // Paramètre de l'appel ou valeur de configuration.
            null,
            // Fonction function : elle regroupe le traitement de cette partie.
            function () {
                // Instruction nécessaire au déroulement de cette partie.
                skinPreviewLoading = false;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        );
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getResolvedSkinPreviewEntry : elle regroupe le traitement de cette partie.
    function getResolvedSkinPreviewEntry(skin, skinIndex) {
        // Vérification avant d'exécuter la suite.
        if (!skinPreviewMeshes.length) return null;

        // Valeur mémorisée dans selectedEntry.
        var selectedEntry = null;
        // Vérification avant d'exécuter la suite.
        if (skin && typeof skin.meshIndex === "number") {
            // Appel de find pour appliquer l'action prévue.
            selectedEntry = skinPreviewMeshes.find(function (entry) {
                // Résultat renvoyé par la fonction.
                return entry.sourceIndex === skin.meshIndex;
            // Instruction nécessaire au déroulement de cette partie.
            }) || null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!selectedEntry && typeof skinIndex === "number" && skinIndex >= 0 && skinIndex < skinPreviewMeshes.length) {
            // Instruction nécessaire au déroulement de cette partie.
            selectedEntry = skinPreviewMeshes[skinIndex];
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return selectedEntry || skinPreviewMeshes[0] || null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction focusSkinPreviewMesh : elle regroupe le traitement de cette partie.
    function focusSkinPreviewMesh(selectedMesh) {
        // Vérification avant d'exécuter la suite.
        if (!selectedMesh || !skinPreviewCamera || !window.BABYLON) return;

        // Appel de computeWorldMatrix pour appliquer l'action prévue.
        selectedMesh.computeWorldMatrix(true);

        // Valeur mémorisée dans bbox.
        var bbox = selectedMesh.getBoundingInfo().boundingBox;
        // Valeur mémorisée dans min.
        var min = bbox.minimumWorld;
        // Valeur mémorisée dans max.
        var max = bbox.maximumWorld;
        // Valeur mémorisée dans center.
        var center = bbox.centerWorld.clone();

        // Valeur mémorisée dans width.
        var width = Math.max(0.1, max.x - min.x);
        // Valeur mémorisée dans height.
        var height = Math.max(0.1, max.y - min.y);
        // Valeur mémorisée dans depth.
        var depth = Math.max(0.1, max.z - min.z);
        // Valeur mémorisée dans largestSize.
        var largestSize = Math.max(width, height, depth);

        // Mise à jour de target.
        skinPreviewCamera.target = new BABYLON.Vector3(center.x, min.y + height * 0.48, center.z);
        // Mise à jour de radius.
        skinPreviewCamera.radius = BABYLON.Scalar.Clamp(largestSize * 0.62, 2.8, 4.1);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateSkinPreviewMesh : elle regroupe le traitement de cette partie.
    function updateSkinPreviewMesh() {
        // Vérification avant d'exécuter la suite.
        if (!skinPreviewLoaded || !skinPreviewMeshes.length) return;
        // Valeur mémorisée dans skin.
        var skin = p2Skins[getActiveSkinIndex()] || p2Skins[0];
        // Vérification avant d'exécuter la suite.
        if (!skin) return;

        // Appel de forEach pour appliquer l'action prévue.
        skinPreviewMeshes.forEach(function (entry) {
            // Appel de setEnabled pour appliquer l'action prévue.
            entry.mesh.setEnabled(false);
        // Fermeture du bloc ou de l'appel.
        });

        // Valeur mémorisée dans selectedEntry.
        var selectedEntry = getResolvedSkinPreviewEntry(skin, getActiveSkinIndex());
        // Valeur mémorisée dans selectedMesh.
        var selectedMesh = selectedEntry && selectedEntry.mesh ? selectedEntry.mesh : null;
        // Vérification avant d'exécuter la suite.
        if (selectedMesh) {
            // Appel de setEnabled pour appliquer l'action prévue.
            selectedMesh.setEnabled(true);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de focusSkinPreviewMesh pour appliquer l'action prévue.
        focusSkinPreviewMesh(selectedMesh);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction formatKeyLabel : elle regroupe le traitement de cette partie.
    function formatKeyLabel(value) {
        // Vérification avant d'exécuter la suite.
        if (!value) return "-";
        // Vérification avant d'exécuter la suite.
        if (value === "Space") return "Space";
        // Vérification avant d'exécuter la suite.
        if (value === "Shift") return "Shift";
        // Valeur mémorisée dans SPECIAL.
        const SPECIAL = {
            // Paramètre de l'appel ou valeur de configuration.
            "arrowup": "↑",
            // Paramètre de l'appel ou valeur de configuration.
            "arrowdown": "↓",
            // Paramètre de l'appel ou valeur de configuration.
            "arrowleft": "←",
            // Paramètre de l'appel ou valeur de configuration.
            "arrowright": "→",
            // Paramètre de l'appel ou valeur de configuration.
            "enter": "Entrée",
            // Paramètre de l'appel ou valeur de configuration.
            "rshift": "Shift►",
            // Paramètre de l'appel ou valeur de configuration.
            "shiftright": "Shift►",
            // Paramètre de l'appel ou valeur de configuration.
            "shiftleft": "Shift◄",
            // Paramètre de l'appel ou valeur de configuration.
            "numpaddecimal": "Num .",
            // Paramètre de l'appel ou valeur de configuration.
            "numpad4": "Num 4",
            // Instruction nécessaire au déroulement de cette partie.
            "numpad6": "Num 6"
        // Fermeture du bloc ou de l'appel.
        };
        // Valeur mémorisée dans lc.
        const lc = value.toLowerCase();
        // Vérification avant d'exécuter la suite.
        if (SPECIAL[lc]) return SPECIAL[lc];
        // Vérification avant d'exécuter la suite.
        if (value.length === 1) return value.toUpperCase();
        // Touches de type "KeyZ" -> afficher juste "Z"
        // Vérification avant d'exécuter la suite.
        if (/^Key[A-Za-z]$/.test(value)) return value[3].toUpperCase();
        // Vérification avant d'exécuter la suite.
        if (/^Digit[0-9]$/.test(value)) return value[5];
        // Résultat renvoyé par la fonction.
        return value;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction syncP2Buttons : elle regroupe le traitement de cette partie.
    function syncP2Buttons() {
        // Appel de forEach pour appliquer l'action prévue.
        versusKeyBtns.forEach(function (btn) {
            // Valeur mémorisée dans action.
            var action = btn.dataset.actionP2;
            // Mise à jour de textContent.
            btn.textContent = formatKeyLabel(p2Binds[action]);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setListeningP2Button : elle regroupe le traitement de cette partie.
    function setListeningP2Button(nextAction) {
        // Appel de forEach pour appliquer l'action prévue.
        versusKeyBtns.forEach(function (btn) {
            // Valeur mémorisée dans active.
            var active = btn.dataset.actionP2 === nextAction;
            // Appel de toggle pour appliquer l'action prévue.
            btn.classList.toggle("is-listening", active);
            // Vérification avant d'exécuter la suite.
            if (active) btn.textContent = "Appuie...";
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction refreshP2Bindings : elle regroupe le traitement de cette partie.
    function refreshP2Bindings() {
        // Vérification avant d'exécuter la suite.
        if (window.inputBindings && typeof window.inputBindings.getPlayer2Bindings === "function") {
            // Appel de getPlayer2Bindings pour appliquer l'action prévue.
            p2Binds = window.inputBindings.getPlayer2Bindings();
        // Deuxième possibilité à tester.
        } else if (window.inputBindings && typeof window.inputBindings.getBindings === "function") {
            // Appel de getBindings pour appliquer l'action prévue.
            p2Binds = window.inputBindings.getBindings();
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Instruction nécessaire au déroulement de cette partie.
            p2Binds = {};
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de syncP2Buttons pour appliquer l'action prévue.
        syncP2Buttons();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction openVersusControls : elle regroupe le traitement de cette partie.
    function openVersusControls() {
        // Vérification avant d'exécuter la suite.
        if (!versusOverlay) return;
        // Appel de refreshP2Bindings pour appliquer l'action prévue.
        refreshP2Bindings();
        // Appel de loadSavedP1SkinSelection pour appliquer l'action prévue.
        loadSavedP1SkinSelection();
        // Appel de loadSavedP2SkinSelection pour appliquer l'action prévue.
        loadSavedP2SkinSelection();
        // Instruction nécessaire au déroulement de cette partie.
        listeningP2Action = null;
        // Appel de setListeningP2Button pour appliquer l'action prévue.
        setListeningP2Button(null);
        // Appel de add pour appliquer l'action prévue.
        versusOverlay.classList.add("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        versusOverlay.setAttribute("aria-hidden", "false");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction closeVersusControls : elle regroupe le traitement de cette partie.
    function closeVersusControls() {
        // Vérification avant d'exécuter la suite.
        if (!versusOverlay) return;
        // Instruction nécessaire au déroulement de cette partie.
        listeningP2Action = null;
        // Appel de setListeningP2Button pour appliquer l'action prévue.
        setListeningP2Button(null);
        // Appel de remove pour appliquer l'action prévue.
        versusOverlay.classList.remove("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        versusOverlay.setAttribute("aria-hidden", "true");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isVersusSkinOpen : elle regroupe le traitement de cette partie.
    function isVersusSkinOpen() {
        // Résultat renvoyé par la fonction.
        return !!versusSkinOverlay && versusSkinOverlay.getAttribute("aria-hidden") === "false";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction renderStatBars : elle regroupe le traitement de cette partie.
    function renderStatBars(stats, skin) {
        // Vérification avant d'exécuter la suite.
        if (!stats) return "";
        // Valeur mémorisée dans keys.
        var keys = Object.keys(stats);
        // Résultat renvoyé par la fonction.
        return keys.map(function (k) {
            // Valeur mémorisée dans v.
            var v = stats[k];
            // Résultat renvoyé par la fonction.
            return (
                // Instruction nécessaire au déroulement de cette partie.
                '<div class="stat-bar-row">' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '<div class="stat-bar-header">' +
                        // Instruction nécessaire au déroulement de cette partie.
                        '<span class="stat-bar-name">' + k + '</span>' +
                        // Instruction nécessaire au déroulement de cette partie.
                        '<span class="stat-bar-num" style="color:' + skin.color + '">' + v + '</span>' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '</div>' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '<div class="stat-bar-track">' +
                        // Appel de gradient pour appliquer l'action prévue.
                        '<div class="stat-bar-fill" style="width:' + v + '%;background:linear-gradient(90deg,' + skin.color2 + ',' + skin.color + ')"></div>' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '</div>' +
                // Instruction nécessaire au déroulement de cette partie.
                '</div>'
            // Fermeture du bloc ou de l'appel.
            );
        // Appel de join pour appliquer l'action prévue.
        }).join("");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction renderSkinDots : elle regroupe le traitement de cette partie.
    function renderSkinDots() {
        // Vérification avant d'exécuter la suite.
        if (!versusSkinIndicators) return;
        // Valeur mémorisée dans html.
        var html = "";
        // Parcours de plusieurs valeurs.
        for (var i = 0; i < p2Skins.length; i += 1) {
            // Valeur mémorisée dans activeIndex.
            var activeIndex = getActiveSkinIndex();
            // Valeur mémorisée dans isBlocked.
            var isBlocked = isSkinBlockedForPlayer(i);
            // Valeur mémorisée dans activeClass.
            var activeClass = i === activeIndex ? " is-active" : "";
            // Valeur mémorisée dans blockedClass.
            var blockedClass = isBlocked ? " is-disabled" : "";
            // Valeur mémorisée dans activeStyle.
            var activeStyle = i === activeIndex ? ' style="background:' + p2Skins[i].color + '"' : "";
            // Instruction nécessaire au déroulement de cette partie.
            html += '<button class="skin-dot' + activeClass + blockedClass + '" type="button" data-index="' + i + '" aria-label="Skin ' + (i + 1) + '"' + (isBlocked ? ' aria-disabled="true"' : "") + activeStyle + '></button>';
        // Fermeture du bloc ou de l'appel.
        }
        // Mise à jour de innerHTML.
        versusSkinIndicators.innerHTML = html;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction renderSkinList : elle regroupe le traitement de cette partie.
    function renderSkinList() {
        // Vérification avant d'exécuter la suite.
        if (!skinList) return;
        // Valeur mémorisée dans html.
        var html = "";
        // Valeur mémorisée dans activeIndex.
        var activeIndex = getActiveSkinIndex();
        // Parcours de plusieurs valeurs.
        for (var i = 0; i < p2Skins.length; i += 1) {
            // Valeur mémorisée dans skin.
            var skin = p2Skins[i];
            // Valeur mémorisée dans isBlocked.
            var isBlocked = isSkinBlockedForPlayer(i);
            // Valeur mémorisée dans activeClass.
            var activeClass = i === activeIndex ? " active" : "";
            // Valeur mémorisée dans blockedClass.
            var blockedClass = isBlocked ? " is-disabled" : "";
            // Instruction nécessaire au déroulement de cette partie.
            html += (
                // Instruction nécessaire au déroulement de cette partie.
                '<button class="skin-option' + activeClass + blockedClass + '" type="button" data-index="' + i + '"' + (isBlocked ? ' disabled aria-disabled="true"' : "") + '>' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '<div class="skin-option-badge" style="background:' + skin.tierBg + ';color:' + skin.color + '">' + skin.num + '</div>' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '<div class="skin-option-info">' +
                        // Instruction nécessaire au déroulement de cette partie.
                        '<div class="skin-option-name">' + skin.name + '</div>' +
                        // Instruction nécessaire au déroulement de cette partie.
                        (isBlocked ? '<div class="skin-option-lock">Indisponible</div>' : "") +
                    // Instruction nécessaire au déroulement de cette partie.
                    '</div>' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '<div class="skin-option-check"></div>' +
                // Instruction nécessaire au déroulement de cette partie.
                '</button>'
            // Fermeture du bloc ou de l'appel.
            );
        // Fermeture du bloc ou de l'appel.
        }
        // Mise à jour de innerHTML.
        skinList.innerHTML = html;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction applySkinTheme : elle regroupe le traitement de cette partie.
    function applySkinTheme(skin) {
        // Vérification avant d'exécuter la suite.
        if (!skin) return;
        // Vérification avant d'exécuter la suite.
        if (stageBg) stageBg.style.background = 'linear-gradient(180deg,' + skin.bgFrom + ' 0%,' + skin.bgTo + ' 100%)';
        // Vérification avant d'exécuter la suite.
        if (stageGlow) stageGlow.style.background = skin.glowColor;

        // Vérification avant d'exécuter la suite.
        if (playerNum) playerNum.textContent = skin.num;

        // Vérification avant d'exécuter la suite.
        if (playerName) {
            // Mise à jour de textContent.
            playerName.textContent = skin.name;
            // Mise à jour de color.
            playerName.style.color = skin.color;
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (playerPos) playerPos.textContent = skin.pos;

        // Vérification avant d'exécuter la suite.
        if (unlockPill) {
            // Mise à jour de textContent.
            unlockPill.textContent = skin.unlockText;
            // Mise à jour de background.
            unlockPill.style.background = skin.unlockBg;
            // Mise à jour de color.
            unlockPill.style.color = skin.unlockCol;
            // Mise à jour de border.
            unlockPill.style.border = '1px solid ' + skin.unlockCol + '40';
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (skinDescText) skinDescText.textContent = skin.desc;

        // Vérification avant d'exécuter la suite.
        if (versusSkinConfirmBtn) {
            // Mise à jour de background.
            versusSkinConfirmBtn.style.background = 'linear-gradient(135deg,' + skin.color2 + ',' + skin.color + ')';
            // Mise à jour de boxShadow.
            versusSkinConfirmBtn.style.boxShadow = '0 8px 30px ' + skin.glowColor;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction renderP2Skin : elle regroupe le traitement de cette partie.
    function renderP2Skin() {
        // Valeur mémorisée dans skin.
        var skin = p2Skins[getActiveSkinIndex()] || p2Skins[0];
        // Vérification avant d'exécuter la suite.
        if (!skin) return;
        // Instruction nécessaire au déroulement de cette partie.
        versusFlowStep = "skins";
        // Appel de applySkinTheme pour appliquer l'action prévue.
        applySkinTheme(skin);
        // Appel de updateSkinPreviewMesh pour appliquer l'action prévue.
        updateSkinPreviewMesh();
        // Appel de renderSkinList pour appliquer l'action prévue.
        renderSkinList();
        // Appel de renderSkinDots pour appliquer l'action prévue.
        renderSkinDots();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction renderVersusStageSelection : elle regroupe le traitement de cette partie.
    function renderVersusStageSelection() {
        // Valeur mémorisée dans stage.
        var stage = getActiveVersusStage();
        // Vérification avant d'exécuter la suite.
        if (!stage) return;

        // Instruction nécessaire au déroulement de cette partie.
        versusFlowStep = "stage";
        // Vérification avant d'exécuter la suite.
        if (versusSkinCanvas) versusSkinCanvas.style.display = "none";

        // Vérification avant d'exécuter la suite.
        if (stageBg) stageBg.style.background = 'linear-gradient(180deg,' + stage.bgFrom + ' 0%,' + stage.bgTo + ' 100%)';
        // Vérification avant d'exécuter la suite.
        if (stageGlow) stageGlow.style.background = stage.glowColor;

        // Vérification avant d'exécuter la suite.
        if (playerNum) playerNum.textContent = stage.order;
        // Vérification avant d'exécuter la suite.
        if (playerName) {
            // Mise à jour de textContent.
            playerName.textContent = stage.name + ' ' + stage.sub;
            // Mise à jour de color.
            playerName.style.color = stage.color;
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (playerPos) playerPos.textContent = stage.pos;
        // Vérification avant d'exécuter la suite.
        if (skinDescText) skinDescText.textContent = stage.desc;

        // Vérification avant d'exécuter la suite.
        if (unlockPill) {
            // Mise à jour de textContent.
            unlockPill.textContent = stage.unlockText;
            // Mise à jour de background.
            unlockPill.style.background = stage.unlockBg;
            // Mise à jour de color.
            unlockPill.style.color = stage.unlockCol;
            // Mise à jour de border.
            unlockPill.style.border = '1px solid ' + stage.unlockCol + '40';
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (versusSkinConfirmBtn) {
            // Mise à jour de textContent.
            versusSkinConfirmBtn.textContent = "Lancer le match";
            // Mise à jour de background.
            versusSkinConfirmBtn.style.background = 'linear-gradient(135deg,' + stage.color2 + ',' + stage.color + ')';
            // Mise à jour de boxShadow.
            versusSkinConfirmBtn.style.boxShadow = '0 8px 30px ' + stage.glowColor;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (versusSkinBackBtn) versusSkinBackBtn.textContent = "← Retour au skin joueur 2";
        // Vérification avant d'exécuter la suite.
        if (skinHeaderMode) skinHeaderMode.textContent = "Selection du stade";
        // Vérification avant d'exécuter la suite.
        if (skinHeaderStep) skinHeaderStep.textContent = "ETAPE 4 / 4";
        // Vérification avant d'exécuter la suite.
        if (skinPlayerBadge) skinPlayerBadge.textContent = stage.order;

        // Vérification avant d'exécuter la suite.
        if (skinList) {
            // Valeur mémorisée dans html.
            var html = "";
            // Parcours de plusieurs valeurs.
            for (var i = 0; i < versusStageOptions.length; i += 1) {
                // Valeur mémorisée dans opt.
                var opt = versusStageOptions[i];
                // Valeur mémorisée dans activeClass.
                var activeClass = i === selectedVersusStageIndex ? " active" : "";
                // Instruction nécessaire au déroulement de cette partie.
                html += (
                    // Instruction nécessaire au déroulement de cette partie.
                    '<button class="skin-option' + activeClass + '" type="button" data-stage-index="' + i + '">' +
                        // Instruction nécessaire au déroulement de cette partie.
                        '<div class="skin-option-badge" style="background:' + opt.tierBg + ';color:' + opt.color + '">' + opt.order + '</div>' +
                        // Instruction nécessaire au déroulement de cette partie.
                        '<div class="skin-option-info">' +
                            // Instruction nécessaire au déroulement de cette partie.
                            '<div class="skin-option-name">' + opt.name + ' ' + opt.sub + '</div>' +
                            // Instruction nécessaire au déroulement de cette partie.
                            '<div class="skin-option-tier">' + opt.tier + '</div>' +
                        // Instruction nécessaire au déroulement de cette partie.
                        '</div>' +
                        // Instruction nécessaire au déroulement de cette partie.
                        '<div class="skin-option-check"></div>' +
                    // Instruction nécessaire au déroulement de cette partie.
                    '</button>'
                // Fermeture du bloc ou de l'appel.
                );
            // Fermeture du bloc ou de l'appel.
            }
            // Mise à jour de innerHTML.
            skinList.innerHTML = html;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (versusSkinIndicators) {
            // Valeur mémorisée dans dotsHtml.
            var dotsHtml = "";
            // Parcours de plusieurs valeurs.
            for (var j = 0; j < versusStageOptions.length; j += 1) {
                // Valeur mémorisée dans stageOpt.
                var stageOpt = versusStageOptions[j];
                // Valeur mémorisée dans activeDotClass.
                var activeDotClass = j === selectedVersusStageIndex ? " is-active" : "";
                // Valeur mémorisée dans activeDotStyle.
                var activeDotStyle = j === selectedVersusStageIndex ? ' style="background:' + stageOpt.color + '"' : "";
                // Instruction nécessaire au déroulement de cette partie.
                dotsHtml += '<button class="skin-dot' + activeDotClass + '" type="button" data-stage-index="' + j + '" aria-label="' + stageOpt.name + ' ' + stageOpt.sub + '"' + activeDotStyle + '></button>';
            // Fermeture du bloc ou de l'appel.
            }
            // Mise à jour de innerHTML.
            versusSkinIndicators.innerHTML = dotsHtml;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction changeP2Skin : elle regroupe le traitement de cette partie.
    function changeP2Skin(delta) {
        // Vérification avant d'exécuter la suite.
        if (!p2Skins.length) return;
        // Valeur mémorisée dans startIndex.
        var startIndex = (getActiveSkinIndex() + delta + p2Skins.length) % p2Skins.length;
        // Valeur mémorisée dans nextIndex.
        var nextIndex = currentSkinPlayer === 2 ? findNextAvailableIndex(startIndex, delta) : startIndex;
        // Vérification avant d'exécuter la suite.
        if (nextIndex >= 0) setActiveSkinIndex(nextIndex);
        // Appel de renderP2Skin pour appliquer l'action prévue.
        renderP2Skin();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction openVersusSkinCarousel : elle regroupe le traitement de cette partie.
    function openVersusSkinCarousel() {
        // Vérification avant d'exécuter la suite.
        if (!versusSkinOverlay) return;
        // Instruction nécessaire au déroulement de cette partie.
        versusFlowStep = "skins";
        // Instruction nécessaire au déroulement de cette partie.
        currentSkinPlayer = 1;
        // Appel de loadSavedP1SkinSelection pour appliquer l'action prévue.
        loadSavedP1SkinSelection();
        // Appel de updateSkinHeader pour appliquer l'action prévue.
        updateSkinHeader();
        // Instruction nécessaire au déroulement de cette partie.
        lastSkinNavAt = 0;
        // Instruction nécessaire au déroulement de cette partie.
        lastSkinSubmitPressed = false;
        // Instruction nécessaire au déroulement de cette partie.
        lastSkinBackPressed = false;
        // Vérification avant d'exécuter la suite.
        if (versusSkinCanvas) versusSkinCanvas.style.display = "";
        // Appel de ensureSkinPreviewReady pour appliquer l'action prévue.
        ensureSkinPreviewReady();
        // Appel de loadSkinPreviewMeshes pour appliquer l'action prévue.
        loadSkinPreviewMeshes();
        // Appel de renderP2Skin pour appliquer l'action prévue.
        renderP2Skin();
        // Appel de add pour appliquer l'action prévue.
        versusSkinOverlay.classList.add("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        versusSkinOverlay.setAttribute("aria-hidden", "false");
        // Vérification avant d'exécuter la suite.
        if (skinPreviewEngine) skinPreviewEngine.resize();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction switchToPlayer2Skin : elle regroupe le traitement de cette partie.
    function switchToPlayer2Skin() {
        // Instruction nécessaire au déroulement de cette partie.
        versusFlowStep = "skins";
        // Instruction nécessaire au déroulement de cette partie.
        currentSkinPlayer = 2;
        // Appel de loadSavedP2SkinSelection pour appliquer l'action prévue.
        loadSavedP2SkinSelection();
        // Vérification avant d'exécuter la suite.
        if (isSkinBlockedForPlayer(p2SkinIndex)) {
            // Valeur mémorisée dans fallbackIndex.
            var fallbackIndex = findNextAvailableIndex(p2SkinIndex, 1);
            // Vérification avant d'exécuter la suite.
            if (fallbackIndex >= 0) p2SkinIndex = fallbackIndex;
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de updateSkinHeader pour appliquer l'action prévue.
        updateSkinHeader();
        // Appel de renderP2Skin pour appliquer l'action prévue.
        renderP2Skin();
        // Vérification avant d'exécuter la suite.
        if (skinPreviewEngine) skinPreviewEngine.resize();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction openVersusStageSelection : elle regroupe le traitement de cette partie.
    function openVersusStageSelection() {
        // Vérification avant d'exécuter la suite.
        if (!versusSkinOverlay) return;
        // Appel de loadSavedVersusStageSelection pour appliquer l'action prévue.
        loadSavedVersusStageSelection();
        // Instruction nécessaire au déroulement de cette partie.
        versusFlowStep = "stage";
        // Instruction nécessaire au déroulement de cette partie.
        lastSkinNavAt = 0;
        // Instruction nécessaire au déroulement de cette partie.
        lastSkinSubmitPressed = false;
        // Instruction nécessaire au déroulement de cette partie.
        lastSkinBackPressed = false;
        // Appel de updateSkinHeader pour appliquer l'action prévue.
        updateSkinHeader();
        // Appel de renderVersusStageSelection pour appliquer l'action prévue.
        renderVersusStageSelection();
        // Appel de add pour appliquer l'action prévue.
        versusSkinOverlay.classList.add("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        versusSkinOverlay.setAttribute("aria-hidden", "false");
        // Vérification avant d'exécuter la suite.
        if (skinPreviewEngine) skinPreviewEngine.resize();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction goToPreviousSkinStep : elle regroupe le traitement de cette partie.
    function goToPreviousSkinStep() {
        // Vérification avant d'exécuter la suite.
        if (versusFlowStep === "stage") {
            // Instruction nécessaire au déroulement de cette partie.
            versusFlowStep = "skins";
            // Instruction nécessaire au déroulement de cette partie.
            currentSkinPlayer = 2;
            // Vérification avant d'exécuter la suite.
            if (versusSkinCanvas) versusSkinCanvas.style.display = "";
            // Appel de updateSkinHeader pour appliquer l'action prévue.
            updateSkinHeader();
            // Appel de renderP2Skin pour appliquer l'action prévue.
            renderP2Skin();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (currentSkinPlayer === 2) {
            // Instruction nécessaire au déroulement de cette partie.
            currentSkinPlayer = 1;
            // Appel de updateSkinHeader pour appliquer l'action prévue.
            updateSkinHeader();
            // Appel de renderP2Skin pour appliquer l'action prévue.
            renderP2Skin();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de closeVersusSkinCarousel pour appliquer l'action prévue.
        closeVersusSkinCarousel();
        // Appel de openVersusControls pour appliquer l'action prévue.
        openVersusControls();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction changeVersusStage : elle regroupe le traitement de cette partie.
    function changeVersusStage(delta) {
        // Vérification avant d'exécuter la suite.
        if (!versusStageOptions.length) return;
        // Valeur mémorisée dans nextIndex.
        var nextIndex = (selectedVersusStageIndex + delta + versusStageOptions.length) % versusStageOptions.length;
        // Appel de setActiveVersusStageIndex pour appliquer l'action prévue.
        setActiveVersusStageIndex(nextIndex);
        // Appel de renderVersusStageSelection pour appliquer l'action prévue.
        renderVersusStageSelection();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction closeVersusSkinCarousel : elle regroupe le traitement de cette partie.
    function closeVersusSkinCarousel() {
        // Vérification avant d'exécuter la suite.
        if (!versusSkinOverlay) return;
        // Appel de remove pour appliquer l'action prévue.
        versusSkinOverlay.classList.remove("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        versusSkinOverlay.setAttribute("aria-hidden", "true");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction captureP2Key : elle regroupe le traitement de cette partie.
    function captureP2Key(event) {
        // Vérification avant d'exécuter la suite.
        if (!listeningP2Action) return;
        // Appel de preventDefault pour appliquer l'action prévue.
        event.preventDefault();

        // Vérification avant d'exécuter la suite.
        if (event.key === "Escape") {
            // Instruction nécessaire au déroulement de cette partie.
            listeningP2Action = null;
            // Appel de setListeningP2Button pour appliquer l'action prévue.
            setListeningP2Button(null);
            // Appel de syncP2Buttons pour appliquer l'action prévue.
            syncP2Buttons();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Préférer event.code pour capturer les touches spéciales (flèches, Entrée, Numpad...)
        // Valeur mémorisée dans value.
        var value = null;
        // Vérification avant d'exécuter la suite.
        if (event.code && event.code !== "" && event.code !== "Unidentified") {
            // Vérification avant d'exécuter la suite.
            if (event.code === "Space") {
                // Instruction nécessaire au déroulement de cette partie.
                value = "Space";
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Instruction nécessaire au déroulement de cette partie.
                value = event.code; // "ArrowUp", "ShiftRight", "Enter", "KeyZ", "Numpad4"...
            // Fermeture du bloc ou de l'appel.
            }
        // Deuxième possibilité à tester.
        } else if (event.key && event.key.length === 1) {
            // Appel de toLowerCase pour appliquer l'action prévue.
            value = event.key.toLowerCase();
        // Deuxième possibilité à tester.
        } else if (event.key) {
            // Instruction nécessaire au déroulement de cette partie.
            value = event.key;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!value || !window.inputBindings || typeof window.inputBindings.setPlayer2Binding !== "function") return;

        // Valeur mémorisée dans result.
        var result = window.inputBindings.setPlayer2Binding(listeningP2Action, value);
        // Vérification avant d'exécuter la suite.
        if (!result.ok) {
            // Valeur mémorisée dans currentAction.
            var currentAction = listeningP2Action;
            // Instruction nécessaire au déroulement de cette partie.
            listeningP2Action = null;
            // Appel de setListeningP2Button pour appliquer l'action prévue.
            setListeningP2Button(null);
            // Récupération de l'élément HTML btn.
            var btn = document.querySelector('.settings-keybind-btn[data-action-p2="' + currentAction + '"]');
            // Vérification avant d'exécuter la suite.
            if (btn) {
                // Mise à jour de textContent.
                btn.textContent = "Déjà pris";
                // Appel de setTimeout pour appliquer l'action prévue.
                window.setTimeout(function () { refreshP2Bindings(); }, 700);
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        listeningP2Action = null;
        // Appel de setListeningP2Button pour appliquer l'action prévue.
        setListeningP2Button(null);
        // Appel de refreshP2Bindings pour appliquer l'action prévue.
        refreshP2Bindings();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setActivePreview : elle regroupe le traitement de cette partie.
    function setActivePreview(key) {
        // Appel de forEach pour appliquer l'action prévue.
        previewFrames.forEach(function (frame) {
            // Valeur mémorisée dans isTarget.
            var isTarget = frame.dataset.preview === key;
            // Appel de toggle pour appliquer l'action prévue.
            frame.classList.toggle("is-active", isTarget);

            // Vérification avant d'exécuter la suite.
            if (isTarget && (key === "tournament" || key === "versus")) {
                // Valeur mémorisée dans tail.
                var tail = frame.querySelector(".pre-match-tournament-tail");
                // Valeur mémorisée dans tailText.
                var tailText = frame.querySelector(".pre-match-tournament-tail span");
                // Vérification avant d'exécuter la suite.
                if (tail && tailText) {
                    // Valeur mémorisée dans revealWidth.
                    var revealWidth = Math.max(1, Math.ceil(tailText.getBoundingClientRect().width));
                    // Appel de setProperty pour appliquer l'action prévue.
                    tail.style.setProperty("--reveal-width", revealWidth + "px");
                    // Appel de setProperty pour appliquer l'action prévue.
                    tail.style.setProperty("--slide-start", -revealWidth + "px");
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans video.
            var video = frame.querySelector(".menu-preview-video");
            // Vérification avant d'exécuter la suite.
            if (!video) return;

            // Vérification avant d'exécuter la suite.
            if (isTarget) {
                // Valeur mémorisée dans dataSrc.
                var dataSrc = video.getAttribute("data-src");
                // Vérification avant d'exécuter la suite.
                if (dataSrc && !video.src) {
                    // Mise à jour de src.
                    video.src = dataSrc;
                // Fermeture du bloc ou de l'appel.
                }
                // Vérification avant d'exécuter la suite.
                if (video.src) {
                    // Appel de play pour appliquer l'action prévue.
                    video.play().catch(function () { /* autoplay may be blocked */ });
                // Fermeture du bloc ou de l'appel.
                }
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Vérification avant d'exécuter la suite.
                if (!video.paused) video.pause();
                // Mise à jour de currentTime.
                video.currentTime = 0;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction resetPreview : elle regroupe le traitement de cette partie.
    function resetPreview() {
        // Appel de setActivePreview pour appliquer l'action prévue.
        setActivePreview("idle");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isModalOverlayOpen : elle regroupe le traitement de cette partie.
    function isModalOverlayOpen() {
        // Récupération de l'élément HTML settingsOverlay.
        var settingsOverlay = document.getElementById("settings-overlay");
        // Résultat renvoyé par la fonction.
        return (
            // Appel de getAttribute pour appliquer l'action prévue.
            (settingsOverlay && settingsOverlay.getAttribute("aria-hidden") === "false") ||
            // Appel de getAttribute pour appliquer l'action prévue.
            (versusOverlay && versusOverlay.getAttribute("aria-hidden") === "false") ||
            // Appel de isVersusSkinOpen pour appliquer l'action prévue.
            isVersusSkinOpen()
        // Fermeture du bloc ou de l'appel.
        );
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isMenuVisible : elle regroupe le traitement de cette partie.
    function isMenuVisible() {
        // Résultat renvoyé par la fonction.
        return !menu.classList.contains("is-hidden") && menu.getAttribute("aria-hidden") !== "true" && !isModalOverlayOpen();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getFocusIndex : elle regroupe le traitement de cette partie.
    function getFocusIndex() {
        // Récupération de l'élément HTML active.
        var active = document.activeElement;
        // Valeur mémorisée dans idx.
        var idx = focusable.indexOf(active);
        // Résultat renvoyé par la fonction.
        return idx >= 0 ? idx : 0;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction focusAt : elle regroupe le traitement de cette partie.
    function focusAt(index) {
        // Vérification avant d'exécuter la suite.
        if (!focusable.length) return;
        // Valeur mémorisée dans i.
        var i = index % focusable.length;
        // Vérification avant d'exécuter la suite.
        if (i < 0) i += focusable.length;
        // Appel de focus pour appliquer l'action prévue.
        focusable[i].focus();
        // Appel de syncMenuSelection pour appliquer l'action prévue.
        syncMenuSelection();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction moveFocus : elle regroupe le traitement de cette partie.
    function moveFocus(delta) {
        // Appel de focusAt pour appliquer l'action prévue.
        focusAt(getFocusIndex() + delta);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction syncMenuSelection : elle regroupe le traitement de cette partie.
    function syncMenuSelection() {
        // Récupération de l'élément HTML active.
        var active = document.activeElement;
        // Appel de forEach pour appliquer l'action prévue.
        focusable.forEach(function (tile) {
            // Appel de toggle pour appliquer l'action prévue.
            tile.classList.toggle("is-selected", tile === active);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleMenuNavKey : elle regroupe le traitement de cette partie.
    function handleMenuNavKey(e) {
        // Vérification avant d'exécuter la suite.
        if (!isMenuVisible()) return;
        // Vérification avant d'exécuter la suite.
        if (isVersusSkinOpen()) return;
        // Vérification avant d'exécuter la suite.
        if (versusOverlay && versusOverlay.getAttribute("aria-hidden") === "false") return;
        // Vérification avant d'exécuter la suite.
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            // Appel de preventDefault pour appliquer l'action prévue.
            e.preventDefault();
            // Appel de moveFocus pour appliquer l'action prévue.
            moveFocus(-1);
        // Deuxième possibilité à tester.
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            // Appel de preventDefault pour appliquer l'action prévue.
            e.preventDefault();
            // Appel de moveFocus pour appliquer l'action prévue.
            moveFocus(1);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getNavInputFromGamepad : elle regroupe le traitement de cette partie.
    function getNavInputFromGamepad(pad) {
        // Vérification avant d'exécuter la suite.
        if (!pad) return null;
        // Valeur mémorisée dans axes.
        var axes = pad.axes || [];
        // Valeur mémorisée dans deadzone.
        var deadzone = 0.4;
        // Valeur mémorisée dans axX.
        var axX = axes.length > 0 ? axes[0] : 0;
        // Valeur mémorisée dans axY.
        var axY = axes.length > 1 ? axes[1] : 0;
        // Vérification avant d'exécuter la suite.
        if (Math.abs(axY) > Math.abs(axX)) {
            // Vérification avant d'exécuter la suite.
            if (axY > deadzone) return "down";
            // Vérification avant d'exécuter la suite.
            if (axY < -deadzone) return "up";
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Vérification avant d'exécuter la suite.
            if (axX > deadzone) return "right";
            // Vérification avant d'exécuter la suite.
            if (axX < -deadzone) return "left";
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans btns.
        var btns = pad.buttons || [];
        // Vérification avant d'exécuter la suite.
        if (btns[12] && btns[12].pressed) return "up";
        // Vérification avant d'exécuter la suite.
        if (btns[13] && btns[13].pressed) return "down";
        // Vérification avant d'exécuter la suite.
        if (btns[14] && btns[14].pressed) return "left";
        // Vérification avant d'exécuter la suite.
        if (btns[15] && btns[15].pressed) return "right";

        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getSkinNavInputFromGamepad : elle regroupe le traitement de cette partie.
    function getSkinNavInputFromGamepad(pad) {
        // Vérification avant d'exécuter la suite.
        if (!pad) return null;

        // Valeur mémorisée dans axes.
        var axes = pad.axes || [];
        // Valeur mémorisée dans deadzone.
        var deadzone = 0.35;
        // Valeur mémorisée dans axX.
        var axX = axes.length > 0 ? axes[0] : 0;
        // Valeur mémorisée dans axY.
        var axY = axes.length > 1 ? axes[1] : 0;

        // Vérification avant d'exécuter la suite.
        if (Math.abs(axX) > Math.abs(axY)) {
            // Vérification avant d'exécuter la suite.
            if (axX > deadzone) return "right";
            // Vérification avant d'exécuter la suite.
            if (axX < -deadzone) return "left";
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans btns.
        var btns = pad.buttons || [];
        // Vérification avant d'exécuter la suite.
        if (btns[14] && btns[14].pressed) return "left";
        // Vérification avant d'exécuter la suite.
        if (btns[15] && btns[15].pressed) return "right";

        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleSkinGamepad : elle regroupe le traitement de cette partie.
    function handleSkinGamepad(pad) {
        // Vérification avant d'exécuter la suite.
        if (!isVersusSkinOpen()) return false;

        // Valeur mémorisée dans nav.
        var nav = versusFlowStep === "stage" ? getSkinNavInputFromGamepad(pad) : getSkinNavInputFromGamepad(pad);
        // Valeur mémorisée dans now.
        var now = performance.now();

        // Vérification avant d'exécuter la suite.
        if (nav && now - lastSkinNavAt > 180) {
            // Instruction nécessaire au déroulement de cette partie.
            lastSkinNavAt = now;
            // Vérification avant d'exécuter la suite.
            if (versusFlowStep === "stage") {
                // Vérification avant d'exécuter la suite.
                if (nav === "left") changeVersusStage(-1);
                // Vérification avant d'exécuter la suite.
                if (nav === "right") changeVersusStage(1);
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Vérification avant d'exécuter la suite.
                if (nav === "left") changeP2Skin(-1);
                // Vérification avant d'exécuter la suite.
                if (nav === "right") changeP2Skin(1);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans buttons.
        var buttons = pad && pad.buttons ? pad.buttons : [];
        // Valeur mémorisée dans confirmPressed.
        var confirmPressed = !!(buttons[0] && buttons[0].pressed);
        // Valeur mémorisée dans backPressed.
        var backPressed = !!(buttons[1] && buttons[1].pressed);

        // Vérification avant d'exécuter la suite.
        if (confirmPressed && !lastSkinSubmitPressed && versusSkinConfirmBtn) {
            // Appel de click pour appliquer l'action prévue.
            versusSkinConfirmBtn.click();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (backPressed && !lastSkinBackPressed) {
            // Vérification avant d'exécuter la suite.
            if (versusSkinBackBtn) {
                // Appel de click pour appliquer l'action prévue.
                versusSkinBackBtn.click();
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de goToPreviousSkinStep pour appliquer l'action prévue.
                goToPreviousSkinStep();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        lastSkinSubmitPressed = confirmPressed;
        // Instruction nécessaire au déroulement de cette partie.
        lastSkinBackPressed = backPressed;
        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction pollMenuGamepad : elle regroupe le traitement de cette partie.
    function pollMenuGamepad() {
        // Valeur mémorisée dans pads.
        var pads = (navigator.getGamepads && navigator.getGamepads()) || [];
        // Valeur mémorisée dans pad.
        var pad = pads.find(function (p) { return p && p.connected; }) || null;

        // Vérification avant d'exécuter la suite.
        if (window.scoreHistory && typeof window.scoreHistory.isOpen === "function" && window.scoreHistory.isOpen()) {
            // Instruction nécessaire au déroulement de cette partie.
            lastSubmitPressed = false;
            // Appel de requestAnimationFrame pour appliquer l'action prévue.
            window.requestAnimationFrame(pollMenuGamepad);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (handleSkinGamepad(pad)) {
            // Appel de requestAnimationFrame pour appliquer l'action prévue.
            window.requestAnimationFrame(pollMenuGamepad);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (isMenuVisible()) {
            // Valeur mémorisée dans nav.
            var nav = getNavInputFromGamepad(pad);
            // Valeur mémorisée dans now.
            var now = performance.now();
            // Vérification avant d'exécuter la suite.
            if (nav && now - lastNavAt > 180) {
                // Instruction nécessaire au déroulement de cette partie.
                lastNavAt = now;
                // Vérification avant d'exécuter la suite.
                if (nav === "left" || nav === "up") moveFocus(-1);
                // Vérification avant d'exécuter la suite.
                if (nav === "right" || nav === "down") moveFocus(1);
            // Fermeture du bloc ou de l'appel.
            }
            // Valeur mémorisée dans submit.
            var submit = pad && pad.buttons && pad.buttons[0] && pad.buttons[0].pressed;
            // Vérification avant d'exécuter la suite.
            if (submit && !lastSubmitPressed) {
                // Récupération de l'élément HTML active.
                var active = document.activeElement;
                // Vérification avant d'exécuter la suite.
                if (active && typeof active.click === "function") {
                    // Appel de click pour appliquer l'action prévue.
                    active.click();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Instruction nécessaire au déroulement de cette partie.
            lastSubmitPressed = !!submit;
            // Appel de syncMenuSelection pour appliquer l'action prévue.
            syncMenuSelection();
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de requestAnimationFrame pour appliquer l'action prévue.
        window.requestAnimationFrame(pollMenuGamepad);
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de forEach pour appliquer l'action prévue.
    tiles.forEach(function (tile) {
        // Valeur mémorisée dans key.
        var key = tile.dataset.preview;
        // Appel de addEventListener pour appliquer l'action prévue.
        tile.addEventListener("mouseenter", function () { setActivePreview(key); });
        // Appel de addEventListener pour appliquer l'action prévue.
        tile.addEventListener("focus", function () { setActivePreview(key); });
        // Appel de addEventListener pour appliquer l'action prévue.
        tile.addEventListener("mouseleave", resetPreview);
        // Appel de addEventListener pour appliquer l'action prévue.
        tile.addEventListener("blur", function () {
            // Appel de resetPreview pour appliquer l'action prévue.
            resetPreview();
            // Appel de syncMenuSelection pour appliquer l'action prévue.
            syncMenuSelection();
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de forEach pour appliquer l'action prévue.
    focusable.forEach(function (tile) {
        // Appel de addEventListener pour appliquer l'action prévue.
        tile.addEventListener("focus", syncMenuSelection);
        // Appel de addEventListener pour appliquer l'action prévue.
        tile.addEventListener("blur", syncMenuSelection);
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de syncMenuSelection pour appliquer l'action prévue.
    syncMenuSelection();

    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("keydown", handleMenuNavKey, true);
    // Appel de pollMenuGamepad pour appliquer l'action prévue.
    pollMenuGamepad();

    // Vérification avant d'exécuter la suite.
    if (settingsTile) {
        // Appel de addEventListener pour appliquer l'action prévue.
        settingsTile.addEventListener("mouseenter", function () {
            // Appel de setActivePreview pour appliquer l'action prévue.
            setActivePreview("__none__");
        // Fermeture du bloc ou de l'appel.
        });
        // Appel de addEventListener pour appliquer l'action prévue.
        settingsTile.addEventListener("focus", function () {
            // Appel de setActivePreview pour appliquer l'action prévue.
            setActivePreview("__none__");
        // Fermeture du bloc ou de l'appel.
        });
        // Appel de addEventListener pour appliquer l'action prévue.
        settingsTile.addEventListener("mouseleave", resetPreview);
        // Appel de addEventListener pour appliquer l'action prévue.
        settingsTile.addEventListener("blur", resetPreview);

        // Appel de addEventListener pour appliquer l'action prévue.
        settingsTile.addEventListener("click", function () {
            // Vérification avant d'exécuter la suite.
            if (window.settingsMenu && typeof window.settingsMenu.open === "function") {
                // Appel de open pour appliquer l'action prévue.
                window.settingsMenu.open();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (tournamentTile) {
        // Appel de addEventListener pour appliquer l'action prévue.
        tournamentTile.addEventListener("click", function () {
            // Appel de add pour appliquer l'action prévue.
            menu.classList.add("is-hidden");
            // Appel de setAttribute pour appliquer l'action prévue.
            menu.setAttribute("aria-hidden", "true");
            // Vérification avant d'exécuter la suite.
            if (typeof window.startTournamentMatch === "function") {
                // Appel de startTournamentMatch pour appliquer l'action prévue.
                window.startTournamentMatch();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusTile) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusTile.addEventListener("click", function () {
            // Appel de openVersusControls pour appliquer l'action prévue.
            openVersusControls();
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (scoreTile) {
        // Appel de addEventListener pour appliquer l'action prévue.
        scoreTile.addEventListener("click", function () {
            // Vérification avant d'exécuter la suite.
            if (window.scoreHistory && typeof window.scoreHistory.open === "function") {
                // Appel de open pour appliquer l'action prévue.
                window.scoreHistory.open();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de forEach pour appliquer l'action prévue.
    versusKeyBtns.forEach(function (btn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        btn.addEventListener("click", function () {
            // Instruction nécessaire au déroulement de cette partie.
            listeningP2Action = btn.dataset.actionP2;
            // Appel de setListeningP2Button pour appliquer l'action prévue.
            setListeningP2Button(listeningP2Action);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Vérification avant d'exécuter la suite.
    if (versusCloseBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusCloseBtn.addEventListener("click", closeVersusControls);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusConfirmBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusConfirmBtn.addEventListener("click", function () {
            // Appel de closeVersusControls pour appliquer l'action prévue.
            closeVersusControls();
            // Appel de openVersusSkinCarousel pour appliquer l'action prévue.
            openVersusSkinCarousel();
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusSkinCloseBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusSkinCloseBtn.addEventListener("click", function () {
            // Appel de goToPreviousSkinStep pour appliquer l'action prévue.
            goToPreviousSkinStep();
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusSkinPrevBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusSkinPrevBtn.addEventListener("click", function () {
            // Appel de changeP2Skin pour appliquer l'action prévue.
            changeP2Skin(-1);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusSkinNextBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusSkinNextBtn.addEventListener("click", function () {
            // Appel de changeP2Skin pour appliquer l'action prévue.
            changeP2Skin(1);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (skinList) {
        // Appel de addEventListener pour appliquer l'action prévue.
        skinList.addEventListener("click", function (event) {
            // Valeur mémorisée dans btn.
            var btn = event.target && event.target.closest ? event.target.closest(".skin-option") : null;
            // Vérification avant d'exécuter la suite.
            if (!btn || !btn.dataset) return;

            // Vérification avant d'exécuter la suite.
            if (versusFlowStep === "stage" && typeof btn.dataset.stageIndex !== "undefined") {
                // Valeur mémorisée dans nextStageIndex.
                var nextStageIndex = Number.parseInt(btn.dataset.stageIndex, 10);
                // Vérification avant d'exécuter la suite.
                if (!Number.isNaN(nextStageIndex)) {
                    // Appel de setActiveVersusStageIndex pour appliquer l'action prévue.
                    setActiveVersusStageIndex(nextStageIndex);
                    // Appel de renderVersusStageSelection pour appliquer l'action prévue.
                    renderVersusStageSelection();
                // Fermeture du bloc ou de l'appel.
                }
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof btn.dataset.index === "undefined") return;
            // Valeur mémorisée dans nextIndex.
            var nextIndex = Number.parseInt(btn.dataset.index, 10);
            // Vérification avant d'exécuter la suite.
            if (currentSkinPlayer === 2 && isSkinBlockedForPlayer(nextIndex)) return;
            // Vérification avant d'exécuter la suite.
            if (!Number.isNaN(nextIndex)) {
                // Appel de setActiveSkinIndex pour appliquer l'action prévue.
                setActiveSkinIndex(nextIndex);
                // Appel de renderP2Skin pour appliquer l'action prévue.
                renderP2Skin();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusSkinIndicators) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusSkinIndicators.addEventListener("click", function (event) {
            // Valeur mémorisée dans btn.
            var btn = event.target && event.target.closest ? event.target.closest(".skin-dot") : null;
            // Vérification avant d'exécuter la suite.
            if (!btn || !btn.dataset) return;

            // Vérification avant d'exécuter la suite.
            if (versusFlowStep === "stage" && typeof btn.dataset.stageIndex === "undefined") return;
            // Vérification avant d'exécuter la suite.
            if (versusFlowStep === "stage") {
                // Valeur mémorisée dans nextStageIndex.
                var nextStageIndex = Number.parseInt(btn.dataset.stageIndex, 10);
                // Vérification avant d'exécuter la suite.
                if (!Number.isNaN(nextStageIndex)) {
                    // Appel de setActiveVersusStageIndex pour appliquer l'action prévue.
                    setActiveVersusStageIndex(nextStageIndex);
                    // Appel de renderVersusStageSelection pour appliquer l'action prévue.
                    renderVersusStageSelection();
                // Fermeture du bloc ou de l'appel.
                }
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof btn.dataset.index === "undefined") return;
            // Valeur mémorisée dans nextIndex.
            var nextIndex = Number.parseInt(btn.dataset.index, 10);
            // Vérification avant d'exécuter la suite.
            if (currentSkinPlayer === 2 && isSkinBlockedForPlayer(nextIndex)) return;
            // Vérification avant d'exécuter la suite.
            if (!Number.isNaN(nextIndex)) {
                // Appel de setActiveSkinIndex pour appliquer l'action prévue.
                setActiveSkinIndex(nextIndex);
                // Appel de renderP2Skin pour appliquer l'action prévue.
                renderP2Skin();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusSkinBackBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusSkinBackBtn.addEventListener("click", function () {
            // Appel de goToPreviousSkinStep pour appliquer l'action prévue.
            goToPreviousSkinStep();
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (versusSkinConfirmBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        versusSkinConfirmBtn.addEventListener("click", function () {
            // Valeur mémorisée dans skin.
            var skin = p2Skins[getActiveSkinIndex()];
            // Vérification avant d'exécuter la suite.
            if (skin) {
                // Valeur mémorisée dans selectedEntry.
                var selectedEntry = getResolvedSkinPreviewEntry(skin, getActiveSkinIndex());
                // Valeur mémorisée dans resolvedMeshIndex.
                var resolvedMeshIndex = selectedEntry ? selectedEntry.sourceIndex : skin.meshIndex;
                // Vérification avant d'exécuter la suite.
                if (currentSkinPlayer === 1) {
                    // Appel de setItem pour appliquer l'action prévue.
                    window.localStorage.setItem(P1_SKIN_STORAGE_KEY, skin.id);
                    // Appel de setItem pour appliquer l'action prévue.
                    window.localStorage.setItem(P1_SKIN_MESH_STORAGE_KEY, String(resolvedMeshIndex));
                    // Appel de switchToPlayer2Skin pour appliquer l'action prévue.
                    switchToPlayer2Skin();
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }
                // Appel de setItem pour appliquer l'action prévue.
                window.localStorage.setItem(P2_SKIN_STORAGE_KEY, skin.id);
                // Appel de setItem pour appliquer l'action prévue.
                window.localStorage.setItem(P2_SKIN_MESH_STORAGE_KEY, String(resolvedMeshIndex));
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (currentSkinPlayer === 2 && versusFlowStep === "skins") {
                // Appel de openVersusStageSelection pour appliquer l'action prévue.
                openVersusStageSelection();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (versusFlowStep === "stage") {
                // Valeur mémorisée dans stage.
                var stage = getActiveVersusStage();
                // Vérification avant d'exécuter la suite.
                if (stage) {
                    // Appel de setItem pour appliquer l'action prévue.
                    window.localStorage.setItem(VERSUS_STAGE_STORAGE_KEY, stage.id);
                    // Mise à jour de selectedVersusStage.
                    window.selectedVersusStage = stage.id;
                // Fermeture du bloc ou de l'appel.
                }
                // Appel de closeVersusSkinCarousel pour appliquer l'action prévue.
                closeVersusSkinCarousel();
                // Appel de add pour appliquer l'action prévue.
                menu.classList.add("is-hidden");
                // Appel de setAttribute pour appliquer l'action prévue.
                menu.setAttribute("aria-hidden", "true");
                // Vérification avant d'exécuter la suite.
                if (typeof window.startVersusMatch === "function") {
                    // Appel de startVersusMatch pour appliquer l'action prévue.
                    window.startVersusMatch(stage ? stage.id : window.selectedVersusStage);
                // Deuxième possibilité à tester.
                } else if (typeof window.startTournamentMatch === "function") {
                    // fallback temporaire tant que le mode 1v1 dédié n'est pas branché
                    // Appel de startTournamentMatch pour appliquer l'action prévue.
                    window.startTournamentMatch();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("keydown", function (e) {
        // Vérification avant d'exécuter la suite.
        if (isVersusSkinOpen()) {
            // Vérification avant d'exécuter la suite.
            if (versusFlowStep === "stage") {
                // Vérification avant d'exécuter la suite.
                if (e.key === "ArrowLeft") {
                    // Appel de preventDefault pour appliquer l'action prévue.
                    e.preventDefault();
                    // Appel de changeVersusStage pour appliquer l'action prévue.
                    changeVersusStage(-1);
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }
                // Vérification avant d'exécuter la suite.
                if (e.key === "ArrowRight") {
                    // Appel de preventDefault pour appliquer l'action prévue.
                    e.preventDefault();
                    // Appel de changeVersusStage pour appliquer l'action prévue.
                    changeVersusStage(1);
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Vérification avant d'exécuter la suite.
                if (e.key === "ArrowLeft") {
                    // Appel de preventDefault pour appliquer l'action prévue.
                    e.preventDefault();
                    // Appel de changeP2Skin pour appliquer l'action prévue.
                    changeP2Skin(-1);
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }
                // Vérification avant d'exécuter la suite.
                if (e.key === "ArrowRight") {
                    // Appel de preventDefault pour appliquer l'action prévue.
                    e.preventDefault();
                    // Appel de changeP2Skin pour appliquer l'action prévue.
                    changeP2Skin(1);
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (e.key === "Enter") {
                // Appel de preventDefault pour appliquer l'action prévue.
                e.preventDefault();
                // Vérification avant d'exécuter la suite.
                if (versusSkinConfirmBtn) versusSkinConfirmBtn.click();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (e.key === "Escape") {
                // Appel de preventDefault pour appliquer l'action prévue.
                e.preventDefault();
                // Appel de goToPreviousSkinStep pour appliquer l'action prévue.
                goToPreviousSkinStep();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!versusOverlay || versusOverlay.getAttribute("aria-hidden") === "true") return;
        // Vérification avant d'exécuter la suite.
        if (listeningP2Action) {
            // Appel de captureP2Key pour appliquer l'action prévue.
            captureP2Key(e);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (e.key === "Escape") {
            // Appel de preventDefault pour appliquer l'action prévue.
            e.preventDefault();
            // Appel de closeVersusControls pour appliquer l'action prévue.
            closeVersusControls();
        // Fermeture du bloc ou de l'appel.
        }
    // Instruction nécessaire au déroulement de cette partie.
    }, true);

    // Appel de forEach pour appliquer l'action prévue.
    closeButtons.forEach(function (btn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        btn.addEventListener("click", function () {
            // Appel de closeVersusSkinCarousel pour appliquer l'action prévue.
            closeVersusSkinCarousel();
            // Appel de closeVersusControls pour appliquer l'action prévue.
            closeVersusControls();
            // Appel de add pour appliquer l'action prévue.
            menu.classList.add("is-hidden");
            // Appel de setAttribute pour appliquer l'action prévue.
            menu.setAttribute("aria-hidden", "true");
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de loadSavedP1SkinSelection pour appliquer l'action prévue.
    loadSavedP1SkinSelection();
    // Appel de loadSavedP2SkinSelection pour appliquer l'action prévue.
    loadSavedP2SkinSelection();
    // Appel de loadSavedVersusStageSelection pour appliquer l'action prévue.
    loadSavedVersusStageSelection();
    // Appel de resetPreview pour appliquer l'action prévue.
    resetPreview();
// Instruction nécessaire au déroulement de cette partie.
})();
