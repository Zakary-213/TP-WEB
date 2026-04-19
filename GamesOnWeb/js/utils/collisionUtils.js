// js/utils/collisionUtils.js
// Fonctions de détection de collisions (inspirées du cours, adaptées pour la 3D Babylon.js)
// Supporte les collisions 2D (plan XZ) et 3D (sphères, cylindres)

// ─────────────────────────────────────────────────────────────────────────────
// 2D — sur le plan XZ (vue de dessus, y ignoré)
// Même style que le fichier du cours
// ─────────────────────────────────────────────────────────────────────────────

// Collision cercle / cercle sur le plan XZ
// x1,z1 : centre du cercle 1, r1 : rayon
// x2,z2 : centre du cercle 2, r2 : rayon
// Fonction circleCollideXZ : elle regroupe le traitement de cette partie.
function circleCollideXZ(x1, z1, r1, x2, z2, r2) {
    // Valeur mémorisée dans dx.
    var dx = x1 - x2;
    // Valeur mémorisée dans dz.
    var dz = z1 - z2;
    // Résultat renvoyé par la fonction.
    return (dx * dx + dz * dz) < (r1 + r2) * (r1 + r2);
// Fermeture du bloc ou de l'appel.
}

// Collision rectangle / rectangle alignés axes (position = coin supérieur gauche)
// x1,z1 : coin haut-gauche du rect 1, w1 : largeur, h1 : profondeur (axe Z)
// Fonction rectsOverlapXZ : elle regroupe le traitement de cette partie.
function rectsOverlapXZ(x1, z1, w1, h1, x2, z2, w2, h2) {
    // Vérification avant d'exécuter la suite.
    if ((x1 > (x2 + w2)) || ((x1 + w1) < x2)) return false; // pas de chevauchement X
    // Vérification avant d'exécuter la suite.
    if ((z1 > (z2 + h2)) || ((z1 + h1) < z2)) return false; // pas de chevauchement Z
    // Résultat renvoyé par la fonction.
    return true;
// Fermeture du bloc ou de l'appel.
}

// Idem mais avec x,z au centre (plus pratique pour nos objets)
// Fonction rectsOverlapFromCenterXZ : elle regroupe le traitement de cette partie.
function rectsOverlapFromCenterXZ(x1, z1, w1, h1, x2, z2, w2, h2) {
    // Valeur mémorisée dans rx1.
    let rx1 = x1 - w1 / 2;
    // Valeur mémorisée dans rz1.
    let rz1 = z1 - h1 / 2;
    // Valeur mémorisée dans rx2.
    let rx2 = x2 - w2 / 2;
    // Valeur mémorisée dans rz2.
    let rz2 = z2 - h2 / 2;
    // Résultat renvoyé par la fonction.
    return rectsOverlapXZ(rx1, rz1, w1, h1, rx2, rz2, w2, h2);
// Fermeture du bloc ou de l'appel.
}

// Collision cercle / rectangle aligné axes, rectangle défini par coin haut-gauche
// Fonction circRectOverlapXZ : elle regroupe le traitement de cette partie.
function circRectOverlapXZ(rx, rz, rw, rh, cx, cz, r) {
    // Valeur mémorisée dans testX.
    var testX = cx;
    // Valeur mémorisée dans testZ.
    var testZ = cz;
    // Vérification avant d'exécuter la suite.
    if (testX < rx)        testX = rx;
    // Vérification avant d'exécuter la suite.
    if (testX > (rx + rw)) testX = rx + rw;
    // Vérification avant d'exécuter la suite.
    if (testZ < rz)        testZ = rz;
    // Vérification avant d'exécuter la suite.
    if (testZ > (rz + rh)) testZ = rz + rh;
    // Résultat renvoyé par la fonction.
    return ((cx - testX) * (cx - testX) + (cz - testZ) * (cz - testZ)) < r * r;
// Fermeture du bloc ou de l'appel.
}

