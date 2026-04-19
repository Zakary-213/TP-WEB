// js/ui/scoreHistory.js
// Overlay des derniers matchs charge depuis les scores sauvegardes par utilisateur.

// Appel de function pour appliquer l'action prévue.
(function () {
    // Instruction nécessaire au déroulement de cette partie.
    "use strict";

    // Récupération de l'élément HTML overlay.
    var overlay = document.getElementById("score-history-overlay");
    // Récupération de l'élément HTML closeBtn.
    var closeBtn = document.getElementById("score-history-close-btn");
    // Récupération de l'élément HTML tbody.
    var tbody = document.getElementById("score-history-table-body");
    // Valeur mémorisée dans filterButtons.
    var filterButtons = overlay ? overlay.querySelectorAll(".score-history-filter-btn[data-result-filter]") : [];
    // Vérification avant d'exécuter la suite.
    if (!overlay || !tbody) return;
    // Valeur mémorisée dans activeFilter.
    var activeFilter = "all";
    // Valeur mémorisée dans historyRows.
    var historyRows = [];
    // Valeur mémorisée dans lastBackPressed.
    var lastBackPressed = false;

    // Fonction getUserId : elle regroupe le traitement de cette partie.
    function getUserId() {
        // Vérification avant d'exécuter la suite.
        if (window.CANVAS_API && typeof window.CANVAS_API.getUserId === "function") {
            // Résultat renvoyé par la fonction.
            return window.CANVAS_API.getUserId();
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return window.localStorage.getItem("tpweb_user_id");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction toApiUrl : elle regroupe le traitement de cette partie.
    function toApiUrl(path) {
        // Vérification avant d'exécuter la suite.
        if (window.CANVAS_API && typeof window.CANVAS_API.toUrl === "function") {
            // Résultat renvoyé par la fonction.
            return window.CANVAS_API.toUrl(path);
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return path;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction modeLabel : elle regroupe le traitement de cette partie.
    function modeLabel(mode) {
        // Valeur mémorisée dans normalized.
        var normalized = typeof mode === "string" ? mode.toLowerCase() : "";
        // Vérification avant d'exécuter la suite.
        if (normalized === "tournament") return "Mode Tournoi";
        // Vérification avant d'exécuter la suite.
        if (normalized === "versus" || normalized === "1v1") return "Mode 1vs1";
        // Résultat renvoyé par la fonction.
        return "Mode inconnu";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction stageLabel : elle regroupe le traitement de cette partie.
    function stageLabel(stage) {
        // Valeur mémorisée dans normalized.
        var normalized = typeof stage === "string" ? stage.toLowerCase() : "";
        // Vérification avant d'exécuter la suite.
        if (normalized === "huitieme") return "Huitieme de finale";
        // Vérification avant d'exécuter la suite.
        if (normalized === "quart") return "Quart de finale";
        // Vérification avant d'exécuter la suite.
        if (normalized === "demi") return "Demi-finale";
        // Vérification avant d'exécuter la suite.
        if (normalized === "finale") return "Finale";
        // Résultat renvoyé par la fonction.
        return "-";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction normalizeResult : elle regroupe le traitement de cette partie.
    function normalizeResult(result, homeGoals, awayGoals) {
        // Valeur mémorisée dans value.
        var value = typeof result === "string" ? result.toLowerCase() : "";
        // Vérification avant d'exécuter la suite.
        if (value === "win" || value === "victoire" || value === "gagne") return "win";
        // Vérification avant d'exécuter la suite.
        if (value === "draw" || value === "nul" || value === "match nul") return "draw";
        // Vérification avant d'exécuter la suite.
        if (value === "loss" || value === "defaite" || value === "perdu") return "loss";
        // Vérification avant d'exécuter la suite.
        if (homeGoals > awayGoals) return "win";
        // Vérification avant d'exécuter la suite.
        if (homeGoals < awayGoals) return "loss";
        // Résultat renvoyé par la fonction.
        return "draw";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction formatGoalTime : elle regroupe le traitement de cette partie.
    function formatGoalTime(value) {
        // Vérification avant d'exécuter la suite.
        if (typeof value === "string" && /^\d{2}:\d{2}'?$/.test(value)) {
            // Résultat renvoyé par la fonction.
            return value.endsWith("'") ? value : value + "'";
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans numeric.
        var numeric = Number(value);
        // Vérification avant d'exécuter la suite.
        if (!Number.isFinite(numeric)) return null;
        // Valeur mémorisée dans safeSeconds.
        var safeSeconds = Math.max(0, Math.floor(numeric));
        // Valeur mémorisée dans min.
        var min = Math.floor(safeSeconds / 60);
        // Valeur mémorisée dans sec.
        var sec = safeSeconds % 60;
        // Résultat renvoyé par la fonction.
        return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0") + "'";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction formatGoalTimes : elle regroupe le traitement de cette partie.
    function formatGoalTimes(times) {
        // Vérification avant d'exécuter la suite.
        if (!Array.isArray(times) || !times.length) return [];
        // Résultat renvoyé par la fonction.
        return times.map(formatGoalTime).filter(Boolean);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction expandTeamLabel : elle regroupe le traitement de cette partie.
    function expandTeamLabel(label) {
        // Valeur mémorisée dans raw.
        var raw = typeof label === "string" ? label.trim() : "";
        // Vérification avant d'exécuter la suite.
        if (!raw) return "Equipe";

        // Valeur mémorisée dans shortToFull.
        var shortToFull = {
            // Paramètre de l'appel ou valeur de configuration.
            PA: "PARIS",
            // Paramètre de l'appel ou valeur de configuration.
            LY: "LYON",
            // Paramètre de l'appel ou valeur de configuration.
            MA: "MARSEILLE",
            // Paramètre de l'appel ou valeur de configuration.
            BO: "BORDEAUX",
            // Paramètre de l'appel ou valeur de configuration.
            LI: "LILLE",
            // Paramètre de l'appel ou valeur de configuration.
            NA: "NANTES",
            // Paramètre de l'appel ou valeur de configuration.
            TO: "TOULOUSE",
            // Paramètre de l'appel ou valeur de configuration.
            RE: "RENNES",
            // Paramètre de l'appel ou valeur de configuration.
            NI: "NICE",
            // Paramètre de l'appel ou valeur de configuration.
            ST: "STRASBOURG",
            // Paramètre de l'appel ou valeur de configuration.
            IA: "IA",
            // Instruction nécessaire au déroulement de cette partie.
            YOU: "YOU"
        // Fermeture du bloc ou de l'appel.
        };

        // Valeur mémorisée dans upper.
        var upper = raw.toUpperCase();
        // Résultat renvoyé par la fonction.
        return shortToFull[upper] || upper;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction toHistoryRow : elle regroupe le traitement de cette partie.
    function toHistoryRow(entry) {
        // Valeur mémorisée dans payload.
        var payload = entry && entry.data ? entry.data : {};
        // Valeur mémorisée dans homeGoals.
        var homeGoals = Number(payload.totalButs || 0);
        // Valeur mémorisée dans awayGoals.
        var awayGoals = Number(payload.totalButsAdversaire || 0);

        // Valeur mémorisée dans leftLabel.
        var leftLabel = expandTeamLabel(payload.teamLeftLabel || "YOU");
        // Valeur mémorisée dans rightLabel.
        var rightLabel = expandTeamLabel(payload.teamRightLabel || "IA");

        // Valeur mémorisée dans mode.
        var mode = typeof (entry && entry.mode) === "string" ? entry.mode.toLowerCase() : String(payload.mode || "").toLowerCase();

        // Résultat renvoyé par la fonction.
        return {
            // Appel de modeLabel pour appliquer l'action prévue.
            competition: modeLabel(mode),
            // Appel de stageLabel pour appliquer l'action prévue.
            stage: mode === "tournament" ? stageLabel(payload.tournamentStage) : "-",
            // Paramètre de l'appel ou valeur de configuration.
            home: leftLabel,
            // Paramètre de l'appel ou valeur de configuration.
            away: rightLabel,
            // Paramètre de l'appel ou valeur de configuration.
            homeGoals: homeGoals,
            // Paramètre de l'appel ou valeur de configuration.
            awayGoals: awayGoals,
            // Appel de normalizeResult pour appliquer l'action prévue.
            result: normalizeResult(payload.result || payload.resultat, homeGoals, awayGoals),
            // Ouverture du bloc correspondant.
            goals: {
                // Appel de formatGoalTimes pour appliquer l'action prévue.
                home: formatGoalTimes(payload.minuteButs),
                // Appel de formatGoalTimes pour appliquer l'action prévue.
                away: formatGoalTimes(payload.minuteButsAdversaire)
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction fetchScoresByMode : elle regroupe le traitement de cette partie.
    async function fetchScoresByMode(userId, mode) {
        // Création de query.
        var query = new URLSearchParams({
            // Paramètre de l'appel ou valeur de configuration.
            game: "gamesonweb",
            // Paramètre de l'appel ou valeur de configuration.
            mode: mode,
            // Paramètre de l'appel ou valeur de configuration.
            limit: "100",
            // Instruction nécessaire au déroulement de cette partie.
            userId: userId
        // Fermeture du bloc ou de l'appel.
        });

        // Valeur mémorisée dans response.
        var response = await fetch(toApiUrl("/api/scores/top?" + query.toString()));
        // Valeur mémorisée dans result.
        var result = await response.json();
        // Vérification avant d'exécuter la suite.
        if (!result.success || !Array.isArray(result.data)) return [];
        // Résultat renvoyé par la fonction.
        return result.data;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction loadHistoryRows : elle regroupe le traitement de cette partie.
    async function loadHistoryRows() {
        // Valeur mémorisée dans userId.
        var userId = getUserId();
        // Vérification avant d'exécuter la suite.
        if (!userId) {
            // Instruction nécessaire au déroulement de cette partie.
            historyRows = [];
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans modes.
        var modes = ["tournament", "versus", "1v1"];
        // Valeur mémorisée dans responses.
        var responses = await Promise.all(modes.map(function (mode) {
            // Résultat renvoyé par la fonction.
            return fetchScoresByMode(userId, mode).catch(function () {
                // Résultat renvoyé par la fonction.
                return [];
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }));

        // Valeur mémorisée dans merged.
        var merged = responses.flat();
        // Valeur mémorisée dans uniqueById.
        var uniqueById = Array.from(
            // Appel de Map pour appliquer l'action prévue.
            new Map(merged.map(function (entry) {
                // Valeur mémorisée dans key.
                var key = entry && entry._id ? entry._id : String((entry && entry.createdAt) || "") + "-" + String((entry && entry.totalTime) || "");
                // Résultat renvoyé par la fonction.
                return [key, entry];
            // Appel de values pour appliquer l'action prévue.
            })).values()
        // Fermeture du bloc ou de l'appel.
        );

        // Appel de sort pour appliquer l'action prévue.
        uniqueById.sort(function (a, b) {
            // Résultat renvoyé par la fonction.
            return new Date((b && b.createdAt) || 0).getTime() - new Date((a && a.createdAt) || 0).getTime();
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de map pour appliquer l'action prévue.
        historyRows = uniqueById.map(toHistoryRow);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction escapeHtml : elle regroupe le traitement de cette partie.
    function escapeHtml(value) {
        // Résultat renvoyé par la fonction.
        return String(value)
            // Appel de replace pour appliquer l'action prévue.
            .replace(/&/g, "&amp;")
            // Appel de replace pour appliquer l'action prévue.
            .replace(/</g, "&lt;")
            // Appel de replace pour appliquer l'action prévue.
            .replace(/>/g, "&gt;")
            // Appel de replace pour appliquer l'action prévue.
            .replace(/\"/g, "&quot;")
            // Appel de replace pour appliquer l'action prévue.
            .replace(/'/g, "&#39;");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction resultMeta : elle regroupe le traitement de cette partie.
    function resultMeta(result) {
        // Vérification avant d'exécuter la suite.
        if (result === "win") return { text: "Victoire", className: "score-history-result--win" };
        // Vérification avant d'exécuter la suite.
        if (result === "draw") return { text: "Match nul", className: "score-history-result--draw" };
        // Résultat renvoyé par la fonction.
        return { text: "Defaite", className: "score-history-result--loss" };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction goalLine : elle regroupe le traitement de cette partie.
    function goalLine(teamName, times) {
        // Valeur mémorisée dans safeTeam.
        var safeTeam = escapeHtml(teamName);
        // Vérification avant d'exécuter la suite.
        if (!times || !times.length) {
            // Résultat renvoyé par la fonction.
            return "<span class=\"score-history-goals-line\"><span class=\"score-history-goals-team\">" + safeTeam + "</span>: aucun but</span>";
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return "<span class=\"score-history-goals-line\"><span class=\"score-history-goals-team\">" + safeTeam + "</span>: " + escapeHtml(times.join(", ")) + "</span>";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getFilteredRows : elle regroupe le traitement de cette partie.
    function getFilteredRows() {
        // Vérification avant d'exécuter la suite.
        if (activeFilter === "all") return historyRows;
        // Résultat renvoyé par la fonction.
        return historyRows.filter(function (row) {
            // Résultat renvoyé par la fonction.
            return row.result === activeFilter;
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction renderRows : elle regroupe le traitement de cette partie.
    function renderRows() {
        // Valeur mémorisée dans rows.
        var rows = getFilteredRows();
        // Vérification avant d'exécuter la suite.
        if (!rows.length) {
            // Mise à jour de innerHTML.
            tbody.innerHTML = "<tr><td colspan=\"6\">Aucune sauvegarde pour ce compte ou pour ce filtre.</td></tr>";
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de innerHTML.
        tbody.innerHTML = rows.map(function (row) {
            // Valeur mémorisée dans meta.
            var meta = resultMeta(row.result);
            // Valeur mémorisée dans teams.
            var teams = escapeHtml(row.home) + " vs " + escapeHtml(row.away);
            // Valeur mémorisée dans score.
            var score = escapeHtml(row.homeGoals) + " - " + escapeHtml(row.awayGoals);
            // Valeur mémorisée dans goalsDetails.
            var goalsDetails = "<div class=\"score-history-goals\">"
                // Appel de goalLine pour appliquer l'action prévue.
                + goalLine(row.home, row.goals && row.goals.home)
                // Appel de goalLine pour appliquer l'action prévue.
                + goalLine(row.away, row.goals && row.goals.away)
                // Instruction nécessaire au déroulement de cette partie.
                + "</div>";

            // Résultat renvoyé par la fonction.
            return "<tr>"
                // Appel de escapeHtml pour appliquer l'action prévue.
                + "<td>" + escapeHtml(row.competition) + "</td>"
                // Appel de escapeHtml pour appliquer l'action prévue.
                + "<td>" + escapeHtml(row.stage) + "</td>"
                // Instruction nécessaire au déroulement de cette partie.
                + "<td class=\"score-history-teams\">" + teams + "</td>"
                // Instruction nécessaire au déroulement de cette partie.
                + "<td class=\"score-history-score\">" + score + "</td>"
                // Instruction nécessaire au déroulement de cette partie.
                + "<td><span class=\"score-history-result " + meta.className + "\">" + meta.text + "</span></td>"
                // Instruction nécessaire au déroulement de cette partie.
                + "<td>" + goalsDetails + "</td>"
                // Instruction nécessaire au déroulement de cette partie.
                + "</tr>";
        // Appel de join pour appliquer l'action prévue.
        }).join("");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateFilterButtonsState : elle regroupe le traitement de cette partie.
    function updateFilterButtonsState() {
        // Appel de forEach pour appliquer l'action prévue.
        filterButtons.forEach(function (btn) {
            // Vérification avant d'exécuter la suite.
            if (btn.dataset.resultFilter === activeFilter) {
                // Appel de add pour appliquer l'action prévue.
                btn.classList.add("is-active");
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de remove pour appliquer l'action prévue.
                btn.classList.remove("is-active");
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setFilter : elle regroupe le traitement de cette partie.
    function setFilter(nextFilter) {
        // Instruction nécessaire au déroulement de cette partie.
        activeFilter = nextFilter || "all";
        // Appel de updateFilterButtonsState pour appliquer l'action prévue.
        updateFilterButtonsState();
        // Appel de renderRows pour appliquer l'action prévue.
        renderRows();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction open : elle regroupe le traitement de cette partie.
    async function open() {
        // Mise à jour de innerHTML.
        tbody.innerHTML = "<tr><td colspan=\"6\">Chargement...</td></tr>";
        // Partie protégée en cas d'erreur.
        try {
            // Attente de la fin de l'action asynchrone.
            await loadHistoryRows();
        // Gestion de l'erreur si le try échoue.
        } catch (error) {
            // Appel de error pour appliquer l'action prévue.
            console.error("Erreur de chargement des scores GamesOnWeb:", error);
            // Mise à jour de innerHTML.
            tbody.innerHTML = "<tr><td colspan=\"6\">Impossible de charger les matchs.</td></tr>";
            // Appel de add pour appliquer l'action prévue.
            overlay.classList.add("settings-overlay--open");
            // Appel de setAttribute pour appliquer l'action prévue.
            overlay.setAttribute("aria-hidden", "false");
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de renderRows pour appliquer l'action prévue.
        renderRows();
        // Appel de add pour appliquer l'action prévue.
        overlay.classList.add("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        overlay.setAttribute("aria-hidden", "false");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction close : elle regroupe le traitement de cette partie.
    function close() {
        // Appel de remove pour appliquer l'action prévue.
        overlay.classList.remove("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        overlay.setAttribute("aria-hidden", "true");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isOpen : elle regroupe le traitement de cette partie.
    function isOpen() {
        // Résultat renvoyé par la fonction.
        return overlay.getAttribute("aria-hidden") === "false";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction pollScoreHistoryGamepad : elle regroupe le traitement de cette partie.
    function pollScoreHistoryGamepad() {
        // Valeur mémorisée dans pads.
        var pads = (navigator.getGamepads && navigator.getGamepads()) || [];
        // Valeur mémorisée dans pad.
        var pad = pads.find(function (p) { return p && p.connected; }) || null;
        // Valeur mémorisée dans buttons.
        var buttons = pad && pad.buttons ? pad.buttons : [];
        // Bouton B (Xbox) / Rond (PlayStation) via Gamepad API standard.
        // Valeur mémorisée dans backPressed.
        var backPressed = !!(buttons[1] && buttons[1].pressed);

        // Vérification avant d'exécuter la suite.
        if (isOpen() && backPressed && !lastBackPressed) {
            // Appel de close pour appliquer l'action prévue.
            close();
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        lastBackPressed = backPressed;
        // Appel de requestAnimationFrame pour appliquer l'action prévue.
        window.requestAnimationFrame(pollScoreHistoryGamepad);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (closeBtn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        closeBtn.addEventListener("click", close);
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de forEach pour appliquer l'action prévue.
    filterButtons.forEach(function (btn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        btn.addEventListener("click", function () {
            // Appel de setFilter pour appliquer l'action prévue.
            setFilter(btn.dataset.resultFilter || "all");
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de addEventListener pour appliquer l'action prévue.
    overlay.addEventListener("click", function (event) {
        // Vérification avant d'exécuter la suite.
        if (event.target === overlay) close();
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("keydown", function (event) {
        // Vérification avant d'exécuter la suite.
        if (event.key === "Escape" && isOpen()) {
            // Appel de preventDefault pour appliquer l'action prévue.
            event.preventDefault();
            // Appel de close pour appliquer l'action prévue.
            close();
        // Fermeture du bloc ou de l'appel.
        }
    // Instruction nécessaire au déroulement de cette partie.
    }, true);

    // Mise à jour de scoreHistory.
    window.scoreHistory = {
        // Paramètre de l'appel ou valeur de configuration.
        open: open,
        // Paramètre de l'appel ou valeur de configuration.
        close: close,
        // Instruction nécessaire au déroulement de cette partie.
        isOpen: isOpen
    // Fermeture du bloc ou de l'appel.
    };

    // Appel de setFilter pour appliquer l'action prévue.
    setFilter("all");
    // Appel de pollScoreHistoryGamepad pour appliquer l'action prévue.
    pollScoreHistoryGamepad();
// Instruction nécessaire au déroulement de cette partie.
})();
