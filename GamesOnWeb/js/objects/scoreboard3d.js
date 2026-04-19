/**
 * scoreboard3d.js
 * Crée deux vrais panneaux de score style stade à chaque bord du terrain.
 * Chaque panneau a : deux poteaux métalliques, une poutre transversale, un cadre et un écran LED.
 * API : window.scoreBoard3D.updateScore(playerScore, aiScore)
 */
// Fonction createScoreboard3D : elle regroupe le traitement de cette partie.
function createScoreboard3D(scene) {

    // ─── Apparence des matériaux ───────────────────────────────
    // Création de metalColor.
    const metalColor  = new BABYLON.Color3(0.22, 0.22, 0.24);

    // Fonction metalMat : elle regroupe le traitement de cette partie.
    function metalMat(name) {
        // Création de m.
        const m = new BABYLON.StandardMaterial(name, scene);
        // Mise à jour de diffuseColor.
        m.diffuseColor   = metalColor;
        // Mise à jour de specularColor.
        m.specularColor  = new BABYLON.Color3(0.5, 0.5, 0.5);
        // Mise à jour de specularPower.
        m.specularPower  = 32;
        // Résultat renvoyé par la fonction.
        return m;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction frameMat : elle regroupe le traitement de cette partie.
    function frameMat(name) {
        // Création de m.
        const m = new BABYLON.StandardMaterial(name, scene);
        // Mise à jour de diffuseColor.
        m.diffuseColor  = new BABYLON.Color3(0.1, 0.1, 0.12);
        // Mise à jour de specularColor.
        m.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        // Résultat renvoyé par la fonction.
        return m;
    // Fermeture du bloc ou de l'appel.
    }

    // ─── Texture LED (écran) ───────────────────────────────────
    // Valeur mémorisée dans TEX_W.
    const TEX_W = 512, TEX_H = 192;
    // Valeur mémorisée dans leftTeamLabel.
    let leftTeamLabel = "YOU";
    // Valeur mémorisée dans rightTeamLabel.
    let rightTeamLabel = "IA";

    // Fonction makeScreenTexture : elle regroupe le traitement de cette partie.
    function makeScreenTexture(name) {
        // Résultat renvoyé par la fonction.
        return new BABYLON.DynamicTexture(name, { width: TEX_W, height: TEX_H }, scene, true);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction drawScreen : elle regroupe le traitement de cette partie.
    function drawScreen(tex, pScore, aScore, mirrored = false) {
        // Valeur mémorisée dans ctx.
        const ctx = tex.getContext();
        // Vérification avant d'exécuter la suite.
        if (!ctx) return; // Garde contre le canvas destroyed
        
        // Appel de clearRect pour appliquer l'action prévue.
        ctx.clearRect(0, 0, TEX_W, TEX_H);

        // Appel de save pour appliquer l'action prévue.
        ctx.save();
        
        // Si le panneau est retourné on retourne le canvas pour que le texte ne soit pas en miroir
        // Vérification avant d'exécuter la suite.
        if (mirrored) {
            // Appel de translate pour appliquer l'action prévue.
            ctx.translate(TEX_W, 0);
            // Appel de scale pour appliquer l'action prévue.
            ctx.scale(-1, 1);
        // Fermeture du bloc ou de l'appel.
        }

        // Fond noir LED
        // Mise à jour de fillStyle.
        ctx.fillStyle = "#050508";
        // Appel de fillRect pour appliquer l'action prévue.
        ctx.fillRect(0, 0, TEX_W, TEX_H);

        // Légère grille de pixels (simulation LED)
        // Mise à jour de strokeStyle.
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        // Mise à jour de lineWidth.
        ctx.lineWidth = 1;
        // Parcours de plusieurs valeurs.
        for (let x = 0; x < TEX_W; x += 8) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,TEX_H); ctx.stroke(); }
        // Parcours de plusieurs valeurs.
        for (let y = 0; y < TEX_H; y += 8) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(TEX_W,y); ctx.stroke(); }

        // Nom équipe gauche - rouge
        // Mise à jour de font.
        ctx.font = "bold 40px 'Courier New', monospace";
        // Mise à jour de textAlign.
        ctx.textAlign = "center";
        // Mise à jour de fillStyle.
        ctx.fillStyle = "#ff4444";
        // Mise à jour de shadowColor.
        ctx.shadowColor = "#ff0000";
        // Mise à jour de shadowBlur.
        ctx.shadowBlur = 14;
        // Appel de fillText pour appliquer l'action prévue.
        ctx.fillText(leftTeamLabel, TEX_W * 0.18, TEX_H / 2 + 14);

        // Nom équipe droite - bleu
        // Mise à jour de fillStyle.
        ctx.fillStyle = "#4488ff";
        // Mise à jour de shadowColor.
        ctx.shadowColor = "#0044ff";
        // Appel de fillText pour appliquer l'action prévue.
        ctx.fillText(rightTeamLabel, TEX_W * 0.82, TEX_H / 2 + 14);

        // Score (centre) - blanc lumineux
        // Mise à jour de font.
        ctx.font = "bold 72px 'Courier New', monospace";
        // Mise à jour de fillStyle.
        ctx.fillStyle = "#ffffff";
        // Mise à jour de shadowColor.
        ctx.shadowColor = "#aaddff";
        // Mise à jour de shadowBlur.
        ctx.shadowBlur = 20;
        // Appel de fillText pour appliquer l'action prévue.
        ctx.fillText(`${pScore}`, TEX_W * 0.38, TEX_H / 2 + 24);
        // Appel de fillText pour appliquer l'action prévue.
        ctx.fillText(`${aScore}`, TEX_W * 0.62, TEX_H / 2 + 24);

        // Trait séparateur
        // Mise à jour de font.
        ctx.font = "bold 50px 'Courier New', monospace";
        // Mise à jour de fillStyle.
        ctx.fillStyle = "#aaaaaa";
        // Mise à jour de shadowBlur.
        ctx.shadowBlur = 8;
        // Appel de fillText pour appliquer l'action prévue.
        ctx.fillText("-", TEX_W * 0.5, TEX_H / 2 + 18);

        // Appel de restore pour appliquer l'action prévue.
        ctx.restore(); // Reset shadow + transform

        // Appel de update pour appliquer l'action prévue.
        tex.update();
    // Fermeture du bloc ou de l'appel.
    }

    // ─── Constructeur d'un panneau complet ─────────────────────
    // Fonction buildBoard : elle regroupe le traitement de cette partie.
    function buildBoard(tag, position, rotY) {
        // Création de root.
        const root = new BABYLON.TransformNode("scoreboard_" + tag, scene);
        // Mise à jour de position.
        root.position = position;
        // Mise à jour de y.
        root.rotation.y = rotY;

        // Valeur mémorisée dans mMetal.
        const mMetal = metalMat("metal_" + tag);
        // Valeur mémorisée dans mFrame.
        const mFrame = frameMat("frame_" + tag);

        // --- Poteaux gauche / droite ---
        // Valeur mémorisée dans poleH.
        const poleH    = 14;
        // Valeur mémorisée dans poleThk.
        const poleThk  = 0.6;
        // Valeur mémorisée dans halfW.
        const halfW    = 9;         // demi-largeur du panneau

        // Appel de forEach pour appliquer l'action prévue.
        [-halfW, halfW].forEach((xOff, i) => {
            // Préparation de pole avec Babylon.js.
            const pole = BABYLON.MeshBuilder.CreateCylinder("pole_" + i + tag, {
                // Paramètre de l'appel ou valeur de configuration.
                height:         poleH,
                // Paramètre de l'appel ou valeur de configuration.
                diameter:       poleThk,
                // Instruction nécessaire au déroulement de cette partie.
                tessellation:   10
            // Instruction nécessaire au déroulement de cette partie.
            }, scene);
            // Mise à jour de position.
            pole.position   = new BABYLON.Vector3(xOff, poleH / 2, 0);
            // Mise à jour de material.
            pole.material   = mMetal;
            // Mise à jour de parent.
            pole.parent     = root;

            // Pied évasé
            // Préparation de foot avec Babylon.js.
            const foot = BABYLON.MeshBuilder.CreateCylinder("foot_" + i + tag, {
                // Paramètre de l'appel ou valeur de configuration.
                height:         0.8,
                // Paramètre de l'appel ou valeur de configuration.
                diameterBottom: 1.4,
                // Paramètre de l'appel ou valeur de configuration.
                diameterTop:    0.8,
                // Instruction nécessaire au déroulement de cette partie.
                tessellation:   10
            // Instruction nécessaire au déroulement de cette partie.
            }, scene);
            // Mise à jour de position.
            foot.position = new BABYLON.Vector3(xOff, 0.4, 0);
            // Mise à jour de material.
            foot.material = mMetal;
            // Mise à jour de parent.
            foot.parent   = root;
        // Fermeture du bloc ou de l'appel.
        });

        // --- Poutre horizontale haute ---
        // Préparation de beam avec Babylon.js.
        const beam = BABYLON.MeshBuilder.CreateBox("beam_" + tag, {
            // Paramètre de l'appel ou valeur de configuration.
            width:  halfW * 2 + poleThk,
            // Paramètre de l'appel ou valeur de configuration.
            height: poleThk * 0.8,
            // Instruction nécessaire au déroulement de cette partie.
            depth:  poleThk * 0.8
        // Instruction nécessaire au déroulement de cette partie.
        }, scene);
        // Mise à jour de position.
        beam.position = new BABYLON.Vector3(0, poleH - 1, 0);
        // Mise à jour de material.
        beam.material = mMetal;
        // Mise à jour de parent.
        beam.parent   = root;

        // --- Cadre du panneau ---
        // Valeur mémorisée dans screenW.
        const screenW = halfW * 2 - 1;
        // Valeur mémorisée dans screenH.
        const screenH = 4.5;
        // Valeur mémorisée dans screenY.
        const screenY = poleH - 1 - screenH / 2 - poleThk * 0.4 - 0.1;
        // Valeur mémorisée dans frameThk.
        const frameThk = 0.35;

        // Bords du cadre (haut, bas, gauche, droite)
        // Instruction nécessaire au déroulement de cette partie.
        [
            // Instruction nécessaire au déroulement de cette partie.
            [screenW, frameThk, screenY + screenH / 2 + frameThk / 2],          // haut
            // Instruction nécessaire au déroulement de cette partie.
            [screenW, frameThk, screenY - screenH / 2 - frameThk / 2],          // bas
        // Appel de forEach pour appliquer l'action prévue.
        ].forEach(([w, h, y], i) => {
            // Préparation de b avec Babylon.js.
            const b = BABYLON.MeshBuilder.CreateBox("fh_" + i + tag, { width: w + frameThk*2, height: frameThk, depth: 0.5 }, scene);
            // Mise à jour de position.
            b.position = new BABYLON.Vector3(0, y, -0.05);
            // Mise à jour de material.
            b.material = mFrame;
            // Mise à jour de parent.
            b.parent   = root;
        // Fermeture du bloc ou de l'appel.
        });
        // Instruction nécessaire au déroulement de cette partie.
        [
            // Paramètre de l'appel ou valeur de configuration.
            [-screenW / 2 - frameThk / 2, screenY],
            // Paramètre de l'appel ou valeur de configuration.
            [ screenW / 2 + frameThk / 2, screenY],
        // Appel de forEach pour appliquer l'action prévue.
        ].forEach(([x, y], i) => {
            // Préparation de b avec Babylon.js.
            const b = BABYLON.MeshBuilder.CreateBox("fv_" + i + tag, { width: frameThk, height: screenH + frameThk*2, depth: 0.5 }, scene);
            // Mise à jour de position.
            b.position = new BABYLON.Vector3(x, y, -0.05);
            // Mise à jour de material.
            b.material = mFrame;
            // Mise à jour de parent.
            b.parent   = root;
        // Fermeture du bloc ou de l'appel.
        });

        // --- Écran LED ---
        // Préparation de screen avec Babylon.js.
        const screen = BABYLON.MeshBuilder.CreatePlane("screen_" + tag, {
            // Paramètre de l'appel ou valeur de configuration.
            width:  screenW,
            // Instruction nécessaire au déroulement de cette partie.
            height: screenH
        // Instruction nécessaire au déroulement de cette partie.
        }, scene);
        // Mise à jour de position.
        screen.position = new BABYLON.Vector3(0, screenY, 0);
        // Mise à jour de parent.
        screen.parent   = root;

        // Valeur mémorisée dans tex.
        const tex = makeScreenTexture("tex_" + tag);
        // Création de screenMat.
        const screenMat = new BABYLON.StandardMaterial("screenMat_" + tag, scene);
        // Mise à jour de diffuseTexture.
        screenMat.diffuseTexture  = tex;
        // Mise à jour de emissiveTexture.
        screenMat.emissiveTexture = tex;
        // Mise à jour de backFaceCulling.
        screenMat.backFaceCulling = false;
        // Mise à jour de disableLighting.
        screenMat.disableLighting = true;
        // Mise à jour de material.
        screen.material = screenMat;

        // Dessins initiaux
        // drawScreen(tex, 0, 0); // Original line
        // This call is now handled outside buildBoard to pass the correct mirrored flag
        // based on which board is being initialized.

        // --- Quelques supports diagonaux décoratifs ---
        // Appel de forEach pour appliquer l'action prévue.
        [[-1, 1], [1, 1]].forEach(([sx, _], i) => {
            // Préparation de supp avec Babylon.js.
            const supp = BABYLON.MeshBuilder.CreateBox("supp_" + i + tag, {
                // Instruction nécessaire au déroulement de cette partie.
                width: 0.25, height: 3.5, depth: 0.25
            // Instruction nécessaire au déroulement de cette partie.
            }, scene);
            // Mise à jour de position.
            supp.position = new BABYLON.Vector3(sx * (halfW - 1), poleH - 4.5, 0);
            // Mise à jour de z.
            supp.rotation.z = sx * 0.35;
            // Mise à jour de material.
            supp.material   = mMetal;
            // Mise à jour de parent.
            supp.parent     = root;
        // Fermeture du bloc ou de l'appel.
        });

        // Résultat renvoyé par la fonction.
        return tex;
    // Fermeture du bloc ou de l'appel.
    }

    // ─── Panneau unique côté nord (Z=+38), face aux tribunes ──
    // Valeur mémorisée dans texBack.
    const texBack = buildBoard("back",
        // Appel de Vector3 pour appliquer l'action prévue.
        new BABYLON.Vector3(0, 0, 38),
        // Instruction nécessaire au déroulement de cette partie.
        Math.PI
    // Fermeture du bloc ou de l'appel.
    );

    // Dessin initial
    // Appel de drawScreen pour appliquer l'action prévue.
    drawScreen(texBack, 0, 0, true);

    // ─── API publique ──────────────────────────────────────────
    // Mise à jour de scoreBoard3D.
    window.scoreBoard3D = {
        // Appel de function pour appliquer l'action prévue.
        setTeamLabels: function(leftLabel, rightLabel) {
            // Instruction nécessaire au déroulement de cette partie.
            leftTeamLabel = leftLabel || "YOU";
            // Instruction nécessaire au déroulement de cette partie.
            rightTeamLabel = rightLabel || "IA";
            // Appel de drawScreen pour appliquer l'action prévue.
            drawScreen(texBack, window.gameScoreboard ? window.gameScoreboard.playerScore : 0, window.gameScoreboard ? window.gameScoreboard.aiScore : 0, true);
        // Fermeture du bloc ou de l'appel.
        },
        // Appel de function pour appliquer l'action prévue.
        updateScore: function(playerScore, aiScore) {
            // Appel de drawScreen pour appliquer l'action prévue.
            drawScreen(texBack, playerScore, aiScore, true);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    };

    // Résultat renvoyé par la fonction.
    return window.scoreBoard3D;
// Fermeture du bloc ou de l'appel.
}