// Idem avec le rectangle centré en (rx, rz)
// Fonction circRectOverlapFromCenterXZ : elle regroupe le traitement de cette partie.
function circRectOverlapFromCenterXZ(rx, rz, rw, rh, cx, cz, r) {
    // Valeur mémorisée dans rrx.
    let rrx = rx - rw / 2;
    // Valeur mémorisée dans rrz.
    let rrz = rz - rh / 2;
    // Résultat renvoyé par la fonction.
    return circRectOverlapXZ(rrx, rrz, rw, rh, cx, cz, r);
// Fermeture du bloc ou de l'appel.
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D — Babylon.js (Vector3)
// ─────────────────────────────────────────────────────────────────────────────

// Collision sphère / sphère en 3D
// posA, posB : BABYLON.Vector3 (centres des sphères)
// rA, rB     : rayons
// Fonction spheresCollide : elle regroupe le traitement de cette partie.
function spheresCollide(posA, rA, posB, rB) {
    // Valeur mémorisée dans dx.
    var dx = posA.x - posB.x;
    // Valeur mémorisée dans dy.
    var dy = posA.y - posB.y;
    // Valeur mémorisée dans dz.
    var dz = posA.z - posB.z;
    // Valeur mémorisée dans distSq.
    var distSq = dx * dx + dy * dy + dz * dz;
    // Valeur mémorisée dans sumR.
    var sumR = rA + rB;
    // Résultat renvoyé par la fonction.
    return distSq < sumR * sumR;
// Fermeture du bloc ou de l'appel.
}

// Collision sphère / sphère uniquement sur le plan XZ (y ignoré)
// Utile pour joueur ↔ balle ou joueur ↔ joueur
// Fonction spheresCollideXZ : elle regroupe le traitement de cette partie.
function spheresCollideXZ(posA, rA, posB, rB) {
    // Résultat renvoyé par la fonction.
    return circleCollideXZ(posA.x, posA.z, rA, posB.x, posB.z, rB);
// Fermeture du bloc ou de l'appel.
}

// Vérifie si un joueur (cylindre approximé par un cercle XZ) touche la balle (sphère)
// player : objet avec une propriété .position (BABYLON.Vector3)
// ball   : objet avec une propriété .position (BABYLON.Vector3)
// playerRadius : rayon de collision du joueur (défaut 1.0)
// ballRadius   : rayon de collision de la balle (défaut 0.55)
// Fonction playerTouchesBall : elle regroupe le traitement de cette partie.
function playerTouchesBall(player, ball, playerRadius, ballRadius) {
    // Instruction nécessaire au déroulement de cette partie.
    playerRadius = playerRadius !== undefined ? playerRadius : 1.0;
    // Instruction nécessaire au déroulement de cette partie.
    ballRadius   = ballRadius   !== undefined ? ballRadius   : 0.55;
    // Vérification avant d'exécuter la suite.
    if (!player || !player.position || !ball || !ball.position) return false;
    // Résultat renvoyé par la fonction.
    return spheresCollideXZ(player.position, playerRadius, ball.position, ballRadius);
// Fermeture du bloc ou de l'appel.
}

// Vérifie si deux joueurs se chevauchent (pour les empêcher de se traverser)
// Fonction playersTouching : elle regroupe le traitement de cette partie.
function playersTouching(playerA, playerB, radiusA, radiusB) {
    // Instruction nécessaire au déroulement de cette partie.
    radiusA = radiusA !== undefined ? radiusA : 1.0;
    // Instruction nécessaire au déroulement de cette partie.
    radiusB = radiusB !== undefined ? radiusB : 1.0;
    // Vérification avant d'exécuter la suite.
    if (!playerA || !playerA.position || !playerB || !playerB.position) return false;
    // Résultat renvoyé par la fonction.
    return spheresCollideXZ(playerA.position, radiusA, playerB.position, radiusB);
// Fermeture du bloc ou de l'appel.
}

// Calcule le vecteur de séparation de A par rapport à B (A doit "être repoussé" par B)
// Retourne un BABYLON.Vector3 normalisé (ou null si positions identiques)
// Fonction separationVector : elle regroupe le traitement de cette partie.
function separationVector(posA, posB) {
    // Valeur mémorisée dans dx.
    var dx = posA.x - posB.x;
    // Valeur mémorisée dans dz.
    var dz = posA.z - posB.z;
    // Valeur mémorisée dans len.
    var len = Math.sqrt(dx * dx + dz * dz);
    // Vérification avant d'exécuter la suite.
    if (len < 0.0001) return null;
    // Résultat renvoyé par la fonction.
    return new BABYLON.Vector3(dx / len, 0, dz / len);
// Fermeture du bloc ou de l'appel.
}

// Résout la collision entre deux joueurs (les repousse l'un de l'autre)
// overlap : quantité de chevauchement à corriger
// Fonction resolvePlayerCollision : elle regroupe le traitement de cette partie.
function resolvePlayerCollision(playerA, playerB, radiusA, radiusB) {
    // Instruction nécessaire au déroulement de cette partie.
    radiusA = radiusA !== undefined ? radiusA : 1.0;
    // Instruction nécessaire au déroulement de cette partie.
    radiusB = radiusB !== undefined ? radiusB : 1.0;
    // Vérification avant d'exécuter la suite.
    if (!playerA || !playerA.position || !playerB || !playerB.position) return;

    // Valeur mémorisée dans dx.
    var dx = playerA.position.x - playerB.position.x;
    // Valeur mémorisée dans dz.
    var dz = playerA.position.z - playerB.position.z;
    // Valeur mémorisée dans dist.
    var dist = Math.sqrt(dx * dx + dz * dz);
    // Valeur mémorisée dans minDist.
    var minDist = radiusA + radiusB;

    // Vérification avant d'exécuter la suite.
    if (dist < minDist && dist > 0.0001) {
        // Chevauchement à corriger
        // Valeur mémorisée dans overlap.
        var overlap = (minDist - dist) / 2;
        // Valeur mémorisée dans nx.
        var nx = dx / dist; // normale de séparation
        // Valeur mémorisée dans nz.
        var nz = dz / dist;

        // On repousse chaque joueur de la moitié du chevauchement
        // Instruction nécessaire au déroulement de cette partie.
        playerA.position.x += nx * overlap;
        // Instruction nécessaire au déroulement de cette partie.
        playerA.position.z += nz * overlap;
        // Instruction nécessaire au déroulement de cette partie.
        playerB.position.x -= nx * overlap;
        // Instruction nécessaire au déroulement de cette partie.
        playerB.position.z -= nz * overlap;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}
